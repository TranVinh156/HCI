type StreamLog = {
  id: string;
  time: string;
  level: "INFO" | "WARN" | "EMERGENCY";
  message: string;
  snapshotUrl?: string;
};

export function IncidentSnapshots({ incidentLogs }: { incidentLogs: StreamLog[] }) {
  if (incidentLogs.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 mt-2">
      <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
        <span className="material-symbols-outlined text-rose-500">photo_library</span>
        Incident Snapshots
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
        {incidentLogs.map((log) => (
          <div key={log.id} className="min-w-[280px] max-w-[280px] rounded-xl border border-slate-200 bg-white shadow-sm snap-start shrink-0 flex flex-col group overflow-hidden">
            <div className="relative h-40 bg-slate-100 overflow-hidden">
              <img src={log.snapshotUrl} alt="Incident snapshot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                <span className="text-white text-xs font-bold font-mono tracking-wider">{log.time}</span>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <span className={`self-start rounded-full px-2 py-0.5 text-[10px] font-bold ${
                log.level === "EMERGENCY" ? "animate-pulse bg-rose-600 text-white" : "bg-amber-100 text-amber-700"
              }`}>
                {log.level}
              </span>
              <p className="text-xs font-medium text-slate-700 line-clamp-2" title={log.message}>{log.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
