import { Check, Lock, Play } from "lucide-react";
import { Link } from "react-router";

import { cn } from "~/lib/utils";

type PathNodeProps = {
  lessonId: string;
  title: string;
  index: number;
  status: "completed" | "current" | "locked";
};

export function PathNode({ lessonId, title, index, status }: PathNodeProps) {
  const Icon = status === "completed" ? Check : status === "locked" ? Lock : Play;
  const node = (
    <div
      className={cn(
        "group grid size-20 place-items-center rounded-full border-4 text-white shadow-lg transition",
        status === "completed" &&
          "border-emerald-200 bg-emerald-500 shadow-emerald-200",
        status === "current" &&
          "border-sky-200 bg-sky-600 shadow-sky-200 hover:-translate-y-1",
        status === "locked" &&
          "border-slate-200 bg-slate-300 text-slate-500 shadow-slate-100"
      )}
    >
      <Icon className="size-8" />
    </div>
  );

  return (
    <div
      className={cn(
        "relative flex w-full items-center gap-4",
        index % 2 === 1 && "justify-end"
      )}
    >
      <div className="flex max-w-[18rem] items-center gap-4">
        {status === "locked" ? node : <Link to={`/lesson/${lessonId}`}>{node}</Link>}
        <div className="min-w-0 rounded-2xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-cyan-100">
          <p className="text-xs font-bold uppercase text-cyan-700">
            Lesson {index + 1}
          </p>
          <p className="truncate text-base font-black text-slate-800">{title}</p>
          <p className="text-xs font-semibold text-slate-500">
            {status === "completed"
              ? "Done"
              : status === "current"
                ? "Unlocked"
                : "Complete the previous lesson"}
          </p>
        </div>
      </div>
    </div>
  );
}
