import {
  BookOpen,
  FileVideo,
  GraduationCap,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { AdminShell } from "~/components/admin/admin-shell";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  readAdminLearningData,
  writeAdminLearningData,
  type AdminLearningData,
  type Lesson,
  type Topic,
} from "~/lib/learning-data";
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
  type: Lesson["type"];
  difficulty: Lesson["difficulty"];
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

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
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

function getTopicLessons(topic: Topic | undefined, data: AdminLearningData) {
  if (!topic) return [];

  const byId = new Map(data.lessons.map((lesson) => [lesson.id, lesson]));
  const orderedLessons = topic.lessonIds
    .map((lessonId) => byId.get(lessonId))
    .filter((lesson): lesson is Lesson => Boolean(lesson));
  const appendedLessons = data.lessons.filter(
    (lesson) => lesson.topicId === topic.id && !topic.lessonIds.includes(lesson.id)
  );

  return [...orderedLessons, ...appendedLessons];
}

export default function AdminLessonsRoute() {
  const [data, setData] = useState<AdminLearningData>(() =>
    readAdminLearningData()
  );
  const [selectedTopicId, setSelectedTopicId] = useState(
    data.topics[0]?.id ?? ""
  );
  const [query, setQuery] = useState("");
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [topicForm, setTopicForm] = useState(defaultTopicForm);
  const [lessonForm, setLessonForm] = useState(defaultLessonForm);

  useEffect(() => {
    const storedData = readAdminLearningData();
    setData(storedData);
    setSelectedTopicId((current) => current || storedData.topics[0]?.id || "");
  }, []);

  useEffect(() => {
    if (!data.topics.length) {
      setSelectedTopicId("");
      return;
    }

    if (!data.topics.some((topic) => topic.id === selectedTopicId)) {
      setSelectedTopicId(data.topics[0].id);
    }
  }, [data.topics, selectedTopicId]);

  const selectedTopic = data.topics.find(
    (topic) => topic.id === selectedTopicId
  );

  const topicLessons = useMemo(
    () => getTopicLessons(selectedTopic, data),
    [data, selectedTopic]
  );

  const filteredLessons = useMemo(
    () =>
      topicLessons.filter((lesson) =>
        `${lesson.title} ${lesson.phrase} ${lesson.description}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query, topicLessons]
  );

  function persistLearningData(nextData: AdminLearningData) {
    setData(nextData);
    writeAdminLearningData(nextData);
  }

  function handleCreateTopic(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = topicForm.title.trim();
    if (!title) return;

    const newTopic: Topic = {
      id: createUniqueId(
        title,
        data.topics.map((topic) => topic.id)
      ),
      title,
      description: topicForm.description.trim() || "New learning path.",
      icon: "BookOpen",
      color: "bg-primary/10 text-primary",
      lessonIds: [],
    };
    const nextData = {
      ...data,
      topics: [...data.topics, newTopic],
    };

    persistLearningData(nextData);
    setSelectedTopicId(newTopic.id);
    setTopicForm(defaultTopicForm);
    setShowTopicForm(false);
    setShowLessonForm(true);
    setQuery("");
  }

  function handleCreateLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTopic) return;

    const title = lessonForm.title.trim();
    const phrase = lessonForm.phrase.trim();
    if (!title || !phrase) return;

    const newLesson: Lesson = {
      id: createUniqueId(
        title,
        data.lessons.map((lesson) => lesson.id)
      ),
      topicId: selectedTopic.id,
      type: lessonForm.type,
      title,
      phrase,
      description:
        lessonForm.description.trim() || `Practice the sign for ${phrase}.`,
      visual: lessonForm.visual.trim() || "⭐",
      signHint: lessonForm.signHint.trim() || "Add a sign hint for learners.",
      difficulty: lessonForm.difficulty,
      xp: Math.max(1, Number.parseInt(lessonForm.xp, 10) || 10),
    };
    const nextData = {
      topics: data.topics.map((topic) =>
        topic.id === selectedTopic.id
          ? { ...topic, lessonIds: [...topic.lessonIds, newLesson.id] }
          : topic
      ),
      lessons: [...data.lessons, newLesson],
    };

    persistLearningData(nextData);
    setLessonForm(defaultLessonForm);
    setShowLessonForm(false);
    setQuery("");
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
          <Card className="rounded-xl border border-primary/30 bg-primary/5 py-0">
            <CardContent className="p-4">
              <form className="grid gap-3 md:grid-cols-[1fr_1.4fr_auto]" onSubmit={handleCreateTopic}>
                <Input
                  value={topicForm.title}
                  onChange={(event) =>
                    setTopicForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Topic title"
                  className="h-11 bg-white"
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
                  className="h-11 bg-white"
                />
                <Button type="submit" className="h-11 rounded-xl font-black">
                  Create topic
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[22rem_1fr]">
          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <div>
                <h2 className="text-lg font-black">Topics</h2>
                <p className="text-sm font-semibold text-slate-500">
                  {data.topics.length} paths
                </p>
              </div>
              <BookOpen className="size-5 text-primary" />
            </div>
            <div className="grid gap-3 p-3">
              {data.topics.map((topic) => {
                const lessonCount = getTopicLessons(topic, data).length;
                const active = topic.id === selectedTopicId;

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => {
                      setSelectedTopicId(topic.id);
                      setQuery("");
                    }}
                    className={cn(
                      "w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-left transition hover:border-primary/40 hover:bg-primary/5",
                      active && "border-primary bg-primary/10"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-black">
                          {topic.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-500">
                          {topic.description}
                        </p>
                      </div>
                      <Badge className="shrink-0 bg-white text-primary">
                        {lessonCount}
                      </Badge>
                    </div>
                  </button>
                );
              })}
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
                    className="h-11 bg-white pl-9 lg:w-72"
                    disabled={!selectedTopic}
                  />
                </div>
              </CardContent>
            </Card>

            {showLessonForm && selectedTopic ? (
              <Card className="rounded-xl border border-primary/30 bg-primary/5 py-0">
                <CardContent className="p-4">
                  <form className="grid gap-3" onSubmit={handleCreateLesson}>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        value={lessonForm.title}
                        onChange={(event) =>
                          setLessonForm((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        placeholder="Lesson title"
                        className="h-11 bg-white"
                      />
                      <Input
                        value={lessonForm.phrase}
                        onChange={(event) =>
                          setLessonForm((current) => ({
                            ...current,
                            phrase: event.target.value,
                          }))
                        }
                        placeholder="Word or phrase"
                        className="h-11 bg-white"
                      />
                    </div>
                    <div className="grid gap-3 md:grid-cols-[1fr_7rem_10rem_10rem_7rem]">
                      <Input
                        value={lessonForm.description}
                        onChange={(event) =>
                          setLessonForm((current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                        placeholder="Lesson description"
                        className="h-11 bg-white"
                      />
                      <Input
                        value={lessonForm.visual}
                        onChange={(event) =>
                          setLessonForm((current) => ({
                            ...current,
                            visual: event.target.value,
                          }))
                        }
                        placeholder="Visual"
                        className="h-11 bg-white"
                      />
                      <select
                        value={lessonForm.type}
                        onChange={(event) =>
                          setLessonForm((current) => ({
                            ...current,
                            type: event.target.value as Lesson["type"],
                          }))
                        }
                        className="h-11 rounded-lg border border-input bg-white px-2.5 text-sm font-semibold outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <option value="vocabulary">Vocabulary</option>
                        <option value="communication">Communication</option>
                      </select>
                      <select
                        value={lessonForm.difficulty}
                        onChange={(event) =>
                          setLessonForm((current) => ({
                            ...current,
                            difficulty: event.target
                              .value as Lesson["difficulty"],
                          }))
                        }
                        className="h-11 rounded-lg border border-input bg-white px-2.5 text-sm font-semibold outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                      </select>
                      <Input
                        type="number"
                        min="1"
                        value={lessonForm.xp}
                        onChange={(event) =>
                          setLessonForm((current) => ({
                            ...current,
                            xp: event.target.value,
                          }))
                        }
                        placeholder="XP"
                        className="h-11 bg-white"
                      />
                    </div>
                    <textarea
                      value={lessonForm.signHint}
                      onChange={(event) =>
                        setLessonForm((current) => ({
                          ...current,
                          signHint: event.target.value,
                        }))
                      }
                      placeholder="Sign hint"
                      className="min-h-24 rounded-lg border border-input bg-white px-2.5 py-2 text-sm font-semibold outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" className="h-11 rounded-xl font-black">
                        Create lesson
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : null}

            {filteredLessons.length ? (
              <div className="grid gap-3">
                {filteredLessons.map((lesson, index) => (
                  <Card
                    key={lesson.id}
                    className="rounded-xl border border-slate-200 py-0"
                  >
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
                          <h3 className="text-base font-black">
                            {lesson.title}
                          </h3>
                          <Badge className="bg-primary/10 text-primary">
                            {lesson.type === "communication"
                              ? "Communication"
                              : "Vocabulary"}
                          </Badge>
                          <Badge className="bg-amber-100 text-amber-800">
                            <FileVideo className="size-3" />
                            Placeholder
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-slate-600">
                          {lesson.phrase}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {lesson.signHint}
                        </p>
                      </div>
                      <div className="flex gap-2 md:justify-end">
                        <Badge className="bg-slate-100 text-slate-700">
                          {lesson.difficulty}
                        </Badge>
                        <Badge className="bg-emerald-100 text-emerald-800">
                          {lesson.xp} XP
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
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
