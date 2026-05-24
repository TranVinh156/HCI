import { AlertTriangle, BarChart3, Clock, Target } from "lucide-react";

import { AdminShell } from "~/components/admin/admin-shell";
import { AdminTable } from "~/components/admin/admin-table";
import { StatCard } from "~/components/admin/stat-card";
import { Badge } from "~/components/ui/badge";
import {
  useLessonReports,
  useOverviewReport,
  useStudentReports,
} from "~/hooks/use-reports";

export default function AdminReportsRoute() {
  const { data: overview } = useOverviewReport();
  const { data: students = [] } = useStudentReports();
  const { data: reportRows = [], isLoading, isError } = useLessonReports();

  return (
    <AdminShell title="Reports" subtitle="Learning analytics">
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Active students"
            value={String(overview?.total_students ?? students.length)}
            detail="Active profiles"
            icon={Target}
          />
          <StatCard
            label="Avg. accuracy"
            value={
              reportRows.length
                ? `${Math.round(
                    reportRows.reduce((sum, row) => sum + row.avg_score, 0) /
                      reportRows.length
                  )}%`
                : "0%"
            }
            detail="Across lesson attempts"
            icon={BarChart3}
          />
          <StatCard
            label="Study time"
            value={String(overview?.total_attempts ?? 0)}
            detail="Total attempts"
            icon={Clock}
          />
          <StatCard
            label="Needs review"
            value={String(reportRows.filter((row) => row.avg_score < 70).length)}
            detail="Lessons below 70%"
            icon={AlertTriangle}
          />
        </div>

        {isLoading ? (
          <p className="rounded-xl bg-white p-4 font-bold text-slate-600">
            Loading reports...
          </p>
        ) : isError ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 font-bold text-rose-700">
            Unable to load reports.
          </p>
        ) : (
          <AdminTable
            title="Lesson performance"
            data={reportRows}
            columns={[
              { key: "lesson", header: "Lesson", render: (item) => item.title },
              {
                key: "topic",
                header: "Topic",
                render: (item) => item.topic_title,
              },
              {
                key: "attempts",
                header: "Attempts",
                render: (item) => item.attempt_count,
              },
              {
                key: "accuracy",
                header: "Accuracy",
                render: (item) => `${Math.round(item.avg_score)}%`,
              },
              {
                key: "risk",
                header: "Status",
                render: (item) => (
                  <Badge
                    className={
                      item.avg_score >= 70
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }
                  >
                    {item.avg_score >= 70 ? "Healthy" : "Review"}
                  </Badge>
                ),
              },
            ]}
          />
        )}
      </div>
    </AdminShell>
  );
}
