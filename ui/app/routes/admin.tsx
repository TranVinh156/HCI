import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router";

import { AdminShell } from "~/components/admin/admin-shell";
import { StatCard } from "~/components/admin/stat-card";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { useOverviewStats } from "~/hooks/use-reports";
import { cn } from "~/lib/utils";

const adminShortcuts = [
  {
    title: "Build lessons",
    description: "Organize topic paths, signs, hints, and rewards.",
    to: "/admin/lessons",
    icon: BookOpen,
    badge: "Curriculum",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Quiz bank",
    description: "Check questions, answers, and practice coverage.",
    to: "/admin/quizzes",
    icon: ClipboardCheck,
    badge: "Assessment",
    className: "md:col-span-1",
  },
] as const;

export default function AdminRoute() {
  const { data: stats } = useOverviewStats();

  const overviewStats = [
    {
      label: "Completion",
      value: String(stats?.total_attempts ?? 0),
      detail: "Total attempts",
      icon: BarChart3,
    },
    {
      label: "Average accuracy",
      value: "84%",
      detail: "Across all quizzes",
      icon: ClipboardCheck,
    },
    {
      label: "Mascot prompts",
      value: "12",
      detail: "Reusable coaching lines",
      icon: Sparkles,
    },
  ];

  return (
    <AdminShell title="Learning dashboard" subtitle="Overview">
      <div className="space-y-5">
        <Card className="rounded-xl border-slate-200 bg-white py-0">
          <CardContent className="p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black uppercase text-primary">
                  Overview
                </p>
                <h1 className="mt-1 text-2xl font-black text-slate-950">
                  Learning dashboard
                </h1>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Track learners, content coverage, and practice materials.
                </p>
              </div>
              <Badge className="w-fit bg-primary/10 text-primary">
                Admin
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Students"
            value={String(stats?.total_students ?? 0)}
            detail="Active profiles"
            icon={Users}
          />
          <StatCard
            label="Topics"
            value={String(stats?.total_topics ?? 0)}
            detail="Ocean curriculum"
            icon={BookOpen}
          />
          <StatCard
            label="Lessons"
            value={String(stats?.total_lessons ?? 0)}
            detail="Vocabulary and communication"
            icon={GraduationCap}
          />
          <StatCard
            label="Quiz questions"
            value={String(stats?.total_questions ?? 0)}
            detail="Two checks per lesson"
            icon={ClipboardCheck}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {overviewStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid auto-rows-[minmax(12rem,auto)] gap-4 md:grid-cols-3">
          {adminShortcuts.map((item) => (
            <BentoActionCard key={item.to} {...item} />
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

type BentoActionCardProps = {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
  badge: string;
  className?: string;
};

function BentoActionCard({
  title,
  description,
  to,
  icon: Icon,
  badge,
  className,
}: BentoActionCardProps) {
  return (
    <Link
      to={to}
      className={cn(
        "group relative flex min-h-48 overflow-hidden rounded-[1.75rem] border-2 border-[#036678] bg-white p-5 shadow-[2px_4px_0_#036678] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_6px_0_#036678]",
        className
      )}
    >
      <div className="flex h-full w-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-6" />
          </div>
          <Badge className="bg-primary/10 text-primary">{badge}</Badge>
        </div>

        <div className="max-w-xl">
          <h2 className="text-2xl font-black leading-tight text-slate-950">
            {title}
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-black text-primary">
          Open
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
