import { cn } from "~/lib/utils";

type OceanProgressProps = {
  value: number;
  label?: string;
  className?: string;
};

export function OceanProgress({ value, label, className }: OceanProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <div className="flex items-center justify-between text-sm font-bold text-slate-700">
          <span>{label}</span>
          <span>{safeValue}%</span>
        </div>
      ) : null}
      <div className="h-4 overflow-hidden rounded-full bg-cyan-100 ring-1 ring-cyan-200">
        <div
          className="h-full rounded-full bg-sky-600 transition-all duration-500"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
