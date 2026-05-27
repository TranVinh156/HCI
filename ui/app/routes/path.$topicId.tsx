import { Link, useParams } from "react-router";

import { PathNode } from "~/components/learning/path-node";
import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { getLessonStatus, useProgressData } from "~/hooks/use-progress";
import { useGetTopic } from "~/hooks/use-get-topics";
import { useGetTopicLessons } from "~/hooks/use-get-topics-lessons";
import { ArrowRight } from "lucide-react";

export default function PathRoute() {
  const params = useParams();
  const topicId = params.topicId;
  const {
    data: topic,
    isLoading: isTopicLoading,
    isError: isTopicError,
  } = useGetTopic(topicId);
  const {
    data: lessons = [],
    isLoading: isLessonsLoading,
    isError: isLessonsError,
  } = useGetTopicLessons(topicId);
  const { data: progressData, isLoading: isProgressLoading } = useProgressData();
  const orderedLessonIds = lessons.map((lesson) => lesson.id);
  const progress = progressData?.progress;

  if (!topicId) {
    return (
      <StudentShell>
        <p className="font-bold">Topic not found.</p>
      </StudentShell>
    );
  }

  if (isTopicLoading || isLessonsLoading || isProgressLoading) {
    return (
      <StudentShell>
        <p className="font-bold">Loading learning path...</p>
      </StudentShell>
    );
  }

  if (isTopicError || isLessonsError) {
    return (
      <StudentShell>
        <p className="font-bold">Unable to load learning path.</p>
      </StudentShell>
    );
  }

  if (!topic) {
    return (
      <StudentShell>
        <p className="font-bold">Topic not found.</p>
      </StudentShell>
    );
  }

  const practiceTopicId = topic?.id ?? topicId;

  return (
    <StudentShell>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-black uppercase text-primary">
                Learning path
              </p>
              <h1 className="text-4xl font-black">{topic.title}</h1>
            </div>
            <div className="flex gap-4">
              <Button
                asChild
                variant="outline"
                className="h-11 w-fit shrink-0 rounded-2xl"
              >
                <Link to="/topics">Back to topics</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 w-fit shrink-0 rounded-2xl"
              >
                <Link to={`/topic-quiz/${practiceTopicId}`}>
                  Practice
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>
          </div>
          <p className="mt-2 max-w-2xl font-semibold text-slate-600">
            {topic.description}
          </p>
        </div>
      </div>
      <div className="relative mx-auto max-w-2xl rounded-[2rem] p-5 sm:p-6">
        {lessons.map((lesson, index) => (
          <PathNode
            key={lesson.id}
            lessonId={lesson.id}
            title={lesson.title}
            index={index}
            isLast={index === lessons.length - 1}
            status={getLessonStatus(lesson.id, orderedLessonIds, progress)}
          />
        ))}
      </div>
    </StudentShell>
  );
}
