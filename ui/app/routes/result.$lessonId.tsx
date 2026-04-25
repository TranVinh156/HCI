import { ArrowRight, Home } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router";

import { Mascot } from "~/components/learning/mascot";
import { RewardSummary } from "~/components/learning/reward-summary";
import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { getLesson, lessons } from "~/lib/learning-data";
import { readProgress } from "~/lib/progress";

export default function ResultRoute() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const lesson = getLesson(params.lessonId ?? "");
  const progress = readProgress();
  const correct = Number(searchParams.get("correct") ?? 0);
  const total = Number(searchParams.get("total") ?? 2);
  const nextLesson =
    lessons.find((item) => !progress.completedLessonIds.includes(item.id)) ??
    lessons[0];

  if (!lesson) {
    return (
      <StudentShell>
        <p className="font-bold">Result not found.</p>
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <div className="mx-auto max-w-3xl space-y-5 text-center">
        <Mascot
          mood="success"
          message={`You completed "${lesson.title}". Here is your reward!`}
        />
        <div className="rounded-[2rem] bg-cyan-50 p-8 shadow-xl shadow-cyan-100">
          <div className="mx-auto grid size-28 place-items-center rounded-full bg-white text-6xl shadow-sm">
            🎉
          </div>
          <h1 className="mt-5 text-4xl font-black">Wonderful!</h1>
          <p className="mt-2 font-semibold text-slate-600">
            You earned experience points, stars, and may unlock the next lesson.
          </p>
        </div>
        <RewardSummary progress={progress} correct={correct} total={total} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Button asChild variant="outline" className="h-13 rounded-2xl font-black">
            <Link to="/learn">
              <Home className="size-5" />
              Back home
            </Link>
          </Button>
          <Button asChild className="h-13 rounded-2xl font-black">
            <Link to={`/lesson/${nextLesson.id}`}>
              Keep learning
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </StudentShell>
  );
}
