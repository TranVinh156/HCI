import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import { OceanProgress } from "~/components/learning/ocean-progress";
import { QuestionVideo } from "~/components/learning/question-video";
import { QuizOption } from "~/components/learning/quiz-option";
import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { useGetLesson } from "~/hooks/use-get-lessons";
import { useGetQuizQuestions } from "~/hooks/use-get-quiz-question";
import { useCompleteLesson, useProgressData } from "~/hooks/use-progress";

export default function QuizRoute() {
  const params = useParams();
  const navigate = useNavigate();
  const lessonId = params.lessonId;
  const {
    data: lesson,
    isLoading: isLessonLoading,
    isError: isLessonError,
  } = useGetLesson(lessonId);

  const {
    data: questions = [],
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
  } = useGetQuizQuestions(lessonId);
  const { data: progressData, isLoading: isProgressLoading } = useProgressData();
  const completeLessonMutation = useCompleteLesson();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);

  if (isLessonLoading || isQuestionsLoading || isProgressLoading) {
    return (
      <StudentShell>
        <p className="font-bold">Loading practice...</p>
      </StudentShell>
    );
  }

  if (isLessonError || isQuestionsError) {
    return (
      <StudentShell>
        <p className="font-bold">Unable to load practice.</p>
      </StudentShell>
    );
  }

  if (!lesson || questions.length === 0) {
    return (
      <StudentShell>
        <p className="font-bold">Practice not found.</p>
      </StudentShell>
    );
  }

  if (!lessonId) {
    return (
      <StudentShell>
        <p className="font-bold">Practice not found.</p>
      </StudentShell>
    );
  }

  const currentLessonId = lessonId;
  const question = questions[questionIndex];
  const isCorrect = selected === question.answer;
  const progressValue = Math.round((questionIndex / questions.length) * 100);

  async function next() {
    if (!checked) {
      setChecked(true);
      if (isCorrect) setCorrect((value) => value + 1);
      return;
    }

    if (questionIndex === questions.length - 1) {
      const finalCorrect = correct;
      if (progressData?.profile) {
        await completeLessonMutation.mutateAsync({
          profileId: progressData.profile.id,
          lessonId: currentLessonId,
          correct: finalCorrect,
          total: questions.length,
        });
      }
      navigate(
        `/result/${currentLessonId}?correct=${finalCorrect}&total=${questions.length}`
      );
      return;
    }

    setQuestionIndex((value) => value + 1);
    setSelected("");
    setChecked(false);
  }

  return (
    <StudentShell>
      <div className="mx-auto max-w-3xl space-y-5">
        <OceanProgress value={progressValue} label={`Question ${questionIndex + 1}`} />
        <section className="rounded-[2rem] bg-white p-5">
          <QuestionVideo
            title={`Answer video for ${question.answer}`}
            url={question.video_url}
          />
          <div className="mb-5 rounded-[1.5rem] p-5 text-center">
            <p className="text-sm font-black uppercase text-primary">
              {lesson.title}
            </p>
            <h1 className="mt-2 text-3xl font-black">{question.prompt}</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {question.options.map((option) => (
              <QuizOption
                key={option}
                option={option}
                selected={selected === option}
                state={
                  checked && selected === option
                    ? isCorrect
                      ? "correct"
                      : "wrong"
                    : "idle"
                }
                onSelect={() => {
                  if (!checked) setSelected(option);
                }}
              />
            ))}
          </div>
        </section>
        <Button
          disabled={!selected || completeLessonMutation.isPending}
          onClick={next}
          className="h-14 w-full rounded-2xl text-lg font-black"
        >
          {checked ? (
            <>
              Continue
              <ArrowRight className="size-5" />
            </>
          ) : (
            <>
              Check
              <CheckCircle2 className="size-5" />
            </>
          )}
        </Button>
      </div>
    </StudentShell>
  );
}
