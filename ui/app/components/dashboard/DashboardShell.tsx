import type { ReactNode } from "react";
import { useSidebarLayout } from "../layout/sidebar-layout-context";

type DashboardShellProps = {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
  contentWidthClassName?: string;
};

export function DashboardShell({
  title,
  subtitle,
  rightSlot,
  children,
  contentClassName,
  contentWidthClassName = "max-w-screen-2xl",
}: DashboardShellProps) {
  const { isSidebarOpen, openSidebar } = useSidebarLayout();

  return (
    <main className="bg-background text-on-surface font-body flex flex-col h-full overflow-hidden">
      <header className="w-full top-0 sticky flex justify-between items-center h-16 px-6 bg-slate-50 border-b border-slate-100 z-10 gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {!isSidebarOpen && (
            <button
              onClick={openSidebar}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Show sidebar"
            >
              <span className="material-symbols-outlined">left_panel_open</span>
            </button>
          )}

          <div className="min-w-0">
            <h1 className="font-headline font-bold text-xl text-primary tracking-tight truncate">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 mt-1 truncate">{subtitle}</p>}
          </div>
        </div>

        {rightSlot && <div className="flex items-center gap-3 shrink-0">{rightSlot}</div>}
      </header>

      <div
        className={`flex-1 overflow-y-auto p-6 mx-auto w-full ${contentWidthClassName} ${
          contentClassName ?? "space-y-6"
        }`}
      >
        {children}
      </div>
    </main>
  );
}
