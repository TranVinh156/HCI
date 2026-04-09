import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/home";

type CameraStatus = "online" | "offline";
type WarningType = "blur" | "signal" | "occlusion";
type Area = "A-Block" | "B-Block" | "C-Block" | "D-Block";
type TimePreset = "5m" | "1h" | "24h";
type ActiveView = "live" | "dashboard" | "playback" | "alerts";

interface Camera {
  id: string;
  name: string;
  area: Area;
  status: CameraStatus;
  fps: number;
  bitrate: number;
  warnings: WarningType[];
  blur: number;
  brightness: number;
  frameDrop: number;
  lastSeen: string;
}

interface AlertEvent {
  id: string;
  cameraId: string;
  severity: "high" | "medium" | "low";
  type: WarningType | "offline";
  message: string;
  at: string;
  second: number;
}

const areas: Area[] = ["A-Block", "B-Block", "C-Block", "D-Block"];

const makeCameras = (): Camera[] =>
  Array.from({ length: 48 }, (_, i) => {
    const area = areas[i % areas.length];
    const status: CameraStatus = i % 11 === 0 ? "offline" : "online";
    const warningSeed = i % 6;
    const warnings: WarningType[] = [];
    if (warningSeed === 0 || warningSeed === 3) warnings.push("blur");
    if (warningSeed === 1 || warningSeed === 5) warnings.push("signal");
    if (warningSeed === 2 || warningSeed === 4) warnings.push("occlusion");

    return {
      id: `CAM-${String(i + 1).padStart(3, "0")}`,
      name: `Class ${String(i + 1).padStart(2, "0")}`,
      area,
      status,
      fps: status === "offline" ? 0 : 16 + (i % 15),
      bitrate: status === "offline" ? 0 : 1300 + (i % 8) * 350,
      warnings,
      blur: 18 + ((i * 7) % 64),
      brightness: 28 + ((i * 11) % 57),
      frameDrop: ((i * 3) % 19) / 10,
      lastSeen: status === "offline" ? `${1 + (i % 5)}m ago` : "Live",
    };
  });

const baseCameras = makeCameras();

const defaultAlerts: AlertEvent[] = [
  {
    id: "A-01",
    cameraId: "CAM-003",
    severity: "high",
    type: "blur",
    message: "Blur > threshold for 36s",
    at: "09:42:10",
    second: 138,
  },
  {
    id: "A-02",
    cameraId: "CAM-011",
    severity: "high",
    type: "offline",
    message: "Offline for 1m 12s",
    at: "09:41:28",
    second: 96,
  },
  {
    id: "A-03",
    cameraId: "CAM-021",
    severity: "medium",
    type: "occlusion",
    message: "Lens occlusion detected",
    at: "09:39:47",
    second: 224,
  },
  {
    id: "A-04",
    cameraId: "CAM-009",
    severity: "medium",
    type: "signal",
    message: "Signal unstable and frame jitter",
    at: "09:38:17",
    second: 182,
  },
];

const trendBlur = [31, 36, 41, 40, 46, 54, 49, 55, 57, 52, 48, 45];
const trendBrightness = [58, 55, 52, 47, 43, 49, 51, 53, 56, 60, 63, 59];
const trendDrop = [1, 2, 3, 2, 5, 8, 7, 6, 4, 5, 3, 2];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Classroom AI Quality Ops" },
    {
      name: "description",
      content:
        "UI-only control center for live monitoring, quality analytics, playback investigation, and alert management.",
    },
  ];
}

function Sparkline({
  values,
  color,
}: {
  values: number[];
  color: string;
}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / Math.max(max - min, 1)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="sparkline">
      <polyline points={points} fill="none" stroke={color} strokeWidth="3" />
    </svg>
  );
}

function warningLabel(type: WarningType | "offline") {
  if (type === "offline") return "Offline";
  if (type === "blur") return "Blur";
  if (type === "signal") return "Signal";
  return "Occlusion";
}

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>("live");
  const [cameraOrder, setCameraOrder] = useState<string[]>(() => {
    if (typeof window === "undefined") return baseCameras.map((c) => c.id);
    const saved = window.localStorage.getItem("camera-order");
    if (!saved) return baseCameras.map((c) => c.id);

    try {
      const parsed = JSON.parse(saved) as string[];
      return parsed.length > 0 ? parsed : baseCameras.map((c) => c.id);
    } catch {
      return baseCameras.map((c) => c.id);
    }
  });
  const [gridSize, setGridSize] = useState<number>(() => {
    if (typeof window === "undefined") return 3;
    const saved = Number(window.localStorage.getItem("camera-grid-size") ?? "3");
    return Number.isFinite(saved) ? Math.min(Math.max(saved, 2), 10) : 3;
  });
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState<Area | "all">("all");
  const [statusFilter, setStatusFilter] = useState<CameraStatus | "all">("all");
  const [issueOnly, setIssueOnly] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [timePreset, setTimePreset] = useState<TimePreset>("1h");
  const [errorFilter, setErrorFilter] = useState<WarningType | "all">("all");
  const [playbackSecond, setPlaybackSecond] = useState(120);
  const [syncMode, setSyncMode] = useState(true);
  const [alerts, setAlerts] = useState<AlertEvent[]>(defaultAlerts);
  const [toasts, setToasts] = useState<AlertEvent[]>([]);

  const orderedCameras = useMemo(() => {
    const byId = new Map(baseCameras.map((cam) => [cam.id, cam]));
    const listed = cameraOrder.map((id) => byId.get(id)).filter(Boolean) as Camera[];
    if (listed.length === baseCameras.length) return listed;

    const missing = baseCameras.filter((cam) => !cameraOrder.includes(cam.id));
    return [...listed, ...missing];
  }, [cameraOrder]);

  const filteredCameras = useMemo(() => {
    return orderedCameras.filter((cam) => {
      const textPass =
        search.trim().length === 0 ||
        cam.name.toLowerCase().includes(search.toLowerCase()) ||
        cam.id.toLowerCase().includes(search.toLowerCase());
      const areaPass = areaFilter === "all" || cam.area === areaFilter;
      const statusPass = statusFilter === "all" || cam.status === statusFilter;
      const issuePass = !issueOnly || cam.status === "offline" || cam.warnings.length > 0;
      return textPass && areaPass && statusPass && issuePass;
    });
  }, [orderedCameras, search, areaFilter, statusFilter, issueOnly]);

  const visibleCameras = filteredCameras.slice(0, gridSize * gridSize);
  const onlineCount = orderedCameras.filter((c) => c.status === "online").length;
  const offlineCount = orderedCameras.length - onlineCount;
  const issueCount = orderedCameras.filter(
    (c) => c.status === "offline" || c.warnings.length > 0,
  ).length;

  const topDefect = useMemo(() => {
    return [...orderedCameras]
      .sort((a, b) => b.blur + b.frameDrop * 10 - (a.blur + a.frameDrop * 10))
      .slice(0, 6);
  }, [orderedCameras]);

  const areaHeatmap = useMemo(() => {
    return areas.map((area) => {
      const inArea = orderedCameras.filter((c) => c.area === area);
      const score = Math.round(
        inArea.reduce((sum, cam) => sum + cam.blur + cam.frameDrop * 10, 0) /
          Math.max(inArea.length, 1),
      );
      return { area, score };
    });
  }, [orderedCameras]);

  const playbackCamera =
    selectedCamera ?? orderedCameras.find((cam) => cam.status === "online") ?? orderedCameras[0];

  const playbackEvents = alerts
    .filter((a) => a.cameraId === playbackCamera?.id)
    .sort((a, b) => a.second - b.second);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("camera-grid-size", String(gridSize));
    }
  }, [gridSize]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("camera-order", JSON.stringify(cameraOrder));
    }
  }, [cameraOrder]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const target = orderedCameras[(Date.now() / 1000) % orderedCameras.length | 0];
      const eventTypes: Array<WarningType | "offline"> = ["blur", "signal", "occlusion", "offline"];
      const eventType = eventTypes[(Date.now() / 2000) % eventTypes.length | 0];
      const seededSecond = 40 + ((Date.now() / 1000) % 260 | 0);
      const newAlert: AlertEvent = {
        id: `A-${Date.now()}`,
        cameraId: target.id,
        severity: eventType === "offline" ? "high" : "medium",
        type: eventType,
        message:
          eventType === "offline"
            ? `${target.id} offline > 1 minute`
            : `${warningLabel(eventType)} score exceeded threshold`,
        at: new Date().toLocaleTimeString("en-GB", { hour12: false }),
        second: seededSecond,
      };
      setAlerts((prev) => [newAlert, ...prev].slice(0, 40));
      setToasts((prev) => [newAlert, ...prev].slice(0, 3));
    }, 9000);

    return () => window.clearInterval(timer);
  }, [orderedCameras]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = window.setTimeout(() => {
      setToasts((prev) => prev.slice(0, -1));
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [toasts]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "f") {
        const target = selectedCamera ?? visibleCameras[0];
        if (target) setSelectedCamera(target);
      }
      if (event.key === "ArrowLeft") {
        setPlaybackSecond((s) => Math.max(0, s - 1));
      }
      if (event.key === "ArrowRight") {
        setPlaybackSecond((s) => Math.min(300, s + 1));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedCamera, visibleCameras]);

  const jumpToPlayback = (camId: string, second: number) => {
    const cam = orderedCameras.find((c) => c.id === camId);
    if (!cam) return;
    setSelectedCamera(cam);
    setPlaybackSecond(second);
    setActiveView("playback");
  };

  const handleDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    const next = [...cameraOrder];
    const from = next.indexOf(draggingId);
    const to = next.indexOf(targetId);
    if (from === -1 || to === -1) return;

    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setCameraOrder(next);
    setDraggingId(null);
  };

  return (
    <main className="ops-shell">
      <header className="ops-topbar">
        <div>
          <p className="eyebrow">Classroom Quality Ops</p>
          <h1>AI Camera Monitoring Center</h1>
        </div>
        <div className="status-strip">
          <span className="chip chip-online">Online {onlineCount}</span>
          <span className="chip chip-offline">Offline {offlineCount}</span>
          <span className="chip chip-warn">Issues {issueCount}</span>
          <button
            className={`chip ${issueOnly ? "chip-active" : ""}`}
            onClick={() => setIssueOnly((v) => !v)}
          >
            Highlight Issues
          </button>
        </div>
      </header>

      <section className="view-switch">
        {[
          ["live", "Live Monitoring"],
          ["dashboard", "Quality Dashboard"],
          ["playback", "Playback / Investigation"],
          ["alerts", "Alert & Notification"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={activeView === key ? "active" : ""}
            onClick={() => setActiveView(key as ActiveView)}
          >
            {label}
          </button>
        ))}
      </section>

      {activeView === "live" && (
        <section className="live-layout">
          <aside className="camera-sidebar">
            <div className="panel-head">
              <h2>Camera Directory</h2>
              <p>{filteredCameras.length} matched</p>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by camera or class"
            />
            <div className="filter-row">
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value as Area | "all")}
              >
                <option value="all">All areas</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as CameraStatus | "all")}
              >
                <option value="all">All status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <label className="zoom-control">
              Grid density: {gridSize}x{gridSize}
              <input
                type="range"
                min={2}
                max={10}
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
              />
            </label>
            <div className="camera-list">
              {filteredCameras.slice(0, 24).map((cam) => (
                <button key={cam.id} onClick={() => setSelectedCamera(cam)}>
                  <strong>{cam.id}</strong>
                  <span>{cam.name}</span>
                  <small>{cam.area}</small>
                </button>
              ))}
            </div>
          </aside>

          <div className="camera-grid-wrap">
            <div
              className="camera-grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              }}
            >
              {visibleCameras.map((cam) => (
                <article
                  key={cam.id}
                  className={`camera-tile ${cam.status === "offline" ? "tile-offline" : ""}`}
                  draggable
                  onDragStart={() => setDraggingId(cam.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(cam.id)}
                  onMouseEnter={() => setHovered(cam.id)}
                  onMouseLeave={() => setHovered((v) => (v === cam.id ? null : v))}
                  onClick={() => setSelectedCamera(cam)}
                >
                  <div className="video-noise" />
                  <div className="tile-head">
                    <span className={`dot ${cam.status}`} />
                    <p>{cam.id}</p>
                    <small>{cam.status === "online" ? "Online" : "Offline"}</small>
                  </div>
                  <div className="tile-meta">
                    <span>FPS {cam.fps}</span>
                    <span>{cam.bitrate} kbps</span>
                  </div>
                  <div className="tile-alerts">
                    {cam.warnings.length === 0 ? (
                      <span className="ok-tag">No Alert</span>
                    ) : (
                      cam.warnings.map((w) => (
                        <span key={w} className={`warn-tag warn-${w}`}>
                          {warningLabel(w)}
                        </span>
                      ))
                    )}
                  </div>
                  {hovered === cam.id && (
                    <div className="hover-preview">
                      <p>Quick Preview</p>
                      <small>
                        Blur {cam.blur}% · Bright {cam.brightness}% · Drop {cam.frameDrop.toFixed(1)}%
                      </small>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeView === "dashboard" && (
        <section className="dashboard-layout">
          <div className="dashboard-main">
            <div className="panel-head">
              <h2>Quality Health Dashboard</h2>
              <div className="filter-row">
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value as Area | "all")}
                >
                  <option value="all">All areas</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                <select
                  value={errorFilter}
                  onChange={(e) => setErrorFilter(e.target.value as WarningType | "all")}
                >
                  <option value="all">All errors</option>
                  <option value="blur">Blur</option>
                  <option value="signal">Signal</option>
                  <option value="occlusion">Occlusion</option>
                </select>
                <select
                  value={timePreset}
                  onChange={(e) => setTimePreset(e.target.value as TimePreset)}
                >
                  <option value="5m">Last 5m</option>
                  <option value="1h">Last 1h</option>
                  <option value="24h">Last 24h</option>
                </select>
              </div>
            </div>

            <div className="metrics-grid">
              <article>
                <h3>Blur Score ({timePreset})</h3>
                <Sparkline values={trendBlur} color="#ff934f" />
              </article>
              <article>
                <h3>Brightness</h3>
                <Sparkline values={trendBrightness} color="#50c7f9" />
              </article>
              <article>
                <h3>Frame Drop</h3>
                <Sparkline values={trendDrop} color="#ff4d67" />
              </article>
              <article>
                <h3>Top N Failing Cameras</h3>
                <ul className="top-list">
                  {topDefect.map((cam) => (
                    <li key={cam.id}>
                      <span>{cam.id}</span>
                      <small>{cam.area}</small>
                      <strong>{Math.round(cam.blur + cam.frameDrop * 10)}</strong>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <div className="heatmap">
              {areaHeatmap.map((entry) => (
                <div
                  key={entry.area}
                  className="heat-cell"
                  style={{
                    background: `linear-gradient(160deg, rgba(18,24,35,1), rgba(255,100,69,${
                      entry.score / 120
                    }))`,
                  }}
                >
                  <p>{entry.area}</p>
                  <strong>Score {entry.score}</strong>
                </div>
              ))}
            </div>

            <div className="quality-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Camera</th>
                    <th>Status</th>
                    <th>Blur</th>
                    <th>Brightness</th>
                    <th>Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {orderedCameras
                    .filter((cam) => (areaFilter === "all" ? true : cam.area === areaFilter))
                    .filter((cam) => {
                      if (errorFilter === "all") return true;
                      return cam.warnings.includes(errorFilter);
                    })
                    .slice(0, 18)
                    .map((cam) => (
                      <tr key={cam.id}>
                        <td>{cam.id}</td>
                        <td>
                          <span className={cam.status === "online" ? "status-ok" : "status-bad"}>
                            {cam.status}
                          </span>
                        </td>
                        <td>{cam.blur}%</td>
                        <td>{cam.brightness}%</td>
                        <td>{cam.lastSeen}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="alert-panel">
            <div className="panel-head">
              <h3>Real-time Alert Stream</h3>
              <p>Log tail</p>
            </div>
            <ul>
              {alerts.slice(0, 14).map((alert) => (
                <li key={alert.id}>
                  <button onClick={() => jumpToPlayback(alert.cameraId, alert.second)}>
                    <span className={`severity ${alert.severity}`} />
                    <div>
                      <strong>{alert.cameraId}</strong>
                      <p>{alert.message}</p>
                      <small>{alert.at}</small>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      )}

      {activeView === "playback" && playbackCamera && (
        <section className="playback-layout">
          <div className="player-stage">
            <div className="player-head">
              <h2>
                Playback {playbackCamera.id} · {playbackCamera.name}
              </h2>
              <div className="playback-controls">
                <button onClick={() => setPlaybackSecond((s) => Math.max(0, s - 10))}>-10s</button>
                <button onClick={() => setPlaybackSecond((s) => Math.max(0, s - 1))}>-1s</button>
                <button onClick={() => setPlaybackSecond((s) => Math.min(300, s + 1))}>+1s</button>
                <button onClick={() => setPlaybackSecond((s) => Math.min(300, s + 10))}>+10s</button>
                <button
                  className={syncMode ? "active" : ""}
                  onClick={() => setSyncMode((v) => !v)}
                >
                  Multi-camera Sync
                </button>
              </div>
            </div>

            <div className="playback-player">
              <div className="video-noise" />
              <div className="bbox b1" />
              <div className="bbox b2" />
              <div className="frame-error">Blur and low brightness detected</div>
            </div>

            <div className="timeline-wrap">
              <div className="timeline-scale">
                {playbackEvents.map((event) => (
                  <button
                    key={event.id}
                    title={event.message}
                    style={{ left: `${(event.second / 300) * 100}%` }}
                    onClick={() => setPlaybackSecond(event.second)}
                  />
                ))}
              </div>
              <input
                type="range"
                min={0}
                max={300}
                value={playbackSecond}
                onChange={(e) => setPlaybackSecond(Number(e.target.value))}
              />
              <p>Timecode: 00:{String(Math.floor(playbackSecond / 60)).padStart(2, "0")}:{String(playbackSecond % 60).padStart(2, "0")}</p>
            </div>

            {syncMode && (
              <div className="sync-row">
                {orderedCameras.slice(0, 3).map((cam) => (
                  <article key={cam.id}>
                    <div className="video-noise" />
                    <p>
                      {cam.id} synced at +{playbackSecond}s
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="event-sidebar">
            <div className="panel-head">
              <h3>Event List</h3>
              <p>Jump by AI detect</p>
            </div>
            <ul>
              {playbackEvents.length === 0 ? (
                <li className="empty">No events for this camera.</li>
              ) : (
                playbackEvents.map((event) => (
                  <li key={event.id}>
                    <button onClick={() => setPlaybackSecond(event.second)}>
                      <strong>{warningLabel(event.type)}</strong>
                      <p>{event.message}</p>
                      <small>
                        t+{event.second}s · {event.at}
                      </small>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </aside>
        </section>
      )}

      {activeView === "alerts" && (
        <section className="alerts-layout">
          <div className="rule-panel">
            <div className="panel-head">
              <h2>Rule Configuration</h2>
              <p>Signal &gt; Noise: only push meaningful alerts</p>
            </div>
            <div className="rule-card">
              <h3>Rule 01</h3>
              <p>Blur score &gt; threshold in 30 seconds</p>
              <div className="rule-row">
                <label>
                  Threshold
                  <input defaultValue={72} />
                </label>
                <label>
                  Window
                  <input defaultValue="30s" />
                </label>
              </div>
            </div>
            <div className="rule-card">
              <h3>Rule 02</h3>
              <p>Camera offline &gt; 1 minute</p>
              <div className="rule-row">
                <label>
                  Timeout
                  <input defaultValue="1m" />
                </label>
                <label>
                  Escalation
                  <input defaultValue="High" />
                </label>
              </div>
            </div>
            <div className="rule-card">
              <h3>Notification Channels</h3>
              <div className="channel-row">
                <label>
                  <input type="checkbox" defaultChecked /> Email
                </label>
                <label>
                  <input type="checkbox" defaultChecked /> Slack
                </label>
                <label>
                  <input type="checkbox" defaultChecked /> Webhook
                </label>
              </div>
              <button>Save Rules</button>
            </div>
          </div>

          <aside className="notify-panel">
            <div className="panel-head">
              <h3>Real-time Notification Panel</h3>
              <p>1-click drill down to playback</p>
            </div>
            <ul>
              {alerts.slice(0, 12).map((alert) => (
                <li key={alert.id}>
                  <button onClick={() => jumpToPlayback(alert.cameraId, alert.second)}>
                    <span className={`severity ${alert.severity}`} />
                    <div>
                      <strong>{alert.message}</strong>
                      <small>
                        {alert.cameraId} · {alert.at}
                      </small>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      )}

      {selectedCamera && (
        <section className="focus-modal" onClick={() => setSelectedCamera(null)}>
          <article onClick={(e) => e.stopPropagation()}>
            <header>
              <h2>
                {selectedCamera.id} · {selectedCamera.name}
              </h2>
              <button onClick={() => setSelectedCamera(null)}>Close</button>
            </header>
            <div className="focus-player">
              <div className="video-noise" />
              <div className="bbox b1" />
              <div className="bbox b2" />
            </div>
            <div className="mini-timeline">
              <span>Mini timeline</span>
              <input
                type="range"
                min={0}
                max={180}
                defaultValue={70}
                onChange={(e) => setPlaybackSecond(Number(e.target.value))}
              />
              <p>Shortcut: F to open focused camera, ←/→ to seek</p>
            </div>
          </article>
        </section>
      )}

      <div className="toast-stack">
        {toasts.map((toast) => (
          <button
            key={toast.id}
            className="toast"
            onClick={() => jumpToPlayback(toast.cameraId, toast.second)}
          >
            <strong>{warningLabel(toast.type)}</strong>
            <p>{toast.message}</p>
          </button>
        ))}
      </div>
    </main>
  );
}
