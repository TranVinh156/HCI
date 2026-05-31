import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router";

import { LessonVisual } from "~/components/learning/lesson-visual";
import { StudentShell } from "~/components/learning/student-shell";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useGetLessons } from "~/hooks/use-get-lessons";

export default function CommunicationRoute() {
  const { data: lessons = [], isLoading, isError } = useGetLessons();
  const communicationLessons = lessons.filter(
    (lesson) => lesson.type === "communication"
  );

  return (
    <StudentShell>
      <div className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          <LoadingSpinner
            label="Loading communication lessons"
            className="py-8 md:col-span-3"
          />
        ) : isError ? (
          <p className="font-bold">Unable to load communication lessons.</p>
        ) : communicationLessons.map((lesson) => (
          <Card
            key={lesson.id}
            className="rounded-[2rem] border-slate-200 bg-white"
          >
            <CardHeader>
              <div className="mb-3 grid size-16 place-items-center overflow-hidden rounded-2xl text-4xl">
                <LessonVisual visual={lesson.visual} />
              </div>
              <CardTitle className="text-2xl font-black">
                {lesson.title}
              </CardTitle>
              <CardDescription className="font-semibold">
                {lesson.description ?? ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl p-4">
                <p className="text-xs font-black uppercase text-primary">
                  Sentence parts
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(lesson.phrase ?? lesson.title).split(" ").map((word) => (
                    <Badge key={word} className="bg-white text-primary">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button asChild className="h-12 w-full rounded-2xl font-black">
                <Link to={`/lesson/${lesson.id}`}>
                  <MessageCircle className="size-5" />
                  Open sentence
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </StudentShell>
  );
}
