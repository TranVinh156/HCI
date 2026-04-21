import { cn } from "../../lib/utils";

type StreamLog = {
  id: string;
  time: string;
  level: "INFO" | "WARN" | "EMERGENCY";
  message: string;
  snapshotUrl?: string;
};

export function IncidentSnapshots({
  incidentLogs,
  className,
}: {
  incidentLogs: StreamLog[];
  className?: string;
}) {
  return (
    <div className={cn("flex h-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5", className)}>
      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
        <span className="material-symbols-outlined text-rose-500">photo_library</span>
        Incident Snapshots
      </h3>
      {incidentLogs.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
          No incident snapshots recorded yet.
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
          {incidentLogs.map((log) => (
            <div
              key={log.id}
              className="group flex min-w-[280px] max-w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img
                  src={log.snapshotUrl}
                  alt="Incident snapshot"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3">
                  <span className="font-mono text-xs font-bold tracking-wider text-white">{log.time}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <span
                  className={`self-start rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    log.level === "EMERGENCY" ? "animate-pulse bg-rose-600 text-white" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {log.level}
                </span>
                <p className="line-clamp-2 text-xs font-medium text-slate-700" title={log.message}>
                  {log.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
