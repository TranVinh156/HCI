import {
  ArrowLeft,
  BookOpen,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Gift,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";
import { Link, useParams } from "react-router";

import { AdminShell } from "~/components/admin/admin-shell";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  getLessonQuiz,
  readAdminLearningData,
  type Lesson,
  type QuizQuestion,
} from "~/lib/learning-data";

type LessonActivity = {
  step: number;
  title: string;
  label: string;
  description: string;
  icon: LucideIcon;
  status: string;
  details: string[];
};

function createFallbackQuizQuestions(lesson: Lesson): QuizQuestion[] {
  return [
    {
      id: `${lesson.id}-meaning-preview`,
      lessonId: lesson.id,
      prompt: "What does this sign mean?",
      type: "sign-choice",
      options: [lesson.phrase, "I am sorry", "Purple", "Go outside"],
      answer: lesson.phrase,
      hint: `Remember the picture ${lesson.visual} and the phrase "${lesson.phrase}".`,
    },
    {
      id: `${lesson.id}-match-preview`,
      lessonId: lesson.id,
      prompt: `Choose the picture that best matches "${lesson.phrase}"`,
      type: "image-choice",
      options: [lesson.visual, "Car", "Banana", "Balloon"],
      answer: lesson.visual,
      hint: "Look back at the large picture from the lesson.",
    },
  ];
}

function getLessonActivities(
  lesson: Lesson,
  questions: QuizQuestion[]
): LessonActivity[] {
  const [firstQuestion, secondQuestion] = questions;

  return [
    {
      step: 1,
      title: "Learn sign",
      label: "Lesson card",
      description: lesson.description,
      icon: BookOpen,
      status: "Preview",
      details: [
        `Phrase: ${lesson.phrase}`,
        `Visual: ${lesson.visual}`,
        `Sign hint: ${lesson.signHint}`,
      ],
    },
    {
      step: 2,
      title: "Camera practice",
      label: "Practice",
      description: "Learners rehearse the sign with camera guidance.",
      icon: Camera,
      status: "Guided",
      details: [
        `Target sign: ${lesson.phrase}`,
        `Coach prompt: ${lesson.signHint}`,
        "Readiness: camera placeholder",
      ],
    },
    {
      step: 3,
      title: "Quiz question 1",
      label: "Meaning check",
      description: firstQuestion.prompt,
      icon: ClipboardCheck,
      status: "Quiz",
      details: [
        `Type: ${firstQuestion.type}`,
        `Answer: ${firstQuestion.answer}`,
        `Options: ${firstQuestion.options.join(", ")}`,
      ],
    },
    {
      step: 4,
      title: "Quiz question 2",
      label: "Match check",
      description: secondQuestion.prompt,
      icon: ClipboardCheck,
      status: "Quiz",
      details: [
        `Type: ${secondQuestion.type}`,
        `Answer: ${secondQuestion.answer}`,
        `Options: ${secondQuestion.options.join(", ")}`,
      ],
    },
    {
      step: 5,
      title: "Reward",
      label: "Completion",
      description: "Learners earn progress after finishing practice.",
      icon: Gift,
      status: "Reward",
      details: [
        `XP reward: ${lesson.xp}`,
        `Difficulty: ${lesson.difficulty}`,
        "Progress: unlocks the next lesson when completed",
      ],
    },
  ];
}

export default function AdminLessonDetailRoute() {
  const params = useParams();
  const data = readAdminLearningData();
  const lesson = data.lessons.find((item) => item.id === params.lessonId);
  const topic = lesson
    ? data.topics.find(
        (item) =>
          item.id === lesson.topicId || item.lessonIds.includes(lesson.id)
      )
    : undefined;

  if (!lesson) {
    return (
      <AdminShell title="Lesson detail" subtitle="Not found">
        <div className="mx-auto max-w-3xl space-y-4">
          <Card className="rounded-xl border border-dashed border-slate-300 py-0">
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <div className="grid size-12 place-items-center rounded-xl bg-slate-100 text-slate-500">
                <BookOpen className="size-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black">Lesson not found</h1>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  This lesson may have been removed or the URL is incorrect.
                </p>
              </div>
              <Button asChild className="h-11 rounded-xl font-black">
                <Link to="/admin/lessons">
                  <ArrowLeft className="size-4" />
                  Back to lessons
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminShell>
    );
  }

  const savedQuestions = getLessonQuiz(lesson.id);
  const fallbackQuestions = createFallbackQuizQuestions(lesson);
  const questions = [
    savedQuestions[0] ?? fallbackQuestions[0],
    savedQuestions[1] ?? fallbackQuestions[1],
  ];
  const activities = getLessonActivities(lesson, questions);

  return (
    <AdminShell title="Lesson detail" subtitle="Learning flow">
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            asChild
            variant="outline"
            className="h-11 w-fit rounded-xl font-black"
          >
            <Link to="/admin/lessons">
              <ArrowLeft className="size-4" />
              Back to lessons
            </Link>
          </Button>
          <Button asChild className="h-11 w-fit rounded-xl font-black">
            <Link to={`/lesson/${lesson.id}`}>
              Student preview
              <ExternalLink className="size-4" />
            </Link>
          </Button>
        </div>

        <Card className="rounded-xl border border-slate-200 py-0">
          <CardContent className="grid gap-5 p-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <div className="grid size-24 place-items-center rounded-2xl bg-primary/10 text-5xl">
              {lesson.visual}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black uppercase text-primary">
                {topic?.title ?? "Unassigned topic"}
              </p>
              <h1 className="mt-1 text-3xl font-black text-slate-900">
                {lesson.title}
              </h1>
              <p className="mt-2 text-base font-semibold text-slate-600">
                {lesson.phrase}
              </p>
              <p className="mt-2 max-w-3xl text-sm font-semibold text-slate-500">
                {lesson.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-44 lg:justify-end">
              <Badge className="bg-primary/10 text-primary">
                {lesson.type === "communication"
                  ? "Communication"
                  : "Vocabulary"}
              </Badge>
              <Badge className="bg-amber-100 text-amber-800">
                {lesson.difficulty}
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-800">
                {lesson.xp} XP
              </Badge>
            </div>
          </CardContent>
        </Card>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black">Lesson activities</h2>
              <p className="text-sm font-semibold text-slate-500">
                Duolingo-style path generated from the student lesson flow.
              </p>
            </div>
            <Badge className="w-fit bg-slate-100 text-slate-700">
              {activities.length} steps
            </Badge>
          </div>

          <div className="relative mt-5 grid gap-4">
            <div className="absolute bottom-8 left-6 top-8 hidden w-1 rounded-full bg-primary/20 sm:block" />
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <article
                  key={activity.step}
                  className="relative grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[3.5rem_1fr_auto]"
                >
                  <div className="z-10 grid size-12 place-items-center rounded-full border-4 border-white bg-primary text-primary-foreground shadow-sm">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-500">
                        Step {activity.step}
                      </span>
                      <Badge className="bg-primary/10 text-primary">
                        {activity.label}
                      </Badge>
                      <Badge className="bg-white text-slate-700">
                        {activity.status}
                      </Badge>
                    </div>
                    <h3 className="mt-3 text-lg font-black">
                      {activity.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {activity.description}
                    </p>
                    <div className="mt-3 grid gap-2">
                      {activity.details.map((detail) => (
                        <div
                          key={detail}
                          className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-600"
                        >
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start justify-end">
                    {activity.step === activities.length ? (
                      <CheckCircle2 className="size-6 text-emerald-500" />
                    ) : (
                      <PlayCircle className="size-6 text-primary" />
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
