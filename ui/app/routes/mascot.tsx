import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router";

import { Mascot } from "~/components/learning/mascot";
import { StudentShell } from "~/components/learning/student-shell";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { lessons } from "~/lib/learning-data";

const prompts = [
  {
    title: "Greeting practice",
    lessonId: "hello-family",
    line: "Sami signs a greeting. Pick the sentence that fits.",
  },
  {
    title: "Ask for help",
    lessonId: "help",
    line: "Sami asks what to sign when you need support.",
  },
  {
    title: "Say thank you",
    lessonId: "thank-you",
    line: "Sami shows a polite classroom response.",
  },
];

export default function MascotRoute() {
  return (
    <StudentShell>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-cyan-700">
            Virtual character
          </p>
          <h1 className="text-4xl font-black">Talk with Sami</h1>
          <p className="mt-2 max-w-2xl font-semibold text-slate-600">
            Basic mascot interactions for greetings, coaching, and simple
            feedback.
          </p>
        </div>
        <Mascot
          compact
          mood="hello"
          message="I can guide the lesson, ask small questions, and celebrate wins."
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-[2rem] border-cyan-100 bg-white shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="mx-auto grid size-28 place-items-center rounded-full bg-sky-500 text-2xl font-black text-white">
              ^_^
            </div>
            <h2 className="mt-4 text-2xl font-black">Sami</h2>
            <p className="mt-2 font-semibold text-slate-500">
              Basic virtual buddy for encouragement and guided practice.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Badge className="bg-cyan-100 text-cyan-800">Greeting</Badge>
              <Badge className="bg-emerald-100 text-emerald-800">Feedback</Badge>
              <Badge className="bg-amber-100 text-amber-800">Rewards</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {prompts.map((prompt) => {
            const lesson = lessons.find((item) => item.id === prompt.lessonId);

            return (
              <Card
                key={prompt.lessonId}
                className="rounded-[1.5rem] border-cyan-100 bg-white shadow-sm"
              >
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="grid size-12 place-items-center rounded-2xl text-cyan-700">
                      <MessageCircle className="size-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black">{prompt.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {prompt.line}
                      </p>
                    </div>
                  </div>
                  <Button asChild className="h-11 rounded-2xl font-black">
                    <Link to={`/lesson/${lesson?.id ?? prompt.lessonId}`}>
                      <Sparkles className="size-4" />
                      Try
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </StudentShell>
  );
}
