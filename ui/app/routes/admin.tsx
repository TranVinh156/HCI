import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router";

import { AdminShell } from "~/components/admin/admin-shell";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { useGetProfiles } from "~/hooks/use-get-profiles";
import { useGetQuestions } from "~/hooks/use-get-topic-questions";
import { useGetTopics } from "~/hooks/use-get-topics";

const adminShortcuts = [
  {
    title: "Build lessons",
    description: "Organize topic paths, signs, hints, and rewards.",
    to: "/admin/lessons",
    icon: BookOpen,
    badge: "Curriculum",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Quiz bank",
    description: "Check questions, answers, and practice coverage.",
    to: "/admin/quizzes",
    icon: ClipboardCheck,
    badge: "Assessment",
    className: "md:col-span-1",
  },
];

export default function AdminRoute() {
  const { data: profiles = [] } = useGetProfiles();
  const { data: questions = [] } = useGetQuestions();
  const { data: topics = [] } = useGetTopics();
  const filteredLessons = useMemo(
    () =>
      lessons.filter((lesson) =>
        `${lesson.title} ${lesson.phrase ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [lessons, query]
  );
  const overviewStats = [
    {
      label: "Students",
      value: String(overview?.total_students ?? profiles.length),
      detail: "Active profiles",
      icon: Users,
    },
    {
      label: "Topics",
      value: String(overview?.total_topics ?? topics.length),
      detail: "Ocean curriculum",
      icon: BookOpen,
    },
    {
      label: "Lessons",
      value: String(overview?.total_lessons ?? topicLessonCount),
      detail: "Vocabulary and communication",
      icon: GraduationCap,
    },
    {
      label: "Quiz questions",
      value: String(overview?.total_questions ?? 0),
      detail: "Two checks per lesson",
      icon: ClipboardCheck,
    },
    {
      label: "Completion",
      value: String(overview?.total_attempts ?? 0),
      detail: "Total attempts",
      icon: BarChart3,
    },
    {
      label: "Average accuracy",
      value: "84%",
      detail: "Across all quizzes",
      icon: ClipboardCheck,
    },
    {
      label: "Mascot prompts",
      value: "12",
      detail: "Reusable coaching lines",
      icon: Sparkles,
    },
  ];

  return (
    <AdminShell title="Learning dashboard" subtitle="Overview">
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Students"
            value={String(profiles.length)}
            detail="Active profiles"
            icon={Users}
          />
          <StatCard
            label="Topics"
            value={String(topics.length)}
            detail="Ocean curriculum"
            icon={BookOpen}
          />
          <StatCard
            label="Lessons"
            value={String(lessons.length)}
            detail="Vocabulary and communication"
            icon={GraduationCap}
          />
          <StatCard
            label="Quiz questions"
            value={String(questions.length)}
            detail="Two checks per lesson"
            icon={ClipboardCheck}
          />
        </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {overviewStats.map((stat) => (
                <OverviewStat key={stat.label} {...stat} />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid auto-rows-[minmax(12rem,auto)] gap-4 md:grid-cols-3">
          {adminShortcuts.map((item) => {
            return (
              <BentoActionCard key={item.to} {...item} />
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Completion"
            value="0"
            detail="Total attempts"
            icon={BarChart3}
          />
          <StatCard
            label="Average accuracy"
            value="84%"
            detail="Across all quizzes"
            icon={ClipboardCheck}
          />
          <StatCard
            label="Mascot prompts"
            value="12"
            detail="Reusable coaching lines"
            icon={Sparkles}
          />
        </div>
        <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-3 text-sm font-bold text-slate-600">{detail}</p>
    </div>
  );
}

type BentoActionCardProps = {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
  badge: string;
  className?: string;
};

function BentoActionCard({
  title,
  description,
  to,
  icon: Icon,
  badge,
  className,
}: BentoActionCardProps) {
  return (
    <Link
      to={to}
      className={cn(
        "group relative flex min-h-48 overflow-hidden rounded-[1.75rem] border-2 border-[#036678] bg-white p-5 shadow-[2px_4px_0_#036678] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_6px_0_#036678]",
        className
      )}
    >
      <div className="flex h-full w-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-6" />
          </div>
          <Badge className="bg-primary/10 text-primary">{badge}</Badge>
        </div>

        <div className="max-w-xl">
          <h2 className="text-2xl font-black leading-tight text-slate-950">
            {title}
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-black text-primary">
          Open
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
