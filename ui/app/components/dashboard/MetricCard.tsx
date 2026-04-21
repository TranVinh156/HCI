import { Card } from "../ui/card";
import { cn } from "../../lib/utils";

type MetricCardProps = {
  label: string;
  value: number | string;
  unit?: string;
  icon: string;
  iconBgClassName: string;
  iconClassName: string;
  valueClassName?: string;
  helper?: string;
  className?: string;
};

export function MetricCard({
  label,
  value,
  unit,
  icon,
  iconBgClassName,
  iconClassName,
  valueClassName,
  helper,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("p-5 hover:shadow-md transition-[box-shadow]", className)}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">{label}</h3>
        <div className={`p-2 rounded-lg ${iconBgClassName}`}>
          <span className={`material-symbols-outlined text-[20px] ${iconClassName}`}>{icon}</span>
        </div>
      </div>

      <div className="flex items-end gap-1">
        <span className={`text-4xl font-extrabold ${valueClassName ?? "text-slate-800"}`}>{value}</span>
        {unit && <span className="text-lg text-slate-400 mb-0.5">{unit}</span>}
      </div>

      {helper && <p className="mt-3 text-xs text-slate-400">{helper}</p>}
    </Card>
  );
}
