import { useEffect, useRef, useState } from "react";
import {
  DrawingUtils,
  FilesetResolver,
  HolisticLandmarker,
} from "@mediapipe/tasks-vision";

type NormalizedLandmark = {
  x: number;
  y: number;
  z: number;
  visibility?: number;
};

type HolisticFrame = {
  pose: NormalizedLandmark[];
  leftHand: NormalizedLandmark[];
  rightHand: NormalizedLandmark[];
};

type UseHolisticTrackingOptions = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  enabled?: boolean;
  maxFrames?: number;
};

const VISION_WASM_PATH =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const HOLISTIC_MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-assets/holistic_landmarker.task";

const HAND_CONNECTIONS = HolisticLandmarker.HAND_CONNECTIONS ?? [];
const POSE_CONNECTIONS = [
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 12],
];
const POSE_LANDMARK_INDICES = Array.from({ length: 14 }, (_, index) => index + 11);

export function useHolisticTracking({
  videoRef,
  canvasRef,
  enabled = true,
  maxFrames = 120,
}: UseHolisticTrackingOptions) {
  const landmarkerRef = useRef<HolisticLandmarker | null>(null);
  const drawingUtilsRef = useRef<DrawingUtils | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const errorRef = useRef<Error | null>(null);
  const sequenceRef = useRef<HolisticFrame[]>([]);
  const [sequence, setSequence] = useState<HolisticFrame[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function setupLandmarker() {
      const vision = await FilesetResolver.forVisionTasks(VISION_WASM_PATH);
      const landmarker = await HolisticLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: HOLISTIC_MODEL_PATH,
        },
        runningMode: "VIDEO",
        minHandLandmarksConfidence: 0.5,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
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

      let poseLandmarks: NormalizedLandmark[] = [];
      let leftHandLandmarks: NormalizedLandmark[] = [];
      let rightHandLandmarks: NormalizedLandmark[] = [];

      try {
        const results = landmarker.detectForVideo(video, performance.now());
        poseLandmarks = (results.poseLandmarks?.[0] ?? []) as NormalizedLandmark[];
        leftHandLandmarks =
          (results.leftHandLandmarks?.[0] ?? []) as NormalizedLandmark[];
        rightHandLandmarks =
          (results.rightHandLandmarks?.[0] ?? []) as NormalizedLandmark[];
        errorRef.current = null;
      } catch (error) {
        if (!errorRef.current) {
          console.error(
            "Holistic tracking stopped: video source is cross-origin without CORS. " +
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
            if (poseLandmarks.length > 0) {
              drawingUtils.drawConnectors(poseLandmarks, POSE_CONNECTIONS, {
                color: "#22c55e",
                lineWidth: 3,
              });
              const upperBody = POSE_LANDMARK_INDICES.map((index) =>
                poseLandmarks[index]
              ).filter(Boolean);
              drawingUtils.drawLandmarks(upperBody, {
                color: "#38bdf8",
                lineWidth: 2,
                radius: 2,
              });
            }

            if (leftHandLandmarks.length > 0) {
              drawingUtils.drawConnectors(leftHandLandmarks, HAND_CONNECTIONS, {
                color: "#a855f7",
                lineWidth: 3,
              });
              drawingUtils.drawLandmarks(leftHandLandmarks, {
                color: "#f472b6",
                lineWidth: 2,
                radius: 2,
              });
            }

            if (rightHandLandmarks.length > 0) {
              drawingUtils.drawConnectors(rightHandLandmarks, HAND_CONNECTIONS, {
                color: "#f97316",
                lineWidth: 3,
              });
              drawingUtils.drawLandmarks(rightHandLandmarks, {
                color: "#fb7185",
                lineWidth: 2,
                radius: 2,
              });
            }
          }
        }
      }

      const poseSubset = POSE_LANDMARK_INDICES.map((index) =>
        poseLandmarks[index]
      ).filter(Boolean);

      if (
        poseSubset.length > 0 ||
        leftHandLandmarks.length > 0 ||
        rightHandLandmarks.length > 0
      ) {
        const frame: HolisticFrame = {
          pose: poseSubset.map((landmark) => ({
            x: landmark.x,
            y: landmark.y,
            z: landmark.z,
            visibility: landmark.visibility,
          })),
          leftHand: leftHandLandmarks.map((landmark) => ({
            x: landmark.x,
            y: landmark.y,
            z: landmark.z,
            visibility: landmark.visibility,
          })),
          rightHand: rightHandLandmarks.map((landmark) => ({
            x: landmark.x,
            y: landmark.y,
            z: landmark.z,
            visibility: landmark.visibility,
          })),
        };

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
