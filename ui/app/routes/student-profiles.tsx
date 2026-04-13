import type { Route } from "./+types/student-profiles";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Student Profiles - The Insightful Lens" }];
}

export default function StudentProfiles() {
  return (
    <main className="bg-background text-on-surface font-body min-h-screen flex">
      <aside className="hidden md:flex flex-col h-screen w-72 left-0 sticky bg-slate-50 p-4 gap-2 border-r border-slate-100 font-medium text-sm">
        <div className="mb-8 px-2 flex flex-col gap-1">
          <h1 className="font-headline font-extrabold text-sky-900 text-xl tracking-tight">The Insightful Lens</h1>
          <p className="text-slate-500 text-xs">AI Classroom Observer</p>
        </div>
        <nav className="flex-grow flex flex-col gap-1">
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-sky-800 hover:bg-slate-200 rounded-lg transition-colors" href="/">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Live Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-sky-800 hover:bg-slate-200 rounded-lg transition-colors" href="/session-analytics">
            <span className="material-symbols-outlined">analytics</span>
            <span>Session Analytics</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 bg-sky-100 text-sky-900 font-semibold rounded-lg" href="/student-profiles">
            <span className="material-symbols-outlined">group</span>
            <span>Student Profiles</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-sky-800 hover:bg-slate-200 rounded-lg transition-colors" href="/ai-configuration">
            <span className="material-symbols-outlined">settings_suggest</span>
            <span>AI Configuration</span>
          </a>
        </nav>
      </aside>

      <section className="flex-grow overflow-y-auto">
        <header className="w-full top-0 sticky bg-slate-50 flex justify-between items-center h-16 px-6 z-10">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-slate-500">search</span>
            <span className="text-slate-400 text-sm">Search student observations...</span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
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
              <div>
                <h2 className="font-headline font-bold text-3xl text-primary tracking-tight">Benjamin Harrison</h2>
                <p className="text-on-surface-variant font-medium">Grade 11 • Honors Computer Science • Section B</p>
              </div>
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
            <div className="md:col-span-8 bg-surface-container-lowest rounded-lg p-6 flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-headline font-bold text-lg text-primary">Engagement Trends</h3>
              </div>
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
            </div>
            <div className="md:col-span-4 bg-primary-container text-on-primary-container rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-headline font-bold text-lg mb-4">AI Snapshot</h3>
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
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
