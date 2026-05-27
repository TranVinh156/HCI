import { Link, useParams } from "react-router";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { PathNode } from "~/components/learning/path-node";
import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { getLessonStatus, useProgressData } from "~/hooks/use-progress";
import { useGetTopic } from "~/hooks/use-get-topics";
import { useInfiniteTopicLessons } from "~/hooks/use-get-topics-lessons";
import { ArrowRight } from "lucide-react";

const LESSON_PAGE_SIZE = 10;

export default function PathRoute() {
  const params = useParams();
  const topicId = params.topicId;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreNodeRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = useRef(false);
  const {
    data: topic,
    isLoading: isTopicLoading,
    isError: isTopicError,
  } = useGetTopic(topicId);
  const {
    data: lessonPages,
    isLoading: isLessonsLoading,
    isError: isLessonsError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteTopicLessons(topicId, LESSON_PAGE_SIZE);
  const { data: progressData, isLoading: isProgressLoading } = useProgressData();
  const lessons = useMemo(
    () => lessonPages?.pages.flatMap((page) => page.items) ?? [],
    [lessonPages]
  );
  const orderedLessonIds = lessons.map((lesson) => lesson.id);
  const progress = progressData?.progress;
  const canLoadMore = Boolean(hasNextPage && !isFetchingNextPage);

  const loadNextPage = useCallback(() => {
    if (!hasNextPage || loadingMoreRef.current) return;

    loadingMoreRef.current = true;
    void fetchNextPage().finally(() => {
      loadingMoreRef.current = false;
    });
  }, [fetchNextPage, hasNextPage]);

  useEffect(() => {
    if (!isFetchingNextPage) {
      loadingMoreRef.current = false;
    }
  }, [isFetchingNextPage]);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      loadMoreNodeRef.current = node;
      observerRef.current?.disconnect();

      if (!node || !hasNextPage) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            loadNextPage();
          }
        },
        { rootMargin: "320px 0px" }
      );

      observerRef.current.observe(node);
    },
    [hasNextPage, loadNextPage]
  );

  useEffect(() => {
    if (!canLoadMore) return;

    function loadIfNearBottom() {
      const node = loadMoreNodeRef.current;
      if (!node) return;

      const { top } = node.getBoundingClientRect();
      if (top <= window.innerHeight + 320) {
        loadNextPage();
      }
    }

    window.addEventListener("scroll", loadIfNearBottom, { passive: true });
    window.addEventListener("resize", loadIfNearBottom);
    loadIfNearBottom();

    return () => {
      window.removeEventListener("scroll", loadIfNearBottom);
      window.removeEventListener("resize", loadIfNearBottom);
    };
  }, [canLoadMore, loadNextPage, lessons.length]);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  if (!topicId) {
    return (
      <StudentShell>
        <p className="font-bold">Topic not found.</p>
      </StudentShell>
    );
  }

  if (isTopicLoading || isLessonsLoading || isProgressLoading) {
    return (
      <StudentShell>
        <p className="font-bold">Loading learning path...</p>
      </StudentShell>
    );
  }

  if (isTopicError || isLessonsError) {
    return (
      <StudentShell>
        <p className="font-bold">Unable to load learning path.</p>
      </StudentShell>
    );
  }

  if (!topic) {
    return (
      <StudentShell>
        <p className="font-bold">Topic not found.</p>
      </StudentShell>
    );
  }

  const practiceTopicId = topic?.id ?? topicId;

  return (
    <StudentShell>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-black uppercase text-primary">
                Learning path
              </p>
              <h1 className="text-4xl font-black">{topic.title}</h1>
            </div>
            <div className="flex gap-4">
              <Button
                asChild
                variant="outline"
                className="h-11 w-fit shrink-0 rounded-2xl"
              >
                <Link to="/learn">Back to topics</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 w-fit shrink-0 rounded-2xl"
              >
                <Link to={`/topic-quiz/${practiceTopicId}`}>
                  Practice
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>
          </div>
          <p className="mt-2 max-w-2xl font-semibold text-slate-600">
            {topic.description}
          </p>
        </div>
      </div>
      <div className="relative mx-auto max-w-2xl rounded-[2rem] p-5 sm:p-6">
        {lessons.map((lesson, index) => (
          <PathNode
            key={lesson.id}
            lessonId={lesson.id}
            title={lesson.title}
            index={index}
            isLast={index === lessons.length - 1 && !hasNextPage}
            status={getLessonStatus(lesson.id, orderedLessonIds, progress)}
          />
        ))}
        {hasNextPage ? (
          <div
            ref={loadMoreRef}
            className="flex justify-center py-5"
          >
            <div
              role="status"
              aria-live="polite"
              aria-label={
                isFetchingNextPage
                  ? "Loading more lessons"
                  : "More lessons available"
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
                {isFetchingNextPage
                  ? "Loading more lessons..."
                  : "More lessons available"}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </StudentShell>
  );
}
