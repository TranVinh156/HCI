import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useParams } from "react-router";

import { CameraPractice } from "~/components/learning/camera-practice";
import { LessonCard } from "~/components/learning/lesson-card";
import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { useGetLesson } from "~/hooks/use-get-lessons";
import { useGetTopic } from "~/hooks/use-get-topics";
import { useGetTopicLessons } from "~/hooks/use-get-topics-lessons";
import {
  calculateSegmentedSignScore,
  resolveSignScoringMetadata,
  type HandRequirement,
  type SignDifficultyLevel,
  type SignScoringMetadataInput,
  type SegmentedSignScoreResult,
  type StudentQualityCheckResult,
} from "~/services/scoring.service";

type Landmark = {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
};

type HolisticFrame = {
  pose: Landmark[];
  leftHand: Landmark[];
  rightHand: Landmark[];
};

type HolisticSequence = HolisticFrame[];

function inferHandRequirement(lesson: {
  title: string;
  phrase: string | null;
  sign_hint: string | null;
}): HandRequirement {
  const text = `${lesson.title} ${lesson.phrase ?? ""} ${lesson.sign_hint ?? ""}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (
    text.includes("both hands") ||
    text.includes("two hands") ||
    text.includes("hai tay") ||
    text.includes("hai ban tay")
  ) {
    return "both";
  }
  if (text.includes("right hand") || text.includes("tay phai")) {
    return "right";
  }
  if (text.includes("left hand") || text.includes("tay trai")) {
    return "left";
  }

  return "any";
}

function normalizeLessonDifficulty(value: string): SignDifficultyLevel {
  const normalized = value.toLowerCase();
  if (normalized === "medium") return "medium";
  if (normalized === "hard") return "hard";
  return "easy";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readLessonScoringMetadata(
  lesson: {
    scoring_metadata?: SignScoringMetadataInput | null;
    difficulty: string;
    exercises?: Array<{ type: string; content: Record<string, unknown> }>;
  },
  fallbackRequiredHands: HandRequirement
): SignScoringMetadataInput {
  if (lesson.scoring_metadata) {
    return lesson.scoring_metadata;
  }

  const metadataExercise = lesson.exercises?.find(
    (exercise) => exercise.type === "scoring_metadata"
  );
  const content = metadataExercise?.content;
  const nested = isRecord(content?.scoringMetadata)
    ? content.scoringMetadata
    : null;

  return {
    ...(nested ?? content ?? {}),
    requiredHands: fallbackRequiredHands,
    difficultyLevel: normalizeLessonDifficulty(lesson.difficulty),
  };
}

export default function LessonRoute() {
  const params = useParams();
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userSequenceBuffer, setUserSequenceBuffer] = useState<HolisticSequence>([]);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [qualityCheck, setQualityCheck] =
    useState<StudentQualityCheckResult | null>(null);
  const [segmentedScoreResult, setSegmentedScoreResult] =
    useState<SegmentedSignScoreResult | null>(null);
  const userSequenceRef = useRef<React.MutableRefObject<HolisticSequence> | null>(null);
  const groundTruthSequenceRef = useRef<React.MutableRefObject<HolisticSequence> | null>(null);
  const {
    data: lesson,
    isLoading: isLessonLoading,
    isError: isLessonError,
  } = useGetLesson(params.lessonId);
  const { data: topic } = useGetTopic(lesson?.topic_id);
  const {
    data: topicLessons = [],
    isLoading: isTopicLessonsLoading,
    isError: isTopicLessonsError,
  } = useGetTopicLessons(lesson?.topic_id);

  if (isLessonLoading || isTopicLessonsLoading) {
    return (
      <StudentShell>
        <p className="font-bold">Loading lesson...</p>
      </StudentShell>
    );
  }

  if (isLessonError || isTopicLessonsError || !lesson) {
    return (
      <StudentShell>
        <p className="font-bold">Lesson not found.</p>
      </StudentShell>
    );
  }

  const currentLessonIndex = topicLessons.findIndex(
    (item) => item.id === lesson.id
  );
  const nextLesson =
    currentLessonIndex >= 0 ? topicLessons[currentLessonIndex + 1] : undefined;

  const nextLessonHref = nextLesson ? `/lesson/${nextLesson.id}` : undefined;
  const handRequirement = inferHandRequirement(lesson);
  const scoringMetadata = resolveSignScoringMetadata(
    readLessonScoringMetadata(lesson, handRequirement)
  );

  function startRecording() {
    setFinalScore(null);
    setQualityCheck(null);
    setSegmentedScoreResult(null);
    setUserSequenceBuffer([]);
    if (userSequenceRef.current) {
      userSequenceRef.current.current = [];
    }
    setIsRecording(true);
  }

  function resetPractice() {
    setIsRecording(false);
    setIsAnalyzing(false);
    setFinalScore(null);
    setQualityCheck(null);
    setSegmentedScoreResult(null);
    setUserSequenceBuffer([]);
    if (userSequenceRef.current) {
      userSequenceRef.current.current = [];
    }
  }

  function stopRecording() {
    if (isAnalyzing) return;
    setIsRecording(false);
    setIsAnalyzing(true);

    const userSequence = userSequenceRef.current?.current ?? [];
    const groundTruthSequence = groundTruthSequenceRef.current?.current ?? [];
    setUserSequenceBuffer(userSequence);

    const nextSegmentedScore = calculateSegmentedSignScore(
      userSequence,
      groundTruthSequence,
      {},
      scoringMetadata,
      {
        webcamPreviewMirrored: true,
        landmarkCoordinatesMirrored: false,
      }
    );
    setQualityCheck(nextSegmentedScore.trackingQuality);
    setSegmentedScoreResult(nextSegmentedScore);

    if (!nextSegmentedScore.ok || nextSegmentedScore.score === null) {
      setFinalScore(null);
      setIsAnalyzing(false);
      return;
    }

    const score = nextSegmentedScore.score;
    setFinalScore(score);
    setIsAnalyzing(false);

    if (score < scoringMetadata.minPassingScore) {
      if (userSequenceRef.current) {
        userSequenceRef.current.current = [];
      }
      setUserSequenceBuffer([]);
    }
  }

  function handleVideoPlay() {
    if (!isRecording && !isAnalyzing) {
      startRecording();
    }
  }

  function handleVideoEnded() {
    if (isRecording) {
      stopRecording();
    }
  }

  return (
    <StudentShell>
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-primary">
            {topic?.title}
          </p>
          <h1 className="text-4xl font-black">{lesson.title}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl space-y-5">
        <LessonCard
          lesson={lesson}
          onGroundTruthSequenceRef={(ref) => {
            groundTruthSequenceRef.current = ref;
          }}
          onVideoPlay={handleVideoPlay}
          onVideoEnded={handleVideoEnded}
        />
        <CameraPractice
          lesson={lesson}
          isRecording={isRecording}
          isAnalyzing={isAnalyzing}
          finalScore={finalScore}
          qualityWarning={
            qualityCheck?.message ?? segmentedScoreResult?.message ?? null
          }
          qualityDebug={qualityCheck}
          scoringDebug={segmentedScoreResult}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onResetPractice={resetPractice}
          onUserSequenceRef={(ref) => {
            userSequenceRef.current = ref;
          }}
          minPassingScore={scoringMetadata.minPassingScore}
          nextLessonHref={
            finalScore !== null && finalScore >= scoringMetadata.minPassingScore
              ? nextLessonHref
              : undefined
          }
        />
        {nextLesson ? (
          <Button asChild className="h-14 w-full rounded-2xl text-lg font-black">
            <Link to={`/lesson/${nextLesson.id}`}>
              Next
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        ) : (
          <Button
            disabled
            className="h-14 w-full rounded-2xl text-lg font-black"
          >
            No next lesson
            <ArrowRight className="size-5" />
          </Button>
        )}
      </div>
    </StudentShell>
  );
}
