import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  HelpCircle,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "~/components/admin/admin-shell";
import { AdminTable } from "~/components/admin/admin-table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { useQuizBank } from "~/hooks/use-quiz-bank";

const QUIZ_PAGE_SIZE = 10;

export default function AdminQuizzesRoute() {
  const { data: quizzes = [], isLoading, isError } = useQuizBank();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(quizzes.length / QUIZ_PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageStart = (currentPage - 1) * QUIZ_PAGE_SIZE;
  const pageEnd = Math.min(pageStart + QUIZ_PAGE_SIZE, quizzes.length);
  const paginatedQuizzes = useMemo(
    () => quizzes.slice(pageStart, pageEnd),
    [pageEnd, pageStart, quizzes]
  );

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
          <LoadingSpinner
            label="Loading question bank"
            className="rounded-xl bg-white p-4"
          />
        ) : isError ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 font-bold text-rose-700">
            Unable to load question bank.
          </p>
        ) : (
          <div className="space-y-3">
            <AdminTable
              title="Question bank"
              data={paginatedQuizzes}
              getRowKey={(item) => item.id}
              emptyMessage="No quiz questions yet."
              columns={[
                {
                  key: "lesson",
                  header: "Lesson",
                  render: (item) => item.lesson_title ?? "Untitled lesson",
                },
                {
                  key: "prompt",
                  header: "Prompt",
                  render: (item) => (
                    <span className="block max-w-md truncate">
                      {item.prompt}
                    </span>
                  ),
                },
                {
                  key: "type",
                  header: "Type",
                  render: (item) => (
                    <Badge className="bg-primary/10 text-primary">
                      {item.type}
                    </Badge>
                  ),
                },
                {
                  key: "answer",
                  header: "Answer",
                  render: (item) => item.answer,
                },
                {
                  key: "options",
                  header: "Options",
                  render: (item) => item.options.length,
                },
                {
                  key: "actions",
                  header: "Actions",
                  render: (item) => (
                    <div className="flex justify-start gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit quiz question ${item.id}`}
                        title="Edit"
                        className="text-slate-600 hover:text-primary"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete quiz question ${item.id}`}
                        title="Delete"
                        className="text-rose-600 hover:text-rose-700"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold text-slate-500">
                Showing {quizzes.length ? pageStart + 1 : 0}-{pageEnd} of{" "}
                {quizzes.length} questions
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-xl font-black"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="size-4" />
                  Prev
                </Button>
                <span className="min-w-24 text-center text-sm font-black text-slate-700">
                  Page {currentPage} / {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-xl font-black"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
