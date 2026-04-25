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
    <Card className="rounded-[2rem] border-slate-200 bg-white/95">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 grid size-32 place-items-center rounded-[2rem] text-7xl ring-1 ring-slate-200">
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
        <div className="rounded-[1.5rem] border border-slate-200 p-5 text-center">
          <div className="mx-auto mb-3 grid size-16 place-items-center rounded-full bg-white text-primary">
            <Video className="size-8" />
          </div>
          <p className="text-sm font-bold uppercase text-primary">
            Sign animation
          </p>
          <p className="mt-2 text-lg font-black text-slate-800">
            {lesson.signHint}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge className="h-8 bg-primary/10 px-3 text-primary">
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
          className="mx-auto flex h-12 rounded-2xl border-primary/30 px-5 text-base font-black text-primary"
        >
          <RotateCcw className="size-5" />
          Replay sign
        </Button>
      </CardContent>
    </Card>
  );
}
