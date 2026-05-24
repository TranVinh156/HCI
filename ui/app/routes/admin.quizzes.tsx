import { CheckCircle2, ClipboardCheck, HelpCircle, Plus } from "lucide-react";

import { AdminShell } from "~/components/admin/admin-shell";
import { AdminTable } from "~/components/admin/admin-table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useQuizBank } from "~/hooks/use-quiz-bank";

export default function AdminQuizzesRoute() {
  const { data: quizzes = [], isLoading, isError } = useQuizBank();

  return (
    <AdminShell title="Quizzes" subtitle="Practice question bank">
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-xl border-slate-200 py-0">
            <CardContent className="p-5">
              <ClipboardCheck className="size-7 text-primary" />
              <p className="mt-3 text-3xl font-black">{quizzes.length}</p>
              <p className="text-sm font-bold text-slate-500">Questions</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-slate-200 py-0">
            <CardContent className="p-5">
              <HelpCircle className="size-7 text-amber-600" />
              <p className="mt-3 text-3xl font-black">2</p>
              <p className="text-sm font-bold text-slate-500">Question types</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-slate-200 py-0">
            <CardContent className="p-5">
              <CheckCircle2 className="size-7 text-emerald-600" />
              <p className="mt-3 text-3xl font-black">100%</p>
              <p className="text-sm font-bold text-slate-500">Answer coverage</p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-xl border-slate-200 py-0">
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

        {isLoading ? (
          <p className="rounded-xl bg-white p-4 font-bold text-slate-600">
            Loading question bank...
          </p>
        ) : isError ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 font-bold text-rose-700">
            Unable to load question bank.
          </p>
        ) : (
          <AdminTable
            title="Question bank"
            data={quizzes}
            columns={[
              {
                key: "lesson",
                header: "Lesson",
                render: (item) => item.lesson_title,
              },
              { key: "prompt", header: "Prompt", render: (item) => item.prompt },
              {
                key: "type",
                header: "Type",
                render: (item) => (
                  <Badge className="bg-primary/10 text-primary">{item.type}</Badge>
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
        )}
      </div>
    </AdminShell>
  );
}
