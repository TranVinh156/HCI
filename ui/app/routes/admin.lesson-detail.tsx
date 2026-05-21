import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Edit3,
  ExternalLink,
  Gift,
  PlayCircle,
  Plus,
  RotateCcw,
  Save,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useParams } from "react-router";

import { AdminShell } from "~/components/admin/admin-shell";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  getLessonQuiz,
  readAdminLearningData,
  writeAdminLearningData,
  type AdminLearningData,
  type CompletionExercise,
  type ExerciseType,
  type LearningExercise,
  type Lesson,
  type LessonExercise,
  type QuizExercise,
  type QuizQuestion,
  type SignPracticeExercise,
} from "~/lib/learning-data";

type LessonEditForm = {
  title: string;
  phrase: string;
  description: string;
  visual: string;
  signHint: string;
  type: Lesson["type"];
  difficulty: Lesson["difficulty"];
  xp: string;
};

type LearningExampleForm = {
  id: string;
  text: string;
  translation: string;
  signVideoUrl: string;
};

type QuizOptionForm = {
  id: string;
  text: string;
  isCorrect: boolean;
  signVideoUrl: string;
};

type MistakeForm = {
  id: string;
  text: string;
};

type ExerciseForm = {
  type: ExerciseType;
  prompt: string;
  instruction: string;
  explanation: string;
  title: string;
  content: string;
  targetWord: string;
  sampleSignVideoUrl: string;
  examples: LearningExampleForm[];
  targetSignVideoUrl: string;
  maxRecordSeconds: string;
  minConfidence: string;
  allowRetry: boolean;
  question: string;
  options: QuizOptionForm[];
  score: string;
  xp: string;
  correctCount: string;
  totalCount: string;
  mistakes: MistakeForm[];
};

const exerciseTypeMeta: Record<
  ExerciseType,
  { label: string; icon: LucideIcon; tone: string }
> = {
  learning: {
    label: "LearningExercise",
    icon: BookOpen,
    tone: "bg-primary/10 text-primary",
  },
  sign_practice: {
    label: "SignPracticeExercise",
    icon: Camera,
    tone: "bg-cyan-100 text-cyan-800",
  },
  quiz: {
    label: "QuizExercise",
    icon: ClipboardCheck,
    tone: "bg-amber-100 text-amber-800",
  },
  completion: {
    label: "CompletionScreen",
    icon: Gift,
    tone: "bg-emerald-100 text-emerald-800",
  },
};

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "exercise"
  );
}

function createUniqueId(label: string, existingIds: string[]) {
  const baseId = slugify(label);
  const usedIds = new Set(existingIds);
  let nextId = baseId;
  let suffix = 2;

  while (usedIds.has(nextId)) {
    nextId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  return nextId;
}

function createFormRowId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function createLessonEditForm(lesson?: Lesson): LessonEditForm {
  return {
    title: lesson?.title ?? "",
    phrase: lesson?.phrase ?? "",
    description: lesson?.description ?? "",
    visual: lesson?.visual ?? "⭐",
    signHint: lesson?.signHint ?? "",
    type: lesson?.type ?? "vocabulary",
    difficulty: lesson?.difficulty ?? "Easy",
    xp: String(lesson?.xp ?? 10),
  };
}

function createEmptyExerciseForm(lesson?: Lesson): ExerciseForm {
  return {
    type: "learning",
    prompt: "",
    instruction: "",
    explanation: "",
    title: lesson ? `Learn ${lesson.phrase}` : "",
    content: lesson?.description ?? "",
    targetWord: lesson?.phrase ?? "",
    sampleSignVideoUrl: "",
    examples: lesson
      ? [
          {
            id: "example-target",
            text: lesson.phrase,
            translation: lesson.description,
            signVideoUrl: "",
          },
        ]
      : [],
    targetSignVideoUrl: "",
    maxRecordSeconds: "5",
    minConfidence: "0.75",
    allowRetry: true,
    question: lesson ? `What does this sign mean?` : "",
    options: lesson
      ? [
          {
            id: "option-correct",
            text: lesson.phrase,
            isCorrect: true,
            signVideoUrl: "",
          },
          {
            id: "option-sorry",
            text: "I am sorry",
            isCorrect: false,
            signVideoUrl: "",
          },
          {
            id: "option-purple",
            text: "Purple",
            isCorrect: false,
            signVideoUrl: "",
          },
          {
            id: "option-outside",
            text: "Go outside",
            isCorrect: false,
            signVideoUrl: "",
          },
        ]
      : [],
    score: "",
    xp: String(lesson?.xp ?? 10),
    correctCount: "",
    totalCount: "",
    mistakes: [],
  };
}

function createExerciseForm(exercise: LessonExercise): ExerciseForm {
  const base = createEmptyExerciseForm();

  if (exercise.type === "learning") {
    return {
      ...base,
      type: exercise.type,
      prompt: exercise.prompt ?? "",
      instruction: exercise.instruction ?? "",
      explanation: exercise.explanation ?? "",
      title: exercise.title,
      content: exercise.content,
      targetWord: exercise.targetWord ?? "",
      sampleSignVideoUrl: exercise.sampleSignVideoUrl ?? "",
      examples: (exercise.examples ?? []).map((example, index) => ({
        id: `example-${index}`,
        text: example.text,
        translation: example.translation ?? "",
        signVideoUrl: example.signVideoUrl ?? "",
      })),
    };
  }

  if (exercise.type === "sign_practice") {
    return {
      ...base,
      type: exercise.type,
      prompt: exercise.prompt ?? "",
      instruction: exercise.instruction ?? "",
      explanation: exercise.explanation ?? "",
      targetWord: exercise.targetWord,
      targetSignVideoUrl: exercise.targetSignVideoUrl ?? "",
      maxRecordSeconds: String(exercise.maxRecordSeconds ?? 5),
      minConfidence: String(exercise.minConfidence ?? 0.75),
      allowRetry: exercise.allowRetry ?? true,
    };
  }

  if (exercise.type === "quiz") {
    return {
      ...base,
      type: exercise.type,
      prompt: exercise.prompt ?? "",
      instruction: exercise.instruction ?? "",
      explanation: exercise.explanation ?? "",
      question: exercise.question,
      options: exercise.options.map((option) => ({
        id: option.id,
        text: option.text,
        isCorrect: option.isCorrect,
        signVideoUrl: option.signVideoUrl ?? "",
      })),
    };
  }

  return {
    ...base,
    type: exercise.type,
    prompt: exercise.prompt ?? "",
    instruction: exercise.instruction ?? "",
    explanation: exercise.explanation ?? "",
    score: String(exercise.score ?? ""),
    xp: String(exercise.xp ?? ""),
    correctCount: String(exercise.correctCount ?? ""),
    totalCount: String(exercise.totalCount ?? ""),
    mistakes: (exercise.mistakes ?? []).map((mistake, index) => ({
      id: `mistake-${index}`,
      text: mistake,
    })),
  };
}

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

function getPreviewQuestions(lesson: Lesson) {
  const savedQuestions = getLessonQuiz(lesson.id);
  const fallbackQuestions = createFallbackQuizQuestions(lesson);

  return [
    savedQuestions[0]?.answer === lesson.phrase
      ? savedQuestions[0]
      : fallbackQuestions[0],
    savedQuestions[1]?.answer === lesson.visual
      ? savedQuestions[1]
      : fallbackQuestions[1],
  ];
}

function createQuizExercise(
  lesson: Lesson,
  question: QuizQuestion,
  index: number
): QuizExercise {
  return {
    id: `${lesson.id}-quiz-${index}`,
    lessonId: lesson.id,
    type: "quiz",
    question: question.prompt,
    instruction: "Choose the correct answer, then check.",
    options: question.options.map((option) => ({
      id: createUniqueId(option, []),
      text: option,
      isCorrect: option === question.answer,
    })),
  };
}

function createDefaultExercises(lesson: Lesson): LessonExercise[] {
  const questions = getPreviewQuestions(lesson);

  return [
    {
      id: `${lesson.id}-learning`,
      lessonId: lesson.id,
      type: "learning",
      title: `Learn ${lesson.phrase}`,
      content: lesson.description,
      targetWord: lesson.phrase,
      instruction: "Watch the sample sign and read the short explanation.",
      explanation: lesson.signHint,
      examples: [
        {
          text: lesson.phrase,
          translation: lesson.description,
        },
      ],
    },
    {
      id: `${lesson.id}-sign-practice`,
      lessonId: lesson.id,
      type: "sign_practice",
      prompt: `Show the sign for "${lesson.phrase}"`,
      instruction:
        "Turn on camera, record a short clip, and keep both hands inside the frame.",
      explanation: lesson.signHint,
      targetWord: lesson.phrase,
      maxRecordSeconds: 5,
      minConfidence: 0.75,
      allowRetry: true,
    },
    createQuizExercise(lesson, questions[0], 1),
    createQuizExercise(lesson, questions[1], 2),
    {
      id: `${lesson.id}-completion`,
      lessonId: lesson.id,
      type: "completion",
      prompt: "Lesson complete",
      explanation: "Show progress, mistakes, and reward summary.",
      xp: lesson.xp,
      totalCount: 4,
    },
  ];
}

function getLessonExercises(data: AdminLearningData, lesson: Lesson) {
  const defaultExercises = createDefaultExercises(lesson);
  const storedExercises = data.exercises.filter(
    (exercise) => exercise.lessonId === lesson.id
  );

  if (!storedExercises.length) return defaultExercises;

  const storedIds = new Set(storedExercises.map((exercise) => exercise.id));
  const missingDefaults = defaultExercises.filter(
    (exercise) => !storedIds.has(exercise.id)
  );

  return [...missingDefaults, ...storedExercises];
}

function createExerciseFromForm(
  form: ExerciseForm,
  lesson: Lesson,
  existingExerciseIds: string[],
  editingId?: string
): LessonExercise {
  const id =
    editingId ??
    createUniqueId(`${lesson.id}-${form.type}-${form.title || form.question}`, [
      ...existingExerciseIds,
    ]);
  const base = {
    id,
    lessonId: lesson.id,
    prompt: form.prompt.trim() || undefined,
    instruction: form.instruction.trim() || undefined,
    explanation: form.explanation.trim() || undefined,
  };

  if (form.type === "learning") {
    return {
      ...base,
      type: "learning",
      title: form.title.trim() || `Learn ${lesson.phrase}`,
      content: form.content.trim() || lesson.description,
      targetWord: form.targetWord.trim() || lesson.phrase,
      sampleSignVideoUrl: form.sampleSignVideoUrl.trim() || undefined,
      examples: form.examples
        .map((example) => ({
          text: example.text.trim(),
          translation: example.translation.trim() || undefined,
          signVideoUrl: example.signVideoUrl.trim() || undefined,
        }))
        .filter((example) => example.text),
    };
  }

  if (form.type === "sign_practice") {
    return {
      ...base,
      type: "sign_practice",
      targetWord: form.targetWord.trim() || lesson.phrase,
      targetSignVideoUrl: form.targetSignVideoUrl.trim() || undefined,
      instruction:
        form.instruction.trim() ||
        "Turn on camera, record a short clip, and keep both hands inside the frame.",
      maxRecordSeconds: Math.max(
        1,
        Number.parseInt(form.maxRecordSeconds, 10) || 5
      ),
      minConfidence: Math.min(
        1,
        Math.max(0, Number.parseFloat(form.minConfidence) || 0.75)
      ),
      allowRetry: form.allowRetry,
    };
  }

  if (form.type === "quiz") {
    return {
      ...base,
      type: "quiz",
      question: form.question.trim() || "Choose the correct answer.",
      options: normalizeQuizOptions(form.options, lesson.phrase),
    };
  }

  return {
    ...base,
    type: "completion",
    score: form.score ? Number.parseInt(form.score, 10) || 0 : undefined,
    xp: form.xp ? Number.parseInt(form.xp, 10) || lesson.xp : lesson.xp,
    correctCount: form.correctCount
      ? Number.parseInt(form.correctCount, 10) || 0
      : undefined,
    totalCount: form.totalCount
      ? Number.parseInt(form.totalCount, 10) || 0
      : undefined,
    mistakes: form.mistakes
      .map((mistake) => mistake.text.trim())
      .filter(Boolean),
  };
}

function normalizeQuizOptions(options: QuizOptionForm[], fallbackAnswer: string) {
  const normalizedOptions = options
    .map((option) => ({
      id: option.id || slugify(option.text),
      text: option.text.trim(),
      isCorrect: option.isCorrect,
      signVideoUrl: option.signVideoUrl.trim() || undefined,
    }))
    .filter((option) => option.text);

  if (!normalizedOptions.length) {
    return [
      { id: slugify(fallbackAnswer), text: fallbackAnswer, isCorrect: true },
      { id: "try-again", text: "Try again", isCorrect: false },
    ];
  }

  if (!normalizedOptions.some((option) => option.isCorrect)) {
    return normalizedOptions.map((option, index) => ({
      ...option,
      isCorrect: index === 0,
    }));
  }

  return normalizedOptions;
}

function ExerciseTypeBadge({ type }: { type: ExerciseType }) {
  const meta = exerciseTypeMeta[type];
  const Icon = meta.icon;

  return (
    <Badge className={meta.tone}>
      <Icon className="size-3" />
      {type}
    </Badge>
  );
}

export default function AdminLessonDetailRoute() {
  const params = useParams();
  const [data, setData] = useState<AdminLearningData>(() =>
    readAdminLearningData()
  );
  const [editingLesson, setEditingLesson] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(
    null
  );
  const [lessonForm, setLessonForm] = useState<LessonEditForm>(() =>
    createLessonEditForm(
      readAdminLearningData().lessons.find(
        (item) => item.id === params.lessonId
      )
    )
  );
  const [exerciseForm, setExerciseForm] = useState<ExerciseForm>(() =>
    createEmptyExerciseForm(
      readAdminLearningData().lessons.find(
        (item) => item.id === params.lessonId
      )
    )
  );

  useEffect(() => {
    const storedData = readAdminLearningData();
    const storedLesson = storedData.lessons.find(
      (item) => item.id === params.lessonId
    );

    setData(storedData);
    setLessonForm(createLessonEditForm(storedLesson));
    setExerciseForm(createEmptyExerciseForm(storedLesson));
    setEditingLesson(false);
    setShowExerciseForm(false);
    setEditingExerciseId(null);
  }, [params.lessonId]);

  const lesson = data.lessons.find((item) => item.id === params.lessonId);
  const topic = lesson
    ? data.topics.find(
        (item) =>
          item.id === lesson.topicId || item.lessonIds.includes(lesson.id)
      )
    : undefined;
  const exercises = useMemo(
    () => (lesson ? getLessonExercises(data, lesson) : []),
    [data, lesson]
  );

  function persistLearningData(nextData: AdminLearningData) {
    setData(nextData);
    writeAdminLearningData(nextData);
  }

  function replaceLessonExercises(nextExercises: LessonExercise[]) {
    if (!lesson) return;

    persistLearningData({
      ...data,
      exercises: [
        ...data.exercises.filter((exercise) => exercise.lessonId !== lesson.id),
        ...nextExercises,
      ],
    });
  }

  function handleSaveLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lesson) return;

    const title = lessonForm.title.trim();
    const phrase = lessonForm.phrase.trim();
    if (!title || !phrase) return;

    const updatedLesson: Lesson = {
      ...lesson,
      title,
      phrase,
      description:
        lessonForm.description.trim() || `Practice the sign for ${phrase}.`,
      visual: lessonForm.visual.trim() || "⭐",
      signHint: lessonForm.signHint.trim() || "Add a sign hint for learners.",
      type: lessonForm.type,
      difficulty: lessonForm.difficulty,
      xp: Math.max(1, Number.parseInt(lessonForm.xp, 10) || 10),
    };

    persistLearningData({
      ...data,
      lessons: data.lessons.map((item) =>
        item.id === updatedLesson.id ? updatedLesson : item
      ),
    });
    setLessonForm(createLessonEditForm(updatedLesson));
    setEditingLesson(false);
  }

  function startAddExercise() {
    setEditingExerciseId(null);
    setExerciseForm(createEmptyExerciseForm(lesson));
    setShowExerciseForm(true);
  }

  function startEditExercise(exercise: LessonExercise) {
    setEditingExerciseId(exercise.id);
    setExerciseForm(createExerciseForm(exercise));
    setShowExerciseForm(true);
  }

  function cancelExerciseForm() {
    setEditingExerciseId(null);
    setExerciseForm(createEmptyExerciseForm(lesson));
    setShowExerciseForm(false);
  }

  function handleSaveExercise(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lesson) return;

    const nextExercise = createExerciseFromForm(
      exerciseForm,
      lesson,
      exercises.map((exercise) => exercise.id),
      editingExerciseId ?? undefined
    );
    const nextExercises = editingExerciseId
      ? exercises.map((exercise) =>
          exercise.id === editingExerciseId ? nextExercise : exercise
        )
      : [...exercises, nextExercise];

    replaceLessonExercises(nextExercises);
    cancelExerciseForm();
  }

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
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-xl font-black"
                onClick={() => {
                  setLessonForm(createLessonEditForm(lesson));
                  setEditingLesson((current) => !current);
                }}
              >
                <Edit3 className="size-4" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {editingLesson ? (
          <ExerciseDialog
            title="Edit lesson"
            subtitle="Update the lesson metadata used by the exercise flow."
            onClose={() => setEditingLesson(false)}
          >
            <LessonEditPanel
              form={lessonForm}
              setForm={setLessonForm}
              onCancel={() => setEditingLesson(false)}
              onSubmit={handleSaveLesson}
            />
          </ExerciseDialog>
        ) : null}

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black">Lesson exercises</h2>
              <p className="text-sm font-semibold text-slate-500">
                ExerciseRenderer-ready list for learning, sign practice, quiz,
                and completion.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="w-fit bg-slate-100 text-slate-700">
                {exercises.length} exercises
              </Badge>
              <Button
                type="button"
                className="h-9 rounded-xl font-black"
                onClick={startAddExercise}
              >
                <Plus className="size-4" />
                Add exercise
              </Button>
            </div>
          </div>

          {showExerciseForm ? (
            <ExerciseDialog
              title={editingExerciseId ? "Edit exercise" : "Create exercise"}
              subtitle="Build this exercise with structured controls instead of text parsing."
              action={
                <ExerciseTypeSelect
                  value={exerciseForm.type}
                  onValueChange={(value) =>
                    setExerciseForm((current) => ({
                      ...current,
                      type: value,
                    }))
                  }
                />
              }
              onClose={cancelExerciseForm}
            >
              <ExerciseEditPanel
                form={exerciseForm}
                setForm={setExerciseForm}
                editing={Boolean(editingExerciseId)}
                onCancel={cancelExerciseForm}
                onSubmit={handleSaveExercise}
              />
            </ExerciseDialog>
          ) : null}

          <div className="relative mt-5 grid gap-4">
            <div className="absolute bottom-8 left-6 top-8 hidden w-1 rounded-full bg-primary/20 sm:block" />
            {exercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                step={index + 1}
                total={exercises.length}
                onEdit={() => startEditExercise(exercise)}
              />
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

function LessonEditPanel({
  form,
  setForm,
  onCancel,
  onSubmit,
}: {
  form: LessonEditForm;
  setForm: React.Dispatch<React.SetStateAction<LessonEditForm>>;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Card className="rounded-xl border border-primary/30 bg-primary/5 py-0">
      <CardContent className="p-4">
        <form className="grid gap-3" onSubmit={onSubmit}>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Lesson title"
              className="h-11 bg-slate-100"
            />
            <Input
              value={form.phrase}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  phrase: event.target.value,
                }))
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
                setForm((current) => ({
                  ...current,
                  visual: event.target.value,
                }))
              }
              placeholder="Visual"
              className="h-11 bg-slate-100"
            />
            <select
              value={form.type}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  type: event.target.value as Lesson["type"],
                }))
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
                  difficulty: event.target.value as Lesson["difficulty"],
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
                setForm((current) => ({
                  ...current,
                  xp: event.target.value,
                }))
              }
              placeholder="XP"
              className="h-11 bg-slate-100"
            />
          </div>
          <textarea
            value={form.signHint}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                signHint: event.target.value,
              }))
            }
            placeholder="Sign hint"
            className="min-h-24 rounded-lg border-2 border-input bg-slate-100 px-2.5 py-2 text-sm font-semibold outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl font-black"
              onClick={onCancel}
            >
              <X className="size-4" />
              Cancel
            </Button>
            <Button type="submit" className="h-11 rounded-xl font-black">
              <Save className="size-4" />
              Save lesson
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ExerciseDialog({
  title,
  subtitle,
  action,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-dialog-title"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[min(88vh,56rem)] w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="exercise-dialog-title" className="text-xl font-black">
              {title}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {subtitle}
            </p>
          </div>
          <div className="flex shrink-0 items-start gap-2 sm:justify-end">
            {action}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={onClose}
              aria-label="Close exercise dialog"
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>
        <div className="max-h-[calc(min(88vh,56rem)-5.5rem)] overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function ExerciseTypeSelect({
  value,
  onValueChange,
}: {
  value: ExerciseType;
  onValueChange: (value: ExerciseType) => void;
}) {
  return (
    <div className="w-full sm:w-64">
      <Select value={value} onValueChange={(next) => onValueChange(next as ExerciseType)}>
        <SelectTrigger className="h-11 rounded-xl border-2 border-primary/30 bg-primary/5 text-primary">
          <SelectValue placeholder="Exercise type" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(exerciseTypeMeta).map(([type, meta]) => {
            const Icon = meta.icon;

            return (
              <SelectItem key={type} value={type}>
                <span className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {type}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

function ExerciseEditPanel({
  form,
  setForm,
  editing,
  onCancel,
  onSubmit,
}: {
  form: ExerciseForm;
  setForm: React.Dispatch<React.SetStateAction<ExerciseForm>>;
  editing: boolean;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
        <form className="grid gap-3" onSubmit={onSubmit}>
          <div className="grid gap-3 lg:grid-cols-2">
            <Input
              value={form.prompt}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  prompt: event.target.value,
                }))
              }
              placeholder="Prompt"
              className="h-11 bg-slate-100"
            />
            <Input
              value={form.instruction}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  instruction: event.target.value,
                }))
              }
              placeholder="Instruction"
              className="h-11 bg-slate-100"
            />
          </div>

          {form.type === "learning" ? (
            <LearningExerciseFields form={form} setForm={setForm} />
          ) : null}

          {form.type === "sign_practice" ? (
            <SignPracticeExerciseFields form={form} setForm={setForm} />
          ) : null}

          {form.type === "quiz" ? (
            <QuizExerciseFields form={form} setForm={setForm} />
          ) : null}

          {form.type === "completion" ? (
            <CompletionExerciseFields form={form} setForm={setForm} />
          ) : null}

          <textarea
            value={form.explanation}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                explanation: event.target.value,
              }))
            }
            placeholder="Explanation or feedback copy"
            className="min-h-24 rounded-lg border-2 border-input bg-slate-100 px-2.5 py-2 text-sm font-semibold outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl font-black"
              onClick={onCancel}
            >
              <X className="size-4" />
              Cancel
            </Button>
            <Button type="submit" className="h-11 rounded-xl font-black">
              <Save className="size-4" />
              {editing ? "Save exercise" : "Create exercise"}
            </Button>
          </div>
        </form>
  );
}

function LearningExerciseFields({
  form,
  setForm,
}: {
  form: ExerciseForm;
  setForm: React.Dispatch<React.SetStateAction<ExerciseForm>>;
}) {
  return (
    <>
      <div className="grid gap-3 md:grid-cols-[1fr_12rem_1fr]">
        <Input
          value={form.title}
          onChange={(event) =>
            setForm((current) => ({ ...current, title: event.target.value }))
          }
          placeholder="Learning title"
          className="h-11 bg-slate-100"
        />
        <Input
          value={form.targetWord}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              targetWord: event.target.value,
            }))
          }
          placeholder="Target word"
          className="h-11 bg-slate-100"
        />
        <Input
          value={form.sampleSignVideoUrl}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              sampleSignVideoUrl: event.target.value,
            }))
          }
          placeholder="Sample sign video URL"
          className="h-11 bg-slate-100"
        />
      </div>
      <textarea
        value={form.content}
        onChange={(event) =>
          setForm((current) => ({ ...current, content: event.target.value }))
        }
        placeholder="Learning content"
        className="min-h-28 rounded-lg border-2 border-input bg-slate-100 px-2.5 py-2 text-sm font-semibold outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-black">Examples</p>
            <p className="text-xs font-semibold text-slate-500">
              Add each example as a structured row.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-xl font-black"
            onClick={() =>
              setForm((current) => ({
                ...current,
                examples: [
                  ...current.examples,
                  {
                    id: createFormRowId("example"),
                    text: "",
                    translation: "",
                    signVideoUrl: "",
                  },
                ],
              }))
            }
          >
            <Plus className="size-4" />
            Add example
          </Button>
        </div>
        <div className="mt-3 grid gap-2">
          {form.examples.map((example) => (
            <div
              key={example.id}
              className="grid gap-2 rounded-xl bg-slate-50 p-3 lg:grid-cols-[1fr_1fr_1fr_auto]"
            >
              <Input
                value={example.text}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    examples: current.examples.map((item) =>
                      item.id === example.id
                        ? { ...item, text: event.target.value }
                        : item
                    ),
                  }))
                }
                placeholder="Example text"
                className="h-10 bg-slate-100"
              />
              <Input
                value={example.translation}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    examples: current.examples.map((item) =>
                      item.id === example.id
                        ? { ...item, translation: event.target.value }
                        : item
                    ),
                  }))
                }
                placeholder="Translation"
                className="h-10 bg-slate-100"
              />
              <Input
                value={example.signVideoUrl}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    examples: current.examples.map((item) =>
                      item.id === example.id
                        ? { ...item, signVideoUrl: event.target.value }
                        : item
                    ),
                  }))
                }
                placeholder="Sign video URL"
                className="h-10 bg-slate-100"
              />
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-xl text-rose-600"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    examples: current.examples.filter(
                      (item) => item.id !== example.id
                    ),
                  }))
                }
                aria-label="Remove example"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SignPracticeExerciseFields({
  form,
  setForm,
}: {
  form: ExerciseForm;
  setForm: React.Dispatch<React.SetStateAction<ExerciseForm>>;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_1fr_10rem_10rem_auto]">
      <Input
        value={form.targetWord}
        onChange={(event) =>
          setForm((current) => ({ ...current, targetWord: event.target.value }))
        }
        placeholder="Target word"
        className="h-11 bg-slate-100"
      />
      <Input
        value={form.targetSignVideoUrl}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            targetSignVideoUrl: event.target.value,
          }))
        }
        placeholder="Target sign video URL"
        className="h-11 bg-slate-100"
      />
      <Input
        type="number"
        min="1"
        value={form.maxRecordSeconds}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            maxRecordSeconds: event.target.value,
          }))
        }
        placeholder="Record sec"
        className="h-11 bg-slate-100"
      />
      <Input
        type="number"
        min="0"
        max="1"
        step="0.01"
        value={form.minConfidence}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            minConfidence: event.target.value,
          }))
        }
        placeholder="Confidence"
        className="h-11 bg-slate-100"
      />
      <label className="flex h-11 items-center gap-2 rounded-lg border-2 border-input bg-slate-100 px-3 text-sm font-black">
        <input
          type="checkbox"
          checked={form.allowRetry}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              allowRetry: event.target.checked,
            }))
          }
        />
        Retry
      </label>
    </div>
  );
}

function QuizExerciseFields({
  form,
  setForm,
}: {
  form: ExerciseForm;
  setForm: React.Dispatch<React.SetStateAction<ExerciseForm>>;
}) {
  return (
    <>
      <Input
        value={form.question}
        onChange={(event) =>
          setForm((current) => ({ ...current, question: event.target.value }))
        }
        placeholder="Quiz question"
        className="h-11 bg-slate-100"
      />
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-black">Answer options</p>
            <p className="text-xs font-semibold text-slate-500">
              Mark one option as correct; no text parsing needed.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-xl font-black"
            onClick={() =>
              setForm((current) => ({
                ...current,
                options: [
                  ...current.options,
                  {
                    id: createFormRowId("option"),
                    text: "",
                    isCorrect: false,
                    signVideoUrl: "",
                  },
                ],
              }))
            }
          >
            <Plus className="size-4" />
            Add option
          </Button>
        </div>
        <div className="mt-3 grid gap-2">
          {form.options.map((option) => (
            <div
              key={option.id}
              className="grid gap-2 rounded-xl bg-slate-50 p-3 lg:grid-cols-[auto_1fr_1fr_auto]"
            >
              <label className="flex h-10 items-center gap-2 rounded-lg border-2 border-input bg-slate-100 px-3 text-sm font-black">
                <input
                  type="radio"
                  name="correctOption"
                  checked={option.isCorrect}
                  onChange={() =>
                    setForm((current) => ({
                      ...current,
                      options: current.options.map((item) => ({
                        ...item,
                        isCorrect: item.id === option.id,
                      })),
                    }))
                  }
                />
                Correct
              </label>
              <Input
                value={option.text}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    options: current.options.map((item) =>
                      item.id === option.id
                        ? { ...item, text: event.target.value }
                        : item
                    ),
                  }))
                }
                placeholder="Option text"
                className="h-10 bg-slate-100"
              />
              <Input
                value={option.signVideoUrl}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    options: current.options.map((item) =>
                      item.id === option.id
                        ? { ...item, signVideoUrl: event.target.value }
                        : item
                    ),
                  }))
                }
                placeholder="Sign video URL"
                className="h-10 bg-slate-100"
              />
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-xl text-rose-600"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    options: current.options.filter(
                      (item) => item.id !== option.id
                    ),
                  }))
                }
                aria-label="Remove option"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function CompletionExerciseFields({
  form,
  setForm,
}: {
  form: ExerciseForm;
  setForm: React.Dispatch<React.SetStateAction<ExerciseForm>>;
}) {
  return (
    <>
      <div className="grid gap-3 md:grid-cols-4">
        <Input
          type="number"
          value={form.score}
          onChange={(event) =>
            setForm((current) => ({ ...current, score: event.target.value }))
          }
          placeholder="Score"
          className="h-11 bg-slate-100"
        />
        <Input
          type="number"
          value={form.xp}
          onChange={(event) =>
            setForm((current) => ({ ...current, xp: event.target.value }))
          }
          placeholder="XP"
          className="h-11 bg-slate-100"
        />
        <Input
          type="number"
          value={form.correctCount}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              correctCount: event.target.value,
            }))
          }
          placeholder="Correct count"
          className="h-11 bg-slate-100"
        />
        <Input
          type="number"
          value={form.totalCount}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              totalCount: event.target.value,
            }))
          }
          placeholder="Total count"
          className="h-11 bg-slate-100"
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-black">Mistakes</p>
            <p className="text-xs font-semibold text-slate-500">
              Add review items one by one.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-xl font-black"
            onClick={() =>
              setForm((current) => ({
                ...current,
                mistakes: [
                  ...current.mistakes,
                  { id: createFormRowId("mistake"), text: "" },
                ],
              }))
            }
          >
            <Plus className="size-4" />
            Add mistake
          </Button>
        </div>
        <div className="mt-3 grid gap-2">
          {form.mistakes.map((mistake) => (
            <div
              key={mistake.id}
              className="grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_auto]"
            >
              <Input
                value={mistake.text}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    mistakes: current.mistakes.map((item) =>
                      item.id === mistake.id
                        ? { ...item, text: event.target.value }
                        : item
                    ),
                  }))
                }
                placeholder="Mistake text"
                className="h-10 bg-slate-100"
              />
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-xl text-rose-600"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    mistakes: current.mistakes.filter(
                      (item) => item.id !== mistake.id
                    ),
                  }))
                }
                aria-label="Remove mistake"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ExerciseCard({
  exercise,
  step,
  total,
  onEdit,
}: {
  exercise: LessonExercise;
  step: number;
  total: number;
  onEdit: () => void;
}) {
  const meta = exerciseTypeMeta[exercise.type];
  const Icon = meta.icon;

  return (
    <article className="relative grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[3.5rem_1fr_auto]">
      <div className="z-10 grid size-12 place-items-center rounded-full border-4 border-white bg-primary text-primary-foreground shadow-sm">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-500">
            Exercise {step}/{total}
          </span>
          <ExerciseTypeBadge type={exercise.type} />
          <Badge className="bg-white text-slate-700">{meta.label}</Badge>
        </div>
        <div className="mt-3">
          <ExercisePreview exercise={exercise} />
        </div>
      </div>
      <div className="flex items-start justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-xl font-black"
          onClick={onEdit}
        >
          <Edit3 className="size-4" />
          Edit
        </Button>
      </div>
    </article>
  );
}

function ExercisePreview({ exercise }: { exercise: LessonExercise }) {
  if (exercise.type === "learning") {
    return <LearningPreview exercise={exercise} />;
  }

  if (exercise.type === "sign_practice") {
    return <SignPracticePreview exercise={exercise} />;
  }

  if (exercise.type === "quiz") {
    return <QuizPreview exercise={exercise} />;
  }

  return <CompletionPreview exercise={exercise} />;
}

function LearningPreview({ exercise }: { exercise: LearningExercise }) {
  return (
    <div>
      <h3 className="text-lg font-black">{exercise.title}</h3>
      <p className="mt-1 text-sm font-semibold text-slate-600">
        {exercise.content}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {exercise.targetWord ? (
          <Badge className="bg-primary/10 text-primary">
            Target: {exercise.targetWord}
          </Badge>
        ) : null}
        {exercise.sampleSignVideoUrl ? (
          <Badge className="bg-cyan-100 text-cyan-800">
            <Video className="size-3" />
            Sample video
          </Badge>
        ) : null}
      </div>
      {exercise.examples?.length ? (
        <div className="mt-3 grid gap-2">
          {exercise.examples.map((example) => (
            <div
              key={`${example.text}-${example.translation ?? ""}`}
              className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-600"
            >
              {example.text}
              {example.translation ? (
                <span className="text-slate-400"> | {example.translation}</span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SignPracticePreview({
  exercise,
}: {
  exercise: SignPracticeExercise;
}) {
  const confidence = exercise.minConfidence ?? 0.75;

  return (
    <div>
      <h3 className="text-lg font-black">Practice: {exercise.targetWord}</h3>
      <p className="mt-1 text-sm font-semibold text-slate-600">
        {exercise.instruction ??
          "Record a short hand sign clip and compare it with the target word."}
      </p>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-slate-950 p-5 text-center text-white">
          <Camera className="mx-auto size-8" />
          <p className="mt-2 text-sm font-black">Camera preview area</p>
          <p className="mt-1 text-xs font-semibold text-slate-300">
            getUserMedia, facingMode user, audio false, cleanup on unmount.
          </p>
        </div>
        <div className="grid gap-2">
          <StatusRow icon={CheckCircle2} text="Permission states handled" />
          <StatusRow icon={PlayCircle} text="Record then analyze MVP" />
          <StatusRow
            icon={AlertCircle}
            text={`Correct if label matches and confidence >= ${confidence}`}
          />
          <StatusRow icon={RotateCcw} text={exercise.allowRetry ? "Retry enabled" : "Retry disabled"} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge className="bg-cyan-100 text-cyan-800">
          Max record: {exercise.maxRecordSeconds ?? 5}s
        </Badge>
        <Badge className="bg-emerald-100 text-emerald-800">
          Min confidence: {confidence}
        </Badge>
        {exercise.targetSignVideoUrl ? (
          <Badge className="bg-primary/10 text-primary">
            <Video className="size-3" />
            Target video
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

function QuizPreview({ exercise }: { exercise: QuizExercise }) {
  return (
    <div>
      <h3 className="text-lg font-black">{exercise.question}</h3>
      <p className="mt-1 text-sm font-semibold text-slate-600">
        Check is disabled until an option is selected; submitted answers lock
        option changes.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {exercise.options.map((option) => (
          <div
            key={option.id}
            className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-black text-slate-700"
          >
            <div className="flex items-center justify-between gap-2">
              <span>{option.text}</span>
              {option.isCorrect ? (
                <Badge className="bg-emerald-100 text-emerald-800">
                  Correct
                </Badge>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompletionPreview({ exercise }: { exercise: CompletionExercise }) {
  return (
    <div>
      <h3 className="text-lg font-black">
        {exercise.prompt ?? "Lesson complete"}
      </h3>
      <p className="mt-1 text-sm font-semibold text-slate-600">
        {exercise.explanation ??
          "Show completion state, score, mistakes, and reward summary."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge className="bg-emerald-100 text-emerald-800">
          XP: {exercise.xp ?? 0}
        </Badge>
        <Badge className="bg-primary/10 text-primary">
          Correct: {exercise.correctCount ?? 0}/{exercise.totalCount ?? 0}
        </Badge>
        <Badge className="bg-rose-100 text-rose-800">
          Mistakes: {exercise.mistakes?.length ?? 0}
        </Badge>
      </div>
      {exercise.mistakes?.length ? (
        <div className="mt-3 grid gap-2">
          {exercise.mistakes.map((mistake) => (
            <div
              key={mistake}
              className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-600"
            >
              {mistake}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function StatusRow({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-600">
      <Icon className="size-4 text-primary" />
      {text}
    </div>
  );
}
