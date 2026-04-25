import { Sparkles } from "lucide-react";

import { cn } from "~/lib/utils";

type MascotProps = {
  message: string;
  mood?: "hello" | "coach" | "success";
  compact?: boolean;
};

export function Mascot({ message, mood = "hello", compact }: MascotProps) {
  const face = mood === "success" ? "^-^" : mood === "coach" ? "o_o" : "^_^";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[2rem] border border-cyan-100 bg-white/90 p-3 shadow-sm",
        compact ? "max-w-md" : "max-w-2xl"
      )}
    >
      <div className="grid size-16 shrink-0 place-items-center rounded-full bg-sky-500 text-lg font-black text-white shadow-inner">
        {face}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-cyan-700">
          <Sparkles className="size-3.5" />
          Sami
        </div>
        <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-700 sm:text-base">
          {message}
        </p>
      </div>
    </div>
  );
}
