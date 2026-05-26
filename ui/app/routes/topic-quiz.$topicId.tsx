import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";

import { OceanProgress } from "~/components/learning/ocean-progress";
import { QuestionVideo } from "~/components/learning/question-video";
import { QuizOption } from "~/components/learning/quiz-option";
import { StudentShell } from "~/components/learning/student-shell";
import { Button } from "~/components/ui/button";
import { useGetTopicQuestions } from "~/hooks/use-get-topic-questions";
import { useGetTopic } from "~/hooks/use-get-topics";

export default function TopicQuizRoute() {
  const params = useParams();
  const topicId = params.topicId;
  const {
    data: topic,
    isLoading: isTopicLoading,
    isError: isTopicError,
  } = useGetTopic(topicId);
  const {
    data: questions = [],
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
  } = useGetTopicQuestions(topicId);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  if (isTopicLoading || isQuestionsLoading) {
    return (
      <StudentShell>
        <p className="font-bold">Loading quiz...</p>
      </StudentShell>
    );
  }

  if (isTopicError || isQuestionsError || !topic) {
    return (
      <StudentShell>
        <p className="font-bold">Unable to load quiz.</p>
      </StudentShell>
    );
  }

  if (!questions.length) {
    return (
      <StudentShell>
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="font-bold">This topic does not have quiz questions yet.</p>
          <Button asChild variant="outline" className="h-11 rounded-xl font-black">
            <Link to="/practice">
              <ArrowLeft className="size-4" />
              Back to quizzes
            </Link>
          </Button>
        </div>
      </StudentShell>
    );
  }

  const question = questions[questionIndex];
  const isCorrect = selected === question.answer;
  const progressValue = Math.round((questionIndex / questions.length) * 100);

  function next() {
    if (!checked) {
      setChecked(true);
      if (isCorrect) setCorrect((value) => value + 1);
      return;
    }

    if (questionIndex === questions.length - 1) {
      setFinished(true);
      return;
    }

    setQuestionIndex((value) => value + 1);
    setSelected("");
    setChecked(false);
  }

  function restart() {
    setQuestionIndex(0);
    setSelected("");
    setChecked(false);
    setCorrect(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <StudentShell>
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-6 text-center">
          <p className="text-sm font-black uppercase text-primary">
            {topic.title}
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Quiz complete
          </h1>
          <p className="mt-3 text-lg font-bold text-slate-600">
            You answered {correct} of {questions.length} questions correctly.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              onClick={restart}
              variant="outline"
              className="h-12 rounded-2xl font-black"
            >
              <RotateCcw className="size-5" />
              Practice again
            </Button>
            <Button asChild className="h-12 rounded-2xl font-black">
              <Link to="/practice">
                Back to quizzes
                <ArrowRight className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <div className="mx-auto max-w-3xl space-y-5">
        <OceanProgress
          value={progressValue}
          label={`Question ${questionIndex + 1}`}
        />
        <section className="rounded-[2rem] bg-white p-5">
          <QuestionVideo
            title={`Answer video for ${question.answer}`}
            url={question.video_url}
          />
          <div className="mb-5 rounded-[1.5rem] p-5 text-center">
            <p className="text-sm font-black uppercase text-primary">
              {topic.title}
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
