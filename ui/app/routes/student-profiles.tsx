import type { Route } from "./+types/student-profiles";
import { ContentCard } from "../components/dashboard/ContentCard";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { SectionHeading } from "../components/dashboard/SectionHeading";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Student Profiles - The Insightful Lens" }];
}

export default function StudentProfiles() {
  return (
    <DashboardShell
      title="Student Profiles"
      rightSlot={
        <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-400">
          <span className="material-symbols-outlined text-slate-500">search</span>
          <span>Search student observations...</span>
        </div>
      }
      contentWidthClassName="max-w-7xl"
      contentClassName="space-y-8"
    >
      <section className="flex flex-col items-start gap-8 md:flex-row">
        <div className="relative group">
          <Avatar className="h-48 w-48 rounded-2xl border border-slate-200 shadow-sm">
            <AvatarImage
              alt="Student Photo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWYOMKeZqbOVZhTRZ9XkLnRPdE-XPfFkU7lpr4KGUlZBl1CDXDahsPGRJmMbwky9dxb3CjADgLFRiJTdIW1K9ozGNdj-JopzcTotDgMAhPeKKrXpvDwqDDt6fT_yHUk0VjCoMxP9YZUBd4_bEBU38DDB7z7wHFUfpEyC5ssLgKMrjJKenyyEo9zuKZz_jbpsJEMKxPVlmmuSdVsCh0bC8eew1Fnras9TL30_Ck_ARSnn53ZbYwwzIQJtN0RFGPLTtEX-GDtmdVOkYq"
            />
            <AvatarFallback>BH</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 rounded-lg bg-primary p-2 text-white shadow-lg">
            <span className="material-symbols-outlined filled text-lg">verified_user</span>
          </div>
        </div>

        <div className="flex-grow space-y-4">
          <SectionHeading title="Benjamin Harrison" description="Grade 11 • Honors Computer Science • Section B" />
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="px-4 py-1.5">
              High Engagement
            </Badge>
            <Badge variant="outline" className="px-4 py-1.5">
              98% Attendance
            </Badge>
            <Badge className="bg-tertiary-container px-4 py-1.5 text-on-tertiary-container">
              Peer Leader
            </Badge>
          </div>
          <p className="max-w-2xl text-on-surface-variant text-sm leading-relaxed">
            Benjamin demonstrates strong analytical skills during collaborative coding sessions. AI observation noted a 14%
            increase in verbal participation this month.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <ContentCard title="Engagement Trends" className="md:col-span-8" bodyClassName="p-6">
          <div className="flex h-48 items-end justify-between gap-2 px-2">
            {[85, 70, 95, 60, 88].map((h, i) => (
              <div className="w-full flex flex-col items-center gap-2" key={h}>
                <div className="relative h-32 w-full rounded-t-sm bg-surface-container">
                  <div className="absolute bottom-0 w-full rounded-t-sm bg-primary-container" style={{ height: `${h}%` }} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"][i]}
                </span>
              </div>
            ))}
          </div>
        </ContentCard>

        <ContentCard
          title="AI Snapshot"
          className="md:col-span-4 border-primary-container bg-primary-container text-on-primary-container"
          titleClassName="text-on-primary-container"
          bodyClassName="flex h-full flex-col justify-between p-6 pt-0"
        >
          <div>
            <p className="text-sm leading-relaxed italic opacity-90">
              Benjamin exhibits flow-state characteristics during laboratory assignments, with high cognitive stability from
              10:15 to 10:45 AM.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="rounded-lg bg-on-primary-container/20 p-2">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">Cognitive State</p>
              <p className="text-sm">Deep Focus Detected</p>
            </div>
          </div>
        </ContentCard>
      </div>
    </DashboardShell>
  );
}
