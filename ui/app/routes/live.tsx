import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { EngagementChart, ActivityBreakdown } from "../components/live/Charts";
import { DetectionStreamLog } from "../components/live/DetectionStreamLog";
import { IncidentSnapshots } from "../components/live/IncidentSnapshots";
import { LiveSessionHeader } from "../components/live/LiveSessionHeader";
import { getAssignedClassByCode, type ManagedClass } from "../features/classes/data";

type DetectionStatus = "FOCUSED" | "DISTRACTED" | "CONFUSED";

type DetectionBox = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  score: number;
  student: string;
  status: DetectionStatus;
};

type StreamLog = {
  id: string;
  time: string;
  level: "INFO" | "WARN" | "EMERGENCY";
  message: string;
  snapshotUrl?: string;
};

type PlaybackSession = {
  id: string;
  label: string;
  startMinutes: number;
  endMinutes: number;
};

const STUDENTS = ["Leo M.", "Sarah J.", "Ahmed K.", "Nora P.", "Mina T.", "Quang N."];

const STATUS_STYLES: Record<DetectionStatus, { stroke: string; badge: string }> = {
  FOCUSED: { stroke: "#3b82f6", badge: "#dbeafe" },
  DISTRACTED: { stroke: "#ef4444", badge: "#fee2e2" },
  CONFUSED: { stroke: "#f59e0b", badge: "#fef3c7" },
};

function randomFrom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function formatMinutesToClock(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function isInClassSlot(selectedClass: ManagedClass, now: Date) {
  const today = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return (
    selectedClass.dayIndexes.includes(today) &&
    currentMinutes >= selectedClass.startMinutes &&
    currentMinutes <= selectedClass.endMinutes
  );
}

function buildPlaybackSessions(selectedClass: ManagedClass, now: Date): PlaybackSession[] {
  const sessions: PlaybackSession[] = [];
  const probe = new Date(now);

  for (let back = 1; back <= 45 && sessions.length < 6; back += 1) {
    probe.setDate(now.getDate() - back);
    if (!selectedClass.dayIndexes.includes(probe.getDay())) {
      continue;
    }

    sessions.push({
      id: `playback-${probe.toISOString().slice(0, 10)}`,
      label: `${probe.toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      })} • ${formatMinutesToClock(selectedClass.startMinutes)} - ${formatMinutesToClock(selectedClass.endMinutes)}`,
      startMinutes: selectedClass.startMinutes,
      endMinutes: selectedClass.endMinutes,
    });
  }

  return sessions;
}

function createMockBox(i: number): DetectionBox {
  const statusRoll = Math.random();
  const status: DetectionStatus = statusRoll > 0.85 ? "DISTRACTED" : statusRoll > 0.65 ? "CONFUSED" : "FOCUSED";

  return {
    id: `box-${Date.now()}-${i}`,
    x: Math.random() * 0.72 + 0.03,
    y: Math.random() * 0.62 + 0.04,
    w: Math.random() * 0.09 + 0.1,
    h: Math.random() * 0.14 + 0.2,
    score: Math.floor(Math.random() * 20) + 78,
    student: randomFrom(STUDENTS),
    status,
  };
}

export function meta() {
  return [
    { title: "Live Session Dashboard" },
    {
      name: "description",
      content: "Real-time classroom AI analytics stream with bounding boxes and warning log.",
    },
  ];
}

type MetricData = {
  time: string;
  engagement: number;
  focus: number;
  focusedCount: number;
  distractedCount: number;
  confusedCount: number;
};

export default function LiveDashboard() {
  const [searchParams] = useSearchParams();
  const selectedClassCode = searchParams.get("class") ?? "ECON-402";
  const selectedClass = getAssignedClassByCode(selectedClassCode);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const [showStreamInfo, setShowStreamInfo] = useState(true);

  const playbackMinuteRef = useRef(selectedClass.startMinutes);
  const [timelineSelection, setTimelineSelection] = useState<string>("live-now");
  const [emergencyLog, setEmergencyLog] = useState<StreamLog | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<MetricData[]>([]);
  const [boxes, setBoxes] = useState<DetectionBox[]>(() => Array.from({ length: 4 }, (_, i) => createMockBox(i)));
  const [incidentLogs, setIncidentLogs] = useState<StreamLog[]>([]);
  const [streamLogs, setStreamLogs] = useState<StreamLog[]>(() => [
    {
      id: "seed-log-1",
      time: new Date().toLocaleTimeString("vi-VN"),
      level: "INFO",
      message: "Live stream connected. Receiving detection packets.",
    },
  ]);

  const playbackSessions = useMemo(() => buildPlaybackSessions(selectedClass, currentTime), [selectedClass, currentTime]);
  const selectedPlaybackSession = useMemo(
    () => playbackSessions.find((item) => item.id === timelineSelection) ?? null,
    [playbackSessions, timelineSelection],
  );
  const isCurrentSlotActive = useMemo(() => isInClassSlot(selectedClass, currentTime), [selectedClass, currentTime]);
  const isLiveMode = timelineSelection === "live-now" && isCurrentSlotActive;
  const playbackStartMinutes = selectedPlaybackSession?.startMinutes ?? selectedClass.startMinutes;
  const playbackEndMinutes = selectedPlaybackSession?.endMinutes ?? selectedClass.endMinutes;
  const sessionWindow = `${formatMinutesToClock(selectedClass.startMinutes)} - ${formatMinutesToClock(selectedClass.endMinutes)}`;
  const warningCount = useMemo(() => streamLogs.filter((item) => item.level === "WARN").length, [streamLogs]);

  useEffect(() => {
    playbackMinuteRef.current = selectedClass.startMinutes;
  }, [selectedClass]);

  useEffect(() => {
    setTimelineSelection("live-now");
  }, [selectedClass.code]);

  useEffect(() => {
    playbackMinuteRef.current = selectedPlaybackSession?.startMinutes ?? selectedClass.startMinutes;
  }, [selectedPlaybackSession, selectedClass]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (emergencyLog) {
      const timer = setTimeout(() => setEmergencyLog(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [emergencyLog]);

  useEffect(() => {
    const streamInterval = window.setInterval(() => {
      const nextBoxes = Array.from({ length: Math.floor(Math.random() * 3) + 4 }, (_, i) => createMockBox(i));
      setBoxes(nextBoxes);

      let streamTime = new Date().toLocaleTimeString("vi-VN");
      if (!isLiveMode) {
        let nextMinute = playbackMinuteRef.current + 1;
        if (nextMinute > playbackEndMinutes) {
          nextMinute = playbackStartMinutes;
        }
        playbackMinuteRef.current = nextMinute;
        streamTime = formatMinutesToClock(nextMinute);
      }

      const focused = nextBoxes.filter(b => b.status === "FOCUSED").length;
      const distracted = nextBoxes.filter(b => b.status === "DISTRACTED").length;
      const confused = nextBoxes.filter(b => b.status === "CONFUSED").length;
      const avgFocus = Math.round(nextBoxes.reduce((acc, box) => acc + box.score, 0) / nextBoxes.length);
      const engagement = Math.round((focused / nextBoxes.length) * 100);

      setMetricsHistory((prev) => {
        const next = [...prev, {
          time: streamTime,
          engagement,
          focus: avgFocus,
          focusedCount: focused,
          distractedCount: distracted,
          confusedCount: confused,
        }];
        return next.slice(-20);
      });

      const warningRoll = Math.random();

      if (warningRoll > 0.985) {
        const suspicious = randomFrom(nextBoxes.filter((item) => item.status !== "FOCUSED")) ?? randomFrom(nextBoxes);
        const newLog: StreamLog = {
          id: `log-${Date.now()}`,
          time: streamTime,
          level: "EMERGENCY",
          message: `CRITICAL ALERT: ${suspicious.student} requires immediate attention! Signal lost or repeatedly disruptive.`,
          snapshotUrl: `https://picsum.photos/seed/${Date.now()}/320/180`
        };
        setEmergencyLog(newLog);
        setIncidentLogs(prev => [newLog, ...prev].slice(0, 20));
        
        try {
          const audio = new Audio('/gey-echo.mp3');
          audio.volume = 0.5;
          audio.play().catch(e => console.error("Audio playback failed:", e));
        } catch(e) {}
        
        setStreamLogs((prev) => {
          const next = [...prev];
          next.unshift(newLog);
          return next.slice(0, 9);
        });
      } else {
        setStreamLogs((prev) => {
          const next = [...prev];

          if (warningRoll > 0.84) {
            const suspicious = randomFrom(nextBoxes.filter((item) => item.status !== "FOCUSED")) ?? randomFrom(nextBoxes);
            const warnLog: StreamLog = {
              id: `log-${Date.now()}`,
              time: streamTime,
              level: "WARN",
              message: `${suspicious.student}: ${suspicious.status.toLowerCase()} signal (${suspicious.score}%).`,
              snapshotUrl: `https://picsum.photos/seed/${Date.now()}/320/180`
            };
            setIncidentLogs(prevIncidents => [warnLog, ...prevIncidents].slice(0, 20));
            next.unshift(warnLog);
          } else {
            next.unshift({
              id: `log-${Date.now()}`,
              time: streamTime,
              level: "INFO",
              message: isLiveMode
                ? `${nextBoxes.length} bounding boxes synced from live server packet.`
                : `${nextBoxes.length} bounding boxes synced from playback timeline.`,
            });
          }

          return next.slice(0, 9);
        });
      }
    }, 650);

    return () => window.clearInterval(streamInterval);
  }, [isLiveMode, playbackStartMinutes, playbackEndMinutes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let rafId = 0;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.clearRect(0, 0, width, height);

      boxes.forEach((box) => {
        const style = STATUS_STYLES[box.status];
        const x = box.x * width;
        const y = box.y * height;
        const w = box.w * width;
        const h = box.h * height;

        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = 2.2;
        ctx.strokeRect(x, y, w, h);

        const label = `${box.student} • ${box.status} • ${box.score}%`;
        ctx.font = "bold 12px 'Segoe UI', sans-serif";
        const textWidth = ctx.measureText(label).width + 16;
        const labelY = Math.max(6, y - 24);

        ctx.fillStyle = style.badge;
        ctx.fillRect(x, labelY, textWidth, 20);
        ctx.fillStyle = "#0f172a";
        ctx.fillText(label, x + 8, labelY + 14);
      });

      rafId = window.requestAnimationFrame(draw);
    };

    rafId = window.requestAnimationFrame(draw);

    return () => window.cancelAnimationFrame(rafId);
  }, [boxes]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setVideoTime(time);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const padTime = (num: number) => Math.floor(num).toString().padStart(2, "0");
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    return `${padTime(time / 60)}:${padTime(time % 60)}`;
  };
  return (
    <main className="bg-background text-on-surface font-body flex flex-col h-full overflow-hidden">
      <section className="flex-1 flex flex-col overflow-hidden">
        {emergencyLog && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-rose-600 text-white px-6 py-3 rounded-lg shadow-xl shadow-rose-600/30 flex items-center gap-4 animate-in slide-in-from-top-4 fade-in duration-300">
            <span className="material-symbols-outlined text-3xl animate-pulse">warning</span>
            <div>
              <p className="font-bold text-lg tracking-tight uppercase">Emergency Alert - {emergencyLog.time}</p>
              <p className="text-rose-100 text-sm">{emergencyLog.message}</p>
            </div>
            <button 
              onClick={() => setEmergencyLog(null)}
              className="ml-4 p-1 hover:bg-rose-700 rounded-md transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <LiveSessionHeader
            selectedClass={selectedClass}
            isLiveMode={isLiveMode}
            selectedPlaybackLabel={selectedPlaybackSession?.label}
            timelineSelection={timelineSelection}
            playbackSessions={playbackSessions}
            sessionWindow={sessionWindow}
            warningCount={warningCount}
            onTimelineChange={setTimelineSelection}
          />

          <div className="grid grid-cols-12 gap-6 flex-1 w-full transition-all duration-500">
            <div className={`self-start relative rounded-xl bg-black shadow-sm border border-slate-800 flex flex-col overflow-hidden transition-all duration-500 col-span-12 ${isVideoFullscreen ? 'h-[85vh]' : 'xl:col-span-8'}`}>
              
              {/* Video Area */}
              <div className="relative w-full flex-1 bg-black group min-h-0 aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  src="/SECURUS CCTV - 2 Megapixel IP Camera with Audio Classroom Solution.mp4"
                  autoPlay
                  muted={isVideoMuted}
                  loop
                  title="Classroom Live Feed"
                  onTimeUpdate={() => videoRef.current && setVideoTime(videoRef.current.currentTime)}
                  onLoadedMetadata={() => videoRef.current && setVideoDuration(videoRef.current.duration)}
                  onClick={togglePlay}
                />

                <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />

                {showStreamInfo && (
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <div className="glass-overlay p-4 rounded-xl border border-white/20 pointer-events-auto">
                      <h4 className="text-xs font-bold text-primary mb-2 uppercase tracking-tighter">Server Stream</h4>
                      <div className="space-y-1 text-[11px] text-slate-700">
                        <p>Mode: {isLiveMode ? "Live" : "Playback"}</p>
                        <p>Session slot: {sessionWindow}</p>
                        <p>Packet rate: ~1.5 Hz</p>
                        <p>Objects: {boxes.length} active</p>
                        <p className="text-error font-semibold">Warnings: {warningCount}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Custom Playback Bar (Static below video) */}
              <div className="p-4 bg-slate-900 border-t  w-full shrink-0">
                <div className="flex flex-col gap-3 w-full">
                  
                  {/* Timeline with intervals */}
                  <div className="relative">
                    <div className="text-white text-xs font-mono mb-2">2025-04-23 11:15:48</div>
                    
                    {/* Time ticks overlay */}
                    <div className="flex justify-between text-white/70 text-[10px] font-mono px-4 mb-1">
                      <span>11:12</span>
                      <span>11:13</span>
                      <span>11:14</span>
                      <span>11:15</span>
                      <span className="text-white">11:16</span>
                      <span>11:17</span>
                      <span>11:18</span>
                    </div>

                    {/* Scrub bar */}
                    <div className="relative w-full h-3 bg-slate-800 overflow-hidden shrink-0 group/scrub flex border-b border-slate-500/50">
                      {/* Timeline colored blocks (mocked to match the image) */}
                      <div className="h-full bg-blue-500 w-[15%]"></div>
                      <div className="h-full bg-orange-400 w-[8%]"></div>
                      <div className="h-full bg-blue-500 w-[12%]"></div>
                      <div className="h-full bg-orange-400 w-[10%]"></div>
                      <div className="h-full bg-blue-500 w-[6%]"></div>
                      <div className="h-full bg-orange-400 w-[10%]"></div>
                      <div className="h-full bg-transparent w-[14%] relative border-l border-orange-500">
                        <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)]" />
                      </div>
                      <div className="h-full bg-yellow-400 w-[12%]"></div>
                      <div className="h-full bg-blue-500 w-[10%]"></div>
                      <div className="h-full bg-yellow-400 w-[15%]"></div>
                      <div className="h-full bg-blue-500 w-[8%]"></div>

                      <input
                        type="range"
                        min="0"
                        max={videoDuration || 0}
                        value={videoTime}
                        onChange={handleSeek}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center justify-between text-white/90 mt-2 px-2">
                    <div className="flex items-center gap-6">
                      <button onClick={() => setIsVideoMuted(!isVideoMuted)} className="hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[24px]">
                          {isVideoMuted ? 'volume_off' : 'volume_up'}
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center gap-6">
                      
                      <div className="flex items-center gap-4 ml-4">
                        <button onClick={() => skipTime(-10)} className="hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[28px]">fast_rewind</span>
                        </button>
                        <button onClick={togglePlay} className="hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[32px]">{isPlaying ? 'pause' : 'play_arrow'}</span>
                        </button>
                        <button onClick={() => skipTime(10)} className="hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[28px]">fast_forward</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <button onClick={() => setShowStreamInfo(!showStreamInfo)} className={`transition-colors ${showStreamInfo ? 'text-primary' : 'hover:text-white text-white/70'}`} title="Toggle Stream Info">
                        <span className="material-symbols-outlined text-[24px]">info</span>
                      </button>
                      <button onClick={() => setIsVideoFullscreen(!isVideoFullscreen)} className="hover:text-white transition-colors" title="Toggle Fullscreen">
                        <span className="material-symbols-outlined text-[24px]">
                          {isVideoFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`flex flex-col gap-6 transition-all duration-500 w-full col-span-12 ${isVideoFullscreen ? 'xl:col-span-12 flex-row flex-wrap' : 'xl:col-span-4'}`}>
              <EngagementChart metricsHistory={metricsHistory} isVideoFullscreen={isVideoFullscreen} />
              <ActivityBreakdown metricsHistory={metricsHistory} isVideoFullscreen={isVideoFullscreen} />
            </div>
          </div>

          <section className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <DetectionStreamLog
              streamLogs={streamLogs}
              isVideoFullscreen={false}
              className="h-[360px] min-h-0 bg-white"
            />
            <IncidentSnapshots incidentLogs={incidentLogs} className="h-[360px] min-h-0" />
          </section>
        </div>
      </section>
    </main>
  );
}
