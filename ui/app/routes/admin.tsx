import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Layers3,
  ListChecks,
  Users,
} from "lucide-react";

import { AdminShell } from "~/components/admin/admin-shell";
import { StatCard } from "~/components/admin/stat-card";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import type { OverviewStats } from "~/api/types";
import { useOverviewStats } from "~/hooks/use-reports";

const chartColors = [
  "bg-primary",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-sky-500",
];

export default function AdminRoute() {
  const { data: stats } = useOverviewStats();
  const readyLessons =
    stats?.content_readiness?.find((item) => item.label === "Ready")?.value ??
    0;

  const overviewStats = [
    {
      label: "Lesson types",
      value: String(stats?.lesson_type_distribution?.length ?? 0),
      detail: "Content categories",
      icon: Layers3,
    },
    {
      label: "Question types",
      value: String(stats?.question_type_distribution?.length ?? 0),
      detail: "Assessment formats",
      icon: ListChecks,
    },
    {
      label: "Ready lessons",
      value: String(readyLessons),
      detail: "Lessons with quiz checks",
      icon: BarChart3,
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
                  Content management dashboard
                </h1>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Manage seeded topics, lessons, and quiz coverage.
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
            detail="Registered profiles"
            icon={Users}
          />
          <StatCard
            label="Topics"
            value={String(stats?.total_topics ?? 0)}
            detail="Seeded learning paths"
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
            detail="Seeded assessment bank"
            icon={ClipboardCheck}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {overviewStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <TopicInventoryChart stats={stats} />
          <ContentReadinessChart stats={stats} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <DistributionChart
            title="Lesson types"
            detail="Lessons by content category"
            badge="Lessons"
            data={stats?.lesson_type_distribution ?? []}
          />
          <DistributionChart
            title="Question types"
            detail="Question bank formats"
            badge="Quizzes"
            data={stats?.question_type_distribution ?? []}
          />
          <DistributionChart
            title="Difficulty"
            detail="Lesson difficulty mix"
            badge="Levels"
            data={stats?.difficulty_distribution ?? []}
          />
        </div>
      </div>
    </AdminShell>
  );
}

function TopicInventoryChart({ stats }: { stats?: OverviewStats }) {
  const data = stats?.topic_inventory ?? [];
  const maxValue = Math.max(
    1,
    ...data.flatMap((item) => [item.lessons, item.questions])
  );

  return (
    <Card className="rounded-xl border-slate-200 bg-white py-0">
      <CardContent className="p-5">
        <ChartHeader
          title="Topic inventory"
          detail="Lessons and quiz questions per seeded topic"
          badge="Content"
        />
        <div className="mt-5 space-y-4">
          {data.length ? (
            data.map((item) => (
              <div key={item.label} className="grid gap-2 sm:grid-cols-[10rem_1fr]">
                <p className="truncate text-sm font-black text-slate-700">
                  {item.label}
                </p>
                <div className="space-y-2">
                  <InventoryBar
                    label="Lessons"
                    value={item.lessons}
                    maxValue={maxValue}
                    className="bg-primary"
                  />
                  <InventoryBar
                    label="Questions"
                    value={item.questions}
                    maxValue={maxValue}
                    className="bg-emerald-500"
                  />
                </div>
              </div>
            ))
          ) : (
            <EmptyChartText />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ContentReadinessChart({ stats }: { stats?: OverviewStats }) {
  const data = stats?.content_readiness ?? [];
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const ready = data.find((item) => item.label === "Ready")?.value ?? 0;
  const readyPct = total ? Math.round((ready / total) * 100) : 0;

  return (
    <Card className="rounded-xl border-slate-200 bg-white py-0">
      <CardContent className="p-5">
        <ChartHeader
          title="Content readiness"
          detail="Lessons with quiz coverage"
          badge="Coverage"
        />
        <div className="mt-6 grid place-items-center">
          <div
            className="grid size-44 place-items-center rounded-full"
            style={{
              background: `conic-gradient(#10b981 0deg ${
                readyPct * 3.6
              }deg, #e2e8f0 ${readyPct * 3.6}deg 360deg)`,
            }}
          >
            <div className="grid size-28 place-items-center rounded-full bg-white text-center">
              <div>
                <p className="text-4xl font-black text-slate-950">
                  {readyPct}%
                </p>
                <p className="text-xs font-black uppercase text-slate-500">
                  Ready
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {data.map((item) => (
            <MiniMetric
              key={item.label}
              label={item.label}
              value={String(item.value)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DistributionChart({
  title,
  detail,
  badge,
  data,
}: {
  title: string;
  detail: string;
  badge: string;
  data: { label: string; value: number }[];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="rounded-xl border-slate-200 bg-white py-0">
      <CardContent className="p-5">
        <ChartHeader title={title} detail={detail} badge={badge} />
        <div className="mt-5 space-y-4">
          {data.length ? (
            data.map((item, index) => {
              const pct = total ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-black text-slate-700">
                      {item.label}
                    </span>
                    <span className="text-sm font-black text-slate-500">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className={`h-3 rounded-full ${
                        chartColors[index % chartColors.length]
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyChartText />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function InventoryBar({
  label,
  value,
  maxValue,
  className,
}: {
  label: string;
  value: number;
  maxValue: number;
  className: string;
}) {
  return (
    <div className="grid grid-cols-[5rem_1fr_2rem] items-center gap-2">
      <span className="text-xs font-black uppercase text-slate-500">
        {label}
      </span>
      <div className="h-3 rounded-full bg-slate-100">
        <div
          className={`h-3 rounded-full ${className}`}
          style={{ width: `${Math.max(4, (value / maxValue) * 100)}%` }}
        />
      </div>
      <span className="text-right text-sm font-black text-slate-700">
        {value}
      </span>
    </div>
  );
}

function ChartHeader({
  title,
  detail,
  badge,
}: {
  title: string;
  detail: string;
  badge: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-black text-slate-950">{title}</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">{detail}</p>
      </div>
      <Badge className="bg-primary/10 text-primary">{badge}</Badge>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function EmptyChartText() {
  return (
    <p className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm font-bold text-slate-500">
      No seeded content yet.
    </p>
  );
}
