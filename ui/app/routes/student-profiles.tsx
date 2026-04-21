import type { Route } from "./+types/student-profiles";
import { ContentCard } from "../components/dashboard/ContentCard";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { SectionHeading } from "../components/dashboard/SectionHeading";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Student Profiles - The Insightful Lens" }];
}

export default function StudentProfiles() {
  return (
    <DashboardShell
      title="Student Profiles"
      rightSlot={
        <div className="flex items-center gap-4 rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-400">
          <span className="material-symbols-outlined text-slate-500">search</span>
          <span>Search student observations...</span>
        </div>
      }
      contentWidthClassName="max-w-7xl"
      contentClassName="space-y-8"
    >
      <section className="flex flex-col md:flex-row gap-8 items-start">
        <div className="relative group">
          <div className="w-48 h-48 rounded-xl overflow-hidden shadow-sm">
            <img
              alt="Student Photo"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWYOMKeZqbOVZhTRZ9XkLnRPdE-XPfFkU7lpr4KGUlZBl1CDXDahsPGRJmMbwky9dxb3CjADgLFRiJTdIW1K9ozGNdj-JopzcTotDgMAhPeKKrXpvDwqDDt6fT_yHUk0VjCoMxP9YZUBd4_bEBU38DDB7z7wHFUfpEyC5ssLgKMrjYKenyyEo9zuKZz_jbpsJEMKxPVlmmuSdVsCh0bC8eew1Fnras9TL30_Ck_ARSnn53ZbYwwzIQJtN0RFGPLTtEX-GDtmdVOkYq"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-lg shadow-lg">
            <span className="material-symbols-outlined filled text-lg">verified_user</span>
          </div>
        </div>
        <div className="flex-grow space-y-4">
          <SectionHeading
            title="Benjamin Harrison"
            description="Grade 11 • Honors Computer Science • Section B"
          />
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">High Engagement</span>
            <span className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold">98% Attendance</span>
            <span className="px-4 py-1.5 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-semibold">Peer Leader</span>
          </div>
          <p className="max-w-2xl text-on-surface-variant text-sm leading-relaxed">
            Benjamin demonstrates strong analytical skills during collaborative coding sessions. AI observation noted a 14%
            increase in verbal participation this month.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <ContentCard title="Engagement Trends" className="md:col-span-8" bodyClassName="p-6">
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {[85, 70, 95, 60, 88].map((h, i) => (
              <div className="w-full flex flex-col items-center gap-2" key={h}>
                <div className="w-full bg-surface-container rounded-t-sm relative h-32">
                  <div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: `${h}%` }}></div>
                </div>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{["Mon", "Tue", "Wed", "Thu", "Fri"][i]}</span>
              </div>
            ))}
          </div>
        </ContentCard>

        <ContentCard
          title="AI Snapshot"
          className="md:col-span-4 bg-primary-container text-on-primary-container border-primary-container"
          titleClassName="text-on-primary-container"
          bodyClassName="p-6 pt-0 flex flex-col justify-between h-full"
        >
          <div>
            <p className="text-sm opacity-90 leading-relaxed italic">
              Benjamin exhibits flow-state characteristics during laboratory assignments, with high cognitive stability from 10:15 to 10:45 AM.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="p-2 bg-on-primary-container/20 rounded-lg">
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
