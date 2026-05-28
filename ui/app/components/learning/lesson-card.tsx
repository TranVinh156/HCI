import { RotateCcw, Video } from "lucide-react";
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
import type { Lesson } from "~/api/types";
import { useHolisticTracking } from "~/hooks/use-holistic-tracking";

type LessonCardProps = {
  lesson: Lesson;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  onGroundTruthSequenceRef?: (
    ref: React.MutableRefObject<HolisticSequence>
  ) => void;
  onVideoPlay?: () => void;
  onVideoPause?: () => void;
  onVideoEnded?: () => void;
};

type SignReference = {
  hint: string;
  url: string | null;
  embedUrl: string | null;
  kind: "video" | "youtube" | "link" | null;
};

type Landmark = {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
};

type HolisticFrame = {
  pose: Landmark[];
  leftHand: Landmark[];
  rightHand: Landmark[];
};

type HolisticSequence = HolisticFrame[];

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

function shouldProxyVideo(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "aslsignbank.haskins.yale.edu";
  } catch {
    return false;
  }
}

function buildProxyUrl(url: string): string {
  const proxyUrl = new URL("/api/media/proxy", API_BASE_URL);
  proxyUrl.searchParams.set("url", url);
  return proxyUrl.toString();
}

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

function parseSignReference(signHint: string | null): SignReference {
  const hint = signHint ?? "";
  const urlMatch = hint.match(/https?:\/\/\S+/);
  const url = urlMatch?.[0] ?? null;
  const cleanedHint = hint
    .replace(/\s*Reference video:\s*https?:\/\/\S+/i, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!url) {
    return {
      hint: cleanedHint,
      url: null,
      embedUrl: null,
      kind: null,
    };
  }

  const youtubeEmbedUrl = getYoutubeEmbedUrl(url);
  if (youtubeEmbedUrl) {
    return {
      hint: cleanedHint,
      url,
      embedUrl: youtubeEmbedUrl,
      kind: "youtube",
    };
  }

  if (url.toLowerCase().split("?")[0].endsWith(".mp4")) {
    const proxiedUrl = shouldProxyVideo(url) ? buildProxyUrl(url) : url;
    return {
      hint: cleanedHint,
      url,
      embedUrl: proxiedUrl,
      kind: "video",
    };
  }

  return {
    hint: cleanedHint,
    url,
    embedUrl: url,
    kind: "link",
  };
}

export function LessonCard({
  lesson,
  videoRef: videoRefProp,
  canvasRef: canvasRefProp,
  onGroundTruthSequenceRef,
  onVideoPlay,
  onVideoPause,
  onVideoEnded,
}: LessonCardProps) {
  const fallbackVideoRef = useRef<HTMLVideoElement>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = videoRefProp ?? fallbackVideoRef;
  const canvasRef = canvasRefProp ?? fallbackCanvasRef;
  const [isTracking, setIsTracking] = useState(false);
  const signReference = parseSignReference(lesson.sign_hint);
  const { sequenceRef: groundTruthSequenceRef } = useHolisticTracking({
    videoRef,
    canvasRef,
    enabled: isTracking && signReference.kind === "video",
  });

  useEffect(() => {
    if (onGroundTruthSequenceRef) {
      onGroundTruthSequenceRef(
        groundTruthSequenceRef as React.MutableRefObject<HolisticSequence>
      );
    }
  }, [groundTruthSequenceRef, onGroundTruthSequenceRef]);

  useEffect(() => {
    groundTruthSequenceRef.current = [];
  }, [groundTruthSequenceRef, signReference.embedUrl]);

  function replaySign() {
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0;
    void videoRef.current.play();
  }

  return (
    <Card className="rounded-[2rem] border-slate-200 bg-white/95">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 grid size-20 place-items-center rounded-[2rem] text-4xl ring-1 ring-slate-200">
          {lesson.visual}
        </div>
        <CardTitle className="text-3xl font-black text-slate-900">
          {lesson.phrase ?? lesson.title}
        </CardTitle>
        <CardDescription className="text-base font-semibold">
          {lesson.description ?? ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-[1.5rem] border border-slate-200 p-5 text-center">
          {signReference.kind === "video" && signReference.embedUrl ? (
            <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-[1.25rem] bg-slate-950">
              <video
                ref={videoRef}
                className="size-full object-contain"
                controls
                crossOrigin="anonymous"
                playsInline
                preload="metadata"
                src={signReference.embedUrl}
                onPlay={() => {
                  setIsTracking(true);
                  onVideoPlay?.();
                }}
                onPause={() => {
                  setIsTracking(false);
                  onVideoPause?.();
                }}
                onEnded={() => {
                  setIsTracking(false);
                  onVideoEnded?.();
                }}
              />
              <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 size-full"
                aria-hidden="true"
              />
            </div>
          ) : signReference.kind === "youtube" && signReference.embedUrl ? (
            <iframe
              className="mb-4 aspect-video w-full rounded-[1.25rem] bg-slate-950"
              src={signReference.embedUrl}
              title={`Reference sign video for ${lesson.phrase ?? lesson.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="mx-auto mb-3 grid size-16 place-items-center rounded-full bg-white text-primary">
              <Video className="size-8" />
            </div>
          )}
          <p className="text-sm font-bold uppercase text-primary">
            Sign animation
          </p>
          <p className="mt-2 text-lg font-black text-slate-800">
            {signReference.hint}
          </p>
          {signReference.kind === "link" && signReference.url ? (
            <Button
              asChild
              variant="outline"
              className="mt-4 h-11 rounded-2xl px-5 font-black text-primary"
            >
              <a href={signReference.url} target="_blank" rel="noreferrer">
                Open reference video
              </a>
            </Button>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge className="h-8 bg-primary/10 px-3 text-primary">
            {lesson.type === "communication" ? "Communication" : "Vocabulary"}
          </Badge>
          <Badge className="h-8 bg-amber-100 px-3 text-amber-800">
            {lesson.difficulty}
          </Badge>
          <Badge className="h-8 bg-emerald-100 px-3 text-emerald-800">
            +{lesson.xp} XP
          </Badge>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={replaySign}
          disabled={signReference.kind !== "video"}
          className="mx-auto flex h-12 rounded-2xl  px-5 text-base font-black text-primary"
        >
          <RotateCcw className="size-5" />
          Replay sign
        </Button>
      </CardContent>
    </Card>
  );
}
