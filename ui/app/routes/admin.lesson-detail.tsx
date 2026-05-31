import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  Edit3,
  ExternalLink,
  FileJson,
  HelpCircle,
  ListChecks,
  Plus,
  Save,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";

import { lessonsApi } from "~/api/lessons";
import type { Exercise, Lesson, QuizQuestion } from "~/api/types";
import { AdminShell } from "~/components/admin/admin-shell";
import {
  LessonVisual,
  LessonVisualUpload,
} from "~/components/learning/lesson-visual";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { useGetLesson } from "~/hooks/use-get-lessons";
import { useGetQuizQuestions } from "~/hooks/use-get-quiz-question";
import { useGetTopic } from "~/hooks/use-get-topics";

type LessonFormState = {
  title: string;
  phrase: string;
  description: string;
  visual: string;
  signHint: string;
  type: string;
  difficulty: string;
  xp: string;
};

type QuestionFormState = {
  prompt: string;
  type: string;
  options: string;
  answer: string;
  videoUrl: string;
  hint: string;
};

type ExerciseFormState = {
  type: string;
  sortOrder: string;
  content: string;
};

const defaultQuestionForm: QuestionFormState = {
  prompt: "",
  type: "sign-choice",
  options: "",
  answer: "",
  videoUrl: "",
  hint: "",
};

const defaultExerciseForm: ExerciseFormState = {
  type: "learning",
  sortOrder: "0",
  content: "{\n  \"title\": \"\",\n  \"content\": \"\"\n}",
};

function createLessonForm(lesson?: Lesson): LessonFormState {
  return {
    title: lesson?.title ?? "",
    phrase: lesson?.phrase ?? "",
    description: lesson?.description ?? "",
    visual: lesson?.visual ?? "",
    signHint: lesson?.sign_hint ?? "",
    type: lesson?.type ?? "vocabulary",
    difficulty: lesson?.difficulty ?? "Easy",
    xp: String(lesson?.xp ?? 10),
  };
}

export default function AdminLessonDetailRoute() {
  const params = useParams();
  const lessonId = params.lessonId;
  const queryClient = useQueryClient();
  const {
    data: lesson,
    isLoading: isLessonLoading,
    isError: isLessonError,
  } = useGetLesson(lessonId);
  const { data: topic } = useGetTopic(lesson?.topic_id);
  const { data: questions = [], isLoading: isQuestionsLoading } =
    useGetQuizQuestions(lessonId);
  const { data: exercises = [], isLoading: isExercisesLoading } = useQuery({
    queryKey: ["lessons", lessonId, "exercises"],
    queryFn: () => lessonsApi.exercises(lessonId ?? ""),
    enabled: Boolean(lessonId),
    retry: false,
    staleTime: 60 * 1000,
  });
  const [editingLesson, setEditingLesson] = useState(false);
  const [lessonForm, setLessonForm] = useState<LessonFormState>(() =>
    createLessonForm()
  );
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState(defaultQuestionForm);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseForm, setExerciseForm] = useState(defaultExerciseForm);
  const [exerciseError, setExerciseError] = useState<string | null>(null);

  useEffect(() => {
    setLessonForm(createLessonForm(lesson));
    setEditingLesson(false);
  }, [lesson]);

  const updateLessonMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Partial<Omit<Lesson, "id">>;
    }) => lessonsApi.update(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["lessons"] });
      setEditingLesson(false);
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: ({
      lessonId,
      body,
    }: {
      lessonId: string;
      body: Parameters<typeof lessonsApi.createQuestion>[1];
    }) => lessonsApi.createQuestion(lessonId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["quiz", lessonId ?? "none"] });
      void queryClient.invalidateQueries({ queryKey: ["quiz-bank"] });
      setQuestionForm(defaultQuestionForm);
      setShowQuestionForm(false);
    },
  });

  const createExerciseMutation = useMutation({
    mutationFn: ({
      lessonId,
      body,
    }: {
      lessonId: string;
      body: Parameters<typeof lessonsApi.createExercise>[1];
    }) => lessonsApi.createExercise(lessonId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["lessons", lessonId, "exercises"],
      });
      setExerciseForm(defaultExerciseForm);
      setExerciseError(null);
      setShowExerciseForm(false);
    },
  });

  function handleSaveLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lesson) return;

    const title = lessonForm.title.trim();
    const phrase = lessonForm.phrase.trim();
    if (!title || !phrase) return;

    updateLessonMutation.mutate({
      id: lesson.id,
      body: {
        topic_id: lesson.topic_id,
        title,
        phrase,
        description:
          lessonForm.description.trim() || `Practice the sign for ${phrase}.`,
        visual: lessonForm.visual.trim() || null,
        sign_hint:
          lessonForm.signHint.trim() || "Add a sign hint for learners.",
        type: lessonForm.type,
        difficulty: lessonForm.difficulty,
        xp: Math.max(1, Number.parseInt(lessonForm.xp, 10) || 10),
        sort_order: lesson.sort_order,
      },
    });
  }

  function handleCreateQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lesson) return;

    const options = questionForm.options
      .split("\n")
      .map((option) => option.trim())
      .filter(Boolean);
    const answer = questionForm.answer.trim();
    if (!questionForm.prompt.trim() || !answer || options.length < 2) return;

    createQuestionMutation.mutate({
      lessonId: lesson.id,
      body: {
        prompt: questionForm.prompt.trim(),
        type: questionForm.type,
        options: options.includes(answer) ? options : [answer, ...options],
        answer,
        video_url: questionForm.videoUrl.trim() || null,
        hint: questionForm.hint.trim() || null,
      },
    });
  }

  function handleCreateExercise(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lesson) return;

    try {
      const content = JSON.parse(exerciseForm.content) as Record<string, unknown>;
      createExerciseMutation.mutate({
        lessonId: lesson.id,
        body: {
          type: exerciseForm.type,
          content,
          sort_order:
            Number.parseInt(exerciseForm.sortOrder, 10) || exercises.length,
        },
      });
    } catch {
      setExerciseError("Exercise content must be valid JSON.");
    }
  }

  if (isLessonLoading) {
    return (
      <AdminShell title="Lesson detail" subtitle="Exercise builder">
        <LoadingSpinner
          label="Loading lesson"
          className="rounded-xl bg-white p-4"
        />
      </AdminShell>
    );
  }

  if (isLessonError || !lesson) {
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

  return (
    <AdminShell title="Lesson detail" subtitle="Exercise builder">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            asChild
            variant="ghost"
            className="h-10 w-fit rounded-xl font-black"
          >
            <Link to="/admin/lessons">
              <ArrowLeft className="size-4" />
              Back to lessons
            </Link>
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl font-black"
              onClick={() => setEditingLesson(true)}
            >
              <Edit3 className="size-4" />
              Edit lesson
            </Button>
            <Button asChild className="h-10 rounded-xl font-black">
              <Link to={`/lesson/${lesson.id}`}>
                Student preview
                <ExternalLink className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <Card className="rounded-[1.35rem] border border-slate-200 bg-gradient-to-br from-white via-white to-cyan-50/60 py-0 shadow-[0_24px_70px_rgba(7,89,133,0.10)]">
          <CardContent className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_19rem] lg:p-6">
            <div className="grid gap-5 sm:grid-cols-[8.5rem_1fr]">
              <div className="grid aspect-square w-full max-w-36 place-items-center overflow-hidden rounded-[1.2rem] border-2 border-cyan-100 bg-white text-6xl shadow-inner">
                <LessonVisual visual={lesson.visual} />
              </div>
              <div className="min-w-0 self-center">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-primary/10 text-primary">
                    {topic?.title ?? "Unassigned topic"}
                  </Badge>
                  <Badge className="bg-slate-100 text-slate-700">
                    {lesson.type === "communication"
                      ? "Communication"
                      : "Vocabulary"}
                  </Badge>
                </div>
                <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 text-balance md:text-4xl">
                  {lesson.title}
                </h1>
                <p className="mt-2 text-lg font-black text-slate-700">
                  {lesson.phrase}
                </p>
                <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-500 text-pretty">
                  {lesson.description}
                </p>
              </div>
            </div>
            <div className="grid gap-3 rounded-2xl border border-cyan-100 bg-white/80 p-4">
              <h2 className="text-sm font-black uppercase text-slate-500">
                Lesson status
              </h2>
              <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
                <MetricTile
                  icon={<Trophy className="size-4" />}
                  label="XP"
                  value={lesson.xp}
                />
                <MetricTile
                  icon={<Sparkles className="size-4" />}
                  label="Level"
                  value={lesson.difficulty}
                />
                <MetricTile
                  icon={<ListChecks className="size-4" />}
                  label="Content"
                  value={`${questions.length} / ${exercises.length}`}
                  hint="quiz / exercises"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {editingLesson ? (
          <Dialog
            title="Edit lesson"
            subtitle="Update lesson metadata from the API."
            onClose={() => setEditingLesson(false)}
          >
            <LessonEditForm
              form={lessonForm}
              setForm={setLessonForm}
              onSubmit={handleSaveLesson}
              submitting={updateLessonMutation.isPending}
            />
          </Dialog>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(24rem,0.9fr)]">
          <section className="rounded-[1.2rem] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                    <HelpCircle className="size-5" />
                  </div>
                  <h2 className="text-lg font-black">Quiz questions</h2>
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  Review answers and distractors before publishing.
                </p>
              </div>
              <Button
                type="button"
                className="h-9 rounded-xl font-black"
                onClick={() => setShowQuestionForm(true)}
              >
                <Plus className="size-4" />
                Add question
              </Button>
            </div>
            {isQuestionsLoading ? (
              <LoadingSpinner label="Loading questions" className="py-4" />
            ) : (
              <QuestionList questions={questions} />
            )}
          </section>

          <section className="rounded-[1.2rem] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                    <FileJson className="size-5" />
                  </div>
                  <h2 className="text-lg font-black">Lesson exercises</h2>
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  Keep JSON blocks ordered the same way students will see them.
                </p>
              </div>
              <Button
                type="button"
                className="h-9 rounded-xl font-black"
                onClick={() => setShowExerciseForm(true)}
              >
                <Plus className="size-4" />
                Add exercise
              </Button>
            </div>
            {isExercisesLoading ? (
              <LoadingSpinner label="Loading exercises" className="py-4" />
            ) : (
              <ExerciseList exercises={exercises} />
            )}
          </section>
        </div>

        {showQuestionForm ? (
          <Dialog
            title="New question"
            subtitle="Create a quiz question for this lesson."
            onClose={() => setShowQuestionForm(false)}
          >
            <QuestionForm
              form={questionForm}
              setForm={setQuestionForm}
              onSubmit={handleCreateQuestion}
              submitting={createQuestionMutation.isPending}
            />
          </Dialog>
        ) : null}

        {showExerciseForm ? (
          <Dialog
            title="New exercise"
            subtitle="Create an exercise with JSON content."
            onClose={() => setShowExerciseForm(false)}
          >
            <ExerciseForm
              form={exerciseForm}
              setForm={setExerciseForm}
              error={exerciseError}
              onSubmit={handleCreateExercise}
              submitting={createExerciseMutation.isPending}
            />
          </Dialog>
        ) : null}
      </div>
    </AdminShell>
  );
}

function MetricTile({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-500">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-xl font-black leading-none text-slate-950">
        {value}
      </div>
      {hint ? (
        <p className="mt-1 text-xs font-bold text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-black uppercase text-slate-500">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="text-xs font-bold text-slate-400">{hint}</span>
      ) : null}
    </div>
  );
}

function QuestionList({ questions }: { questions: QuizQuestion[] }) {
  if (!questions.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <div className="mx-auto grid size-11 place-items-center rounded-xl bg-white text-primary">
          <HelpCircle className="size-5" />
        </div>
        <h3 className="mt-3 font-black text-slate-900">No quiz questions</h3>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Add at least one question so students can check the lesson.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {questions.map((question, index) => (
        <article
          key={question.id}
          className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge className="bg-white text-slate-700">
                  Question {index + 1}
                </Badge>
                <Badge className="bg-primary/10 text-primary">
                  {question.type}
                </Badge>
              </div>
              <h3 className="text-base font-black leading-snug text-slate-950 text-pretty">
                {question.prompt}
              </h3>
            </div>
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-800">
              {question.answer}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {question.options.map((option) => (
              <span
                key={option}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600"
              >
                {option}
              </span>
            ))}
          </div>
          {question.hint || question.video_url ? (
            <div className="mt-3 grid gap-2 text-xs font-bold text-slate-500">
              {question.hint ? <p>Hint: {question.hint}</p> : null}
              {question.video_url ? (
                <a
                  href={question.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit text-primary hover:underline"
                >
                  Open answer video
                </a>
              ) : null}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function LessonEditForm({
  form,
  setForm,
  onSubmit,
  submitting,
}: {
  form: LessonFormState;
  setForm: React.Dispatch<React.SetStateAction<LessonFormState>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
}) {
  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Lesson title">
          <Input
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="Lesson title"
            className="h-11 bg-slate-100"
          />
        </Field>
        <Field label="Word or phrase">
          <Input
            value={form.phrase}
            onChange={(event) =>
              setForm((current) => ({ ...current, phrase: event.target.value }))
            }
            placeholder="Word or phrase"
            className="h-11 bg-slate-100"
          />
        </Field>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_10rem_10rem_7rem]">
        <Field label="Description">
          <Input
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Lesson description"
            className="h-11 bg-slate-100"
          />
        </Field>
        <Field label="Type">
          <select
            value={form.type}
            onChange={(event) =>
              setForm((current) => ({ ...current, type: event.target.value }))
            }
            className="h-11 rounded-lg border-2 border-input bg-slate-100 px-2.5 text-sm font-semibold outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="vocabulary">Vocabulary</option>
            <option value="communication">Communication</option>
          </select>
        </Field>
        <Field label="Difficulty">
          <select
            value={form.difficulty}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                difficulty: event.target.value,
              }))
            }
            className="h-11 rounded-lg border-2 border-input bg-slate-100 px-2.5 text-sm font-semibold outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
          </select>
        </Field>
        <Field label="XP">
          <Input
            type="number"
            min="1"
            value={form.xp}
            onChange={(event) =>
              setForm((current) => ({ ...current, xp: event.target.value }))
            }
            placeholder="XP"
            className="h-11 bg-slate-100"
          />
        </Field>
      </div>
      <Field
        label="Lesson visual"
        hint="Use an uploaded SVG or image reference for the lesson card."
      >
        <LessonVisualUpload
          value={form.visual}
          onChange={(visual) => setForm((current) => ({ ...current, visual }))}
        />
      </Field>
      <Field label="Sign hint">
        <textarea
          value={form.signHint}
          onChange={(event) =>
            setForm((current) => ({ ...current, signHint: event.target.value }))
          }
          placeholder="Sign hint"
          className="min-h-24 rounded-lg border-2 border-input bg-slate-100 px-2.5 py-2 text-sm font-semibold outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </Field>
      <div className="flex justify-end">
        <Button
          type="submit"
          className="h-11 rounded-xl font-black"
          disabled={submitting}
        >
          <Save className="size-4" />
          Save lesson
        </Button>
      </div>
    </form>
  );
}

function QuestionForm({
  form,
  setForm,
  onSubmit,
  submitting,
}: {
  form: QuestionFormState;
  setForm: React.Dispatch<React.SetStateAction<QuestionFormState>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
}) {
  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      <Field label="Prompt">
        <Input
          value={form.prompt}
          onChange={(event) =>
            setForm((current) => ({ ...current, prompt: event.target.value }))
          }
          placeholder="What should the student answer?"
          className="h-11 bg-slate-100"
        />
      </Field>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Question type">
          <Input
            value={form.type}
            onChange={(event) =>
              setForm((current) => ({ ...current, type: event.target.value }))
            }
            placeholder="sign-choice"
            className="h-11 bg-slate-100"
          />
        </Field>
        <Field label="Correct answer">
          <Input
            value={form.answer}
            onChange={(event) =>
              setForm((current) => ({ ...current, answer: event.target.value }))
            }
            placeholder="Correct answer"
            className="h-11 bg-slate-100"
          />
        </Field>
      </div>
      <Field
        label="Options"
        hint="One option per line. The correct answer will be added automatically if missing."
      >
        <textarea
          value={form.options}
          onChange={(event) =>
            setForm((current) => ({ ...current, options: event.target.value }))
          }
          placeholder="Options, one per line"
          className="min-h-32 rounded-lg border-2 border-input bg-slate-100 px-2.5 py-2 text-sm font-semibold outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </Field>
      <Field label="Answer video URL">
        <Input
          value={form.videoUrl}
          onChange={(event) =>
            setForm((current) => ({ ...current, videoUrl: event.target.value }))
          }
          placeholder="https://..."
          className="h-11 bg-slate-100"
        />
      </Field>
      <Field label="Hint">
        <Input
          value={form.hint}
          onChange={(event) =>
            setForm((current) => ({ ...current, hint: event.target.value }))
          }
          placeholder="Optional hint shown during quiz"
          className="h-11 bg-slate-100"
        />
      </Field>
      <div className="flex justify-end">
        <Button
          type="submit"
          className="h-11 rounded-xl font-black"
          disabled={submitting}
        >
          Create question
        </Button>
      </div>
    </form>
  );
}

function ExerciseForm({
  form,
  setForm,
  error,
  onSubmit,
  submitting,
}: {
  form: ExerciseFormState;
  setForm: React.Dispatch<React.SetStateAction<ExerciseFormState>>;
  error: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
}) {
  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      <div className="grid gap-3 md:grid-cols-[1fr_8rem]">
        <Field label="Exercise type">
          <Input
            value={form.type}
            onChange={(event) =>
              setForm((current) => ({ ...current, type: event.target.value }))
            }
            placeholder="learning"
            className="h-11 bg-slate-100"
          />
        </Field>
        <Field label="Order">
          <Input
            type="number"
            min="0"
            value={form.sortOrder}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                sortOrder: event.target.value,
              }))
            }
            placeholder="Order"
            className="h-11 bg-slate-100"
          />
        </Field>
      </div>
      <Field
        label="JSON content"
        hint="Paste a valid JSON object. This is saved directly to the exercise content field."
      >
        <textarea
          value={form.content}
          onChange={(event) =>
            setForm((current) => ({ ...current, content: event.target.value }))
          }
          placeholder="JSON content"
          className="min-h-56 rounded-lg border-2 border-input bg-slate-100 px-2.5 py-2 font-mono text-sm font-semibold outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </Field>
      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">
          {error}
        </p>
      ) : null}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="h-11 rounded-xl font-black"
          disabled={submitting}
        >
          Create exercise
        </Button>
      </div>
    </form>
  );
}

function ExerciseList({ exercises }: { exercises: Exercise[] }) {
  if (!exercises.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <div className="mx-auto grid size-11 place-items-center rounded-xl bg-white text-emerald-700">
          <FileJson className="size-5" />
        </div>
        <h3 className="mt-3 font-black text-slate-900">No exercises yet</h3>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Add the first JSON exercise to build the lesson sequence.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {exercises.map((exercise, index) => (
        <Card key={exercise.id} className="rounded-xl border-slate-200 py-0">
          <CardContent className="p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary/10 text-primary">
                  Step {index + 1}
                </Badge>
                <Badge className="bg-slate-100 text-slate-700">
                  {exercise.type}
                </Badge>
              </div>
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500">
                Order {exercise.sort_order}
              </span>
            </div>
            <pre className="max-h-72 overflow-auto rounded-lg bg-slate-950 p-3 text-xs font-semibold leading-5 text-white shadow-inner">
              {JSON.stringify(exercise.content, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Dialog({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-detail-dialog-title"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[min(88vh,56rem)] w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4">
          <div>
            <h2 id="admin-detail-dialog-title" className="text-xl font-black">
              {title}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {subtitle}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </Button>
        </div>
        <div className="max-h-[calc(min(88vh,56rem)-5.5rem)] overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
