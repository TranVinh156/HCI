import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router";

import { Mascot } from "~/components/learning/mascot";
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
import { lessons } from "~/lib/learning-data";

const communicationLessons = lessons.filter(
  (lesson) => lesson.type === "communication"
);

export default function CommunicationRoute() {
  return (
    <StudentShell>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-cyan-700">
            Communication
          </p>
          <h1 className="text-4xl font-black">Daily sign sentences</h1>
          <p className="mt-2 max-w-2xl font-semibold text-slate-600">
            Learn full phrases in context, then practice matching signs to
            meaning.
          </p>
        </div>
        <Mascot
          compact
          mood="coach"
          message="Sentences are easier when we learn the situation first."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {communicationLessons.map((lesson) => (
          <Card
            key={lesson.id}
            className="rounded-[2rem] border-cyan-100 bg-white shadow-sm"
          >
            <CardHeader>
              <div className="mb-3 grid size-16 place-items-center rounded-2xl text-4xl">
                {lesson.visual}
              </div>
              <CardTitle className="text-2xl font-black">
                {lesson.title}
              </CardTitle>
              <CardDescription className="font-semibold">
                {lesson.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl p-4">
                <p className="text-xs font-black uppercase text-cyan-700">
                  Sentence parts
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {lesson.phrase.split(" ").map((word) => (
                    <Badge key={word} className="bg-white text-cyan-800">
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
