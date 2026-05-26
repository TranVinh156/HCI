import { cn } from "~/lib/utils";

type OceanProgressProps = {
  value: number;
  label?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
};

export function OceanProgress({
  value,
  label,
  className,
  orientation = "horizontal",
}: OceanProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  if (orientation === "vertical") {
    return (
      <div className={cn("flex h-full min-h-56 items-center gap-3", className)}>
        <div className="flex h-full min-h-56 w-4 items-end overflow-hidden rounded-full bg-primary/10 ring-1 ring-primary/30">
          <div
            className="w-full rounded-full bg-primary transition-all duration-500"
            style={{ height: `${safeValue}%` }}
          />
        </div>
        {label ? (
          <div className="flex h-full min-h-56 flex-col items-center justify-between text-xs font-bold text-slate-700">
            <span className="rotate-180 whitespace-nowrap [writing-mode:vertical-rl]">
              {label}
            </span>
            <span>{safeValue}%</span>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <div className="flex items-center justify-between text-sm font-bold text-slate-700">
          <span>{label}</span>
          <span>{safeValue}%</span>
        </div>
      ) : null}
      <div className="h-4 overflow-hidden rounded-full bg-primary/10 ring-1 ring-primary/30">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
