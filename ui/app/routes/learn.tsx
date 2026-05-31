import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { Topic } from "~/api/types";

import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { BlockyCard, CardContent } from "~/components/ui/card";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { useGetTopics } from "~/hooks/use-get-topics";
import { getTopicProgress, useProgressData } from "~/hooks/use-progress";

export default function LearnRoute() {
  const { data, isLoading, isError } = useGetTopics();
  const { data: progressData, isLoading: isProgressLoading } = useProgressData();
  const topicList: Topic[] = data ?? [];

  return (
    <StudentShell>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading || isProgressLoading ? (
          <LoadingSpinner
            label="Loading topics"
            className="col-span-full py-8"
          />
        ) : isError ? (
          <div className="col-span-full text-sm font-semibold text-rose-600">
            Unable to load topics. Please try again.
          </div>
        ) : (
          topicList.map((topic) => {
            const topicProgress = getTopicProgress(
              progressData?.progress,
              topic.id
            );
            const completedLessons = topicProgress?.completed_lesson_count ?? 0;
            const totalLessons = topic.lesson_count;
            const percentage = totalLessons
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0;

            return (
              <BlockyCard key={topic.id} className="h-full">
                <CardContent className="flex h-full flex-col pb-2">
                  <div className="mb-5 rounded-[1.5rem]">
                    <h2 className="text-2xl font-black">{topic.title}</h2>
                  </div>
                  <p className="min-h-12 grow text-sm font-semibold text-slate-600">
                    {topic.description ?? ""}
                  </p>
                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-black text-slate-600">
                      <span>Progress</span>
                      <span>
                        {completedLessons}/{totalLessons}
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <Button
                    asChild
                    className="mt-5 h-12 w-full rounded-2xl font-black"
                  >
                    <Link to={`/path/${topic.id}`}>
                      Open path
                      <ArrowRight className="size-5" />
                    </Link>
                  </Button>
                </CardContent>
              </BlockyCard>
            );
          })
        )}
      </div>
    </StudentShell>
  );
}
