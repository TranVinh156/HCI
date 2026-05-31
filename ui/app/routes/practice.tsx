import type { FormEvent, KeyboardEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Copy,
  Library,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Link } from "react-router";
import type { Lesson, QuizQuestion, Topic } from "~/api/types";

import { StudentShell } from "~/components/learning/student-shell";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  BlockyCard,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { cn } from "~/lib/utils";
import { useInfiniteLessons } from "~/hooks/use-get-lessons";
import { useGetQuestions } from "~/hooks/use-get-topic-questions";
import { useGetTopics } from "~/hooks/use-get-topics";

const trainingTabs = [
  { id: "quizzes", label: "Quizzes", icon: ClipboardCheck },
  { id: "flashcards", label: "Flash cards", icon: BookOpen },
] as const;

const flashcardModes = [
  { id: "public", label: "Public", icon: Library },
  { id: "custom", label: "Tự tạo", icon: User },
] as const;

type TrainingTab = (typeof trainingTabs)[number]["id"];
type FlashcardMode = (typeof flashcardModes)[number]["id"];

type FlashcardSource = "public" | "custom";

type Flashcard = {
  id: string;
  source: FlashcardSource;
  front: string;
  back: string;
  hint?: string;
  tag: string;
};

type FlashcardDeck = {
  id: string;
  source: FlashcardSource;
  title: string;
  description?: string | null;
  lessonCount?: number;
  cards: Flashcard[];
};

type FlashcardDraft = {
  front: string;
  back: string;
  tag: string;
};

const customFlashcardsStorageKey = "hihihaha.custom-flashcards";
const PUBLIC_FLASHCARD_PAGE_SIZE = 12;

const starterCustomFlashcards: Flashcard[] = [
  {
    id: "custom-starter-hello",
    source: "custom",
    front: "Hello",
    back: "Palm out, move your hand away from your forehead.",
    hint: "Greeting",
    tag: "My deck",
  },
];

export default function PracticeRoute() {
  const [activeTrainingTab, setActiveTrainingTab] =
    useState<TrainingTab>("quizzes");
  const [activeFlashcardMode, setActiveFlashcardMode] =
    useState<FlashcardMode>("public");
  const publicFlashcardsEnabled =
    activeTrainingTab === "flashcards" && activeFlashcardMode === "public";
  const { data: topics = [], isLoading, isError } = useGetTopics();
  const {
    data: questions = [],
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
  } = useGetQuestions(activeTrainingTab === "quizzes");
  const {
    data: publicLessonPages,
    isLoading: isPublicFlashcardsLoading,
    isError: isPublicFlashcardsError,
    hasNextPage: hasNextPublicFlashcardPage,
    fetchNextPage: fetchNextPublicFlashcardPage,
    isFetchingNextPage: isFetchingNextPublicFlashcardPage,
  } = useInfiniteLessons(
    { pageSize: PUBLIC_FLASHCARD_PAGE_SIZE },
    { enabled: publicFlashcardsEnabled }
  );
  const quizTopics = getTopicQuizzes(topics, questions);
  const publicFlashcardLessons = useMemo(() => {
    const lessons: Lesson[] = [];

    for (const page of publicLessonPages?.pages ?? []) {
      lessons.push(...page.items);
    }

    return lessons;
  }, [publicLessonPages]);
  const publicFlashcardDecks = useMemo(
    () => getPublicFlashcardDecks(topics, publicFlashcardLessons),
    [topics, publicFlashcardLessons]
  );
  const [customFlashcards, setCustomFlashcards] = useState<Flashcard[]>(
    starterCustomFlashcards
  );
  const customFlashcardDecks = useMemo(
    () => getCustomFlashcardDecks(customFlashcards),
    [customFlashcards]
  );
  const [customCardsLoaded, setCustomCardsLoaded] = useState(false);
  const [draft, setDraft] = useState<FlashcardDraft>({
    front: "",
    back: "",
    tag: "My deck",
  });
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const loadMorePublicFlashcards = useCallback(
    () => fetchNextPublicFlashcardPage(),
    [fetchNextPublicFlashcardPage]
  );

  useEffect(() => {
    try {
      const storedCards = window.localStorage.getItem(
        customFlashcardsStorageKey
      );

      if (storedCards) {
        const parsedCards = JSON.parse(storedCards) as Flashcard[];

        if (Array.isArray(parsedCards)) {
          setCustomFlashcards(
            parsedCards
              .filter((card) => Boolean(card.front?.trim() && card.back?.trim()))
              .map((card) => ({
                ...card,
                source: "custom",
                tag: card.tag?.trim() || "My deck",
              }))
          );
        }
      }
    } catch {
      setCustomFlashcards(starterCustomFlashcards);
    } finally {
      setCustomCardsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!customCardsLoaded) {
      return;
    }

    window.localStorage.setItem(
      customFlashcardsStorageKey,
      JSON.stringify(customFlashcards)
    );
  }, [customCardsLoaded, customFlashcards]);

  function submitCustomFlashcard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const front = draft.front.trim();
    const back = draft.back.trim();
    const tag = draft.tag.trim() || "My deck";

    if (!front || !back) {
      return;
    }

    if (editingCardId) {
      setCustomFlashcards((currentCards) =>
        currentCards.map((card) =>
          card.id === editingCardId
            ? {
              ...card,
              front,
              back,
              tag,
            }
            : card
        )
      );
      setDraft({ front: "", back: "", tag });
      setEditingCardId(null);
      setActiveFlashcardMode("custom");
      return;
    }

    setCustomFlashcards((currentCards) => [
      {
        id: createCustomFlashcardId(),
        source: "custom",
        front,
        back,
        tag,
      },
      ...currentCards,
    ]);
    setDraft({ front: "", back: "", tag });
    setActiveFlashcardMode("custom");
  }

  function editCustomFlashcard(card: Flashcard) {
    setDraft({
      front: card.front,
      back: card.back,
      tag: card.tag,
    });
    setEditingCardId(card.id);
    setActiveFlashcardMode("custom");
  }

  function cloneCustomFlashcard(card: Flashcard) {
    setCustomFlashcards((currentCards) => [
      {
        ...card,
        id: createCustomFlashcardId(),
        source: "custom",
      },
      ...currentCards,
    ]);
    setActiveFlashcardMode("custom");
  }

  function deleteCustomFlashcard(cardId: string) {
    setCustomFlashcards((currentCards) =>
      currentCards.filter((card) => card.id !== cardId)
    );

    if (editingCardId === cardId) {
      setEditingCardId(null);
      setDraft({ front: "", back: "", tag: "My deck" });
    }
  }

  function cancelCustomFlashcardEdit() {
    setEditingCardId(null);
    setDraft({ front: "", back: "", tag: "My deck" });
  }

  return (
    <StudentShell>
      <div className="space-y-6">
        <SegmentedTabs
          tabs={trainingTabs}
          activeTab={activeTrainingTab}
          onTabChange={setActiveTrainingTab}
          ariaLabel="Training sections"
        />

        {activeTrainingTab === "quizzes" ? (
          <section
            id="training-panel-quizzes"
            role="tabpanel"
            aria-labelledby="training-tab-quizzes"
          >
            <QuizTopicGrid
              quizTopics={quizTopics}
              isLoading={isLoading || isQuestionsLoading}
              isError={isError || isQuestionsError}
            />
          </section>
        ) : (
          <section
            id="training-panel-flashcards"
            role="tabpanel"
            aria-labelledby="training-tab-flashcards"
            className="space-y-5"
          >
            {/* <div className="flex flex-col gap-4 rounded-[1.75rem] border-2 border-[#036678] bg-white p-4 shadow-[2px_4px_0_#036678] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-black leading-tight">
                  Flash cards
                </h1>
                <p className="text-sm font-semibold text-slate-600">
                  {activeFlashcardMode === "public"
                    ? `${publicFlashcardDecks.length} public decks, ${publicFlashcardLessons.length} lessons loaded`
                    : `${customFlashcardDecks.length} tự tạo decks, ${customFlashcards.length} cards`}
                </p>
              </div>
              <SegmentedTabs
                tabs={flashcardModes}
                activeTab={activeFlashcardMode}
                onTabChange={setActiveFlashcardMode}
                ariaLabel="Flash card decks"
                className="sm:w-fit"
                buttonClassName="sm:w-32"
                tabIdPrefix="flashcard"
                controlledPanelId="flashcard-panel"
              />
            </div> */}

            <QuizTopicGrid
              quizTopics={quizTopics}
              isLoading={isLoading || isQuestionsLoading}
              isError={isError || isQuestionsError}
            />

            <div
              id="flashcard-panel"
              role="tabpanel"
              aria-labelledby={`flashcard-tab-${activeFlashcardMode}`}
              className="space-y-5"
            >
              {activeFlashcardMode === "custom" ? (
                <form
                  onSubmit={submitCustomFlashcard}
                  className="grid gap-3 rounded-[1.75rem] border-2 border-[#036678] bg-white p-4 shadow-[2px_4px_0_#036678] md:grid-cols-[1fr_1fr_12rem_auto]"
                >
                  {editingCardId ? (
                    <div className="flex items-center justify-between gap-3 md:col-span-full">
                      <p className="text-sm font-black text-slate-700">
                        Editing flash card
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={cancelCustomFlashcardEdit}
                        className="h-9 rounded-2xl px-3 font-black"
                      >
                        <X className="size-4" />
                        Cancel
                      </Button>
                    </div>
                  ) : null}
                  <label className="grid gap-1 text-sm font-black text-slate-700">
                    Front
                    <Input
                      value={draft.front}
                      onChange={(event) =>
                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          front: event.target.value,
                        }))
                      }
                      className="h-11 rounded-2xl bg-white font-semibold"
                      placeholder="Phrase or question"
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-black text-slate-700">
                    Back
                    <Input
                      value={draft.back}
                      onChange={(event) =>
                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          back: event.target.value,
                        }))
                      }
                      className="h-11 rounded-2xl bg-white font-semibold"
                      placeholder="Answer or sign note"
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-black text-slate-700">
                    Deck
                    <Input
                      value={draft.tag}
                      onChange={(event) =>
                        setDraft((currentDraft) => ({
                          ...currentDraft,
                          tag: event.target.value,
                        }))
                      }
                      className="h-11 rounded-2xl bg-white font-semibold"
                      placeholder="My deck"
                    />
                  </label>
                  <Button
                    type="submit"
                    className="mt-auto h-11 rounded-2xl font-black"
                  >
                    {editingCardId ? (
                      <Pencil className="size-5" />
                    ) : (
                      <Plus className="size-5" />
                    )}
                    {editingCardId ? "Save" : "Add"}
                  </Button>
                </form>
              ) : null}

              <FlashcardGrid
                decks={
                  activeFlashcardMode === "public"
                    ? publicFlashcardDecks
                    : customFlashcardDecks
                }
                isLoading={
                  activeFlashcardMode === "public" &&
                  (isLoading || isPublicFlashcardsLoading)
                }
                isError={
                  activeFlashcardMode === "public" &&
                  (isError || isPublicFlashcardsError)
                }
                emptyMessage={
                  activeFlashcardMode === "public"
                    ? "No public flash cards yet."
                    : "No tự tạo flash cards yet."
                }
                onDelete={
                  activeFlashcardMode === "custom"
                    ? deleteCustomFlashcard
                    : undefined
                }
                onEdit={
                  activeFlashcardMode === "custom"
                    ? editCustomFlashcard
                    : undefined
                }
                onClone={
                  activeFlashcardMode === "custom"
                    ? cloneCustomFlashcard
                    : undefined
                }
                hasMore={
                  activeFlashcardMode === "public" &&
                  Boolean(hasNextPublicFlashcardPage)
                }
                isLoadingMore={
                  activeFlashcardMode === "public" &&
                  isFetchingNextPublicFlashcardPage
                }
                onLoadMore={
                  activeFlashcardMode === "public"
                    ? loadMorePublicFlashcards
                    : undefined
                }
              />
            </div>
          </section>
        )}
      </div>
    </StudentShell>
  );
}

type SegmentedTabItem<T extends string> = {
  id: T;
  label: string;
  icon: LucideIcon;
};

type SegmentedTabsProps<T extends string> = {
  tabs: readonly SegmentedTabItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  ariaLabel: string;
  className?: string;
  buttonClassName?: string;
  tabIdPrefix?: string;
  controlledPanelId?: string;
};

function SegmentedTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel,
  className,
  buttonClassName,
  tabIdPrefix = "training",
  controlledPanelId,
}: SegmentedTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={(event) =>
        handleTabListKeyDown(event, tabs, activeTab, onTabChange)
      }
      className={cn(
        "flex w-full gap-2 rounded-[1.75rem] border-2 border-[#036678] bg-white p-1.5 sm:w-fit",
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const selected = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`${tabIdPrefix}-tab-${tab.id}`}
            data-tab-id={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={controlledPanelId ?? `${tabIdPrefix}-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex h-12 flex-1 items-center justify-center gap-2 rounded-[1.25rem] px-4 text-sm font-black transition-colors sm:w-40 sm:flex-none",
              selected
                ? "bg-primary text-primary-foreground"
                : "text-slate-600 hover:bg-primary/10 hover:text-primary",
              buttonClassName
            )}
          >
            <Icon className="size-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

type QuizTopicGridProps = {
  quizTopics: { topic: Topic; questionCount: number }[];
  isLoading: boolean;
  isError: boolean;
};

function QuizTopicGrid({
  quizTopics,
  isLoading,
  isError
}: QuizTopicGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {isLoading ? (
        <LoadingSpinner
          label="Loading quizzes"
          className="py-8 md:col-span-2 xl:col-span-3"
        />
      ) : isError ? (
        <p className="font-bold">Unable to load quizzes.</p>
      ) : quizTopics.length ? (
        quizTopics.map(({ topic, questionCount }) => (
          <Card
            key={topic.id}
            className="rounded-[2rem] border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
          >
            <Link
              to={`/topic-quiz-history/${topic.id}`}
              className="block rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <CardHeader>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <ClipboardCheck className="size-7" />
                  </div>
                  <Badge className="bg-primary/10 text-primary">
                    {questionCount} questions
                  </Badge>
                </div>
                <CardTitle className="text-xl font-black">
                  {topic.title}
                </CardTitle>
                <CardDescription className="font-semibold">
                  {topic.description ??
                    "Practice all quiz questions in this topic."}
                </CardDescription>
              </CardHeader>
            </Link>
            <CardContent>
              <Button asChild className="h-12 w-full rounded-2xl font-black">
                <Link to={`/topic-quiz/${topic.id}`}>
                  Start quiz
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="font-bold">No quizzes yet.</p>
      )}
    </div>
  );
}

type FlashcardGridProps = {
  decks: FlashcardDeck[];
  isLoading: boolean;
  isError: boolean;
  emptyMessage: string;
  onDelete?: (cardId: string) => void;
  onEdit?: (card: Flashcard) => void;
  onClone?: (card: Flashcard) => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => Promise<unknown> | void;
};

function FlashcardGrid({
  decks,
  isLoading,
  isError,
  emptyMessage,
  onDelete,
  onEdit,
  onClone,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: FlashcardGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreNodeRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = useRef(false);
  const canLoadMore = Boolean(hasMore && onLoadMore && !isLoadingMore);
  const cardCount = getDeckCardCount(decks);

  const loadMore = useCallback(() => {
    if (!hasMore || !onLoadMore || loadingMoreRef.current) return;

    loadingMoreRef.current = true;
    void Promise.resolve(onLoadMore()).finally(() => {
      loadingMoreRef.current = false;
    });
  }, [hasMore, onLoadMore]);

  useEffect(() => {
    if (!isLoadingMore) {
      loadingMoreRef.current = false;
    }
  }, [isLoadingMore]);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      loadMoreNodeRef.current = node;
      observerRef.current?.disconnect();

      if (!node || !hasMore) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            loadMore();
          }
        },
        { rootMargin: "320px 0px" }
      );

      observerRef.current.observe(node);
    },
    [hasMore, loadMore]
  );

  useEffect(() => {
    if (!canLoadMore) return;

    function loadIfNearBottom() {
      const node = loadMoreNodeRef.current;
      if (!node) return;

      const { top } = node.getBoundingClientRect();
      if (top <= window.innerHeight + 320) {
        loadMore();
      }
    }

    window.addEventListener("scroll", loadIfNearBottom, { passive: true });
    window.addEventListener("resize", loadIfNearBottom);
    loadIfNearBottom();

    return () => {
      window.removeEventListener("scroll", loadIfNearBottom);
      window.removeEventListener("resize", loadIfNearBottom);
    };
  }, [canLoadMore, cardCount, loadMore]);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner label="Loading flash cards" className="py-8" />;
  }

  if (isError) {
    return <p className="font-bold">Unable to load flash cards.</p>;
  }

  if (!decks.length && !hasMore) {
    return <p className="font-bold">{emptyMessage}</p>;
  }

  return (
    <>
      <div className="space-y-8">
        {decks.map((deck) => (
          <FlashcardDeckSection
            key={deck.id}
            deck={deck}
            onDelete={onDelete}
            onEdit={onEdit}
            onClone={onClone}
          />
        ))}
      </div>
      {hasMore ? (
        <div ref={loadMoreRef} className="flex justify-center py-5">
          <div
            role="status"
            aria-live="polite"
            aria-label={
              isLoadingMore
                ? "Loading more flash cards"
                : "More flash cards available"
            }
            className="inline-flex h-11 items-center gap-1.5 "
          >
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="size-2.5 animate-bounce rounded-full bg-primary [animation-duration:0.8s]"
                style={{ animationDelay: `${dot * 120}ms` }}
              />
            ))}
            <span className="sr-only">
              {isLoadingMore
                ? "Loading more flash cards..."
                : "More flash cards available"}
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}

type FlashcardDeckSectionProps = {
  deck: FlashcardDeck;
  onDelete?: (cardId: string) => void;
  onEdit?: (card: Flashcard) => void;
  onClone?: (card: Flashcard) => void;
};

function FlashcardDeckSection({
  deck,
  onDelete,
  onEdit,
  onClone,
}: FlashcardDeckSectionProps) {
  const titleId = `flashcard-deck-${deck.id}`;
  const DeckIcon = deck.source === "public" ? Library : User;

  return (
    <section aria-labelledby={titleId} className="space-y-3">
      <div className="flex flex-col gap-3 border-b-2 border-[#036678]/20 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <DeckIcon className="size-5" />
          </div>
          <div className="min-w-0">
            <h2
              id={titleId}
              className="truncate text-xl font-black leading-tight text-slate-950"
            >
              {deck.title}
            </h2>
            {deck.description ? (
              <p className="mt-1 max-w-2xl text-sm font-semibold text-slate-600">
                {deck.description}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Badge className="bg-primary/10 text-primary">
            {deck.cards.length} cards
          </Badge>
          {deck.lessonCount ? (
            <Badge variant="outline">{deck.lessonCount} lessons</Badge>
          ) : null}
        </div>
      </div>
      {deck.cards.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {deck.cards.map((card) => (
            <FlipFlashcard
              key={card.id}
              card={card}
              onDelete={onDelete}
              onEdit={onEdit}
              onClone={onClone}
            />
          ))}
        </div>
      ) : (
        <p className="font-bold text-slate-600">No cards in this deck.</p>
      )}
    </section>
  );
}

type FlipFlashcardProps = {
  card: Flashcard;
  onDelete?: (cardId: string) => void;
  onEdit?: (card: Flashcard) => void;
  onClone?: (card: Flashcard) => void;
};

function FlipFlashcard({
  card,
  onDelete,
  onEdit,
  onClone,
}: FlipFlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasActions = Boolean(onEdit || onClone || onDelete);

  return (
    <BlockyCard className="group/flashcard relative h-72 overflow-visible bg-transparent p-0 shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none">
      <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[1.75rem] border-2 border-[#036678] bg-[#036678]" />
      <button
        type="button"
        onClick={() => setIsFlipped((currentValue) => !currentValue)}
        aria-pressed={isFlipped}
        aria-label={`${card.front}: ${isFlipped ? card.back : "front"}`}
        title="Flip"
        className="relative h-full w-full rounded-[1.75rem] text-left outline-none [perspective:1200px] focus-visible:ring-4 focus-visible:ring-primary/30"
      >
        <div
          className="relative h-full w-full transition-transform duration-500 ease-out [transform-style:preserve-3d]"
          style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          <div
            aria-hidden={isFlipped}
            className="absolute inset-0 flex flex-col justify-between rounded-[1.75rem] border-2 border-[#036678] bg-white p-5 shadow-[inset_0_-8px_0_#e8f4f7] [backface-visibility:hidden]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <FlashcardFaceHeader
              label="Question"
              source={card.source}
            />
            <p className="max-h-36 overflow-auto break-words text-center text-xl font-black leading-snug text-slate-900 sm:text-2xl">
              {card.front}
            </p>
            <FlashcardFaceFooter isFlipped={isFlipped} />
          </div>

          <div
            aria-hidden={!isFlipped}
            className="absolute inset-0 flex flex-col justify-between rounded-[1.75rem] border-2 border-[#036678] bg-[#123040] p-5 text-white shadow-[inset_0_-8px_0_rgba(255,255,255,0.18)] [backface-visibility:hidden]"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <FlashcardFaceHeader
              label="Answer"
              source={card.source}
              inverted
            />
            <div className="space-y-3 overflow-auto text-center">
              <p className="break-words text-xl font-black leading-snug sm:text-2xl">
                {card.back}
              </p>
              {card.hint ? (
                <p className="break-words text-sm font-semibold text-cyan-100">
                  {card.hint}
                </p>
              ) : null}
            </div>
            <FlashcardFaceFooter isFlipped={isFlipped} inverted />
          </div>
        </div>
      </button>

      {hasActions ? (
        <div className="absolute right-2 top-2 z-20 flex gap-1 rounded-full border-2 border-[#036678] bg-[#036678] p-1 opacity-100 transition-all duration-200 sm:-right-3 sm:top-3 sm:pointer-events-none sm:translate-x-2 sm:opacity-0 sm:group-hover/flashcard:pointer-events-auto sm:group-hover/flashcard:translate-x-0 sm:group-hover/flashcard:opacity-100 sm:group-focus-within/flashcard:pointer-events-auto sm:group-focus-within/flashcard:translate-x-0 sm:group-focus-within/flashcard:opacity-100">
          {onEdit ? (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => onEdit(card)}
              className="rounded-full bg-white"
              aria-label={`Edit ${card.front}`}
              title="Edit"
            >
              <Pencil className="size-4" />
            </Button>
          ) : null}
          {onClone ? (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => onClone(card)}
              className="rounded-full bg-white"
              aria-label={`Clone ${card.front}`}
              title="Clone"
            >
              <Copy className="size-4" />
            </Button>
          ) : null}
          {onDelete ? (
            <Button
              type="button"
              variant="destructive"
              size="icon-sm"
              onClick={() => onDelete(card.id)}
              className="rounded-full bg-white"
              aria-label={`Delete ${card.front}`}
              title="Delete"
            >
              <Trash2 className="size-4" />
            </Button>
          ) : null}
        </div>
      ) : null}
    </BlockyCard>
  );
}

type FlashcardFaceHeaderProps = {
  label: string;
  source: FlashcardSource;
  inverted?: boolean;
};

function FlashcardFaceHeader({
  label,
  source,
  inverted = false,
}: FlashcardFaceHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={cn(
          "text-xs font-black uppercase",
          inverted ? "text-cyan-100" : "text-slate-500"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "rounded-full px-2 py-1 text-xs font-black",
          inverted
            ? "bg-white/10 text-cyan-100"
            : "bg-primary/10 text-primary"
        )}
      >
        {source === "public" ? "Public" : "Custom"}
      </span>
    </div>
  );
}

type FlashcardFaceFooterProps = {
  isFlipped: boolean;
  inverted?: boolean;
};

function FlashcardFaceFooter({
  isFlipped,
  inverted = false,
}: FlashcardFaceFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 text-xs font-black",
        inverted ? "text-cyan-100" : "text-slate-500"
      )}
    >
      <RotateCcw className="size-4" />
      {isFlipped ? "Back" : "Front"}
    </div>
  );
}

function getTopicQuizzes(topics: Topic[], questions: QuizQuestion[]) {
  const questionCountByTopicId = questions.reduce((countMap, question) => {
    countMap.set(question.topic_id, (countMap.get(question.topic_id) ?? 0) + 1);
    return countMap;
  }, new Map<string, number>());

  return topics
    .map((topic) => ({
      topic,
      questionCount: questionCountByTopicId.get(topic.id) ?? 0,
    }))
    .filter((quiz) => quiz.questionCount > 0);
}

function getPublicFlashcardDecks(
  topics: Topic[],
  lessons: Lesson[]
): FlashcardDeck[] {
  const topicById = new Map(topics.map((topic) => [topic.id, topic]));
  const deckByTopicId = new Map<string, FlashcardDeck>();
  const decks: FlashcardDeck[] = [];

  for (const lesson of lessons) {
    const topic = topicById.get(lesson.topic_id);
    const deckTitle = topic?.title ?? "Public deck";
    let deck = deckByTopicId.get(lesson.topic_id);

    if (!deck) {
      deck = {
        id: `public-${lesson.topic_id}`,
        source: "public",
        title: deckTitle,
        description: topic?.description,
        lessonCount: 0,
        cards: [],
      };
      deckByTopicId.set(lesson.topic_id, deck);
      decks.push(deck);
    }

    deck.lessonCount = (deck.lessonCount ?? 0) + 1;

    for (const question of lesson.questions ?? []) {
      deck.cards.push({
        id: `public-${question.id}`,
        source: "public",
        front: question.prompt,
        back: question.answer || lesson.phrase || lesson.title,
        hint: question.hint ?? getAnswerOptionsHint(question),
        tag: deckTitle,
      });
    }
  }

  return decks.filter((deck) => deck.cards.length > 0);
}

function getCustomFlashcardDecks(cards: Flashcard[]): FlashcardDeck[] {
  const deckByTag = new Map<string, FlashcardDeck>();
  const decks: FlashcardDeck[] = [];

  for (const card of cards) {
    const title = card.tag.trim() || "My deck";
    const key = title.toLowerCase();
    let deck = deckByTag.get(key);

    if (!deck) {
      deck = {
        id: `custom-${slugifyDeckId(title) || decks.length + 1}`,
        source: "custom",
        title,
        cards: [],
      };
      deckByTag.set(key, deck);
      decks.push(deck);
    }

    deck.cards.push({ ...card, tag: title });
  }

  return decks;
}

function getDeckCardCount(decks: FlashcardDeck[]) {
  return decks.reduce((count, deck) => count + deck.cards.length, 0);
}

function getAnswerOptionsHint(question: QuizQuestion) {
  const distractors = question.options.filter(
    (option) => option !== question.answer
  );

  if (!distractors.length) {
    return undefined;
  }

  return `Also seen with: ${distractors.slice(0, 2).join(", ")}`;
}

function createCustomFlashcardId() {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugifyDeckId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function handleTabListKeyDown<T extends string>(
  event: KeyboardEvent<HTMLDivElement>,
  tabs: readonly SegmentedTabItem<T>[],
  activeTab: T,
  onTabChange: (tab: T) => void
) {
  const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const lastIndex = tabs.length - 1;
  let nextIndex: number | null = null;

  if (event.key === "ArrowRight") {
    nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
  } else if (event.key === "ArrowLeft") {
    nextIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = lastIndex;
  }

  if (nextIndex === null) {
    return;
  }

  event.preventDefault();

  const nextTab = tabs[nextIndex];
  onTabChange(nextTab.id);
  event.currentTarget
    .querySelector<HTMLButtonElement>(`[data-tab-id="${nextTab.id}"]`)
    ?.focus();
}
