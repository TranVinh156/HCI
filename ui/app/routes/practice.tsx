import { ArrowRight, ClipboardCheck, RotateCcw } from "lucide-react";
import { Link } from "react-router";

import { Mascot } from "~/components/learning/mascot";
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
import { getLesson, quizzes } from "~/lib/learning-data";
import { readProgress } from "~/lib/progress";

export default function PracticeRoute() {
  const progress = readProgress();
  const practiceLessons = quizzes
    .map((question) => getLesson(question.lessonId))
    .filter((lesson, index, list) => lesson && list.findIndex((item) => item?.id === lesson.id) === index)
    .filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson));

  return (
    <StudentShell>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-cyan-700">
            Practice
          </p>
          <h1 className="text-4xl font-black">Quick sign checks</h1>
          <p className="mt-2 max-w-2xl font-semibold text-slate-600">
            Choose a lesson quiz, get instant feedback, and earn stars.
          </p>
        </div>
        <Mascot
          compact
          mood="coach"
          message="Short quizzes help us remember signs after each topic."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {practiceLessons.map((lesson) => {
          const completed = progress.completedLessonIds.includes(lesson.id);

          return (
            <Card
              key={lesson.id}
              className="rounded-[2rem] border-cyan-100 bg-white shadow-sm"
            >
              <CardHeader>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="grid size-14 place-items-center rounded-2xl bg-cyan-50 text-3xl">
                    {lesson.visual}
                  </div>
                  <Badge
                    className={
                      completed
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }
                  >
                    {completed ? "Review" : "New"}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-black">
                  {lesson.title}
                </CardTitle>
                <CardDescription className="font-semibold">
                  {lesson.type === "communication"
                    ? "Sentence matching and sign meaning."
                    : "Visual matching and sign meaning."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="h-12 w-full rounded-2xl font-black">
                  <Link to={`/quiz/${lesson.id}`}>
                    {completed ? (
                      <RotateCcw className="size-5" />
                    ) : (
                      <ClipboardCheck className="size-5" />
                    )}
                    {completed ? "Practice again" : "Start quiz"}
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </StudentShell>
  );
}
