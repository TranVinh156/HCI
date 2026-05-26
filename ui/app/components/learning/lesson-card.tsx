import { RotateCcw, Video } from "lucide-react";
import { useRef } from "react";

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

type LessonCardProps = {
  lesson: Lesson;
};

type SignReference = {
  hint: string;
  url: string | null;
  embedUrl: string | null;
  kind: "video" | "youtube" | "link" | null;
};

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
    return {
      hint: cleanedHint,
      url,
      embedUrl: url,
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

export function LessonCard({ lesson }: LessonCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const signReference = parseSignReference(lesson.sign_hint);

  function replaySign() {
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0;
    void videoRef.current.play();
  }

  return (
    <Card className="rounded-[2rem] border-slate-200 bg-white/95">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 grid size-32 place-items-center rounded-[2rem] text-7xl ring-1 ring-slate-200">
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
            <video
              ref={videoRef}
              className="mb-4 aspect-video w-full rounded-[1.25rem] bg-slate-950 object-contain"
              controls
              playsInline
              preload="metadata"
              src={signReference.embedUrl}
            />
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
