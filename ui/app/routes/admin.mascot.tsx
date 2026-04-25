import { MessageSquare, Play, Plus, Sparkles } from "lucide-react";

import { AdminShell } from "~/components/admin/admin-shell";
import { AdminTable } from "~/components/admin/admin-table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

const mascotScripts = [
  {
    moment: "Welcome",
    line: "Choose a profile to start learning today.",
    mood: "hello",
    status: "Active",
  },
  {
    moment: "Lesson coach",
    line: "Watch the hands and face, then replay the sign if you need.",
    mood: "coach",
    status: "Active",
  },
  {
    moment: "Correct answer",
    line: "That is correct. Great job.",
    mood: "success",
    status: "Active",
  },
  {
    moment: "Camera retry",
    line: "Bring your hands higher and move a little slower.",
    mood: "coach",
    status: "Draft",
  },
];

export default function AdminMascotRoute() {
  return (
    <AdminShell title="Mascot" subtitle="Virtual coach scripts">
      <div className="space-y-5">
        <Card className="rounded-xl border-slate-200 py-0">
          <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center rounded-full bg-primary text-lg font-black text-white">
                ^_^
              </div>
              <div>
                <h2 className="text-lg font-black">Sami script manager</h2>
                <p className="text-sm font-semibold text-slate-500">
                  Manage basic mascot prompts, moods, and feedback states.
                </p>
              </div>
            </div>
            <Button className="h-11 rounded-xl font-black">
              <Plus className="size-4" />
              Add script
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-xl border-slate-200 py-0">
            <CardContent className="p-5">
              <Sparkles className="size-7 text-primary" />
              <p className="mt-3 text-3xl font-black">4</p>
              <p className="text-sm font-bold text-slate-500">Script moments</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-slate-200 py-0">
            <CardContent className="p-5">
              <MessageSquare className="size-7 text-emerald-600" />
              <p className="mt-3 text-3xl font-black">3</p>
              <p className="text-sm font-bold text-slate-500">Moods</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-slate-200 py-0">
            <CardContent className="p-5">
              <Play className="size-7 text-amber-600" />
              <p className="mt-3 text-3xl font-black">1</p>
              <p className="text-sm font-bold text-slate-500">Animation set</p>
            </CardContent>
          </Card>
        </div>

        <AdminTable
          title="Mascot scripts"
          data={mascotScripts}
          columns={[
            { key: "moment", header: "Moment", render: (item) => item.moment },
            { key: "line", header: "Line", render: (item) => item.line },
            { key: "mood", header: "Mood", render: (item) => item.mood },
            {
              key: "status",
              header: "Status",
              render: (item) => (
                <Badge
                  className={
                    item.status === "Active"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-700"
                  }
                >
                  {item.status}
                </Badge>
              ),
            },
          ]}
        />
      </div>
    </AdminShell>
  );
}
