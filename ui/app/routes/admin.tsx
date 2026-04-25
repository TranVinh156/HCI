import { BarChart3, BookOpen, GraduationCap, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminShell } from "~/components/admin/admin-shell";
import { AdminTable } from "~/components/admin/admin-table";
import { StatCard } from "~/components/admin/stat-card";
import { Input } from "~/components/ui/input";
import { lessons, profiles, topics } from "~/lib/learning-data";

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
    <AdminShell>
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
            label="Completion"
            value="68%"
            detail="Weekly sample data"
            icon={BarChart3}
          />
        </div>

        <section className="rounded-xl border border-sky-100 bg-white p-4 shadow-sm">
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
            title="Students"
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
            title="Topics"
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
            { key: "phrase", header: "Word/Phrase", render: (item) => item.phrase },
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
