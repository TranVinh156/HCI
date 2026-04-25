import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Mascot } from "~/components/learning/mascot";
import { OceanProgress } from "~/components/learning/ocean-progress";
import { QuizOption } from "~/components/learning/quiz-option";
import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { getLesson, getLessonQuiz } from "~/lib/learning-data";
import { completeLesson } from "~/lib/progress";

export default function QuizRoute() {
  const params = useParams();
  const navigate = useNavigate();
  const lesson = getLesson(params.lessonId ?? "");
  const questions = useMemo(
    () => getLessonQuiz(params.lessonId ?? ""),
    [params.lessonId]
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);

  if (!lesson || questions.length === 0) {
    return (
      <StudentShell>
        <p className="font-bold">Practice not found.</p>
      </StudentShell>
    );
  }

  const question = questions[questionIndex];
  const isCorrect = selected === question.answer;
  const progressValue = Math.round((questionIndex / questions.length) * 100);
  const lessonId = lesson.id;

  function next() {
    if (!checked) {
      setChecked(true);
      if (isCorrect) setCorrect((value) => value + 1);
      return;
    }

    if (questionIndex === questions.length - 1) {
      const finalCorrect = correct + (isCorrect ? 1 : 0);
      completeLesson(lessonId, finalCorrect, questions.length);
      navigate(
        `/result/${lessonId}?correct=${finalCorrect}&total=${questions.length}`
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
        <Mascot
          mood={checked ? (isCorrect ? "success" : "coach") : "coach"}
          message={
            checked
              ? isCorrect
                ? "That is correct. Great job."
                : question.hint
              : "Choose the answer that matches the sign you just learned."
          }
        />
        <section className="rounded-[2rem] bg-white p-5 shadow-xl shadow-cyan-100/60">
          <div className="mb-5 rounded-[1.5rem] bg-cyan-50 p-5 text-center">
            <p className="text-sm font-black uppercase text-cyan-700">
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
          disabled={!selected}
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
