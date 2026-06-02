import type { KeyboardEvent, PointerEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  ExternalLink,
  Pencil,
  RotateCcw,
  Trash2,
  Video,
  XCircle,
} from "lucide-react";
import { Link } from "react-router";
import type { Lesson, QuizQuestion, Topic } from "~/api/types";

import { StudentShell } from "~/components/learning/student-shell";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  BlockyCard,
  CardContent,
} from "~/components/ui/card";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { cn } from "~/lib/utils";
import { useGetLessonsPage } from "~/hooks/use-get-lessons";
import { useGetQuestions } from "~/hooks/use-get-topic-questions";
import { useGetTopics } from "~/hooks/use-get-topics";

const trainingTabs = [
  { id: "quizzes", label: "Quizzes", icon: ClipboardCheck },
  { id: "flashcards", label: "Flash cards", icon: BookOpen },
] as const;

type TrainingTab = (typeof trainingTabs)[number]["id"];

type FlashcardSource = "public" | "custom";

type Flashcard = {
  id: string;
  source: FlashcardSource;
  front: string;
  back: string;
  videoUrl?: string | null;
  videoEmbedUrl?: string | null;
  videoKind?: "video" | "youtube" | "link" | null;
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

const PUBLIC_FLASHCARD_PAGE_SIZE = 12;
const FLASHCARD_TAP_MAX_DRAG = 8;
const FLASHCARD_SWIPE_THRESHOLD = 110;

export default function PracticeRoute() {
  const [activeTrainingTab, setActiveTrainingTab] =
    useState<TrainingTab>("quizzes");
  const [selectedFlashcardTopicId, setSelectedFlashcardTopicId] =
    useState<string | null>(null);
  const publicFlashcardsEnabled =
    activeTrainingTab === "flashcards" &&
    Boolean(selectedFlashcardTopicId);
  const { data: topics = [], isLoading, isError } = useGetTopics();
  const {
    data: questions = [],
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
  } = useGetQuestions(activeTrainingTab === "quizzes");
  const {
    data: publicFlashcardLessonPage,
    isLoading: isPublicFlashcardsLoading,
    isError: isPublicFlashcardsError,
  } = useGetLessonsPage(
    {
      topicId: selectedFlashcardTopicId ?? undefined,
      page: 1,
      pageSize: PUBLIC_FLASHCARD_PAGE_SIZE,
    },
    { enabled: publicFlashcardsEnabled }
  );
  const publicFlashcardLessons = publicFlashcardLessonPage?.items ?? [];
  const quizTopics = getTopicQuizzes(topics, questions);
  const publicFlashcardDecks = useMemo(
    () => getPublicFlashcardDecks(topics, publicFlashcardLessons),
    [topics, publicFlashcardLessons]
  );

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
            {selectedFlashcardTopicId ? (
              <FlashcardPracticeScreen
                topic={topics.find((topic) => topic.id === selectedFlashcardTopicId)}
                decks={publicFlashcardDecks}
                isLoading={isLoading || isPublicFlashcardsLoading}
                isError={isError || isPublicFlashcardsError}
                onBack={() => setSelectedFlashcardTopicId(null)}
              />
            ) : (
              <TopicFlashcardGrid
                topics={topics}
                selectedTopicId={selectedFlashcardTopicId}
                isLoading={isLoading}
                isError={isError}
                onPractice={(topicId) => {
                  setSelectedFlashcardTopicId(topicId);
                }}
              />
            )}
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

type FlashcardPracticeScreenProps = {
  topic?: Topic;
  decks: FlashcardDeck[];
  isLoading: boolean;
  isError: boolean;
  onBack: () => void;
};

type FlashcardLearningStatus = "learned" | "review";

function FlashcardPracticeScreen({
  topic,
  decks,
  isLoading,
  isError,
  onBack,
}: FlashcardPracticeScreenProps) {
  const cards = useMemo(
    () => decks.flatMap((deck) => deck.cards),
    [decks]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardStatus, setCardStatus] = useState<
    Record<string, FlashcardLearningStatus>
  >({});
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffsetX, setDragOffsetX] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
    setCardStatus({});
    setIsCardFlipped(false);
    setDragStartX(null);
    setDragOffsetX(0);
  }, [topic?.id]);

  useEffect(() => {
    setIsCardFlipped(false);
    setDragStartX(null);
    setDragOffsetX(0);
  }, [currentIndex]);

  const currentCard = cards[currentIndex] ?? null;
  const learnedCount = Object.values(cardStatus).filter(
    (status) => status === "learned"
  ).length;
  const reviewCount = Object.values(cardStatus).filter(
    (status) => status === "review"
  ).length;

  const markCard = useCallback(
    (status: FlashcardLearningStatus) => {
      if (!currentCard) return;

      setCardStatus((currentStatus) => ({
        ...currentStatus,
        [currentCard.id]: status,
      }));
      setCurrentIndex((index) => Math.min(index + 1, cards.length));
      setIsCardFlipped(false);
      setDragStartX(null);
      setDragOffsetX(0);
    },
    [cards.length, currentCard]
  );

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!currentCard) return;

    const target = event.target as HTMLElement;
    if (target.closest("video, iframe, a, button")) return;

    setDragStartX(event.clientX);
    setDragOffsetX(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (dragStartX === null) return;

    setDragOffsetX(event.clientX - dragStartX);
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (dragStartX === null) return;

    if (dragOffsetX >= FLASHCARD_SWIPE_THRESHOLD) {
      markCard("learned");
    } else if (dragOffsetX <= -FLASHCARD_SWIPE_THRESHOLD) {
      markCard("review");
    } else {
      const target = event.target as HTMLElement;

      if (
        Math.abs(dragOffsetX) <= FLASHCARD_TAP_MAX_DRAG &&
        !target.closest("video, iframe, a, button")
      ) {
        setIsCardFlipped((currentValue) => !currentValue);
      }
      setDragStartX(null);
      setDragOffsetX(0);
    }
  }

  function handlePointerCancel() {
    setDragStartX(null);
    setDragOffsetX(0);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-[1.75rem] border-2 border-[#036678] bg-white p-4 shadow-[2px_4px_0_#036678] sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="mb-2 h-9 rounded-2xl px-3 font-black"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <h1 className="truncate text-2xl font-black leading-tight">
            {topic?.title ?? "Flashcards"}
          </h1>
          <p className="text-sm font-semibold text-slate-600">
            Swipe left for not learned, swipe right for learned.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-emerald-100 text-emerald-700">
            {learnedCount} learned
          </Badge>
          <Badge className="bg-rose-100 text-rose-700">
            {reviewCount} review
          </Badge>
          <Badge variant="outline">
            {Math.min(currentIndex + 1, cards.length || 1)} / {cards.length}
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading flash cards" className="py-8" />
      ) : isError ? (
        <p className="font-bold">Unable to load flash cards.</p>
      ) : cards.length ? (
        <div className="min-h-[22rem]">
            {currentCard ? (
              <div className="relative mx-auto max-w-xl overflow-hidden px-3 py-4">
                <div
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerEnd}
                  onPointerCancel={handlePointerCancel}
                  className="relative touch-pan-y select-none"
                  style={{
                    transform: `translateX(${dragOffsetX}px) rotate(${dragOffsetX / 18}deg)`,
                    transition:
                      dragStartX === null ? "transform 180ms ease-out" : "none",
                  }}
                >
                  <FlipFlashcard
                    card={currentCard}
                    isFlipped={isCardFlipped}
                    onFlip={() =>
                      setIsCardFlipped((currentValue) => !currentValue)
                    }
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => markCard("review")}
                    className="h-12 rounded-2xl border-rose-200 font-black text-rose-700 hover:bg-rose-50"
                  >
                    <XCircle className="size-5" />
                    Chưa thuộc
                  </Button>
                  <Button
                    type="button"
                    onClick={() => markCard("learned")}
                    className="h-12 rounded-2xl bg-emerald-600 font-black text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="size-5" />
                    Đã thuộc
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-[1.75rem] border-2 border-[#036678] bg-white p-8 text-center shadow-[2px_4px_0_#036678]">
                <CheckCircle2 className="mx-auto size-12 text-emerald-600" />
                <h2 className="mt-3 text-2xl font-black">Finished</h2>
                <p className="mt-1 font-semibold text-slate-600">
                  You reviewed all flashcards in this topic.
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    setCurrentIndex(0);
                    setCardStatus({});
                  }}
                  className="mt-5 h-12 rounded-2xl font-black"
                >
                  Practice again
                  <RotateCcw className="size-5" />
                </Button>
              </div>
            )}
        </div>
      ) : (
        <p className="font-bold">No flash cards in this topic yet.</p>
      )}
    </div>
  );
}

type TopicFlashcardGridProps = {
  topics: Topic[];
  selectedTopicId: string | null;
  isLoading: boolean;
  isError: boolean;
  onPractice: (topicId: string) => void;
};

function TopicFlashcardGrid({
  topics,
  selectedTopicId,
  isLoading,
  isError,
  onPractice,
}: TopicFlashcardGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {isLoading ? (
        <LoadingSpinner
          label="Loading topics"
          className="col-span-full py-8"
        />
      ) : isError ? (
        <p className="col-span-full font-bold">Unable to load topics.</p>
      ) : topics.length ? (
        topics.map((topic) => {
          const selected = selectedTopicId === topic.id;

          return (
            <BlockyCard
              key={topic.id}
              className={cn(
                "h-full",
                selected && "border-primary/50 shadow-lg"
              )}
            >
              <CardContent className="flex h-full flex-col pb-2">
                <div className="mb-5 rounded-[1.5rem]">
                  <h2 className="text-2xl font-black">{topic.title}</h2>
                </div>
                <p className="min-h-12 grow text-sm font-semibold text-slate-600">
                  {topic.description ??
                    "Practice flashcards from lessons in this topic."}
                </p>
                <div className="mt-5 flex items-center justify-between text-xs font-black text-slate-600">
                  <span>Lessons</span>
                  <span>{topic.lesson_count}</span>
                </div>
                <Button
                  type="button"
                  onClick={() => onPractice(topic.id)}
                  disabled={topic.lesson_count === 0}
                  className="mt-5 h-12 w-full rounded-2xl font-black"
                >
                  Practice Flashcard
                  <ArrowRight className="size-5" />
                </Button>
              </CardContent>
            </BlockyCard>
          );
        })
      ) : (
        <p className="col-span-full font-bold">No topics yet.</p>
      )}
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
  isError,
}: QuizTopicGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {isLoading ? (
        <LoadingSpinner
          label="Loading quizzes"
          className="col-span-full py-8"
        />
      ) : isError ? (
        <p className="col-span-full font-bold">Unable to load quizzes.</p>
      ) : quizTopics.length ? (
        quizTopics.map(({ topic, questionCount }) => (
          <BlockyCard key={topic.id} className="h-full">
            <CardContent className="flex h-full flex-col pb-2">
              <Link
                to={`/topic-quiz-history/${topic.id}`}
                className="flex grow flex-col rounded-[1.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div className="mb-5 rounded-[1.5rem]">
                  <h2 className="text-2xl font-black">{topic.title}</h2>
                </div>
                <p className="min-h-12 grow text-sm font-semibold text-slate-600">
                  {topic.description ??
                    "Practice all quiz questions in this topic."}
                </p>
              </Link>
              <div className="mt-5 flex items-center justify-between text-xs font-black text-slate-600">
                <span>Questions</span>
                <span>{questionCount}</span>
              </div>
              <Button asChild className="mt-5 h-12 w-full rounded-2xl font-black">
                <Link to={`/topic-quiz/${topic.id}`}>
                  Start quiz
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </CardContent>
          </BlockyCard>
        ))
      ) : (
        <p className="col-span-full font-bold">No quizzes yet.</p>
      )}
    </div>
  );
}

type FlipFlashcardProps = {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  onDelete?: (cardId: string) => void;
  onEdit?: (card: Flashcard) => void;
  onClone?: (card: Flashcard) => void;
};

function FlipFlashcard({
  card,
  isFlipped,
  onFlip,
  onDelete,
  onEdit,
  onClone,
}: FlipFlashcardProps) {
  const hasActions = Boolean(onEdit || onClone || onDelete);

  function handleFlipKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onFlip();
  }

  return (
    <BlockyCard className="group/flashcard relative h-80 overflow-visible bg-transparent p-0 shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none">
      <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[1.75rem] border-2 border-[#036678] bg-[#036678]" />
      <div
        role="button"
        tabIndex={0}
        onKeyDown={handleFlipKeyDown}
        aria-pressed={isFlipped}
        aria-label={`${card.front}: ${isFlipped ? "video answer" : "front"}`}
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
              label="Word"
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
              label="Video"
              source={card.source}
              inverted
            />
            <FlashcardVideoBack card={card} isActive={isFlipped} />
            <FlashcardFaceFooter isFlipped={isFlipped} inverted />
          </div>
        </div>
      </div>

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

function FlashcardVideoBack({
  card,
  isActive,
}: {
  card: Flashcard;
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoUrl = card.videoEmbedUrl ?? card.videoUrl;
  const normalizedVideoUrl = videoUrl?.replace(/^https:\/\//, "http://");
  const youtubeSrc =
    card.videoKind === "youtube" && card.videoEmbedUrl
      ? getAutoplayYoutubeEmbedUrl(card.videoEmbedUrl, isActive)
      : card.videoEmbedUrl;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || card.videoKind !== "video") return;

    if (!isActive) {
      video.pause();
      return;
    }

    video.currentTime = 0;
    void video.play().catch(() => {
      // Browser autoplay policies can still block playback in some cases.
    });
  }, [card.id, card.videoKind, isActive]);

  return (
    <div className="min-h-0 space-y-3 overflow-auto text-center">
      {card.videoKind === "video" && normalizedVideoUrl ? (
        <video
          ref={videoRef}
          className="aspect-video w-full rounded-[1.25rem] bg-slate-950 object-contain"
          autoPlay={isActive}
          controls
          muted
          playsInline
          preload="metadata"
          src={normalizedVideoUrl}
        />
      ) : card.videoKind === "youtube" && youtubeSrc ? (
        <iframe
          className="aspect-video w-full rounded-[1.25rem] bg-slate-950"
          src={youtubeSrc}
          title={`Reference sign video for ${card.front}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : card.videoKind === "link" && card.videoUrl ? (
        <Button
          asChild
          variant="outline"
          className="mx-auto h-11 rounded-2xl border-white/30 bg-white/10 px-4 font-black text-white hover:bg-white/20"
        >
          <a href={card.videoUrl} target="_blank" rel="noreferrer">
            Open video
            <ExternalLink className="size-4" />
          </a>
        </Button>
      ) : (
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-white/10 text-cyan-100">
          <Video className="size-8" />
        </div>
      )}
      <p className="break-words text-sm font-semibold text-cyan-100">
        {card.back}
      </p>
      {card.hint ? (
        <p className="break-words text-xs font-semibold text-cyan-100/80">
          {card.hint}
        </p>
      ) : null}
    </div>
  );
}

function getAutoplayYoutubeEmbedUrl(url: string, shouldAutoplay: boolean) {
  if (!shouldAutoplay) return url;

  try {
    const parsed = new URL(url);
    parsed.searchParams.set("autoplay", "1");
    parsed.searchParams.set("mute", "1");
    parsed.searchParams.set("playsinline", "1");
    return parsed.toString();
  } catch {
    return url;
  }
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

    const phrase = lesson.phrase || lesson.title;
    const signReference = parseFlashcardSignReference(lesson.sign_hint);
    const questionVideoUrl = lesson.questions?.find(
      (question) => question.answer === phrase && question.video_url
    )?.video_url;
    const questionVideoReference = parseFlashcardVideoUrl(questionVideoUrl);
    const videoReference = questionVideoReference.videoUrl
      ? questionVideoReference
      : signReference;

    deck.cards.push({
      id: `public-lesson-${lesson.id}`,
      source: "public",
      front: phrase,
      back:
        videoReference.hint ||
        lesson.description ||
        `Watch the sign for ${phrase}.`,
      videoUrl: videoReference.videoUrl,
      videoEmbedUrl: videoReference.videoEmbedUrl,
      videoKind: videoReference.videoKind,
      tag: deckTitle,
    });
  }

  return decks.filter((deck) => deck.cards.length > 0);
}

type FlashcardVideoReference = {
  hint: string;
  videoUrl: string | null;
  videoEmbedUrl: string | null;
  videoKind: Flashcard["videoKind"];
};

function parseFlashcardSignReference(
  signHint: string | null
): FlashcardVideoReference {
  const hint = signHint ?? "";
  const urlMatch = hint.match(/https?:\/\/\S+/);
  const videoUrl = urlMatch?.[0] ?? null;
  const cleanedHint = hint
    .replace(/\s*Reference video:\s*https?:\/\/\S+/i, "")
    .replace(/\s+/g, " ")
    .trim();
  const reference = parseFlashcardVideoUrl(videoUrl);

  return {
    ...reference,
    hint: cleanedHint,
  };
}

function parseFlashcardVideoUrl(
  videoUrl: string | null | undefined
): FlashcardVideoReference {
  if (!videoUrl) {
    return {
      hint: "",
      videoUrl: null,
      videoEmbedUrl: null,
      videoKind: null,
    };
  }

  const youtubeEmbedUrl = getYoutubeEmbedUrl(videoUrl);
  if (youtubeEmbedUrl) {
    return {
      hint: "",
      videoUrl,
      videoEmbedUrl: youtubeEmbedUrl,
      videoKind: "youtube",
    };
  }

  if (videoUrl.toLowerCase().split("?")[0].match(/\.(mp4|mov|webm)$/)) {
    return {
      hint: "",
      videoUrl,
      videoEmbedUrl: videoUrl,
      videoKind: "video",
    };
  }

  return {
    hint: "",
    videoUrl,
    videoEmbedUrl: videoUrl,
    videoKind: "link",
  };
}

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (parsed.hostname === "youtu.be") {
      const videoId = parsed.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
  } catch {
    return null;
  }

  return null;
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
