import { ArrowRight, Camera, Hand } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { BlockyCard, CardContent } from "~/components/ui/card";
import { topics } from "~/lib/learning-data";

const tabs = [
  { id: "handsign", label: "Handsign", icon: Hand },
  { id: "sign_practice", label: "Sign practice", icon: Camera },
] as const;

type LearnTab = (typeof tabs)[number]["id"];

const signPracticeCards = [
  {
    id: "camera-ready",
    title: "Camera ready",
    description: "Check lighting, framing, and hand position before practice.",
  },
  {
    id: "record-sign",
    title: "Record sign",
    description: "Record a short hand sign clip for recognition practice.",
  },
  {
    id: "confidence",
    title: "Confidence check",
    description: "Compare detected signs with the target word and score.",
  },
  {
    id: "retry-flow",
    title: "Retry flow",
    description: "Practice again when confidence is low or no hand is detected.",
  },
];

export default function LearnRoute() {
  const [activeTab, setActiveTab] = useState<LearnTab>("handsign");

  return (
    <StudentShell>
      <div className="space-y-6">
        <div className="flex w-full rounded-[1.75rem] border-3 border-slate-800 bg-white p-1.5 shadow-[4px_6px_0_#1f2937] sm:w-fit gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-40 flex h-12 flex-1 items-center justify-center gap-2 rounded-[1.25rem] px-4 text-sm font-black transition-colors sm:flex-none ${
                  selected
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
            {topics.map((topic) => (
              <BlockyCard key={topic.id} className="h-full">
                <CardContent className="flex h-full flex-col pb-2">
                  <div className={`mb-5 rounded-[1.5rem]`}>
                    <h2 className="text-2xl font-black">{topic.title}</h2>
                  </div>
                  <p className="min-h-12 grow text-sm font-semibold text-slate-600">
                    {topic.description}
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
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {signPracticeCards.map((card) => (
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
