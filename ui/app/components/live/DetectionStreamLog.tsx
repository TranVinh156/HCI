type StreamLog = {
  id: string;
  time: string;
  level: "INFO" | "WARN" | "EMERGENCY";
  message: string;
  snapshotUrl?: string;
};

export function DetectionStreamLog({ streamLogs, isVideoFullscreen }: { streamLogs: StreamLog[], isVideoFullscreen: boolean }) {
  return (
    <div className={`flex flex-col rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 ${isVideoFullscreen ? "h-64 flex-1 min-w-[300px]" : "min-h-[300px] w-full flex-1"}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-on-surface-variant text-sm font-medium">Detection Stream Log</h3>
        <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-[10px] font-bold text-primary">LIVE</span>
      </div>
      <div className="flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/70">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10 bg-slate-100 text-slate-500 uppercase tracking-wider shadow-sm">
            <tr>
              <th className="text-left p-2">Time</th>
              <th className="text-left p-2">Level</th>
              <th className="text-left p-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {streamLogs.map((entry) => (
              <tr key={entry.id} className={`border-t border-slate-200/80 ${entry.level === "EMERGENCY" ? "bg-rose-50/50" : ""}`}>
                <td className="p-2 text-slate-600 whitespace-nowrap">{entry.time}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold ${
                      entry.level === "EMERGENCY"
                        ? "animate-pulse bg-rose-600 text-white"
                        : entry.level === "WARN"
                          ? "bg-error-container text-error"
                          : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {entry.level}
                  </span>
                </td>
                <td className={`p-2 ${entry.level === "EMERGENCY" ? "text-rose-800 font-bold" : "text-slate-700"}`}>
                  {entry.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
