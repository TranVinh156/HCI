import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Live Performance Dashboard - The Insightful Lens" },
    {
      name: "description",
      content: "Live classroom AI dashboard replicated from stitch design.",
    },
  ];
}

export default function Home() {
  return (
    <main className="bg-background text-on-surface font-body flex overflow-hidden min-h-screen">
      <aside className="h-screen w-72 left-0 sticky flex flex-col p-4 gap-2 border-r border-slate-100 bg-slate-50 font-medium text-sm">
        <div className="px-4 py-6">
          <h1 className="font-headline font-extrabold text-sky-900 text-2xl tracking-tight">The Insightful Lens</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">AI Classroom Observer</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <a className="flex items-center gap-3 px-4 py-3 bg-sky-100 text-sky-900 font-semibold rounded-lg transition-all duration-200 ease-in-out" href="/">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Live Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-sky-800 hover:bg-slate-200 rounded-lg transition-all duration-200 ease-in-out" href="/session-analytics">
            <span className="material-symbols-outlined">analytics</span>
            <span>Session Analytics</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-sky-800 hover:bg-slate-200 rounded-lg transition-all duration-200 ease-in-out" href="/student-profiles">
            <span className="material-symbols-outlined">group</span>
            <span>Student Profiles</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-sky-800 hover:bg-slate-200 rounded-lg transition-all duration-200 ease-in-out" href="/ai-configuration">
            <span className="material-symbols-outlined">settings_suggest</span>
            <span>AI Configuration</span>
          </a>
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-slate-200 pt-4">
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-sky-800 hover:bg-slate-200 rounded-lg transition-all duration-200 ease-in-out" href="#">
            <span className="material-symbols-outlined">help_outline</span>
            <span>Help Center</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-sky-800 hover:bg-slate-200 rounded-lg transition-all duration-200 ease-in-out" href="#">
            <span className="material-symbols-outlined">logout</span>
            <span>Sign Out</span>
          </a>
        </div>
      </aside>

      <section className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="w-full top-0 sticky flex justify-between items-center h-16 px-6 bg-slate-50 border-b border-slate-100 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 ring-primary text-sm"
                placeholder="Search students or metrics..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold animate-pulse">
              <span className="material-symbols-outlined text-sm filled">sensors</span>
              LIVE FEED ACTIVE
            </div>
            <div className="flex items-center gap-4">
              <button className="text-slate-500 hover:bg-slate-200/50 p-2 rounded-full transition-colors">
                <span className="material-symbols-outlined">videocam</span>
              </button>
              <button className="text-slate-500 hover:bg-slate-200/50 p-2 rounded-full transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-primary-container">
                <img
                  alt="Professor Profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX7kpFVr0Cld-tlzY69vmlEn9jeUqhpOqdsfWLaNqMApu2HF5UuNjPCT3yuWlql06WliqfSAeFvGxDD8IJ7qsZa2UYJ-woPappx-o-m4f7X1sML8G8fJcY9tqhcvXuVs89-DLNy8kaQg4Uja1MTE3d0GzQyNQvPqzxUT70R76hcTzo5p2jx2uNw85ILH1N9jA_RlgJlpoVhcyDelnjvd5HZGg1zmdfiHZHMP9IBZaKxfea1B1AnKlCe9wHBCsnOHr8CbOpimPJCuni"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-headline font-bold text-3xl text-primary tracking-tight">Classroom Engagement Metrics</h2>
              <p className="text-on-surface-variant text-sm mt-1">Section 402 • Room 204 • Professor Julian Vance</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-surface-container-high px-4 py-2 rounded-md font-medium text-sm text-on-surface hover:bg-slate-200 transition-colors">
                Generate Report
              </button>
              <button className="bg-linear-to-br from-primary to-primary-container text-on-primary px-4 py-2 rounded-md font-semibold text-sm hover:opacity-90 active:scale-95 transition-all">
                Export Session
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 flex-1">
            <div className="col-span-8 relative group rounded-xl overflow-hidden bg-slate-200 shadow-sm border border-outline-variant/15">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsQa-IcVVQQ_TP6bHJ_t267QpNQAXrImQkXQT6uXJJT7ybWa5sqZFFGhIUk0JDm7rRijdvIZRGHocpUbcuXlxjQT1AkYiUG7bC7tOMNW2sFW8MYaDVbGYayZOcR84b8V-QX9TYHMuHdDjJD39VTbcmh-h4wz7iiKQ9_mo4W-Gb5SrRH7OysdMtta0YfDmg4Bi8oeNkdK4fKuseBGvw_GYoxWWSQSE2W5Y0Pxawq6QgYgGSHMME0hZobQvLAKX0OoIidFNqdllEE0Ix"
                alt="Modern high-tech classroom"
              />

              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-32 h-44 border-2 border-on-tertiary-container rounded-lg">
                  <div className="absolute -top-10 left-0 glass-overlay px-2 py-1 rounded-md flex items-center gap-2 border border-white/20">
                    <span className="bg-tertiary-container text-on-tertiary-container text-[10px] px-2 py-0.5 rounded-full font-bold">FOCUSED</span>
                    <span className="material-symbols-outlined text-sky-600 text-sm">sentiment_satisfied</span>
                  </div>
                </div>

                <div className="absolute top-1/3 right-1/4 w-32 h-44 border-2 border-error/50 rounded-lg">
                  <div className="absolute -top-10 left-0 glass-overlay px-2 py-1 rounded-md flex items-center gap-2 border border-white/20">
                    <span className="bg-error-container text-on-error-container text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Distracted</span>
                    <span className="material-symbols-outlined text-error text-sm">sentiment_dissatisfied</span>
                  </div>
                </div>

                <div className="absolute bottom-10 left-10 glass-overlay p-4 rounded-xl border border-white/20 pointer-events-auto">
                  <h4 className="text-xs font-bold text-primary mb-2 uppercase tracking-tighter">Activity Heatmap</h4>
                  <div className="flex gap-1 h-8 items-end">
                    <div className="w-4 bg-primary/20 h-2 rounded-t-sm"></div>
                    <div className="w-4 bg-primary/40 h-4 rounded-t-sm"></div>
                    <div className="w-4 bg-primary/80 h-8 rounded-t-sm"></div>
                    <div className="w-4 bg-primary/60 h-6 rounded-t-sm"></div>
                    <div className="w-4 bg-primary h-7 rounded-t-sm"></div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="p-2 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-black/60 transition-colors">
                  <span className="material-symbols-outlined">fullscreen</span>
                </button>
                <button className="p-2 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-black/60 transition-colors">
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
              </div>
            </div>

            <div className="col-span-4 flex flex-col gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                  <h3 className="text-on-surface-variant text-sm font-medium">Overall Engagement</h3>
                  <span className="material-symbols-outlined text-primary">insights</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">84%</span>
                  <span className="text-secondary text-sm font-semibold flex items-center">
                    <span className="material-symbols-outlined text-sm">arrow_upward</span> 12%
                  </span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "84%" }}></div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                  <h3 className="text-on-surface-variant text-sm font-medium">Mean Focus Level</h3>
                  <span className="material-symbols-outlined text-secondary">psychology</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-secondary">72.5</span>
                  <span className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">High Stability</span>
                </div>
                <div className="flex gap-1 h-4">
                  <div className="flex-1 bg-secondary-container rounded-sm"></div>
                  <div className="flex-1 bg-secondary-container rounded-sm"></div>
                  <div className="flex-1 bg-secondary-container rounded-sm"></div>
                  <div className="flex-1 bg-secondary rounded-sm"></div>
                  <div className="flex-1 bg-secondary/30 rounded-sm"></div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-on-surface-variant text-sm font-medium">Active Participation</h3>
                  <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary-fixed rounded-full">REAL-TIME</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      alt="Student"
                      className="w-8 h-8 rounded-full"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkQcD8ZJW3Ay21MFedhgeCGrB2O4AfXZ8hyzbSzRaNMA5zdWEd1slCP24KJ64shgdgmsK7gOYQf4bO8bk6OHviSj1ay4YNAnRjcJusDt_OKhiRdpJW2Gkk9ozJ3QPqBWcHsRgoC5ndHVTe1tXNc9m2q7qvagCJ7aGkzNsA3xf2SoX_W5KhvOGKQrficQxnmvKG_8CLpZaozyBGv0QqEfIWTJ3VoHqmPDrkVL2N9Sl3yn-d1oWYpReDeq_2C1A_ZiWLc_6NNzfDdHEB"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold text-primary">
                        <span>Leo M.</span>
                        <span>4 Questions</span>
                      </div>
                      <div className="w-full bg-surface-container h-1 mt-1 rounded-full">
                        <div className="bg-primary h-full" style={{ width: "90%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      alt="Student"
                      className="w-8 h-8 rounded-full"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeyOuNbM0e3Hy0HOMSUgr2th3tOJafRyIYyUsXmI7puNEg4zessKtrb_k-pq3Kige9CeDemt814aPR2I8h8fBpVRAeEJVoFUTxVN6Qnjp7etSbwRarT87Ix_WmHlmDw1GmHv5lPNTVTl-VKJmSbpCE1M5UDsVHCqdAjAF13_ZVwV2yyyumQm2b7RxxKUZDpv_O9oezp3d_sQfVFnywBu7DqHtfliIyN6WZzUZMcYR_1OXn2PkCAcGdwEQN_PlBhxBN5EtJUvvuuhVL"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold text-primary">
                        <span>Sarah J.</span>
                        <span>3 Questions</span>
                      </div>
                      <div className="w-full bg-surface-container h-1 mt-1 rounded-full">
                        <div className="bg-primary h-full" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      alt="Student"
                      className="w-8 h-8 rounded-full"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4Lj-ns-EH9zuih3ZTqXlHC7E1roXOGg5UftX_45N0XKk7nj4Jd_bbWHNrODcTl0HCUa6MGtbsqeF7NraBvci5QnFmTEmUrMwkQncfwxIJb0c7kQs5I6meWjWufkbY73JSGrX1kvVNek8cr3MsYDhgc52AXQcJGN6-FQRkmw63-xZ9AGajpd63JnfY9zrLq2HVRIWb3KbU-vAuMwHF4H8njTjf52gPJ4-GB--uOCF23VYCmgPH2p4QAgbfiDtNtqzbAdy8E_gtUDOc"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold text-primary">
                        <span>Ahmed K.</span>
                        <span>2 Questions</span>
                      </div>
                      <div className="w-full bg-surface-container h-1 mt-1 rounded-full">
                        <div className="bg-primary h-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <span className="material-symbols-outlined text-primary">history</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">Session Duration</p>
                <p className="text-lg font-bold text-primary">01:24:05</p>
              </div>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <span className="material-symbols-outlined text-secondary">groups</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">Students Present</p>
                <p className="text-lg font-bold text-primary">28 / 32</p>
              </div>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl flex items-center gap-4 border border-primary/10">
              <div className="p-3 bg-primary-container rounded-lg shadow-sm">
                <span className="material-symbols-outlined text-on-primary-container">smart_toy</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">AI Insights Logged</p>
                <p className="text-lg font-bold text-primary">142</p>
              </div>
            </div>

            <div className="bg-error-container/30 p-5 rounded-xl flex items-center gap-4 border border-error/10">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <span className="material-symbols-outlined text-error">warning</span>
              </div>
              <div>
                <p className="text-xs text-error font-medium">Anomalies Detected</p>
                <p className="text-lg font-bold text-error">2</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
