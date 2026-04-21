import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { cn } from "../../lib/utils";

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
    <Card className={className}>
      {(title || description || action) && (
        <CardHeader className="flex-row items-start justify-between gap-4 border-b border-slate-100 p-5">
          <div className="space-y-1">
            {title && (
              <CardTitle className={cn("font-headline text-lg text-primary", titleClassName)}>{title}</CardTitle>
            )}
            {description && <CardDescription>{description}</CardDescription>}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </CardHeader>
      )}

      <CardContent className={bodyClassName ?? "p-5"}>{children}</CardContent>
    </Card>
  );
}
