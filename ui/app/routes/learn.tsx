import { ArrowRight, Hand, Keyboard } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import type { Topic } from "~/api/types";

import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { BlockyCard, CardContent } from "~/components/ui/card";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { useGetTopics } from "~/hooks/use-get-topics";

const tabs = [
  { id: "handsign", label: "Handsign", icon: Hand },
  { id: "fingerspelling", label: "Fingerspelling", icon: Keyboard },
] as const;

type LearnTab = (typeof tabs)[number]["id"];

const fingerspellingCards = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(
  (letter) => ({
    id: letter.toLowerCase(),
    title: letter,
    description: `Practice the ${letter} handshape.`,
  })
);

export default function LearnRoute() {
  const { data, isLoading, isError } = useGetTopics();
  const topicList: Topic[] = data ?? [];
  const [activeTab, setActiveTab] = useState<LearnTab>("handsign");

  return (
    <StudentShell>
      <div className="space-y-6">
        <div className="flex w-full rounded-[1.75rem] border-2 border-[#036678] bg-white p-1.5  sm:w-fit gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-40 flex h-12 flex-1 items-center justify-center gap-2 rounded-[1.25rem] px-4 text-sm font-black transition-colors sm:flex-none ${selected
                  ? "bg-primary text-primary-foreground"
                  : "text-slate-600 hover:bg-primary/10 hover:text-primary"
                  }`}
                aria-pressed={selected}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "handsign" ? (
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
                    <div className={`mb-5 rounded-[1.5rem]`}>
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
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {fingerspellingCards.map((card) => (
              <BlockyCard key={card.id} className="h-full">
                <CardContent className="flex h-full flex-col px-5 pb-2">
                  <div className="grid aspect-square place-items-center rounded-[1.5rem] bg-primary text-7xl font-black text-white">
                    {card.title}
                  </div>
                  <p className="mt-1 grow text-sm font-semibold text-slate-600">
                    {card.description}
                  </p>
                  <Button className="mt-5 h-12 w-full rounded-2xl font-black">
                    Start practice
                    <ArrowRight className="size-5" />
                  </Button>
                </CardContent>
              </BlockyCard>
            ))}
          </div>
        )}
      </div>
    </StudentShell>
  );
}
