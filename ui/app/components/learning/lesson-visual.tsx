import { ImageUp, X } from "lucide-react";
import type { ChangeEvent } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

type LessonVisualProps = {
  visual: string | null | undefined;
  className?: string;
  imageClassName?: string;
};

type LessonVisualUploadProps = {
  value: string;
  onChange: (value: string) => void;
};

export function isSvgVisual(visual: string | null | undefined) {
  return Boolean(
    visual?.startsWith("data:image/svg+xml") || visual?.trim().startsWith("<svg")
  );
}

export function LessonVisual({
  visual,
  className,
  imageClassName,
}: LessonVisualProps) {
  const fallback = visual?.trim() || "⭐";

  if (isSvgVisual(fallback)) {
    const src = fallback.startsWith("<svg")
      ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fallback)}`
      : fallback;

    return (
      <img
        src={src}
        alt=""
        className={cn("h-full w-full object-contain", imageClassName)}
        aria-hidden="true"
      />
    );
  }

  return (
    <span className={cn("leading-none", className)} aria-hidden="true">
      {fallback}
    </span>
  );
}

export function LessonVisualUpload({
  value,
  onChange,
}: LessonVisualUploadProps) {
  function handleSvgUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.type !== "image/svg+xml" && !file.name.endsWith(".svg")) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    });
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-2 rounded-xl border-2 border-input bg-slate-100 p-3">
      <div className="flex items-center gap-3">
        <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-white text-2xl">
          <LessonVisual visual={value} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-slate-800">Lesson visual</p>
          <p className="truncate text-xs font-semibold text-slate-500">
            {isSvgVisual(value) ? "SVG uploaded" : value || "No SVG selected"}
          </p>
        </div>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 rounded-xl"
            onClick={() => onChange("")}
            aria-label="Remove lesson visual"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground">
        <ImageUp className="size-4" />
        Upload SVG
        <Input
          type="file"
          accept=".svg,image/svg+xml"
          className="sr-only"
          onChange={handleSvgUpload}
        />
      </label>
    </div>
  );
}
