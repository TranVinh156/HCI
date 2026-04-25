import { AlertTriangle, BarChart3, Clock, Target } from "lucide-react";

import { AdminShell } from "~/components/admin/admin-shell";
import { AdminTable } from "~/components/admin/admin-table";
import { StatCard } from "~/components/admin/stat-card";
import { Badge } from "~/components/ui/badge";
import { lessons, profiles, topics } from "~/lib/learning-data";

const reportRows = lessons.slice(0, 6).map((lesson, index) => ({
  lesson: lesson.title,
  topic: topics.find((topic) => topic.id === lesson.topicId)?.title ?? "Unknown",
  attempts: 18 - index * 2,
  accuracy: `${92 - index * 6}%`,
  risk: index > 3 ? "Review" : "Healthy",
}));

export default function AdminReportsRoute() {
  return (
    <AdminShell title="Reports" subtitle="Learning analytics">
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Active students"
            value={String(profiles.length)}
            detail="Mock roster"
            icon={Target}
          />
          <StatCard
            label="Avg. accuracy"
            value="84%"
            detail="+6% vs last week"
            icon={BarChart3}
          />
          <StatCard
            label="Study time"
            value="42m"
            detail="Per student/week"
            icon={Clock}
          />
          <StatCard
            label="Needs review"
            value="2"
            detail="Lessons below target"
            icon={AlertTriangle}
          />
        </div>

        <AdminTable
          title="Lesson performance"
          data={reportRows}
          columns={[
            { key: "lesson", header: "Lesson", render: (item) => item.lesson },
            { key: "topic", header: "Topic", render: (item) => item.topic },
            { key: "attempts", header: "Attempts", render: (item) => item.attempts },
            { key: "accuracy", header: "Accuracy", render: (item) => item.accuracy },
            {
              key: "risk",
              header: "Status",
              render: (item) => (
                <Badge
                  className={
                    item.risk === "Healthy"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }
                >
                  {item.risk}
                </Badge>
              ),
            },
          ]}
        />
      </div>
    </AdminShell>
  );
}
