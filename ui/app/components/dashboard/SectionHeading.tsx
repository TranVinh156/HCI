import type { ReactNode } from "react";

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
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p>
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
