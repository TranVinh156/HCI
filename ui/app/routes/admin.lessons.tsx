import { FileVideo, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminShell } from "~/components/admin/admin-shell";
import { AdminTable } from "~/components/admin/admin-table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { getTopic, lessons } from "~/lib/learning-data";

export default function AdminLessonsRoute() {
  const [query, setQuery] = useState("");
  const filteredLessons = useMemo(
    () =>
      lessons.filter((lesson) =>
        `${lesson.title} ${lesson.phrase} ${getTopic(lesson.topicId)?.title}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <AdminShell title="Lessons" subtitle="Signs and learning content">
      <div className="space-y-5">
        <Card className="rounded-xl border-sky-100 py-0 shadow-sm">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-black">Lesson library</h2>
              <p className="text-sm font-semibold text-slate-500">
                Review sign hints, lesson type, XP, and media readiness.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search lessons..."
                  className="h-11 pl-9 sm:w-72"
                />
              </div>
              <Button className="h-11 rounded-xl font-black">
                <Plus className="size-4" />
                New lesson
              </Button>
            </div>
          </CardContent>
        </Card>

        <AdminTable
          title="Lesson management"
          data={filteredLessons}
          columns={[
            { key: "visual", header: "Visual", render: (item) => item.visual },
            { key: "title", header: "Lesson", render: (item) => item.title },
            { key: "phrase", header: "Phrase", render: (item) => item.phrase },
            {
              key: "topic",
              header: "Topic",
              render: (item) => getTopic(item.topicId)?.title ?? "Unknown",
            },
            {
              key: "type",
              header: "Type",
              render: (item) => (
                <Badge className="bg-cyan-100 text-cyan-800">
                  {item.type === "communication" ? "Communication" : "Vocabulary"}
                </Badge>
              ),
            },
            {
              key: "media",
              header: "Media",
              render: () => (
                <Badge className="bg-amber-100 text-amber-800">
                  <FileVideo className="size-3" />
                  Placeholder
                </Badge>
              ),
            },
            { key: "xp", header: "XP", render: (item) => item.xp },
          ]}
        />
      </div>
    </AdminShell>
  );
}
