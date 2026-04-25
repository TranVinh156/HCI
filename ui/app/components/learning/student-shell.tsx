import {
  BookOpen,
  Dumbbell,
  Home,
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
  { to: "/learn", label: "Home", icon: Home },
  { to: "/topics", label: "Learn", icon: BookOpen },
  { to: "/communication", label: "Talk", icon: MessageCircle },
  { to: "/practice", label: "Practice", icon: Dumbbell },
  { to: "/mascot", label: "Sami", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/admin", label: "Admin", icon: Shield },
];

export function StudentShell({ children }: StudentShellProps) {
  return (
    <AppSidebarLayout
      navItems={navItems}
      navLabel="Student"
      homeTo="/learn"
      contentClassName="mx-auto max-w-6xl px-4 py-6 lg:px-8"
    >
      {children}
    </AppSidebarLayout>
  );
}
