import {
  AlertCircle,
  Camera,
  CameraOff,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import type { Lesson } from "~/api/types";
import { useHolisticTracking } from "~/hooks/use-holistic-tracking";
import type {
  SegmentedSignScoreResult,
  StudentQualityCheckResult,
} from "~/services/scoring.service";

type CameraPracticeProps = {
  lesson: Lesson;
  isRecording: boolean;
  isAnalyzing: boolean;
  finalScore: number | null;
  qualityWarning: string | null;
  qualityDebug: StudentQualityCheckResult | null;
  scoringDebug: SegmentedSignScoreResult | null;
  minPassingScore: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onResetPractice: () => void;
  onUserSequenceRef: (ref: React.MutableRefObject<HolisticSequence>) => void;
  nextLessonHref?: string;
};

type Landmark = {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
  presence?: number;
};

type HolisticFrame = {
  pose: Landmark[];
  leftHand: Landmark[];
  rightHand: Landmark[];
};

type HolisticSequence = HolisticFrame[];

const checklist = [
  "Keep both hands inside the frame",
  "Face the camera clearly",
  "Move slowly like the sample",
];

export function CameraPractice({
  lesson,
  isRecording,
  isAnalyzing,
  finalScore,
  qualityWarning,
  qualityDebug,
  scoringDebug,
  minPassingScore,
  onStartRecording,
  onStopRecording,
  onResetPractice,
  onUserSequenceRef,
  nextLessonHref,
}: CameraPracticeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState("");
  const { sequenceRef: userSequenceRef } = useHolisticTracking({
    videoRef,
    canvasRef,
    enabled: isCameraOn,
  });

  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    onUserSequenceRef(userSequenceRef);
  }, [onUserSequenceRef, userSequenceRef]);

  async function startCamera() {
    setError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera is not available in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 960 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch {
      setError("Camera permission was blocked. Please allow camera access.");
      setIsCameraOn(false);
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraOn(false);
  }

  function handlePractice() {
    if (!isCameraOn) {
      setError("Turn on the camera before checking the sign.");
      return;
    }

    setError("");
    if (isRecording) {
      onStopRecording();
      return;
    }
    onStartRecording();
  }

  const isSuccess = finalScore !== null && finalScore >= minPassingScore;
  const isRetry = finalScore !== null && finalScore < minPassingScore;
  const feedbackCopy = isAnalyzing
    ? {
        title: "Analyzing your sign",
        text: "Hold still while we compare your motion to the sample.",
        className: "bg-amber-50 text-amber-800",
        icon: Sparkles,
      }
    : qualityWarning
      ? {
          title: "Camera check",
          text: qualityWarning,
          className: "bg-rose-50 text-rose-800",
          icon: AlertCircle,
        }
    : isSuccess
      ? {
          title: "Success!",
          text: "Great match. You are ready for the next lesson.",
          className: "bg-emerald-50 text-emerald-800",
          icon: CheckCircle2,
        }
      : isRetry
        ? {
            title: "Try again",
            text: "Slow down and keep your hands higher in frame.",
            className: "bg-rose-50 text-rose-800",
            icon: RotateCcw,
          }
        : isRecording
          ? {
              title: "Recording in progress",
              text: "Match the timing of the sample and keep your hands visible.",
              className: "bg-blue-50 text-blue-800",
              icon: Sparkles,
            }
          : {
              title: "Mirror practice",
              text: `Try "${lesson.phrase ?? lesson.title}" while looking at yourself in the mirror view.`,
              className: "text-primary",
              icon: Sparkles,
            };

  const currentFeedback = feedbackCopy;
  const FeedbackIcon = currentFeedback.icon;
  const qualityMetrics = qualityDebug?.metrics;
  const alignmentMetrics = scoringDebug?.alignmentDiagnostics;
  const mirrorMetrics = scoringDebug?.mirrorDiagnostics;
  const componentMetrics = scoringDebug?.componentScores;
  const formatRatio = (value: number) => `${Math.round(value * 100)}%`;

  return (
    <Card className="rounded-[2rem] border-slate-200 bg-white/95">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-2xl font-black text-slate-900">
              Practice with camera
            </CardTitle>
            <CardDescription className="mt-1 text-base font-semibold">
              Mirror your camera so the child can compare their sign with the
              sample.
            </CardDescription>
          </div>
          <Badge className="h-8 bg-primary/10 px-3 text-primary">
            Prototype feedback
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-950">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="size-full scale-x-[-1] object-cover"
            />
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0 size-full scale-x-[-1]"
              aria-hidden="true"
            />
            {!isCameraOn ? (
              <div className="absolute inset-0 grid place-items-center p-5 text-center">
                <div>
                  <Skeleton className="mx-auto mb-4 size-20 rounded-full bg-slate-700" />
                  <p className="text-lg font-black text-white">Camera mirror</p>
                  <p className="mt-1 text-sm font-semibold text-slate-300">
                    Turn on the camera to see a reflected preview.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className={`rounded-[1.5rem] p-4 ${currentFeedback.className}`}>
              <div className="flex items-start gap-3">
                <FeedbackIcon className="mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-black">{currentFeedback.title}</p>
                  <p className="mt-1 text-sm font-semibold">
                    {currentFeedback.text}
                  </p>
                </div>
              </div>
              {finalScore !== null ? (
                <div className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-sm font-black text-slate-900">
                  Score: {finalScore}%
                </div>
              ) : null}
              {isSuccess && nextLessonHref ? (
                <Button
                  asChild
                  className="mt-3 h-10 rounded-xl font-black"
                >
                  <Link to={nextLessonHref}>Success! Move to next lesson</Link>
                </Button>
              ) : null}
            </div>

            <div className="rounded-[1.5rem] p-4">
              <p className="mb-2 text-sm font-black uppercase text-primary">
                Practice checklist
              </p>
              <ul className="space-y-2">
                {checklist.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {error ? (
              <div className="flex items-start gap-2 rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {error}
              </div>
            ) : null}

            {qualityMetrics ? (
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-xs font-bold text-slate-700">
                <p className="mb-2 text-sm font-black uppercase text-primary">
                  Tracking debug
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <span>Total frames</span>
                  <span>{qualityMetrics.totalFrames}</span>
                  <span>Valid frames</span>
                  <span>{qualityMetrics.validFrames}</span>
                  <span>Valid ratio</span>
                  <span>{formatRatio(qualityMetrics.validFrameRatio)}</span>
                  <span>Pose detected</span>
                  <span>{qualityMetrics.poseDetected ? "yes" : "no"}</span>
                  <span>Left hand detected</span>
                  <span>{qualityMetrics.leftHandDetected ? "yes" : "no"}</span>
                  <span>Right hand detected</span>
                  <span>{qualityMetrics.rightHandDetected ? "yes" : "no"}</span>
                  <span>Left hand ratio</span>
                  <span>{formatRatio(qualityMetrics.leftHandValidFrameRatio)}</span>
                  <span>Right hand ratio</span>
                  <span>{formatRatio(qualityMetrics.rightHandValidFrameRatio)}</span>
                  <span>Pose confidence</span>
                  <span>
                    {formatRatio(qualityMetrics.averagePoseConfidence)} (
                    {qualityMetrics.poseConfidenceSource})
                  </span>
                  <span>Left confidence</span>
                  <span>
                    {formatRatio(qualityMetrics.averageLeftHandConfidence)} (
                    {qualityMetrics.leftHandConfidenceSource})
                  </span>
                  <span>Right confidence</span>
                  <span>
                    {formatRatio(qualityMetrics.averageRightHandConfidence)} (
                    {qualityMetrics.rightHandConfidenceSource})
                  </span>
                  <span>Hands inside</span>
                  <span>{formatRatio(qualityMetrics.handsInsideFrameRatio)}</span>
                  <span>Failure reason</span>
                  <span>{qualityMetrics.finalFailureReason ?? "none"}</span>
                </div>
              </div>
            ) : null}

            {alignmentMetrics ? (
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-xs font-bold text-slate-700">
                <p className="mb-2 text-sm font-black uppercase text-primary">
                  Scoring debug
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <span>Average cost</span>
                  <span>{alignmentMetrics.averageCost.toFixed(3)}</span>
                  <span>Base score</span>
                  <span>{alignmentMetrics.baseScore}%</span>
                  <span>Final score</span>
                  <span>{alignmentMetrics.finalScore}%</span>
                  <span>Timing penalty</span>
                  <span>{alignmentMetrics.timingPenalty}</span>
                  <span>Length ratio</span>
                  <span>{alignmentMetrics.sequenceLengthRatio.toFixed(2)}</span>
                  <span>Student frames</span>
                  <span>{alignmentMetrics.studentFrames}</span>
                  <span>Teacher frames</span>
                  <span>{alignmentMetrics.teacherFrames}</span>
                  <span>Hand score</span>
                  <span>{alignmentMetrics.handScore}%</span>
                  <span>Arm score</span>
                  <span>{alignmentMetrics.armScore}%</span>
                  <span>Torso score</span>
                  <span>{alignmentMetrics.torsoScore}%</span>
                  <span>Angle score</span>
                  <span>{alignmentMetrics.angleScore}%</span>
                  <span>Missing landmarks</span>
                  <span>{formatRatio(alignmentMetrics.missingLandmarkRatio)}</span>
                  <span>Original score</span>
                  <span>{mirrorMetrics?.originalScore ?? "-"}</span>
                  <span>Flipped score</span>
                  <span>{mirrorMetrics?.flippedScore ?? "-"}</span>
                  <span>Selected score</span>
                  <span>{mirrorMetrics?.selectedScore ?? "-"}</span>
                  <span>Hand shape</span>
                  <span>{componentMetrics?.handShape ?? "-"}</span>
                  <span>Motion path</span>
                  <span>{componentMetrics?.motionPath ?? "-"}</span>
                  <span>Orientation</span>
                  <span>{componentMetrics?.handOrientation ?? "-"}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Button
            type="button"
            onClick={isCameraOn ? stopCamera : startCamera}
            variant={isCameraOn ? "outline" : "default"}
            className="h-12 rounded-2xl font-black"
          >
            {isCameraOn ? (
              <>
                <CameraOff className="size-5" />
                Stop camera
              </>
            ) : (
              <>
                <Camera className="size-5" />
                Start camera
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={handlePractice}
            disabled={isAnalyzing}
            className="h-12 rounded-2xl bg-emerald-600 font-black text-white hover:bg-emerald-700"
          >
            <CheckCircle2 className="size-5" />
            {isAnalyzing
              ? "Analyzing..."
              : isRecording
                ? "Stop & score"
                : "Start practice"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onResetPractice}
            className="h-12 rounded-2xl font-black text-primary"
          >
            <RotateCcw className="size-5" />
            Try again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
