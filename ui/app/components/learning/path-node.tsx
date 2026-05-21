import { Check, Lock, Play } from "lucide-react";
import { Link } from "react-router";

import { cn } from "~/lib/utils";

type PathNodeProps = {
  lessonId: string;
  title: string;
  index: number;
  status: "completed" | "current" | "locked";
  isLast?: boolean;
};

export function PathNode({
  lessonId,
  title,
  index,
  status,
  isLast,
}: PathNodeProps) {
  const Icon = status === "completed" ? Check : status === "locked" ? Lock : Play;
  const node = (
    <div
      className={cn(
        "relative z-10 grid size-16 place-items-center rounded-full border-4 text-white transition sm:size-18",
        status === "completed" &&
          "border-emerald-200 bg-emerald-500",
        status === "current" &&
          "border-primary/30 bg-primary hover:-translate-y-1",
        status === "locked" &&
          "border-slate-200 bg-slate-300 text-slate-500"
      )}
    >
      <Icon className="size-8" />
    </div>
  );

  return (
    <div className="relative grid grid-cols-[4.5rem_1fr] gap-4 sm:grid-cols-[5.5rem_1fr]">
      <div className="relative flex justify-center">
        {!isLast ? (
          <div
            className={cn(
              "absolute left-1/2 top-16 h-[calc(100%+2rem)] w-1 -translate-x-1/2 rounded-full bg-primary/30 sm:top-18",
              status === "completed" && "bg-emerald-300"
            )}
            aria-hidden="true"
          />
        ) : null}
        {status === "locked" ? (
          node
        ) : (
          <Link
            to={`/lesson/${lessonId}`}
            aria-label={`Open lesson ${index + 1}: ${title}`}
          >
            {node}
          </Link>
        )}
      </div>

      <div
        className={cn(
          "mb-8 min-w-0 rounded-2xl bg-white px-4 py-4 ring-1 ring-slate-200 sm:px-5",
          status === "current" && "ring-2 ring-primary/40",
          status === "completed" && "bg-emerald-50 ring-slate-200",
          status === "locked" && "bg-slate-50 text-slate-500 ring-slate-200"
        )}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-primary">
              Lesson {index + 1}
            </p>
            <p className="mt-1 truncate text-lg font-black text-slate-800">
              {title}
            </p>
          </div>
          <span
            className={cn(
              "w-fit rounded-full px-2.5 py-1 text-xs font-black",
              status === "completed" && "bg-emerald-100 text-emerald-800",
              status === "current" && "bg-primary/10 text-primary",
              status === "locked" && "bg-slate-200 text-slate-600"
            )}
          >
            {status === "completed"
              ? "Done"
              : status === "current"
                ? "Unlocked"
                : "Locked"}
          </span>
        </div>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          {status === "completed"
            ? "You can review this lesson anytime."
            : status === "current"
              ? "Tap the play node to start this lesson."
              : "Complete the previous lesson to unlock this."}
        </p>
      </div>
    </div>
  );
}
