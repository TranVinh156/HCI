import {
  AlertCircle,
  Camera,
  CameraOff,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

type CameraPracticeProps = {
  lesson: Lesson;
};

type FeedbackState = "idle" | "checking" | "correct" | "retry";

const checklist = [
  "Keep both hands inside the frame",
  "Face the camera clearly",
  "Move slowly like the sample",
];

export function CameraPractice({ lesson }: CameraPracticeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  async function startCamera() {
    setError("");
    setFeedback("idle");

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

  function checkPractice() {
    if (!isCameraOn) {
      setError("Turn on the camera before checking the sign.");
      return;
    }

    setError("");
    setFeedback("checking");

    window.setTimeout(() => {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setFeedback(nextAttempts % 3 === 1 ? "retry" : "correct");
    }, 900);
  }

  const feedbackCopy = {
    idle: {
      title: "Mirror practice",
      text: `Try "${lesson.phrase ?? lesson.title}" while looking at yourself in the mirror view.`,
      className: "text-primary",
      icon: Sparkles,
    },
    checking: {
      title: "Checking your pose",
      text: "Hold the sign steady for a moment.",
      className: "bg-amber-50 text-amber-800",
      icon: Sparkles,
    },
    correct: {
      title: "Looks good",
      text: "Your hands and timing look close to the sample. Nice practice.",
      className: "bg-emerald-50 text-emerald-800",
      icon: CheckCircle2,
    },
    retry: {
      title: "Try once more",
      text: "Bring your hands higher and move a little slower.",
      className: "bg-rose-50 text-rose-800",
      icon: RotateCcw,
    },
  } satisfies Record<
    FeedbackState,
    {
      title: string;
      text: string;
      className: string;
      icon: typeof Sparkles;
    }
  >;

  const currentFeedback = feedbackCopy[feedback];
  const FeedbackIcon = currentFeedback.icon;

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
            onClick={checkPractice}
            disabled={feedback === "checking"}
            className="h-12 rounded-2xl bg-emerald-600 font-black text-white hover:bg-emerald-700"
          >
            <CheckCircle2 className="size-5" />
            Check my sign
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setFeedback("idle")}
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
