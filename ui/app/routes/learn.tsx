import {
  ArrowRight,
  BookOpen,
  Dumbbell,
  Flame,
  MessageCircle,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Mascot } from "~/components/learning/mascot";
import { OceanProgress } from "~/components/learning/ocean-progress";
import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getSelectedProfile, readProgress, type ProgressState } from "~/lib/progress";
import { lessons, topics } from "~/lib/learning-data";

const mainActions = [
  {
    title: "Learn by topic",
    description: "Pick a topic and follow the lesson path.",
    to: "/topics",
    icon: BookOpen,
  },
  {
    title: "Communication",
    description: "Practice useful daily sentences in context.",
    to: "/communication",
    icon: MessageCircle,
  },
  {
    title: "Practice",
    description: "Answer quick visual quizzes and review signs.",
    to: "/practice",
    icon: Dumbbell,
  },
  {
    title: "Talk with Sami",
    description: "Try simple mascot-guided conversation prompts.",
    to: "/mascot",
    icon: Sparkles,
  },
];

export default function LearnRoute() {
  const [progress, setProgress] = useState<ProgressState>(() => readProgress());

  useEffect(() => {
    setProgress(readProgress());
  }, []);

  const profile = getSelectedProfile(progress);
  const completion = Math.round(
    (progress.completedLessonIds.length / lessons.length) * 100
  );
  const nextLesson =
    lessons.find((lesson) => !progress.completedLessonIds.includes(lesson.id)) ??
    lessons[0];

  return (
    <StudentShell>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-5">
          <div className="rounded-[2rem] bg-sky-600 p-6 text-white ">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase text-cyan-100">
                  Hello {profile?.name}
                </p>
                <h1 className="mt-2 text-4xl font-black">
                  Ready to learn a new sign?
                </h1>
              </div>
              <Mascot
                compact
                mood="hello"
                message="I will learn with you one small lesson at a time."
              />
            </div>
          </div>

          <Card className="rounded-[2rem] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-black">
                Continue learning
              </CardTitle>
              <CardDescription>
                Complete lessons to earn experience points, stars, and badges.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <OceanProgress value={completion} label="Overall progress" />
              <div className="flex flex-col gap-3 rounded-[1.5rem] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-cyan-700">Next lesson</p>
                  <h2 className="text-2xl font-black">{nextLesson.title}</h2>
                </div>
                <Button asChild className="h-12 rounded-2xl text-base font-black">
                  <Link to={`/lesson/${nextLesson.id}`}>
                    Learn now
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <section>
            <h2 className="mb-3 text-2xl font-black">Start a mode</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {mainActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-cyan-100 transition hover:-translate-y-1"
                  >
                    <div className="mb-4 grid size-12 place-items-center rounded-2xl text-cyan-800">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="text-xl font-black">{action.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {action.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-2xl font-black">Topics</h2>
              <Link className="text-sm font-black text-cyan-700" to="/topics">
                View all
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {topics.slice(0, 4).map((topic) => (
                <Link
                  key={topic.id}
                  to={`/path/${topic.id}`}
                  className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-cyan-100 transition hover:-translate-y-1"
                >
                  <p className="text-sm font-black uppercase text-cyan-700">
                    {topic.lessonIds.length} lessons
                  </p>
                  <h3 className="mt-2 text-2xl font-black">{topic.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {topic.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-4">
          {[
            { label: "XP", value: progress.xp, icon: Zap },
            { label: "Stars", value: progress.stars, icon: Star },
            { label: "Streak", value: progress.streak, icon: Flame },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-cyan-100"
              >
                <div className="grid size-12 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                  <Icon className="size-6" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </aside>
      </div>
    </StudentShell>
  );
}
