import type { Route } from "./+types/ai-configuration";

export function meta({}: Route.MetaArgs) {
  return [{ title: "AI Configuration - The Insightful Lens" }];
}

export default function AIConfiguration() {
  return (
    <main className="bg-background text-on-surface font-body min-h-screen">
      <div className="flex min-h-screen">
        <aside className="h-screen w-72 left-0 sticky bg-slate-50 flex flex-col p-4 gap-2 border-r border-slate-100 font-medium text-sm">
          <div className="mb-8 px-2 py-4">
            <h1 className="font-headline font-extrabold text-sky-900 text-2xl tracking-tight">The Insightful Lens</h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">AI Classroom Observer</p>
          </div>
          <nav className="flex-1 space-y-1">
            <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-sky-800 hover:bg-slate-200 rounded-lg transition-all" href="/">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Live Dashboard</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-sky-800 hover:bg-slate-200 rounded-lg transition-all" href="/session-analytics">
              <span className="material-symbols-outlined">analytics</span>
              <span>Session Analytics</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-sky-800 hover:bg-slate-200 rounded-lg transition-all" href="/student-profiles">
              <span className="material-symbols-outlined">group</span>
              <span>Student Profiles</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 bg-sky-100 text-sky-900 font-semibold rounded-lg transition-all" href="/ai-configuration">
              <span className="material-symbols-outlined">settings_suggest</span>
              <span>AI Configuration</span>
            </a>
          </nav>
        </aside>

        <section className="flex-1 min-w-0 flex flex-col overflow-y-auto">
          <header className="w-full top-0 sticky bg-slate-50 z-30 flex justify-between items-center h-16 px-6 font-headline font-bold text-lg tracking-tight">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                <input className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm font-normal focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Search system settings..." type="text" />
              </div>
            </div>
          </header>

          <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-headline font-bold text-primary mb-2">AI Configuration</h2>
                <p className="text-on-surface-variant max-w-2xl">Refine your classroom digital twin and camera setup.</p>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-surface-container-high text-on-surface font-medium rounded-md hover:brightness-95 transition-all">Export Config</button>
                <button className="px-6 py-2 bg-linear-to-br from-primary to-primary-container text-white font-medium rounded-md shadow-lg shadow-primary/20 active:scale-95 transition-all">Save Changes</button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <section className="col-span-12 lg:col-span-8 space-y-6">
                <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-headline font-bold text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary-fixed-dim">camera</span>
                      Camera Calibration
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider">Active: Feed 01</span>
                  </div>
                  <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden">
                    <img alt="Live Classroom Feed" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUF_tB6pfKbagf-q_LZkT-8XsSbbY-7SFXWioh0YGHMBRF7CSj8SvPZsNS89g5uec-KEoWUyGZt9BCgwO3oVvqzjUE5x4f7bmTMocZ7lYX17StYpkg5oQDqCnzlQfoueNfPzvZY0FYGs20rCtgeOjMiZANYCfBewdOm2KXJU2Zob0QwR8mhvCy0DYaye3t3an-i1lsOjPjTx_KKe3iS3neiLCNGM9Pm11LNZsvB5HHW-468cUig7RSO2NsnabrkUJ33oVa5IQCR0li" />
                    <div className="absolute inset-0 p-6 pointer-events-none">
                      <div className="border-2 border-on-tertiary-container/40 absolute top-1/4 left-1/3 w-32 h-44 rounded-lg"></div>
                      <div className="border-2 border-on-tertiary-container/40 absolute top-1/2 left-1/2 w-28 h-36 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl">
                <h3 className="text-lg font-headline font-bold text-primary mb-6">System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><span>Camera Feed</span><span className="text-secondary font-semibold">Healthy</span></div>
                  <div className="flex items-center justify-between"><span>Recognition Model</span><span className="text-secondary font-semibold">Stable</span></div>
                  <div className="flex items-center justify-between"><span>Latency</span><span className="text-primary font-semibold">42ms</span></div>
                  <div className="flex items-center justify-between"><span>GPU Utilization</span><span className="text-primary font-semibold">68%</span></div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
