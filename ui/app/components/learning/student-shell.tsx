import {
  ArrowLeftRight,
  BookOpen,
  Dumbbell,
  Home,
  Languages,
  MessageCircle,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import type { ReactNode } from "react";

import { AppSidebarLayout } from "~/components/layout/app-sidebar-layout";

type StudentShellProps = {
  children: ReactNode;
};

const navItems = [
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/translate", label: "Translate", icon: Languages },
  { to: "/practice", label: "Practice", icon: Dumbbell },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/admin", label: "Admin", icon: Shield, adminOnly: true },
];

export function StudentShell({ children }: StudentShellProps) {
  return (
    <AppSidebarLayout
      navItems={navItems}
      navLabel="Student"
      homeTo="/learn"
      contentClassName="mx-auto max-w-6xl px-4 py-6 lg:px-8"
      requireAuth
    >
      {children}
    </AppSidebarLayout>
  );
}
