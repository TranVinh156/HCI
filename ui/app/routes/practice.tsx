import { ArrowRight, ClipboardCheck, RotateCcw } from "lucide-react";
import { Link } from "react-router";
import type { Lesson } from "~/api/types";

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
import { useGetLessons } from "~/hooks/use-get-lessons";
import { useProgressData } from "~/hooks/use-progress";

export default function PracticeRoute() {
  const { data, isLoading, isError } = useGetLessons();
  const { data: progressData, isLoading: isProgressLoading } = useProgressData();
  const completedLessonIds = progressData?.progress?.completed_lesson_ids ?? [];
  const practiceLessons: Lesson[] = data ?? [];

  return (
    <StudentShell>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading || isProgressLoading ? (
          <p className="font-bold">Loading practice...</p>
        ) : isError ? (
          <p className="font-bold">Unable to load practice.</p>
        ) : practiceLessons.map((lesson) => {
          const completed = completedLessonIds.includes(lesson.id);

          return (
            <Card
              key={lesson.id}
              className="rounded-[2rem] border-slate-200 bg-white"
            >
              <CardHeader>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="grid size-14 place-items-center rounded-2xl text-3xl">
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
