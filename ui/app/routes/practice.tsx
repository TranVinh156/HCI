import { ArrowRight, ClipboardCheck } from "lucide-react";
import { Link } from "react-router";
import type { QuizQuestion, Topic } from "~/api/types";

import { StudentShell } from "~/components/learning/student-shell";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useGetQuestions } from "~/hooks/use-get-topic-questions";
import { useGetTopics } from "~/hooks/use-get-topics";

export default function PracticeRoute() {
  const { data: topics = [], isLoading, isError } = useGetTopics();
  const {
    data: questions = [],
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
  } = useGetQuestions();
  const quizTopics = getTopicQuizzes(topics, questions);

  return (
    <StudentShell>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading || isQuestionsLoading ? (
          <p className="font-bold">Loading quizzes...</p>
        ) : isError || isQuestionsError ? (
          <p className="font-bold">Unable to load quizzes.</p>
        ) : quizTopics.length ? (
          quizTopics.map(({ topic, questionCount }) => (
            <Card
              key={topic.id}
              className="rounded-[2rem] border-slate-200 bg-white"
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
                  {topic.description ?? "Practice all quiz questions in this topic."}
                </CardDescription>
              </CardHeader>
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
    </StudentShell>
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
