import { ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router";

import { CameraPractice } from "~/components/learning/camera-practice";
import { LessonCard } from "~/components/learning/lesson-card";
import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { useGetLesson } from "~/hooks/use-get-lessons";
import { useGetTopic } from "~/hooks/use-get-topics";

export default function LessonRoute() {
  const params = useParams();
  const {
    data: lesson,
    isLoading: isLessonLoading,
    isError: isLessonError,
  } = useGetLesson(params.lessonId);
  const { data: topic } = useGetTopic(lesson?.topic_id);

  if (isLessonLoading) {
    return (
      <StudentShell>
        <p className="font-bold">Loading lesson...</p>
      </StudentShell>
    );
  }

  if (isLessonError || !lesson) {
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
          <p className="text-sm font-black uppercase text-primary">
            {topic?.title}
          </p>
          <h1 className="text-4xl font-black">{lesson.title}</h1>
        </div>
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
