import { Eye, EyeOff, Plus } from "lucide-react";

import { AdminShell } from "~/components/admin/admin-shell";
import { AdminTable } from "~/components/admin/admin-table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { topics } from "~/lib/learning-data";

const topicRows = topics.map((topic, index) => ({
  ...topic,
  order: index + 1,
  visibility: index === topics.length - 1 ? "Draft" : "Published",
}));

export default function AdminTopicsRoute() {
  return (
    <AdminShell title="Topics" subtitle="Curriculum structure">
      <div className="space-y-5">
        <Card className="rounded-xl border-slate-200 py-0">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-black">Learning topics</h2>
              <p className="text-sm font-semibold text-slate-500">
                Organize the topic cards that students see before entering a path.
              </p>
            </div>
            <Button className="h-11 rounded-xl font-black">
              <Plus className="size-4" />
              New topic
            </Button>
          </CardContent>
        </Card>

        <AdminTable
          title="Topic management"
          data={topicRows}
          columns={[
            { key: "order", header: "Order", render: (item) => item.order },
            { key: "title", header: "Topic", render: (item) => item.title },
            {
              key: "description",
              header: "Description",
              render: (item) => item.description,
            },
            {
              key: "lessons",
              header: "Lessons",
              render: (item) => item.lessonIds.length,
            },
            {
              key: "visibility",
              header: "Visibility",
              render: (item) => (
                <Badge
                  className={
                    item.visibility === "Published"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-700"
                  }
                >
                  {item.visibility === "Published" ? (
                    <Eye className="size-3" />
                  ) : (
                    <EyeOff className="size-3" />
                  )}
                  {item.visibility}
                </Badge>
              ),
            },
          ]}
        />
      </div>
    </AdminShell>
  );
}
