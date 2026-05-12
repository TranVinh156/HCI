import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Camera,
  Globe,
  GraduationCap,
  Heart,
  Sparkles,
  Star,
} from "lucide-react";

import { Mascot } from "~/components/learning/mascot";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function HomeRoute() {
  return (
    <main className="min-h-screen px-4 py-8 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-center gap-8">
        <div className="text-center">
          <div className="mx-auto mb-4 grid size-20 place-items-center rounded-[2rem] bg-primary text-2xl font-black text-white">
            SO
          </div>
          <h1 className="text-4xl font-black sm:text-5xl">SignOcean</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg font-semibold text-slate-600">
            Learn sign language with visuals, playful quizzes, and Sami.
          </p>
        </div>
        <div className="mx-auto">
          <Mascot message="Choose a profile to start learning today." />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              className={`rounded-[2rem] bg-white ${
                selectedId === profile.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardContent className="flex flex-col items-center gap-4 p-5 text-center">
                <button type="button" onClick={() => setSelectedId(profile.id)}>
                  <Avatar className="size-24 bg-primary text-white">
                    <AvatarFallback className="bg-transparent text-4xl font-black text-white">
                      {profile.avatar}
                    </AvatarFallback>
                  </Avatar>
                </button>
                <div>
                  <h2 className="text-2xl font-black">{profile.name}</h2>
                  <p className="text-sm font-semibold text-slate-500">
                    Age {profile.age} · Guardian: {profile.guardian}
                  </p>
                </div>
                <Button className="h-11 w-full rounded-2xl bg-slate-900 text-sm font-black text-white shadow-[4px_6px_0_#0f172a]">
                  Continue lesson
                </Button>
              </CardContent>
            </Card>
            <div className="rounded-[2rem] border-3 border-slate-900 bg-[#fff4b0] p-6 shadow-[6px_8px_0_#0f172a]">
              <Mascot message="I saved your streak! Want a high-five?" />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border-3 border-slate-900 bg-[#b7f5ff] p-6 shadow-[6px_8px_0_#0f172a]">
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-slate-600">
              <Star className="size-4" />
              Student voices
            </div>
            <h2 className="mt-3 text-3xl font-black">Everyone belongs in the wave.</h2>
            <p className="mt-3 text-base font-semibold text-slate-700">
              Students and families share how SignOcean makes learning joyful,
              expressive, and inclusive.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                name: "Linh (Grade 5)",
                quote: "The camera tips feel like a game coach!",
              },
              {
                name: "Mai & Dad",
                quote: "We practice together after dinner every day.",
              },
              {
                name: "Duy (Teen learner)",
                quote: "The progress wave keeps me motivated.",
              },
              {
                name: "Ms. An (Teacher)",
                quote: "Beautiful visuals and a gentle learning flow.",
              },
            ].map((story) => (
              <Card
                key={story.name}
                className="rounded-[2rem] border-3 border-slate-900 bg-white shadow-[5px_6px_0_#0f172a]"
              >
                <CardContent className="space-y-3 p-5">
                  <div className="text-sm font-black text-slate-500">
                    {story.name}
                  </div>
                  <p className="text-base font-semibold text-slate-700">
                    “{story.quote}”
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[2.5rem] border-3 border-slate-900 bg-[#0f172a] p-8 text-white shadow-[8px_10px_0_#0f172a] sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-white/80 bg-white/10 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-white/80">
                Ready to enroll
              </div>
              <h2 className="text-3xl font-black">Start your first lesson today.</h2>
              <p className="mt-3 max-w-xl text-base font-semibold text-white/80">
                Unlock live camera practice, printable guides, and celebrations
                for every milestone.
              </p>
            </div>
            <div className="grid gap-3">
              <Button className="h-12 rounded-2xl bg-white text-base font-black text-slate-900 shadow-[4px_6px_0_#000000]">
                Enroll with free trial
                <ArrowRight className="size-5" />
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-2 border-white/80 text-base font-black text-white"
              >
                Talk to an advisor
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
