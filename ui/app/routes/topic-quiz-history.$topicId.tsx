import { ArrowLeft, ArrowRight, ClipboardCheck, Trophy } from "lucide-react";
import { Link, useParams } from "react-router";

import { StudentShell } from "~/components/learning/student-shell";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useGetTopicQuestions } from "~/hooks/use-get-topic-questions";
import { useGetTopic } from "~/hooks/use-get-topics";
import { useProgressData, useTopicQuizAttempts } from "~/hooks/use-progress";

export default function TopicQuizHistoryRoute() {
  const params = useParams();
  const topicId = params.topicId;
  const {
    data: topic,
    isLoading: isTopicLoading,
    isError: isTopicError,
  } = useGetTopic(topicId);
  const { data: questions = [], isLoading: isQuestionsLoading } =
    useGetTopicQuestions(topicId);
  const { data: progressData, isLoading: isProgressLoading } =
    useProgressData();
  const profileId = progressData?.profile?.id;
  const {
    data: attempts = [],
    isLoading: isAttemptsLoading,
    isError: isAttemptsError,
  } = useTopicQuizAttempts(profileId, topicId);

  if (!topicId) {
    return (
      <StudentShell>
        <p className="font-bold">Topic not found.</p>
      </StudentShell>
    );
  }

  if (
    isTopicLoading ||
    isQuestionsLoading ||
    isProgressLoading ||
    isAttemptsLoading
  ) {
    return (
      <StudentShell>
        <p className="font-bold">Loading quiz history...</p>
      </StudentShell>
    );
  }

  if (isTopicError || isAttemptsError || !topic) {
    return (
      <StudentShell>
        <p className="font-bold">Unable to load quiz history.</p>
      </StudentShell>
    );
  }

  const bestAttempt = getBestAttempt(attempts);

  return (
    <StudentShell>
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-primary">
              Topic exam
            </p>
            <h1 className="text-4xl font-black text-slate-900">
              {topic.title}
            </h1>
            <p className="mt-2 max-w-2xl font-semibold text-slate-600">
              {topic.description ?? "Review previous attempts before starting again."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-2xl font-black"
            >
              <Link to="/practice">
                <ArrowLeft className="size-5" />
                Back
              </Link>
            </Button>
            <Button asChild className="h-11 rounded-2xl font-black">
              <Link to={`/topic-quiz/${topicId}`}>
                Start quiz
                <ArrowRight className="size-5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="rounded-[2rem] border-slate-200 bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="font-black uppercase text-primary">
                Attempts
              </CardDescription>
              <CardTitle className="text-3xl font-black">
                {attempts.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="rounded-[2rem] border-slate-200 bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="font-black uppercase text-primary">
                Questions
              </CardDescription>
              <CardTitle className="text-3xl font-black">
                {questions.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="rounded-[2rem] border-slate-200 bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="font-black uppercase text-primary">
                Best score
              </CardDescription>
              <CardTitle className="text-3xl font-black">
                {bestAttempt
                  ? `${scorePercent(bestAttempt.correct, bestAttempt.total)}%`
                  : "-"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="rounded-[2rem] border-slate-200 bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <ClipboardCheck className="size-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black">
                  Previous attempts
                </CardTitle>
                <CardDescription className="font-semibold">
                  Completed quiz sessions for this topic.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {attempts.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-black">#</TableHead>
                    <TableHead className="font-black">Score</TableHead>
                    <TableHead className="font-black">Correct</TableHead>
                    <TableHead className="font-black">Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attempts.map((attempt, index) => (
                    <TableRow key={attempt.id}>
                      <TableCell className="font-black">
                        {attempts.length - index}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/10 text-primary">
                          {scorePercent(attempt.correct, attempt.total)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-slate-700">
                        {attempt.correct}/{attempt.total}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-600">
                        {formatCompletedAt(attempt.completed_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 p-8 text-center">
                <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                  <Trophy className="size-7" />
                </div>
                <p className="text-xl font-black text-slate-900">
                  No attempts yet
                </p>
                <p className="mt-1 font-semibold text-slate-600">
                  Start the quiz to save your first result.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentShell>
  );
}

function scorePercent(correct: number, total: number) {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}

function getBestAttempt<T extends { correct: number; total: number }>(
  attempts: T[]
) {
  return attempts.reduce<T | undefined>((best, attempt) => {
    if (!best) return attempt;
    return scorePercent(attempt.correct, attempt.total) >
      scorePercent(best.correct, best.total)
      ? attempt
      : best;
  }, undefined);
}

function formatCompletedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
