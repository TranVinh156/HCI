import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type DashboardShellProps = {
  children: ReactNode;
  contentClassName?: string;
  contentWidthClassName?: string;
};

export function DashboardShell({
  children,
  contentClassName,
  contentWidthClassName = "max-w-screen-2xl",
}: DashboardShellProps) {
  return (
    <main className="bg-background text-on-surface font-body flex h-full flex-col overflow-hidden">
      <div
        className={cn(
          "flex-1 overflow-y-auto p-6 mx-auto w-full",
          contentWidthClassName,
          contentClassName ?? "space-y-6",
        )}
      >
        {children}
      </div>
    </main>
  );
}
