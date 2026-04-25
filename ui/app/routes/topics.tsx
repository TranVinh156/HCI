import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { topics } from "~/lib/learning-data";

export default function TopicsRoute() {
  return (
    <StudentShell>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topics.map((topic) => (
          <article
            key={topic.id}
            className="rounded-[2rem] bg-white p-5 ring-1 ring-slate-200"
          >
            <div className={`mb-5 rounded-[1.5rem] p-4 ${topic.color}`}>
              <p className="text-sm font-black uppercase">
                {topic.lessonIds.length} lessons
              </p>
              <h2 className="mt-2 text-2xl font-black">{topic.title}</h2>
            </div>
            <p className="min-h-12 text-sm font-semibold text-slate-600">
              {topic.description}
            </p>
            <Button asChild className="mt-5 h-12 w-full rounded-2xl font-black">
              <Link to={`/path/${topic.id}`}>
                Open path
                <ArrowRight className="size-5" />
              </Link>
            </Button>
          </article>
        ))}
      </div>
    </StudentShell>
  );
}
