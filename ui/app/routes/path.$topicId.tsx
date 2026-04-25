import { Link, useParams } from "react-router";

import { Mascot } from "~/components/learning/mascot";
import { PathNode } from "~/components/learning/path-node";
import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { getTopic, getTopicLessons } from "~/lib/learning-data";
import { getLessonStatus, readProgress } from "~/lib/progress";

export default function PathRoute() {
  const params = useParams();
  const topic = getTopic(params.topicId ?? "");
  const lessons = getTopicLessons(params.topicId ?? "");
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
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-cyan-700">
            Learning path
          </p>
          <h1 className="text-4xl font-black">{topic.title}</h1>
          <p className="mt-2 max-w-2xl font-semibold text-slate-600">
            {topic.description}
          </p>
        </div>
        <Mascot compact mood="coach" message="Take it one node at a time. The next lesson unlocks after this one." />
      </div>
      <div className="relative mx-auto max-w-3xl space-y-8 rounded-[2rem] bg-cyan-50/70 p-6">
        {lessons.map((lesson, index) => (
          <PathNode
            key={lesson.id}
            lessonId={lesson.id}
            title={lesson.title}
            index={index}
            status={getLessonStatus(lesson.id, topic.lessonIds, progress)}
          />
        ))}
      </div>
      <Button asChild variant="outline" className="mt-6 h-11 rounded-2xl">
        <Link to="/topics">Back to topics</Link>
      </Button>
    </StudentShell>
  );
}
