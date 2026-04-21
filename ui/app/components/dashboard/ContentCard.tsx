import type { ReactNode } from "react";

type ContentCardProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  titleClassName?: string;
};

export function ContentCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
  titleClassName,
}: ContentCardProps) {
  return (
    <section className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className ?? ""}`}>
      {(title || description || action) && (
        <div className="flex items-start justify-between gap-4 p-5 border-b border-slate-100">
          <div className="space-y-1">
            {title && (
              <h3 className={`font-headline font-bold text-lg text-primary ${titleClassName ?? ""}`}>{title}</h3>
            )}
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className={bodyClassName ?? "p-5"}>{children}</div>
    </section>
  );
}
