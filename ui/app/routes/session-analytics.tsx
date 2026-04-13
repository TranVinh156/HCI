import type { Route } from "./+types/session-analytics";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Session Analytics - The Insightful Lens" }];
}

export default function SessionAnalytics() {
  return (
    <main className="bg-background text-on-surface font-body flex min-h-screen">
      <aside className="h-screen w-72 left-0 sticky flex flex-col p-4 gap-2 border-r border-slate-100 bg-slate-50">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container">
              <span className="material-symbols-outlined">visibility</span>
            </div>
            <div>
              <h1 className="font-headline font-extrabold text-primary text-lg leading-tight">The Insightful Lens</h1>
              <p className="text-xs text-slate-500">AI Classroom Observer</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-200 transition-all rounded-lg font-medium text-sm" href="/">
            <span className="material-symbols-outlined">dashboard</span>
            Live Dashboard
          </a>
          <a className="flex items-center gap-3 px-4 py-3 bg-sky-100 text-primary font-semibold rounded-lg text-sm" href="/session-analytics">
            <span className="material-symbols-outlined">analytics</span>
            Session Analytics
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-200 transition-all rounded-lg font-medium text-sm" href="/student-profiles">
            <span className="material-symbols-outlined">group</span>
            Student Profiles
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-200 transition-all rounded-lg font-medium text-sm" href="/ai-configuration">
            <span className="material-symbols-outlined">settings_suggest</span>
            AI Configuration
          </a>
        </nav>
      </aside>

      <section className="flex-1 overflow-y-auto">
        <header className="w-full top-0 sticky z-10 bg-slate-50/80 backdrop-blur-md flex justify-between items-center h-16 px-8 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <h2 className="font-headline font-bold text-lg tracking-tight text-primary">Post-Session Analysis</h2>
            <span className="px-3 py-1 bg-surface-container text-outline text-[10px] font-bold rounded-full uppercase tracking-wider">Advanced Report</span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-8 bg-surface-container-lowest rounded-xl shadow-sm border border-slate-100 min-h-[320px]">
              <div className="flex items-center gap-2 text-primary font-bold mb-4">
                <span className="material-symbols-outlined text-sm filled">auto_awesome</span>
                <span className="text-xs uppercase tracking-widest font-headline">AI Performance Summary</span>
              </div>
              <h3 className="font-headline text-2xl font-bold text-on-surface mb-4">Session: Advanced Macroeconomics (Section B)</h3>
              <p className="text-on-surface-variant leading-relaxed max-w-2xl mb-6">
                Overall class engagement peaked during the Monetary Policy breakout session at 10:45 AM. AI detected a 22% increase
                in collaborative sentiment compared to previous weeks.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-secondary-container/30 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  <span className="text-xs font-semibold text-on-secondary-container">High Engagement</span>
                </div>
                <div className="flex items-center gap-2 bg-tertiary-container/10 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-tertiary rounded-full"></span>
                  <span className="text-xs font-semibold text-on-tertiary-fixed-variant">Concept Mastery: 88%</span>
                </div>
              </div>
            </div>
            <div className="bg-primary text-white rounded-xl p-8 flex flex-col justify-between shadow-lg" style={{ background: "linear-gradient(135deg, #00355f 0%, #0f4c81 100%)" }}>
              <div>
                <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-6">Critical Alerts</div>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-error bg-white/10 p-2 rounded-lg">warning</span>
                    <div>
                      <div className="text-sm font-bold">Participation Gap</div>
                      <div className="text-xs text-white/70">Rear cluster group remains silent for more than 20 minutes.</div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-secondary-fixed bg-white/10 p-2 rounded-lg">psychology</span>
                    <div>
                      <div className="text-sm font-bold">Concept Friction</div>
                      <div className="text-xs text-white/70">Liquidity Trap triggered confused facial signals.</div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors text-xs font-bold rounded-lg border border-white/20 uppercase tracking-widest">
                View Detailed Insights
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-2 block">Sentiment Trend</span>
              <div className="text-3xl font-headline font-extrabold text-primary mb-4">+14%</div>
              <div className="h-16 w-full flex items-end gap-1">
                <div className="w-full bg-primary/10 h-1/2 rounded-sm"></div>
                <div className="w-full bg-primary/20 h-2/3 rounded-sm"></div>
                <div className="w-full bg-primary/40 h-1/3 rounded-sm"></div>
                <div className="w-full bg-primary/60 h-3/4 rounded-sm"></div>
                <div className="w-full bg-primary h-full rounded-sm"></div>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter mb-4 block">Student Participation</span>
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eceef0" strokeWidth="3"></path>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#006a66" strokeDasharray="75, 100" strokeWidth="3"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-primary">75%</div>
              </div>
              <p className="text-[10px] text-center text-slate-400">Active engagement threshold met</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-slate-100 lg:col-span-2">
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Peak Engagement Periods</span>
                <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                </div>
              </div>
              <div className="grid grid-cols-6 h-24 items-end gap-4">
                <div className="h-[20%] bg-surface-container-highest rounded-t-lg"></div>
                <div className="h-[45%] bg-surface-container-highest rounded-t-lg"></div>
                <div className="h-[90%] bg-primary rounded-t-lg"></div>
                <div className="h-[100%] bg-secondary rounded-t-lg"></div>
                <div className="h-[60%] bg-surface-container-highest rounded-t-lg"></div>
                <div className="h-[30%] bg-surface-container-highest rounded-t-lg"></div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
