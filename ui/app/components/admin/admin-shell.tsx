import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import { AppSidebarLayout } from "~/components/layout/app-sidebar-layout";

type AdminShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

const navItems = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Topics", to: "/admin/topics", icon: BookOpen },
  { label: "Lessons", to: "/admin/lessons", icon: GraduationCap },
  { label: "Quizzes", to: "/admin/quizzes", icon: ClipboardCheck },
  { label: "Reports", to: "/admin/reports", icon: BarChart3 },
];

export function AdminShell({ children }: AdminShellProps) {
  return (
    <AppSidebarLayout
      navItems={navItems}
      navLabel="Admin"
      homeTo="/admin"
      contentClassName="mx-auto max-w-7xl p-5"
      mobileNavBorder
    >
      {children}
    </AppSidebarLayout>
  );
}
