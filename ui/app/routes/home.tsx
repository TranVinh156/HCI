import {
  ArrowRight,
  BookOpen,
  Camera,
  CheckCircle2,
  Hand,
  Languages,
  Play,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent } from "~/components/ui/card";

const featurePanels = [
  {
    title: "Learn signs in tiny wins",
    copy: "Visual lessons keep every handshape clear, short, and easy to repeat.",
    icon: BookOpen,
    color: "bg-white",
  },
  {
    title: "Practice with your camera",
    copy: "Capture signs, check your movement, and build confidence through active recall.",
    icon: Camera,
    color: "bg-[#f2fbfd]",
  },
  {
    title: "Play through quizzes",
    copy: "Flash cards, checks, and progress rewards help new signs stick longer.",
    icon: Trophy,
    color: "bg-white",
  },
] as const;

const lessonSteps = [
  "Watch the sign",
  "Copy the motion",
  "Practice it",
  "Unlock the next one",
] as const;

export default function HomeRoute() {
  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#f7fbfd] text-slate-950">
      <HeroSection />
      <FeatureSection />
      <PracticeSection />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative px-4 pb-14 pt-5">
      <div className="absolute inset-0 [background-image:radial-gradient(#c4e5eb_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative mx-auto max-w-7xl">
        <header className="flex items-center justify-between gap-4 rounded-full bg-white/90 px-4 py-3 shadow-[0_18px_45px_rgba(18,48,64,0.10)] backdrop-blur">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-sm font-black text-white shadow-[0_10px_24px_rgba(0,194,228,0.28)]">
              SO
            </div>
            <span className="truncate text-xl font-black">SignOcean</span>
          </Link>
          <nav className="hidden items-center gap-2 text-sm font-black text-slate-600 md:flex">
            <Link className="rounded-full px-4 py-2 hover:bg-secondary" to="/learn">
              Learn
            </Link>
            <Link className="rounded-full px-4 py-2 hover:bg-secondary" to="/practice">
              Practice
            </Link>
            <Link className="rounded-full px-4 py-2 hover:bg-secondary" to="/translate">
              Translate
            </Link>
          </nav>
          <Link
            to="/learn"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-black uppercase text-white shadow-[0_12px_28px_rgba(0,194,228,0.26)] transition hover:-translate-y-0.5"
          >
            Start
            <ArrowRight className="size-5" />
          </Link>
        </header>

        <div className="grid min-h-[calc(100dvh-7rem)] items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr] lg:py-14">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-normal text-primary shadow-[0_12px_30px_rgba(18,48,64,0.08)]">
              <Sparkles className="size-4" />
              ASL handsign practice
            </div>
            <h1 className="max-w-[12ch] text-6xl font-black leading-[0.94] tracking-normal text-slate-950 sm:text-7xl lg:text-8xl">
              Learn ASL by doing.
            </h1>
            <p className="mt-6 max-w-xl text-xl font-black leading-snug text-slate-700 sm:text-2xl">
              A cheerful app for learning, practicing, and remembering handsigns
              with a friendly mascot coach.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/learn"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-black uppercase text-white shadow-[0_16px_36px_rgba(0,194,228,0.26)] transition hover:-translate-y-0.5"
              >
                Open lessons
                <ArrowRight className="size-5" />
              </Link>
              <Link
                to="/practice"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-black uppercase text-slate-800 shadow-[0_16px_36px_rgba(18,48,64,0.10)] transition hover:-translate-y-0.5"
              >
                Practice now
                <Play className="size-5" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[34rem]">
            <div className="rounded-[3rem] bg-white p-5 shadow-[0_24px_60px_rgba(18,48,64,0.12)]">
              <MascotHero />
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: "Signs", value: "A-Z" },
                  { label: "Mode", value: "Cam" },
                  { label: "Mood", value: "Fun" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.5rem] bg-[#f2fbfd] p-3 text-center"
                  >
                    <p className="text-xl font-black">{item.value}</p>
                    <p className="text-xs font-black uppercase text-slate-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-black leading-none sm:text-6xl">
            Built for hands, eyes, and memory.
          </h2>
          <p className="mt-4 max-w-2xl text-lg font-bold text-slate-600">
            Lessons stay visual, practice stays active, and progress feels like
            a game loop instead of a worksheet.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {featurePanels.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className={`min-h-72 rounded-[2.5rem] ${feature.color} border-0 py-0 shadow-[0_18px_45px_rgba(18,48,64,0.08)] transition-transform hover:-translate-y-1`}
              >
                <CardContent className="p-6">
                  <div className="grid size-16 place-items-center rounded-2xl bg-white text-primary shadow-[0_12px_28px_rgba(18,48,64,0.08)]">
                    <Icon className="size-8 stroke-[3]" />
                  </div>
                  <h3 className="mt-8 text-3xl font-black leading-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-base font-black leading-relaxed text-slate-700">
                    {feature.copy}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PracticeSection() {
  return (
    <section className="bg-[#eef9fc] px-4 py-16">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-normal text-primary shadow-[0_12px_28px_rgba(18,48,64,0.08)]">
            <Hand className="size-4" />
            Practice loop
          </div>
          <h2 className="mt-5 text-4xl font-black leading-none sm:text-6xl">
            Move from "I saw it" to "I can sign it".
          </h2>
          <p className="mt-4 text-lg font-bold text-slate-700">
            The app connects lessons, camera practice, quizzes, and translation
            into one fast learning path.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/translate"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-black uppercase text-white shadow-[0_16px_36px_rgba(0,194,228,0.24)]"
            >
              Try translate
              <Languages className="size-5" />
            </Link>
            <Link
              to="/practice"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-white px-6 text-base font-black uppercase text-slate-800 shadow-[0_16px_36px_rgba(18,48,64,0.10)]"
            >
              Open practice
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>

        <Card className="rounded-[3rem] border-0 py-0 shadow-[0_22px_56px_rgba(18,48,64,0.10)]">
          <CardContent className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {lessonSteps.map((step, index) => (
                <Card
                  key={step}
                  className="rounded-[2rem] border-0 bg-[#f6fcff] py-0 shadow-none"
                >
                  <CardContent className="p-5">
                    <div className="mb-8 flex items-center justify-between">
                      <span className="grid size-10 place-items-center rounded-2xl bg-primary text-sm font-black text-white">
                        {index + 1}
                      </span>
                      <CheckCircle2 className="size-7 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-black leading-tight">{step}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-[#123040] px-4 py-14 text-white">
      <Card className="mx-auto max-w-7xl rounded-[3rem] border-0 py-0 text-slate-950 shadow-[0_24px_70px_rgba(0,0,0,0.20)]">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-4xl font-black leading-none sm:text-5xl">
              Start with one sign today.
            </h2>
            <p className="mt-3 max-w-2xl text-lg font-black text-slate-700">
              Jump into the lesson path, practice with cards, then test what your
              hands remember.
            </p>
          </div>
          <Link
            to="/learn"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-black uppercase text-white shadow-[0_16px_36px_rgba(0,194,228,0.26)]"
          >
            Begin learning
            <ArrowRight className="size-5" />
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-[#123040] px-4 pb-8 text-center text-xs font-bold text-white/70">
      Sound Effect by{" "}
      <a
        href="https://pixabay.com/vi/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=206492"
        target="_blank"
        rel="noreferrer"
        className="text-white underline underline-offset-4 hover:text-primary"
      >
        Universfield
      </a>{" "}
      from{" "}
      <a
        href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=206492"
        target="_blank"
        rel="noreferrer"
        className="text-white underline underline-offset-4 hover:text-primary"
      >
        Pixabay
      </a>
    </footer>
  );
}

function MascotHero() {
  return (
    <div className="relative grid aspect-square place-items-center overflow-hidden rounded-[2.5rem] bg-[#dff8ff]">
      <div className="absolute inset-0 [background-image:radial-gradient(#7fcdda_1px,transparent_1px)] [background-size:18px_18px] opacity-45" />
      <img
        src="/mascot.svg"
        alt="SignOcean mascot"
        className="relative z-10 w-[82%] animate-[mascot-float_2.4s_ease-in-out_infinite] object-contain"
      />
      <style>
        {`
          @keyframes mascot-float {
            0%, 100% { transform: translateY(0) rotate(-1deg); }
            50% { transform: translateY(-10px) rotate(1deg); }
          }
        `}
      </style>
    </div>
  );
}
