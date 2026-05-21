import { Link, useParams } from "react-router";

import { PathNode } from "~/components/learning/path-node";
import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { getTopic, getTopicLessons } from "~/lib/learning-data";
import { getLessonStatus, readProgress } from "~/lib/progress";

export default function PathRoute() {
  const params = useParams();
  const topic = getTopic(params.topicId ?? "");
  const lessons = getTopicLessons(params.topicId ?? "");
  const orderedLessonIds = lessons.map((lesson) => lesson.id);
  const progress = readProgress();

  if (!topic) {
    return (
      <StudentShell>
        <p className="font-bold">Topic not found.</p>
      </StudentShell>
    );
  }

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
            <Button
              asChild
              variant="outline"
              className="h-11 w-fit shrink-0 rounded-2xl"
            >
              <Link to="/topics">Back to topics</Link>
            </Button>
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
