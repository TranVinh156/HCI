/**
 * Browser-side MediaPipe keypoint extraction for the WLASL word model.
 *
 * Produces clips of shape (NUM_FRAMES, 75, 3) where the 75 keypoints are laid
 * out as: 33 pose, 21 left-hand, 21 right-hand. Each value is [x, y, c] where
 * c is pose visibility / 1.0 for hands. This layout MUST match the backend
 * (sign_service.py) and training extraction (demo_inference.py).
 *
 * The backend applies shoulder-based normalization, so we send raw landmarks.
 */
import type {
  HandLandmarker as HandLandmarkerT,
  PoseLandmarker as PoseLandmarkerT,
} from "@mediapipe/tasks-vision";

export const NUM_FRAMES = 32;
export const NUM_KEYPOINTS = 75;
export const KP_DIMS = 3;
const POSE_COUNT = 33;
const LH_OFFSET = 33;
const RH_OFFSET = 54;

const WASM_BASE = "/mediapipe/wasm";
const POSE_MODEL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task";
const HAND_MODEL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task";

export type Keypoints = number[][][]; // (T, 75, 3)

let poseLandmarker: PoseLandmarkerT | null = null;
let handLandmarker: HandLandmarkerT | null = null;
let loadPromise: Promise<void> | null = null;

function emptyFrame(): number[][] {
  return Array.from({ length: NUM_KEYPOINTS }, () => [0, 0, 0]);
}

function flipFrameHorizontal(frame: number[][]): number[][] {
  const flipped = frame.map(([x, y, c]) => [c > 0 ? 1 - x : x, y, c]);

  for (let i = 0; i < 21; i++) {
    const leftIndex = LH_OFFSET + i;
    const rightIndex = RH_OFFSET + i;
    const left = flipped[leftIndex];
    flipped[leftIndex] = flipped[rightIndex];
    flipped[rightIndex] = left;
  }

  return flipped;
}

export async function ensureLandmarkers(): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Keypoint extraction is only available in the browser.");
  }
  if (poseLandmarker && handLandmarker) return;
  if (!loadPromise) {
    loadPromise = (async () => {
      const { FilesetResolver, PoseLandmarker, HandLandmarker } = await import(
        "@mediapipe/tasks-vision"
      );
      const vision = await FilesetResolver.forVisionTasks(WASM_BASE);
      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: POSE_MODEL },
        runningMode: "VIDEO",
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
      });
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: HAND_MODEL },
        runningMode: "VIDEO",
        numHands: 2,
        minHandDetectionConfidence: 0.5,
      });
    })().catch((error) => {
      loadPromise = null;
      throw error;
    });
  }
  return loadPromise;
}

/** Return the shared HandLandmarker, loading it on demand. */
export async function getHandLandmarker(): Promise<HandLandmarkerT> {
  await ensureLandmarkers();
  if (!handLandmarker) {
    throw new Error("HandLandmarker not initialized after ensureLandmarkers().");
  }
  return handLandmarker;
}

/** Extract a single (75, 3) frame from the current video frame at timestamp tsMs. */
export function extractFrame(
  video: HTMLVideoElement,
  tsMs: number,
  opts: { flipHorizontal?: boolean } = {}
): number[][] {
  if (!poseLandmarker || !handLandmarker) {
    throw new Error("Landmarkers not initialized. Call ensureLandmarkers().");
  }
  const kp = emptyFrame();

  const pose = poseLandmarker.detectForVideo(video, tsMs);
  const poseLms = pose.landmarks?.[0];
  if (poseLms) {
    for (let i = 0; i < Math.min(POSE_COUNT, poseLms.length); i++) {
      const lm = poseLms[i];
      kp[i] = [lm.x, lm.y, lm.visibility ?? 0];
    }
  }

  const hand = handLandmarker.detectForVideo(video, tsMs);
  hand.landmarks?.forEach((lms, j) => {
    const side = hand.handedness?.[j]?.[0]?.categoryName;
    const offset = side === "Left" ? LH_OFFSET : RH_OFFSET;
    for (let i = 0; i < Math.min(21, lms.length); i++) {
      kp[offset + i] = [lms[i].x, lms[i].y, 1.0];
    }
  });

  return opts.flipHorizontal ? flipFrameHorizontal(kp) : kp;
}

/**
 * Record a clip of NUM_FRAMES from a playing <video>, sampling every intervalMs.
 * onProgress reports captured-frame count for UI feedback.
 */
export async function captureClip(
  video: HTMLVideoElement,
  opts: {
    intervalMs?: number;
    onProgress?: (n: number) => void;
    flipHorizontal?: boolean;
  } = {}
): Promise<Keypoints> {
  await ensureLandmarkers();
  const intervalMs = opts.intervalMs ?? 66; // ~32 frames over ~2.1s
  const frames: number[][][] = [];
  let ts = performance.now();

  return new Promise<Keypoints>((resolve) => {
    const timer = setInterval(() => {
      ts += intervalMs;
      try {
        frames.push(extractFrame(video, ts, {
          flipHorizontal: opts.flipHorizontal,
        }));
      } catch {
        frames.push(emptyFrame());
      }
      opts.onProgress?.(frames.length);
      if (frames.length >= NUM_FRAMES) {
        clearInterval(timer);
        resolve(frames);
      }
    }, intervalMs);
  });
}

/**
 * Variant of the extractor for the BiLSTM landmark model (46 classes).
 *
 * Differences from the WLASL Transformer extractor above:
 *   - 3rd dim is `z` (depth), not visibility / 1.0 — the new model was trained
 *     on (x, y, z) for both pose and hands.
 *   - Clips are 20 frames long, not 32.
 *   - Default capture interval ~100ms (~2s clip) matches typical WLASL video length.
 *
 * Layout on the wire stays (T, 75, 3) = [pose(33), LH(21), RH(21)]; the backend
 * reorders to [LH, RH, pose] flat to match the training feature layout.
 */
export const NUM_FRAMES_LANDMARK = 20;

export function extractLandmarkFrame(
  video: HTMLVideoElement,
  tsMs: number
): number[][] {
  if (!poseLandmarker || !handLandmarker) {
    throw new Error("Landmarkers not initialized. Call ensureLandmarkers().");
  }
  const kp = emptyFrame();

  const pose = poseLandmarker.detectForVideo(video, tsMs);
  const poseLms = pose.landmarks?.[0];
  if (poseLms) {
    for (let i = 0; i < Math.min(POSE_COUNT, poseLms.length); i++) {
      const lm = poseLms[i];
      kp[i] = [lm.x, lm.y, lm.z ?? 0];
    }
  }

  const hand = handLandmarker.detectForVideo(video, tsMs);
  hand.landmarks?.forEach((lms, j) => {
    const side = hand.handedness?.[j]?.[0]?.categoryName;
    const offset = side === "Left" ? LH_OFFSET : RH_OFFSET;
    for (let i = 0; i < Math.min(21, lms.length); i++) {
      kp[offset + i] = [lms[i].x, lms[i].y, lms[i].z ?? 0];
    }
  });

  return kp;
}

/** Capture a single (75, 3) frame; backend repeats it x20 for static signs. */
export async function captureStaticLandmark(
  video: HTMLVideoElement
): Promise<Keypoints> {
  await ensureLandmarkers();
  return [extractLandmarkFrame(video, performance.now())];
}

/** Record a 20-frame landmark clip for dynamic signs (words). */
export async function captureLandmarkClip(
  video: HTMLVideoElement,
  opts: { intervalMs?: number; onProgress?: (n: number) => void } = {}
): Promise<Keypoints> {
  await ensureLandmarkers();
  const intervalMs = opts.intervalMs ?? 100; // ~20 frames over ~2.0s
  const frames: number[][][] = [];
  let ts = performance.now();

  return new Promise<Keypoints>((resolve) => {
    const timer = setInterval(() => {
      ts += intervalMs;
      try {
        frames.push(extractLandmarkFrame(video, ts));
      } catch {
        frames.push(emptyFrame());
      }
      opts.onProgress?.(frames.length);
      if (frames.length >= NUM_FRAMES_LANDMARK) {
        clearInterval(timer);
        resolve(frames);
      }
    }, intervalMs);
  });
}
