import { CheckCircle2, ClipboardCheck, HelpCircle, Plus } from "lucide-react";

import { AdminShell } from "~/components/admin/admin-shell";
import { AdminTable } from "~/components/admin/admin-table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { getLesson, quizzes } from "~/lib/learning-data";

export default function AdminQuizzesRoute() {
  return (
    <AdminShell title="Quizzes" subtitle="Practice question bank">
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-xl border-sky-100 py-0 shadow-sm">
            <CardContent className="p-5">
              <ClipboardCheck className="size-7 text-cyan-700" />
              <p className="mt-3 text-3xl font-black">{quizzes.length}</p>
              <p className="text-sm font-bold text-slate-500">Questions</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-sky-100 py-0 shadow-sm">
            <CardContent className="p-5">
              <HelpCircle className="size-7 text-amber-600" />
              <p className="mt-3 text-3xl font-black">2</p>
              <p className="text-sm font-bold text-slate-500">Question types</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-sky-100 py-0 shadow-sm">
            <CardContent className="p-5">
              <CheckCircle2 className="size-7 text-emerald-600" />
              <p className="mt-3 text-3xl font-black">100%</p>
              <p className="text-sm font-bold text-slate-500">Answer coverage</p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-xl border-sky-100 py-0 shadow-sm">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-black">Quiz questions</h2>
              <p className="text-sm font-semibold text-slate-500">
                Each lesson currently has meaning and image-matching checks.
              </p>
            </div>
            <Button className="h-11 rounded-xl font-black">
              <Plus className="size-4" />
              New question
            </Button>
          </CardContent>
        </Card>

        <AdminTable
          title="Question bank"
          data={quizzes}
          columns={[
            {
              key: "lesson",
              header: "Lesson",
              render: (item) => getLesson(item.lessonId)?.title ?? "Unknown",
            },
            { key: "prompt", header: "Prompt", render: (item) => item.prompt },
            {
              key: "type",
              header: "Type",
              render: (item) => (
                <Badge className="bg-cyan-100 text-cyan-800">{item.type}</Badge>
              ),
            },
            { key: "answer", header: "Answer", render: (item) => item.answer },
            {
              key: "options",
              header: "Options",
              render: (item) => item.options.length,
            },
          ]}
        />
      </div>
    </AdminShell>
  );
}
