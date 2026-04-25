import { ArrowRight, BarChart3, BookOpen, ClipboardCheck, GraduationCap, Sparkles, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

import { AdminShell } from "~/components/admin/admin-shell";
import { AdminTable } from "~/components/admin/admin-table";
import { StatCard } from "~/components/admin/stat-card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { lessons, profiles, quizzes, topics } from "~/lib/learning-data";

const adminShortcuts = [
  {
    title: "Manage students",
    description: "Review profiles, guardians, progress, and class status.",
    to: "/admin/students",
    icon: Users,
  },
  {
    title: "Edit topics",
    description: "Organize learning paths, topic order, and visibility.",
    to: "/admin/topics",
    icon: BookOpen,
  },
  {
    title: "Build lessons",
    description: "Maintain signs, hints, difficulty, and reward values.",
    to: "/admin/lessons",
    icon: GraduationCap,
  },
  {
    title: "Quiz bank",
    description: "Check questions, answers, and practice coverage.",
    to: "/admin/quizzes",
    icon: ClipboardCheck,
  },
  {
    title: "Reports",
    description: "Inspect completion, accuracy, and weak lessons.",
    to: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Mascot scripts",
    description: "Tune feedback lines and coaching behavior.",
    to: "/admin/mascot",
    icon: Sparkles,
  },
];

export default function AdminRoute() {
  const [query, setQuery] = useState("");
  const filteredLessons = useMemo(
    () =>
      lessons.filter((lesson) =>
        `${lesson.title} ${lesson.phrase}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <AdminShell title="Learning dashboard" subtitle="Overview">
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Students"
            value={String(profiles.length)}
            detail="+2 active profiles"
            icon={Users}
          />
          <StatCard
            label="Topics"
            value={String(topics.length)}
            detail="Ocean curriculum"
            icon={BookOpen}
          />
          <StatCard
            label="Lessons"
            value={String(lessons.length)}
            detail="Vocabulary and communication"
            icon={GraduationCap}
          />
          <StatCard
            label="Quiz questions"
            value={String(quizzes.length)}
            detail="Two checks per lesson"
            icon={ClipboardCheck}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {adminShortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.to} className="rounded-xl border-slate-200 py-0">
                <CardContent className="flex h-full flex-col gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid size-11 place-items-center rounded-xl text-cyan-700">
                      <Icon className="size-5" />
                    </div>
                    <Badge className="bg-sky-100 text-sky-800">Route ready</Badge>
                  </div>
                  <div className="grow">
                    <h2 className="text-lg font-black">{item.title}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {item.description}
                    </p>
                  </div>
                  <Button asChild variant="outline" className="h-10 rounded-xl">
                    <Link to={item.to}>
                      Open
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Completion"
            value="68%"
            detail="Weekly sample data"
            icon={BarChart3}
          />
          <StatCard
            label="Average accuracy"
            value="84%"
            detail="Across all quizzes"
            icon={ClipboardCheck}
          />
          <StatCard
            label="Mascot prompts"
            value="12"
            detail="Reusable coaching lines"
            icon={Sparkles}
          />
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-black">Search content</h2>
              <p className="text-sm font-semibold text-slate-500">
                Sample area for future filtering, pagination, and uploads.
              </p>
            </div>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search lessons..."
              className="h-11 md:max-w-xs"
            />
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-2">
          <AdminTable
            title="Recent students"
            data={profiles}
            columns={[
              { key: "name", header: "Name", render: (item) => item.name },
              { key: "age", header: "Age", render: (item) => item.age },
              {
                key: "guardian",
                header: "Guardian",
                render: (item) => item.guardian,
              },
            ]}
          />
          <AdminTable
            title="Topic status"
            data={topics}
            columns={[
              { key: "title", header: "Topic", render: (item) => item.title },
              {
                key: "lessons",
                header: "Lessons",
                render: (item) => item.lessonIds.length,
              },
              {
                key: "status",
                header: "Status",
                render: () => (
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-700">
                    Published
                  </span>
                ),
              },
            ]}
          />
        </div>

        <AdminTable
          title="Lessons and vocabulary"
          data={filteredLessons}
          columns={[
            { key: "title", header: "Lesson", render: (item) => item.title },
            {
              key: "phrase",
              header: "Word/Phrase",
              render: (item) => item.phrase,
            },
            {
              key: "type",
              header: "Type",
              render: (item) =>
                item.type === "communication" ? "Communication" : "Vocabulary",
            },
            { key: "xp", header: "XP", render: (item) => item.xp },
          ]}
        />
      </div>
    </AdminShell>
  );
}
