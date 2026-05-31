import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  ClipboardCheck,
  Edit3,
  ExternalLink,
  Plus,
  Save,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";

import { lessonsApi } from "~/api/lessons";
import type { Exercise, Lesson } from "~/api/types";
import { AdminShell } from "~/components/admin/admin-shell";
import { AdminTable } from "~/components/admin/admin-table";
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
    visual: lesson?.visual ?? "⭐",
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
        visual: lessonForm.visual.trim() || "⭐",
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
            <div className="flex flex-wrap gap-2 lg:max-w-52 lg:justify-end">
              <Badge className="bg-primary/10 text-primary">
                {lesson.type === "communication" ? "Communication" : "Vocabulary"}
              </Badge>
              <Badge className="bg-amber-100 text-amber-800">
                {lesson.difficulty}
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-800">
                {lesson.xp} XP
              </Badge>
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-xl font-black"
                onClick={() => setEditingLesson((current) => !current)}
              >
                <Edit3 className="size-4" />
                Edit
              </Button>
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

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black">Quiz questions</h2>
              <p className="text-sm font-semibold text-slate-500">
                Questions served by the lesson quiz API.
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
            <LoadingSpinner
              label="Loading questions"
              className="py-4"
            />
          ) : (
            <AdminTable
              title="Questions"
              data={questions}
              columns={[
                { key: "prompt", header: "Prompt", render: (item) => item.prompt },
                { key: "type", header: "Type", render: (item) => item.type },
                { key: "answer", header: "Answer", render: (item) => item.answer },
                {
                  key: "options",
                  header: "Options",
                  render: (item) => item.options.length,
                },
              ]}
            />
          )}
        </section>

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

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black">Lesson exercises</h2>
              <p className="text-sm font-semibold text-slate-500">
                Structured exercise records from the lesson exercises API.
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
            <LoadingSpinner
              label="Loading exercises"
              className="py-4"
            />
          ) : (
            <ExerciseList exercises={exercises} />
          )}
        </section>

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
        <Input
          value={form.title}
          onChange={(event) =>
            setForm((current) => ({ ...current, title: event.target.value }))
          }
          placeholder="Lesson title"
          className="h-11 bg-slate-100"
        />
        <Input
          value={form.phrase}
          onChange={(event) =>
            setForm((current) => ({ ...current, phrase: event.target.value }))
          }
          placeholder="Word or phrase"
          className="h-11 bg-slate-100"
        />
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_7rem_10rem_10rem_7rem]">
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
        <Input
          value={form.visual}
          onChange={(event) =>
            setForm((current) => ({ ...current, visual: event.target.value }))
          }
          placeholder="Visual"
          className="h-11 bg-slate-100"
        />
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
      </div>
      <textarea
        value={form.signHint}
        onChange={(event) =>
          setForm((current) => ({ ...current, signHint: event.target.value }))
        }
        placeholder="Sign hint"
        className="min-h-24 rounded-lg border-2 border-input bg-slate-100 px-2.5 py-2 text-sm font-semibold outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
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
      <Input
        value={form.prompt}
        onChange={(event) =>
          setForm((current) => ({ ...current, prompt: event.target.value }))
        }
        placeholder="Prompt"
        className="h-11 bg-slate-100"
      />
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          value={form.type}
          onChange={(event) =>
            setForm((current) => ({ ...current, type: event.target.value }))
          }
          placeholder="Question type"
          className="h-11 bg-slate-100"
        />
        <Input
          value={form.answer}
          onChange={(event) =>
            setForm((current) => ({ ...current, answer: event.target.value }))
          }
          placeholder="Correct answer"
          className="h-11 bg-slate-100"
        />
      </div>
      <textarea
        value={form.options}
        onChange={(event) =>
          setForm((current) => ({ ...current, options: event.target.value }))
        }
        placeholder="Options, one per line"
        className="min-h-32 rounded-lg border-2 border-input bg-slate-100 px-2.5 py-2 text-sm font-semibold outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <Input
        value={form.videoUrl}
        onChange={(event) =>
          setForm((current) => ({ ...current, videoUrl: event.target.value }))
        }
        placeholder="Answer video URL"
        className="h-11 bg-slate-100"
      />
      <Input
        value={form.hint}
        onChange={(event) =>
          setForm((current) => ({ ...current, hint: event.target.value }))
        }
        placeholder="Hint"
        className="h-11 bg-slate-100"
      />
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
        <Input
          value={form.type}
          onChange={(event) =>
            setForm((current) => ({ ...current, type: event.target.value }))
          }
          placeholder="Exercise type"
          className="h-11 bg-slate-100"
        />
        <Input
          type="number"
          min="0"
          value={form.sortOrder}
          onChange={(event) =>
            setForm((current) => ({ ...current, sortOrder: event.target.value }))
          }
          placeholder="Order"
          className="h-11 bg-slate-100"
        />
      </div>
      <textarea
        value={form.content}
        onChange={(event) =>
          setForm((current) => ({ ...current, content: event.target.value }))
        }
        placeholder="JSON content"
        className="min-h-56 rounded-lg border-2 border-input bg-slate-100 px-2.5 py-2 font-mono text-sm font-semibold outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
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
      <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center font-bold text-slate-500">
        No exercises yet.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {exercises.map((exercise) => (
        <Card key={exercise.id} className="rounded-xl border-slate-200 py-0">
          <CardContent className="p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/10 text-primary">
                {exercise.type}
              </Badge>
              <Badge className="bg-slate-100 text-slate-700">
                Order {exercise.sort_order}
              </Badge>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs font-semibold text-white">
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
