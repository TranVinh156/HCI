import { RotateCcw, Video } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Lesson } from "~/lib/learning-data";

type LessonCardProps = {
  lesson: Lesson;
};

export function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Card className="rounded-[2rem] border-cyan-100 bg-white/95 shadow-xl shadow-cyan-100/70">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 grid size-32 place-items-center rounded-[2rem] bg-cyan-50 text-7xl ring-1 ring-cyan-100">
          {lesson.visual}
        </div>
        <CardTitle className="text-3xl font-black text-slate-900">
          {lesson.phrase}
        </CardTitle>
        <CardDescription className="text-base font-semibold">
          {lesson.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-[1.5rem] border border-sky-100 bg-cyan-50 p-5 text-center">
          <div className="mx-auto mb-3 grid size-16 place-items-center rounded-full bg-white text-sky-700 shadow-sm">
            <Video className="size-8" />
          </div>
          <p className="text-sm font-bold uppercase text-cyan-700">
            Sign animation
          </p>
          <p className="mt-2 text-lg font-black text-slate-800">
            {lesson.signHint}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge className="h-8 bg-cyan-100 px-3 text-cyan-800">
            {lesson.type === "communication" ? "Communication" : "Vocabulary"}
          </Badge>
          <Badge className="h-8 bg-amber-100 px-3 text-amber-800">
            {lesson.difficulty}
          </Badge>
          <Badge className="h-8 bg-emerald-100 px-3 text-emerald-800">
            +{lesson.xp} XP
          </Badge>
        </div>
        <Button
          type="button"
          variant="outline"
          className="mx-auto flex h-12 rounded-2xl border-cyan-200 px-5 text-base font-black text-cyan-800"
        >
          <RotateCcw className="size-5" />
          Replay sign
        </Button>
      </CardContent>
    </Card>
  );
}
