import { ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router";

import { CameraPractice } from "~/components/learning/camera-practice";
import { LessonCard } from "~/components/learning/lesson-card";
import { Mascot } from "~/components/learning/mascot";
import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { getLesson, getTopic } from "~/lib/learning-data";

export default function LessonRoute() {
  const params = useParams();
  const lesson = getLesson(params.lessonId ?? "");
  const topic = lesson ? getTopic(lesson.topicId) : undefined;

  if (!lesson) {
    return (
      <StudentShell>
        <p className="font-bold">Lesson not found.</p>
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-cyan-700">
            {topic?.title}
          </p>
          <h1 className="text-4xl font-black">{lesson.title}</h1>
        </div>
        <Mascot compact mood="coach" message="Watch the hands and face, then replay the sign if you need." />
      </div>
      <div className="mx-auto max-w-3xl space-y-5">
        <LessonCard lesson={lesson} />
        <CameraPractice lesson={lesson} />
        <Button asChild className="h-14 w-full rounded-2xl text-lg font-black">
          <Link to={`/quiz/${lesson.id}`}>
            Practice
            <ArrowRight className="size-5" />
          </Link>
        </Button>
      </div>
    </StudentShell>
  );
}
