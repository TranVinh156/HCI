import type { ReactNode } from "react";
import { Badge } from "../ui/badge";

type SectionHeadingProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({
  title,
  description,
  eyebrow,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${className ?? ""}`}>
      <div className="space-y-2">
        {eyebrow && (
          <Badge variant="secondary" className="self-start rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.24em]">
            {eyebrow}
          </Badge>
        )}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      </div>

      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
