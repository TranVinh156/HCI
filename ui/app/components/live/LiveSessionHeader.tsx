import { Link } from "react-router";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type PlaybackSessionOption = {
  id: string;
  label: string;
};

type SelectedClassSummary = {
  code: string;
  room: string;
  subject: string;
  schedule: string;
  studentCount: number;
};

export function LiveSessionHeader({
  selectedClass,
  isLiveMode,
  selectedPlaybackLabel,
  timelineSelection,
  playbackSessions,
  sessionWindow,
  warningCount,
  onTimelineChange,
}: {
  selectedClass: SelectedClassSummary;
  isLiveMode: boolean;
  selectedPlaybackLabel?: string | null;
  timelineSelection: string;
  playbackSessions: PlaybackSessionOption[];
  sessionWindow: string;
  warningCount: number;
  onTimelineChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className={`${isLiveMode ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"} gap-2 rounded-full px-3 py-1.5 text-xs font-semibold`}
          >
            <span className="material-symbols-outlined text-sm filled">sensors</span>
            {isLiveMode ? "LIVE FEED ACTIVE" : "PLAYBACK MODE"}
          </Badge>
          <p className="truncate text-sm font-semibold text-slate-900">
            {selectedClass.code} • Room {selectedClass.room} • {selectedClass.subject}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600">
            Duration: <span className="font-bold text-slate-900">01:24:05</span>
          </span>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600">
            Students: <span className="font-bold text-slate-900">28/{selectedClass.studentCount}</span>
          </span>
          <span className="rounded-md border border-sky-100 bg-sky-50 px-2 py-1 text-sky-700">
            AI Logs: <span className="font-bold text-sky-900">142</span>
          </span>
          <span className="rounded-md border border-rose-100 bg-rose-50 px-2 py-1 text-rose-700">
            Anomalies: <span className="font-bold text-rose-900">{warningCount}</span>
          </span>
        </div>
        <p className="text-sm text-on-surface-variant">{selectedClass.schedule}</p>
        {!isLiveMode && timelineSelection === "live-now" && (
          <p className="mt-2 text-xs font-semibold text-amber-700">
            Outside current class time. Showing playback for session window {sessionWindow} ({selectedClass.schedule}).
          </p>
        )}
        {!isLiveMode && selectedPlaybackLabel && (
          <p className="mt-2 text-xs font-semibold text-sky-700">Playback session: {selectedPlaybackLabel}</p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3 xl:justify-end">
        <Button asChild variant="secondary" className="shrink-0">
          <Link to="/" title="Back to Class Management">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span className="text-sm font-medium">Back</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-500" title="Session Timeline">
            history
          </span>
          <select
            value={timelineSelection}
            onChange={(event) => onTimelineChange(event.target.value)}
            className="min-w-48 rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary/50 xl:min-w-72"
            title="Session Timeline"
          >
            <option value="live-now">Live now</option>
            {playbackSessions.map((session) => (
              <option key={session.id} value={session.id}>
                Playback: {session.label}
              </option>
            ))}
          </select>
        </div>

        <Button variant="default" size="icon" title="Export Session">
          <span className="material-symbols-outlined text-[20px]">download</span>
        </Button>
      </div>
    </div>
  );
}
