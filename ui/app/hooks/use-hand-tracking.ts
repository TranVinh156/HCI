import { useEffect, useRef, useState } from "react";
import {
  DrawingUtils,
  FilesetResolver,
  HandLandmarker,
} from "@mediapipe/tasks-vision";

type NormalizedLandmark = {
  x: number;
  y: number;
  z: number;
  visibility?: number;
};

type HandFrame = NormalizedLandmark[];

type UseHandTrackingOptions = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  enabled?: boolean;
  maxFrames?: number;
};

const VISION_WASM_PATH =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const HAND_MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task";
const HAND_CONNECTIONS = HandLandmarker.HAND_CONNECTIONS ?? [];

export function useHandTracking({
  videoRef,
  canvasRef,
  enabled = true,
  maxFrames = 120,
}: UseHandTrackingOptions) {
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const drawingUtilsRef = useRef<DrawingUtils | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const errorRef = useRef<Error | null>(null);
  const sequenceRef = useRef<HandFrame[]>([]);
  const [sequence, setSequence] = useState<HandFrame[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function setupLandmarker() {
      const vision = await FilesetResolver.forVisionTasks(VISION_WASM_PATH);
      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: HAND_MODEL_PATH,
        },
        runningMode: "VIDEO",
        numHands: 2,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      if (cancelled) {
        landmarker.close();
        return;
      }

      landmarkerRef.current = landmarker;
      setIsReady(true);
    }

    void setupLandmarker();

    return () => {
      cancelled = true;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
      drawingUtilsRef.current = null;
      contextRef.current = null;
      sequenceRef.current = [];
      setSequence([]);
      setIsReady(false);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !isReady) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      const canvas = canvasRef?.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    let active = true;

    const renderLoop = () => {
      if (!active) return;
      rafIdRef.current = requestAnimationFrame(renderLoop);

      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (!video || !landmarker) return;
      if (video.readyState < 2) return;

      if (video.currentTime === lastVideoTimeRef.current) return;
      lastVideoTimeRef.current = video.currentTime;

      let hands: HandFrame[] = [];
      try {
        const results = landmarker.detectForVideo(video, performance.now());
        hands = (results.landmarks ?? []) as HandFrame[];
        errorRef.current = null;
      } catch (error) {
        if (!errorRef.current) {
          console.error(
            "Hand tracking stopped: video source is cross-origin without CORS. " +
              "Host the video on the same origin or enable CORS and set crossOrigin=\"anonymous\".",
            error
          );
        }
        errorRef.current = error as Error;
        active = false;
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        return;
      }

      const canvas = canvasRef?.current;
      if (canvas && video.videoWidth > 0 && video.videoHeight > 0) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const ctx = canvas.getContext("2d");
        if (ctx) {
          if (contextRef.current !== ctx) {
            contextRef.current = ctx;
            drawingUtilsRef.current = new DrawingUtils(ctx);
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const drawingUtils = drawingUtilsRef.current;
          if (drawingUtils) {
            hands.forEach((landmarks) => {
              drawingUtils.drawConnectors(landmarks, HAND_CONNECTIONS, {
                color: "#22c55e",
                lineWidth: 3,
              });
              drawingUtils.drawLandmarks(landmarks, {
                color: "#e11d48",
                lineWidth: 2,
                radius: 2,
              });
            });
          }
        }
      }

      if (hands.length > 0) {
        const frame = hands[0].map((landmark) => ({
          x: landmark.x,
          y: landmark.y,
          z: landmark.z,
          visibility: landmark.visibility,
        }));

        const nextSequence = sequenceRef.current
          .concat([frame])
          .slice(-maxFrames);

        sequenceRef.current = nextSequence;

        if (nextSequence.length === 1 || nextSequence.length % 6 === 0) {
          setSequence([...nextSequence]);
        }
      }
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      active = false;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [canvasRef, enabled, isReady, maxFrames, videoRef]);

  return { isReady, sequence, sequenceRef };
}
