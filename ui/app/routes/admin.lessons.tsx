import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  FileVideo,
  GraduationCap,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router";

import { lessonsApi } from "~/api/lessons";
import { topicsApi } from "~/api/topics";
import type { Lesson, Topic } from "~/api/types";
import { AdminShell } from "~/components/admin/admin-shell";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useGetTopicLessons } from "~/hooks/use-get-topics-lessons";
import { useGetTopics } from "~/hooks/use-get-topics";
import { cn } from "~/lib/utils";

type TopicFormState = {
  title: string;
  description: string;
};

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

const defaultTopicForm: TopicFormState = {
  title: "",
  description: "",
};

const defaultLessonForm: LessonFormState = {
  title: "",
  phrase: "",
  description: "",
  visual: "⭐",
  signHint: "",
  type: "vocabulary",
  difficulty: "Easy",
  xp: "10",
};

export default function AdminLessonsRoute() {
  const queryClient = useQueryClient();
  const { data: topics = [], isLoading: isTopicsLoading } = useGetTopics();
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [query, setQuery] = useState("");
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [topicForm, setTopicForm] = useState(defaultTopicForm);
  const [lessonForm, setLessonForm] = useState(defaultLessonForm);

  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId);
  const {
    data: topicLessons = [],
    isLoading: isLessonsLoading,
    isError: isLessonsError,
  } = useGetTopicLessons(selectedTopicId || undefined);

  useEffect(() => {
    if (!selectedTopicId && topics[0]) {
      setSelectedTopicId(topics[0].id);
    }
  }, [selectedTopicId, topics]);

  useEffect(() => {
    if (
      selectedTopicId &&
      topics.length > 0 &&
      !topics.some((topic) => topic.id === selectedTopicId)
    ) {
      setSelectedTopicId(topics[0].id);
    }
  }, [selectedTopicId, topics]);

  const filteredLessons = useMemo(
    () =>
      topicLessons.filter((lesson) =>
        `${lesson.title} ${lesson.phrase ?? ""} ${lesson.description ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query, topicLessons]
  );

  const createTopicMutation = useMutation({
    mutationFn: topicsApi.create,
    onSuccess: (topic) => {
      void queryClient.invalidateQueries({ queryKey: ["topics"] });
      setSelectedTopicId(topic.id);
      setTopicForm(defaultTopicForm);
      setShowTopicForm(false);
      setShowLessonForm(true);
    },
  });

  const createLessonMutation = useMutation({
    mutationFn: lessonsApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["lessons"] });
      setLessonForm(defaultLessonForm);
      setShowLessonForm(false);
      setQuery("");
    },
  });

  function handleCreateTopic(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = topicForm.title.trim();
    if (!title) return;

    createTopicMutation.mutate({
      title,
      description: topicForm.description.trim() || "New learning path.",
      icon: "BookOpen",
      color: "bg-primary/10 text-primary",
      sort_order: topics.length,
    });
  }

  function handleCreateLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTopic) return;

    const title = lessonForm.title.trim();
    const phrase = lessonForm.phrase.trim();
    if (!title || !phrase) return;

    createLessonMutation.mutate({
      topic_id: selectedTopic.id,
      type: lessonForm.type,
      title,
      phrase,
      description:
        lessonForm.description.trim() || `Practice the sign for ${phrase}.`,
      visual: lessonForm.visual.trim() || "⭐",
      sign_hint: lessonForm.signHint.trim() || "Add a sign hint for learners.",
      difficulty: lessonForm.difficulty,
      xp: Math.max(1, Number.parseInt(lessonForm.xp, 10) || 10),
      sort_order: topicLessons.length,
    });
  }

  return (
    <AdminShell title="Lessons" subtitle="Topics and learning content">
      <div className="space-y-5">
        <Card className="rounded-xl border border-slate-200 py-0">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-black">Topic paths and lessons</h1>
              <p className="text-sm font-semibold text-slate-500">
                Pick a topic path, then add lessons inside it.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl font-black"
                onClick={() => setShowTopicForm((current) => !current)}
              >
                <Plus className="size-4" />
                New topic
              </Button>
              <Button
                type="button"
                className="h-11 rounded-xl font-black"
                disabled={!selectedTopic}
                onClick={() => setShowLessonForm((current) => !current)}
              >
                <Plus className="size-4" />
                New lesson
              </Button>
            </div>
          </CardContent>
        </Card>

        {showTopicForm ? (
          <FormDialog
            title="New topic"
            subtitle="Create a topic path before adding lessons."
            onClose={() => setShowTopicForm(false)}
          >
            <form className="grid gap-3" onSubmit={handleCreateTopic}>
              <Input
                value={topicForm.title}
                onChange={(event) =>
                  setTopicForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Topic title"
                className="h-11 bg-slate-100"
              />
              <Input
                value={topicForm.description}
                onChange={(event) =>
                  setTopicForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Topic description"
                className="h-11 bg-slate-100"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="h-11 rounded-xl font-black"
                  disabled={createTopicMutation.isPending}
                >
                  Create topic
                </Button>
              </div>
            </form>
          </FormDialog>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[22rem_1fr]">
          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <div>
                <h2 className="text-lg font-black">Topics</h2>
                <p className="text-sm font-semibold text-slate-500">
                  {isTopicsLoading ? "Loading..." : `${topics.length} paths`}
                </p>
              </div>
              <BookOpen className="size-5 text-primary" />
            </div>
            <div className="grid gap-3 p-3">
              {topics.map((topic) => (
                <TopicButton
                  key={topic.id}
                  topic={topic}
                  active={topic.id === selectedTopicId}
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                    setQuery("");
                  }}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <Card className="rounded-xl border border-slate-200 py-0">
              <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="size-5 text-primary" />
                    <h2 className="text-lg font-black">
                      {selectedTopic?.title ?? "No topic selected"}
                    </h2>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {selectedTopic?.description ??
                      "Create a topic before adding lessons."}
                  </p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search this topic..."
                    className="h-11 bg-slate-100 pl-9 lg:w-72"
                    disabled={!selectedTopic}
                  />
                </div>
              </CardContent>
            </Card>

            {showLessonForm && selectedTopic ? (
              <FormDialog
                title="New lesson"
                subtitle={`Create a lesson inside ${selectedTopic.title}.`}
                onClose={() => setShowLessonForm(false)}
              >
                <LessonForm
                  form={lessonForm}
                  setForm={setLessonForm}
                  onSubmit={handleCreateLesson}
                  submitting={createLessonMutation.isPending}
                  submitLabel="Create lesson"
                />
              </FormDialog>
            ) : null}

            {isLessonsLoading ? (
              <p className="rounded-xl bg-white p-4 font-bold text-slate-600">
                Loading lessons...
              </p>
            ) : isLessonsError ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 font-bold text-rose-700">
                Unable to load lessons.
              </p>
            ) : filteredLessons.length ? (
              <div className="grid gap-3">
                {filteredLessons.map((lesson, index) => (
                  <LessonRow key={lesson.id} lesson={lesson} index={index} />
                ))}
              </div>
            ) : (
              <Card className="rounded-xl border border-dashed border-slate-300 py-0">
                <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
                  <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black">
                      {query ? "No lessons match this search" : "No lessons yet"}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {query
                        ? "Clear the search or add a new lesson to this topic."
                        : "Create the first lesson in this topic path."}
                    </p>
                  </div>
                  <Button
                    type="button"
                    className="h-11 rounded-xl font-black"
                    disabled={!selectedTopic}
                    onClick={() => setShowLessonForm(true)}
                  >
                    <Plus className="size-4" />
                    New lesson
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}

function TopicButton({
  topic,
  active,
  onClick,
}: {
  topic: Topic;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-left transition hover:border-primary/40 hover:bg-primary/5",
        active && "border-primary bg-primary/10"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-black">{topic.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-500">
            {topic.description}
          </p>
        </div>
        <Badge className="shrink-0 bg-white text-primary">
          {topic.lesson_count}
        </Badge>
      </div>
    </button>
  );
}

function signHintPreview(signHint: string | null): string {
  return (
    signHint
      ?.replace(/\s*Reference video:\s*https?:\/\/\S+/i, "")
      .replace(/\s+/g, " ")
      .trim() ?? ""
  );
}

function LessonRow({ lesson, index }: { lesson: Lesson; index: number }) {
  return (
    <Link
      to={`/admin/lessons/${lesson.id}`}
      className="block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="rounded-xl border border-slate-200 py-0 transition hover:border-primary/40 hover:bg-primary/5">
        <CardContent className="grid gap-4 p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-xl">
              {lesson.visual}
            </div>
            <div className="grid size-9 place-items-center rounded-full bg-slate-100 text-sm font-black text-slate-500">
              {index + 1}
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-black">{lesson.title}</h3>
              <Badge className="bg-primary/10 text-primary">
                {lesson.type === "communication" ? "Communication" : "Vocabulary"}
              </Badge>
              <Badge className="bg-amber-100 text-amber-800">
                <FileVideo className="size-3" />
                Placeholder
              </Badge>
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              {lesson.phrase ?? "-"}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
              {signHintPreview(lesson.sign_hint)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <Badge className="bg-slate-100 text-slate-700">
              {lesson.difficulty}
            </Badge>
            <Badge className="bg-emerald-100 text-emerald-800">
              {lesson.xp} XP
            </Badge>
            <span className="inline-flex h-7 items-center gap-1 rounded-full bg-primary px-2 text-xs font-black text-primary-foreground">
              Details
              <ArrowRight className="size-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function LessonForm({
  form,
  setForm,
  onSubmit,
  submitting,
  submitLabel,
}: {
  form: LessonFormState;
  setForm: React.Dispatch<React.SetStateAction<LessonFormState>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
  submitLabel: string;
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
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function FormDialog({
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
      aria-labelledby="admin-form-dialog-title"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4">
          <div>
            <h2 id="admin-form-dialog-title" className="text-xl font-black">
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
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
