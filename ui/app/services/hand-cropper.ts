/**
 * Detect a hand in a live video frame and return a tight square crop as a
 * data URL. Used by the alphabet recognition flow so the backend model sees
 * only the hand, not the whole 640x480 frame.
 */
import { getHandLandmarker } from "./keypoint-extractor";

export interface HandCropResult {
  dataUrl: string;
  bbox: { x: number; y: number; size: number };
  handedness: "Left" | "Right";
  confidence: number;
}

const PADDING_RATIO = 0.25;

export async function hasHandInFrame(
  video: HTMLVideoElement,
): Promise<boolean> {
  if (!video.videoWidth || !video.videoHeight) return false;
  const handLandmarker = await getHandLandmarker();
  const result = handLandmarker.detectForVideo(video, performance.now());
  return (result.landmarks?.length ?? 0) > 0;
}

export async function detectAndCropHand(
  video: HTMLVideoElement,
  outputSize: number = 224,
): Promise<HandCropResult | null> {
  const handLandmarker = await getHandLandmarker();

  const frameW = video.videoWidth;
  const frameH = video.videoHeight;
  if (!frameW || !frameH) return null;

  const result = handLandmarker.detectForVideo(video, performance.now());
  const hands = result.landmarks ?? [];
  if (hands.length === 0) return null;

  let bestIdx = 0;
  let bestScore = -Infinity;
  for (let i = 0; i < hands.length; i++) {
    const score = result.handedness?.[i]?.[0]?.score ?? 0;
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  const lms = hands[bestIdx];
  const handedness =
    (result.handedness?.[bestIdx]?.[0]?.categoryName as "Left" | "Right") ??
    "Right";

  let xMin = Infinity;
  let yMin = Infinity;
  let xMax = -Infinity;
  let yMax = -Infinity;
  for (const lm of lms) {
    if (lm.x < xMin) xMin = lm.x;
    if (lm.x > xMax) xMax = lm.x;
    if (lm.y < yMin) yMin = lm.y;
    if (lm.y > yMax) yMax = lm.y;
  }

  let pxMin = xMin * frameW;
  let pxMax = xMax * frameW;
  let pyMin = yMin * frameH;
  let pyMax = yMax * frameH;

  const padX = (pxMax - pxMin) * PADDING_RATIO;
  const padY = (pyMax - pyMin) * PADDING_RATIO;
  pxMin -= padX;
  pxMax += padX;
  pyMin -= padY;
  pyMax += padY;

  const cx = (pxMin + pxMax) / 2;
  const cy = (pyMin + pyMax) / 2;
  let size = Math.max(pxMax - pxMin, pyMax - pyMin);
  size = Math.min(size, frameW, frameH);

  let srcX = cx - size / 2;
  let srcY = cy - size / 2;
  if (srcX < 0) srcX = 0;
  if (srcY < 0) srcY = 0;
  if (srcX + size > frameW) srcX = frameW - size;
  if (srcY + size > frameH) srcY = frameH - size;

  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(video, srcX, srcY, size, size, 0, 0, outputSize, outputSize);

  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.85),
    bbox: { x: srcX, y: srcY, size },
    handedness,
    confidence: bestScore,
  };
}
