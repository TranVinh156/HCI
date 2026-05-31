import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { Topic } from "~/api/types";

import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { BlockyCard, CardContent } from "~/components/ui/card";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { useGetTopics } from "~/hooks/use-get-topics";

export default function LearnRoute() {
  const { data, isLoading, isError } = useGetTopics();
  const topicList: Topic[] = data ?? [];

  return (
    <StudentShell>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <LoadingSpinner
            label="Loading topics"
            className="col-span-full py-8"
          />
        ) : isError ? (
          <div className="col-span-full text-sm font-semibold text-rose-600">
            Unable to load topics. Please try again.
          </div>
        ) : (
          topicList.map((topic) => (
            <BlockyCard key={topic.id} className="h-full">
              <CardContent className="flex h-full flex-col pb-2">
                <div className="mb-5 rounded-[1.5rem]">
                  <h2 className="text-2xl font-black">{topic.title}</h2>
                </div>
                <p className="min-h-12 grow text-sm font-semibold text-slate-600">
                  {topic.description ?? ""}
                </p>
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
          ))
        )}
      </div>
    </StudentShell>
  );
}
