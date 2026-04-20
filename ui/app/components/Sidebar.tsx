

export type SidebarTab = "home" | "live" | "analytics" | "students" | "ai";

export function Sidebar({ 
  isOpen, 
  onClose, 
  activeTab,
  liveClassUrl 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  activeTab: SidebarTab;
  liveClassUrl?: string;
}) {
  return (
    <aside
      className={`h-screen left-0 sticky flex flex-col gap-2 font-medium text-sm transition-all duration-300 ease-in-out z-30 overflow-hidden ${
        isOpen ? "w-72 p-4 bg-white border-r-2 border-slate-200 shadow-[4px_0_24px_rgba(15,23,42,0.08)]" : "w-0 p-0 border-r-0"
      }`}
    >
      <div className="px-4 py-6">
        <div className="flex justify-end mb-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Hide sidebar"
          >
            <span className="material-symbols-outlined">left_panel_close</span>
          </button>
        </div>
        <h1 className="font-headline font-extrabold text-sky-900 text-2xl tracking-tight">The Insightful Lens</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">AI Classroom Observer</p>
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        <a 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${activeTab === 'home' ? 'bg-sky-100 text-sky-900 font-semibold' : 'text-slate-600 hover:text-sky-800 hover:bg-slate-200'}`} 
          href="/"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span>Class Management</span>
        </a>
        
        {liveClassUrl && (
          <a 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${activeTab === 'live' ? 'bg-sky-100 text-sky-900 font-semibold' : 'text-slate-600 hover:text-sky-800 hover:bg-slate-200'}`} 
            href={liveClassUrl}
          >
            <span className="material-symbols-outlined">videocam</span>
            <span>Live Session</span>
          </a>
        )}

        <a 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${activeTab === 'analytics' ? 'bg-sky-100 text-sky-900 font-semibold' : 'text-slate-600 hover:text-sky-800 hover:bg-slate-200'}`} 
          href="/session-analytics"
        >
          <span className="material-symbols-outlined">analytics</span>
          <span>Session Analytics</span>
        </a>
        <a 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${activeTab === 'students' ? 'bg-sky-100 text-sky-900 font-semibold' : 'text-slate-600 hover:text-sky-800 hover:bg-slate-200'}`} 
          href="/student-profiles"
        >
          <span className="material-symbols-outlined">group</span>
          <span>Student Profiles</span>
        </a>
        <a 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${activeTab === 'ai' ? 'bg-sky-100 text-sky-900 font-semibold' : 'text-slate-600 hover:text-sky-800 hover:bg-slate-200'}`} 
          href="/ai-configuration"
        >
          <span className="material-symbols-outlined">settings_suggest</span>
          <span>AI Configuration</span>
        </a>
      </nav>
    </aside>
  );
}
