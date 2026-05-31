import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { CameraPractice } from "~/components/learning/camera-practice";
import { LessonCard } from "~/components/learning/lesson-card";
import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { useGetLesson } from "~/hooks/use-get-lessons";
import { useGetTopic } from "~/hooks/use-get-topics";
import {
  getLessonStatusFromNeighbors,
  useCompleteLesson,
  useProgressData,
} from "~/hooks/use-progress";

export default function LessonRoute() {
  const params = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<"video" | "practice">("video");
  const {
    data: lesson,
    isLoading: isLessonLoading,
    isError: isLessonError,
  } = useGetLesson(params.lessonId);
  const { data: topic } = useGetTopic(lesson?.topic_id);
  const { data: progressData, isLoading: isProgressLoading } = useProgressData();
  const completeLessonMutation = useCompleteLesson();

  useEffect(() => {
    setStep("video");
  }, [lesson?.id]);

  if (isLessonLoading || isProgressLoading) {
    return (
      <StudentShell>
        <LoadingSpinner label="Loading lesson" className="py-8" />
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

  const currentLesson = lesson;
  const lessonStatus = getLessonStatusFromNeighbors(
    currentLesson,
    progressData?.progress
  );

  function completeAndGoNext() {
    if (progressData?.profile) {
      completeLessonMutation.mutate({
        profileId: progressData.profile.id,
        lessonId: currentLesson.id,
        correct: 0,
        total: 0,
      });
    }

    navigate(
      currentLesson.next_lesson_id
        ? `/lesson/${currentLesson.next_lesson_id}`
        : `/path/${currentLesson.topic_id}`
    );
  }

  if (lessonStatus === "locked") {
    return (
      <StudentShell>
        <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-6 text-center">
          <h1 className="text-3xl font-black">Lesson is locked</h1>
          <p className="mt-2 font-semibold text-slate-600">
            Complete the previous lesson in this topic to unlock it.
          </p>
          <Button asChild className="mt-5 h-12 rounded-2xl font-black">
            <Link to={`/path/${lesson.topic_id}`}>
              <ArrowLeft className="size-5" />
              Back to learning path
            </Link>
          </Button>
        </div>
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
        <Button asChild variant="outline" className="h-11 rounded-2xl px-4 font-black">
          <Link to={`/path/${lesson.topic_id}`}>
            <ArrowLeft className="size-5" />
            Back to learning path
          </Link>
        </Button>
      </div>
      <div className="mx-auto max-w-3xl space-y-5">
        {step === "video" ? (
          <>
            <LessonCard lesson={lesson} />
            <Button
              type="button"
              className="h-14 w-full rounded-2xl text-lg font-black"
              onClick={() => setStep("practice")}
            >
              Practice
              <ArrowRight className="size-5" />
            </Button>
          </>
        ) : (
          <>
            <CameraPractice lesson={lesson} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="h-14 rounded-2xl text-lg font-black"
                onClick={() => setStep("video")}
              >
                <ArrowLeft className="size-5" />
                Back
              </Button>
              <Button
                type="button"
                disabled={completeLessonMutation.isPending}
                onClick={completeAndGoNext}
                className="h-14 rounded-2xl text-lg font-black"
              >
                Done
                <Check className="size-5" />
              </Button>
            </div>
          </>
        )}
      </div>
    </StudentShell>
  );
}
