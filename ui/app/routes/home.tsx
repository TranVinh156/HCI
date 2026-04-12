import { useMemo, useState } from "react";
import type { Route } from "./+types/home";

type Role = "lecturer" | "school" | "admin";
type Panel = "dashboard" | "reports" | "history";
type RiskLevel = "thấp" | "vừa" | "cao";
type FeedbackType = "hợp_lý" | "xem_lại";

type SessionRow = {
  id: string;
  date: string;
  className: string;
  attentive: number;
  distracted: number;
  noteTaking: number;
  drowsyMinutes: number;
  confidence: number;
  recommendation: string;
};

type Indicator = {
  id: string;
  label: string;
  value: string;
  trend: string;
  explain: string;
};

type EventItem = {
  id: string;
  minute: number;
  timeLabel: string;
  title: string;
  description: string;
  confidence: number;
  severity: RiskLevel;
};

type MinuteCell = {
  id: string;
  minute: number;
  attentive: number;
  distracted: number;
  uncertainty: number;
  level: RiskLevel;
};

type TimeWindow = {
  id: string;
  label: string;
  attentive: number;
  distracted: number;
  confidence: number;
  level: RiskLevel;
  causes: string[];
  actions: string[];
  sessionIds: string[];
  minuteCells: MinuteCell[];
  events: EventItem[];
};

type AuditLog = {
  id: string;
  at: string;
  role: Role;
  action: string;
  detail: string;
};

const roleLabel: Record<Role, string> = {
  lecturer: "Giảng viên",
  school: "Nhà trường",
  admin: "Quản trị viên",
};

const roleHint: Record<Role, string> = {
  lecturer: "Tối ưu bài giảng từ các điểm rơi mất chú ý theo tiến trình tiết học.",
  school: "Theo dõi hiệu quả dạy học và điều kiện lớp bằng dữ liệu tổng hợp, ẩn danh.",
  admin: "Giám sát an toàn hệ thống, fairness, audit và cơ chế dừng khẩn cấp (kill-switch).",
};

const sessions: SessionRow[] = [
  {
    id: "S-2026-04-10-01",
    date: "10/04/2026 07:30",
    className: "INT3011E-3",
    attentive: 74,
    distracted: 16,
    noteTaking: 41,
    drowsyMinutes: 5,
    confidence: 86,
    recommendation: "Giảm block lý thuyết liên tục và chen tương tác ngắn sau mỗi 12 phút.",
  },
  {
    id: "S-2026-04-08-02",
    date: "08/04/2026 13:30",
    className: "INT3011E-3",
    attentive: 68,
    distracted: 22,
    noteTaking: 37,
    drowsyMinutes: 11,
    confidence: 84,
    recommendation: "Ưu tiên thảo luận nhóm ở giữa tiết để tránh tụt chú ý sau giờ trưa.",
  },
  {
    id: "S-2026-04-04-03",
    date: "04/04/2026 09:20",
    className: "INT2030-1",
    attentive: 79,
    distracted: 12,
    noteTaking: 46,
    drowsyMinutes: 3,
    confidence: 88,
    recommendation: "Giữ nhịp hiện tại, thêm 2 checkpoint hỏi đáp ở phút 20 và 35.",
  },
  {
    id: "S-2026-04-02-04",
    date: "02/04/2026 15:10",
    className: "INT2030-1",
    attentive: 71,
    distracted: 18,
    noteTaking: 39,
    drowsyMinutes: 8,
    confidence: 82,
    recommendation: "Cần tăng trực quan hóa nội dung trừu tượng và nhắc lớp ghi chú có chủ đích.",
  },
];

const timeWindows: TimeWindow[] = [
  {
    id: "TW-01",
    label: "07:30-07:50",
    attentive: 78,
    distracted: 11,
    confidence: 88,
    level: "thấp",
    causes: ["Mở bài có ví dụ thực tế", "Lớp vào nhịp nhanh"],
    actions: ["Giữ format khởi động 5 phút", "Chốt mục tiêu học tập đầu giờ"],
    sessionIds: ["S-2026-04-10-01", "S-2026-04-04-03"],
    minuteCells: [
      { id: "M-01", minute: 5, attentive: 84, distracted: 8, uncertainty: 9, level: "thấp" },
      { id: "M-02", minute: 10, attentive: 81, distracted: 10, uncertainty: 8, level: "thấp" },
      { id: "M-03", minute: 15, attentive: 78, distracted: 12, uncertainty: 10, level: "thấp" },
      { id: "M-04", minute: 20, attentive: 76, distracted: 13, uncertainty: 11, level: "vừa" },
      { id: "M-05", minute: 25, attentive: 77, distracted: 12, uncertainty: 12, level: "vừa" },
      { id: "M-06", minute: 30, attentive: 79, distracted: 11, uncertainty: 9, level: "thấp" },
    ],
    events: [
      {
        id: "E-01",
        minute: 14,
        timeLabel: "07:44",
        title: "Mất chú ý tăng nhẹ",
        description: "Khi chuyển sang phần định nghĩa, tỉ lệ nhìn xuống tăng.",
        confidence: 83,
        severity: "vừa",
      },
      {
        id: "E-02",
        minute: 19,
        timeLabel: "07:49",
        title: "Tương tác kéo lại tập trung",
        description: "Sau câu hỏi trắc nghiệm nhanh, mức attentive tăng trở lại.",
        confidence: 87,
        severity: "thấp",
      },
    ],
  },
  {
    id: "TW-02",
    label: "13:20-13:50",
    attentive: 63,
    distracted: 27,
    confidence: 84,
    level: "cao",
    causes: ["Khung giờ sau nghỉ trưa", "Mật độ nội dung dài liên tục"],
    actions: ["Đổi sang thảo luận nhóm 7 phút", "Giảm tốc độ giảng 10-15%"],
    sessionIds: ["S-2026-04-08-02", "S-2026-04-02-04"],
    minuteCells: [
      { id: "M-07", minute: 5, attentive: 72, distracted: 17, uncertainty: 13, level: "vừa" },
      { id: "M-08", minute: 10, attentive: 68, distracted: 20, uncertainty: 15, level: "vừa" },
      { id: "M-09", minute: 15, attentive: 64, distracted: 24, uncertainty: 17, level: "cao" },
      { id: "M-10", minute: 20, attentive: 59, distracted: 29, uncertainty: 20, level: "cao" },
      { id: "M-11", minute: 25, attentive: 61, distracted: 27, uncertainty: 19, level: "cao" },
      { id: "M-12", minute: 30, attentive: 65, distracted: 23, uncertainty: 16, level: "vừa" },
    ],
    events: [
      {
        id: "E-03",
        minute: 16,
        timeLabel: "13:36",
        title: "Tụt chú ý đồng loạt",
        description: "Mất chú ý tăng đồng thời ở nhiều cụm ghế trong 4 phút liên tiếp.",
        confidence: 85,
        severity: "cao",
      },
      {
        id: "E-04",
        minute: 22,
        timeLabel: "13:42",
        title: "Drowsy tăng",
        description: "Tín hiệu drowsy tăng trong nhóm ngồi cuối lớp.",
        confidence: 74,
        severity: "cao",
      },
      {
        id: "E-05",
        minute: 28,
        timeLabel: "13:48",
        title: "Nhịp lớp cải thiện",
        description: "Sau khi đổi hoạt động, attentive bắt đầu phục hồi.",
        confidence: 79,
        severity: "vừa",
      },
    ],
  },
  {
    id: "TW-03",
    label: "15:10-15:40",
    attentive: 72,
    distracted: 18,
    confidence: 85,
    level: "vừa",
    causes: ["Nội dung trừu tượng", "Tương tác hai chiều chưa đều"],
    actions: ["Thêm sơ đồ trực quan", "Gọi phản hồi nhanh theo cặp"],
    sessionIds: ["S-2026-04-02-04"],
    minuteCells: [
      { id: "M-13", minute: 5, attentive: 76, distracted: 14, uncertainty: 12, level: "vừa" },
      { id: "M-14", minute: 10, attentive: 73, distracted: 17, uncertainty: 14, level: "vừa" },
      { id: "M-15", minute: 15, attentive: 70, distracted: 20, uncertainty: 16, level: "vừa" },
      { id: "M-16", minute: 20, attentive: 69, distracted: 21, uncertainty: 17, level: "cao" },
      { id: "M-17", minute: 25, attentive: 72, distracted: 18, uncertainty: 13, level: "vừa" },
      { id: "M-18", minute: 30, attentive: 75, distracted: 15, uncertainty: 11, level: "thấp" },
    ],
    events: [
      {
        id: "E-06",
        minute: 12,
        timeLabel: "15:22",
        title: "Phân tán tăng theo cụm",
        description: "Nhóm bàn giữa có xu hướng nhìn lệch khỏi bảng.",
        confidence: 77,
        severity: "vừa",
      },
      {
        id: "E-07",
        minute: 21,
        timeLabel: "15:31",
        title: "Cần xem lại tín hiệu",
        description: "Mô hình báo drowsy nhưng confidence thấp, cần human review.",
        confidence: 68,
        severity: "vừa",
      },
    ],
  },
];

const initialAudit: AuditLog[] = [
  {
    id: "A-01",
    at: "09:01:12",
    role: "admin",
    action: "Xem nhật ký",
    detail: "Tải 20 bản ghi audit gần nhất.",
  },
  {
    id: "A-02",
    at: "09:03:25",
    role: "lecturer",
    action: "Mở dashboard",
    detail: "Truy cập lớp INT3011E-3 với dữ liệu ẩn danh.",
  },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard học tập có trách nhiệm" },
    {
      name: "description",
      content:
        "Hệ thống phân tích tương tác lớp học bằng dữ liệu tổng hợp, có phân quyền và cơ chế human-in-the-loop.",
    },
  ];
}

function roleIndicators(role: Role): Indicator[] {
  if (role === "lecturer") {
    return [
      {
        id: "attention",
        label: "Tỉ lệ tập trung trung bình",
        value: "74%",
        trend: "+5% so với tuần trước",
        explain: "Tăng rõ khi tiết học có mini-quiz và checkpoint hỏi đáp.",
      },
      {
        id: "distracted",
        label: "Tỉ lệ phân tán",
        value: "16%",
        trend: "-3%",
        explain: "Giảm khi nội dung được chia theo cụm 10-12 phút.",
      },
      {
        id: "drowsy",
        label: "Phút có dấu hiệu buồn ngủ",
        value: "6 phút/tiết",
        trend: "-2 phút",
        explain: "Giảm sau khi đổi hoạt động ở giữa tiết.",
      },
      {
        id: "confidence",
        label: "Độ tin cậy phân tích",
        value: "86%",
        trend: "Ổn định",
        explain: "Confidence thấp sẽ tự gắn cờ để giảng viên xem lại.",
      },
    ];
  }

  if (role === "school") {
    return [
      {
        id: "coverage",
        label: "Số lớp có báo cáo ẩn danh",
        value: "124 lớp",
        trend: "+12 lớp/tháng",
        explain: "Dữ liệu chỉ tổng hợp theo lớp, bộ môn, học kỳ.",
      },
      {
        id: "teaching",
        label: "Chỉ số hiệu quả dạy học",
        value: "7.8/10",
        trend: "+0.4",
        explain: "Tăng ở các lớp có can thiệp đúng điểm rơi mất chú ý.",
      },
      {
        id: "risk",
        label: "Khung giờ rủi ro lặp lại",
        value: "13:20-13:50",
        trend: "3 tuần liên tiếp",
        explain: "Nên điều chỉnh lịch hoặc ưu tiên hoạt động thực hành.",
      },
      {
        id: "privacy",
        label: "Mức độ ẩn danh",
        value: "100%",
        trend: "Đạt chuẩn",
        explain: "Không hiển thị danh tính sinh viên ở cấp nhà trường.",
      },
    ];
  }

  return [
    {
      id: "uptime",
      label: "Độ sẵn sàng hệ thống",
      value: "99.2%",
      trend: "+0.2%",
      explain: "Ổn định 30 ngày gần nhất, không đứt luồng dữ liệu tổng hợp.",
    },
    {
      id: "fairness",
      label: "Fairness kiểm thử",
      value: "Đạt",
      trend: "Sai lệch < 3%",
      explain: "Theo dõi theo nhóm điều kiện ánh sáng, kính, vị trí ngồi.",
    },
    {
      id: "retention",
      label: "Lưu trữ video gốc",
      value: "7 ngày",
      trend: "Tự xóa",
      explain: "Video chỉ lưu phục vụ khiếu nại, hết hạn tự động xóa.",
    },
    {
      id: "policy",
      label: "Tuân thủ chính sách",
      value: "Đạt",
      trend: "Không vi phạm",
      explain: "Cấm dùng hệ thống làm căn cứ kỷ luật tự động.",
    },
  ];
}

function levelLabel(level: RiskLevel) {
  if (level === "cao") return "Rủi ro cao";
  if (level === "vừa") return "Rủi ro vừa";
  return "Ổn định";
}

function levelClass(level: RiskLevel) {
  if (level === "cao") return "is-high";
  if (level === "vừa") return "is-medium";
  return "is-low";
}

export default function Home() {
  const [role, setRole] = useState<Role>("lecturer");
  const [panel, setPanel] = useState<Panel>("dashboard");
  const [activeWindowId, setActiveWindowId] = useState<string>("TW-02");
  const [focusRiskOnly, setFocusRiskOnly] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedMinuteId, setSelectedMinuteId] = useState<string>("M-10");
  const [feedbackMap, setFeedbackMap] = useState<Record<string, FeedbackType>>({});
  const [interventionMap, setInterventionMap] = useState<Record<string, boolean>>({});
  const [isKillSwitchActive, setIsKillSwitchActive] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAudit);

  const indicators = useMemo(() => roleIndicators(role), [role]);
  const canViewSessionDetail = role !== "school";
  const canTriggerGovernance = role === "admin";

  const addAudit = (action: string, detail: string, roleSnapshot: Role = role) => {
    const at = new Date().toLocaleTimeString("vi-VN", { hour12: false });
    setAuditLogs((prev) => [
      { id: `A-${Date.now()}`, at, role: roleSnapshot, action, detail },
      ...prev,
    ].slice(0, 20));
  };

  const shownWindows = useMemo(() => {
    if (!focusRiskOnly) return timeWindows;
    return timeWindows.filter((item) => item.level !== "thấp");
  }, [focusRiskOnly]);

  const activeWindow =
    shownWindows.find((item) => item.id === activeWindowId) ?? shownWindows[0] ?? timeWindows[0];

  const selectedMinute =
    activeWindow.minuteCells.find((cell) => cell.id === selectedMinuteId) ?? activeWindow.minuteCells[0];

  const relatedEvents = activeWindow.events.filter(
    (event) => Math.abs(event.minute - selectedMinute.minute) <= 6,
  );

  const linkedSessions = sessions.filter((session) => activeWindow.sessionIds.includes(session.id));
  const selectedSession = sessions.find((session) => session.id === selectedSessionId) ?? linkedSessions[0] ?? null;

  const interventionImpact = selectedSession
    ? {
        before: Math.max(selectedSession.attentive - 6, 50),
        after: selectedSession.attentive + (interventionMap[selectedSession.id] ? 4 : 0),
      }
    : null;

  const handleRoleChange = (nextRole: Role) => {
    setRole(nextRole);
    addAudit("Chuyển vai trò", `Người dùng chuyển sang vai trò ${roleLabel[nextRole]}.`, nextRole);
  };

  const handleWindowChange = (windowId: string) => {
    setActiveWindowId(windowId);
    const windowItem = timeWindows.find((item) => item.id === windowId);
    if (windowItem?.minuteCells[0]) setSelectedMinuteId(windowItem.minuteCells[0].id);
    addAudit("Chọn khung giờ", `Mở phân tích cho khung ${windowItem?.label ?? windowId}.`);
  };

  const handleMinuteChange = (minuteId: string) => {
    setSelectedMinuteId(minuteId);
    const minuteItem = activeWindow.minuteCells.find((cell) => cell.id === minuteId);
    addAudit("Drill-down theo phút", `Xem dữ liệu phút ${minuteItem?.minute ?? "?"} của ${activeWindow.label}.`);
  };

  const handleFeedback = (eventId: string, feedback: FeedbackType) => {
    setFeedbackMap((prev) => ({ ...prev, [eventId]: feedback }));
    addAudit(
      "Phản hồi human-in-the-loop",
      `Sự kiện ${eventId} được đánh dấu ${feedback === "hợp_lý" ? "hợp lý" : "cần xem lại"}.`,
    );
  };

  const handleApplyIntervention = () => {
    if (!selectedSession) return;
    setInterventionMap((prev) => ({ ...prev, [selectedSession.id]: true }));
    addAudit("Áp dụng can thiệp", `Đã ghi nhận can thiệp sư phạm cho phiên ${selectedSession.id}.`);
  };

  const jumpToDashboardBySession = (sessionId: string) => {
    setPanel("dashboard");
    setSelectedSessionId(sessionId);
    const matchWindow = timeWindows.find((item) => item.sessionIds.includes(sessionId));
    if (matchWindow) {
      setActiveWindowId(matchWindow.id);
      setSelectedMinuteId(matchWindow.minuteCells[0]?.id ?? selectedMinuteId);
    }
    addAudit("Điều hướng từ lịch sử", `Mở dashboard để xem phiên ${sessionId}.`);
  };

  const toggleKillSwitch = () => {
    const next = !isKillSwitchActive;
    setIsKillSwitchActive(next);
    addAudit(
      next ? "Kích hoạt kill-switch" : "Tắt kill-switch",
      next
        ? "Dừng phát sinh khuyến nghị tự động, chỉ cho phép chế độ xem." 
        : "Khôi phục khuyến nghị tự động sau kiểm tra an toàn.",
      "admin",
    );
  };

  return (
    <main className="edu-shell">
      <header className="hero-card">
        <p className="eyebrow">Responsible AI for Education</p>
        <h1>Dashboard và Báo cáo Theo Phân quyền</h1>
        <p className="lead">
          Hệ thống dùng dữ liệu tổng hợp để tối ưu hóa phương pháp sư phạm. Mọi quyết định quan trọng đều
          cần xác nhận của con người, không dùng để giám sát cá nhân hay kỷ luật tự động.
        </p>
      </header>

      <section className="role-bar">
        <div className="role-switch" role="tablist" aria-label="Chọn vai trò">
          {(Object.keys(roleLabel) as Role[]).map((item) => (
            <button
              key={item}
              role="tab"
              aria-selected={role === item}
              className={role === item ? "active" : ""}
              onClick={() => handleRoleChange(item)}
            >
              {roleLabel[item]}
            </button>
          ))}
        </div>
        <p className="role-hint">{roleHint[role]}</p>
      </section>

      <section className="guardrail-grid">
        <article>
          <h2>Phạm vi dữ liệu</h2>
          <p>Chỉ hiển thị tổng hợp theo lớp/phiên học, không hiển thị danh tính cá nhân mặc định.</p>
        </article>
        <article>
          <h2>Human-in-the-loop</h2>
          <p>Mọi cảnh báo có thể được đánh dấu “hợp lý” hoặc “cần xem lại” để tránh quyết định máy móc.</p>
        </article>
        <article>
          <h2>Ràng buộc quản trị</h2>
          <p>Cấm tuyệt đối dùng đầu ra dashboard làm căn cứ trực tiếp để trừ điểm hoặc kỷ luật.</p>
        </article>
      </section>

      <section className="panel-switch">
        {[
          ["dashboard", "Dashboard tương tác"],
          ["reports", "Báo cáo diễn giải"],
          ["history", "Lịch sử phiên học"],
        ].map(([id, label]) => (
          <button key={id} className={panel === id ? "active" : ""} onClick={() => setPanel(id as Panel)}>
            {label}
          </button>
        ))}
      </section>

      {panel === "dashboard" && (
        <section className="dashboard-grid">
          <article className="card span-2">
            <div className="card-head">
              <h2>Chỉ số tổng quan theo vai trò {roleLabel[role]}</h2>
              <span>Khung đang xem: {activeWindow.label}</span>
            </div>
            <div className="indicator-grid">
              {indicators.map((item) => (
                <div className="indicator" key={item.id}>
                  <p>{item.label}</p>
                  <strong>{item.value}</strong>
                  <small>{item.trend}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="card">
            <div className="card-head">
              <h2>Bộ lọc khung giờ</h2>
            </div>
            <button
              className={`toggle-chip ${focusRiskOnly ? "active" : ""}`}
              onClick={() => {
                setFocusRiskOnly((value) => !value);
                addAudit("Lọc khung giờ", "Bật/tắt chế độ chỉ hiển thị rủi ro vừa và cao.");
              }}
            >
              {focusRiskOnly ? "Đang lọc: chỉ rủi ro vừa/cao" : "Hiển thị toàn bộ khung giờ"}
            </button>
            <ul className="risk-window-list">
              {shownWindows.map((item) => (
                <li key={item.id}>
                  <button
                    className={`${item.id === activeWindow.id ? "active" : ""} ${levelClass(item.level)}`}
                    onClick={() => handleWindowChange(item.id)}
                  >
                    <strong>{item.label}</strong>
                    <span>{levelLabel(item.level)}</span>
                    <small>Mất chú ý: {item.distracted}%</small>
                  </button>
                </li>
              ))}
            </ul>
          </article>

          <article className="card">
            <div className="card-head">
              <h2>Heatmap theo phút (nhấn để drill-down)</h2>
            </div>
            <div className="minute-heatmap" aria-label="Heatmap theo phút">
              {activeWindow.minuteCells.map((cell) => (
                <button
                  key={cell.id}
                  className={`minute-cell ${cell.id === selectedMinute.id ? "active" : ""} ${levelClass(
                    cell.level,
                  )}`}
                  onClick={() => handleMinuteChange(cell.id)}
                  aria-label={`Phút ${cell.minute} tập trung ${cell.attentive}%`}
                >
                  <span>P{cell.minute}</span>
                  <strong>{cell.attentive}%</strong>
                </button>
              ))}
            </div>
            <p className="assist-note">
              Điểm đang chọn: phút {selectedMinute.minute} · Mất chú ý {selectedMinute.distracted}% · Bất định
              {selectedMinute.uncertainty}%
            </p>
          </article>

          <article className="card span-2">
            <div className="card-head">
              <h2>Bằng chứng sự kiện theo tiến trình</h2>
              <span>{relatedEvents.length} sự kiện gần mốc đã chọn</span>
            </div>
            <ul className="event-timeline">
              {relatedEvents.length === 0 ? (
                <li className="empty-card">Không có sự kiện phù hợp ở mốc này.</li>
              ) : (
                relatedEvents.map((event) => (
                  <li key={event.id} className={`event-card ${levelClass(event.severity)}`}>
                    <div className="event-head">
                      <strong>{event.timeLabel}</strong>
                      <span>{event.title}</span>
                      <small>Confidence: {event.confidence}%</small>
                    </div>
                    <p>{event.description}</p>
                    <div className="feedback-row">
                      <button
                        className={feedbackMap[event.id] === "hợp_lý" ? "active" : ""}
                        onClick={() => handleFeedback(event.id, "hợp_lý")}
                      >
                        Hợp lý
                      </button>
                      <button
                        className={feedbackMap[event.id] === "xem_lại" ? "active" : ""}
                        onClick={() => handleFeedback(event.id, "xem_lại")}
                      >
                        Cần xem lại
                      </button>
                      {event.confidence < 75 && <span className="warning-tag">Độ tin cậy thấp</span>}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </article>

          <article className="card">
            <div className="card-head">
              <h2>Can thiệp và hiệu quả</h2>
            </div>
            {selectedSession && interventionImpact ? (
              <>
                <p className="assist-note">
                  Phiên: {selectedSession.id} · Lớp {selectedSession.className}
                </p>
                <div className="before-after">
                  <div>
                    <span>Trước can thiệp</span>
                    <strong>{interventionImpact.before}%</strong>
                  </div>
                  <div>
                    <span>Sau can thiệp</span>
                    <strong>{interventionImpact.after}%</strong>
                  </div>
                </div>
                {role === "lecturer" && (
                  <button className="primary-btn" onClick={handleApplyIntervention}>
                    Ghi nhận đã áp dụng can thiệp
                  </button>
                )}
              </>
            ) : (
              <p className="assist-note">Chọn một phiên liên quan để xem hiệu quả trước/sau can thiệp.</p>
            )}
            <div className="session-link-row">
              <span>Phiên liên quan:</span>
              {linkedSessions.map((session) => (
                <button key={session.id} className="session-pill" onClick={() => setSelectedSessionId(session.id)}>
                  {session.id}
                </button>
              ))}
            </div>
          </article>

          {canTriggerGovernance && (
            <article className="card">
              <div className="card-head">
                <h2>Governance & Kill-switch</h2>
              </div>
              <p className="assist-note">
                Trạng thái hệ thống: {isKillSwitchActive ? "Đang giới hạn chỉ chế độ xem" : "Đang hoạt động bình thường"}
              </p>
              <button className="primary-btn" onClick={toggleKillSwitch}>
                {isKillSwitchActive ? "Tắt kill-switch" : "Kích hoạt kill-switch"}
              </button>
              <ul className="risk-list">
                <li>Rò rỉ dữ liệu cá nhân hoặc truy cập vượt phân quyền.</li>
                <li>Sai số vượt ngưỡng an toàn liên tục theo nhiều phiên.</li>
                <li>Bị lạm dụng cho mục đích đánh giá kỷ luật cá nhân.</li>
                <li>Khảo sát cho thấy tác động tâm lý tiêu cực kéo dài.</li>
              </ul>
            </article>
          )}
        </section>
      )}

      {panel === "reports" && (
        <section className="report-layout">
          <article className="card">
            <div className="card-head">
              <h2>Báo cáo sư phạm theo tuần</h2>
              <span>Ẩn danh hóa</span>
            </div>
            <p>
              Điểm rơi mất chú ý lặp lại chủ yếu ở phút 15-25 của các tiết sau giờ trưa. Khuyến nghị tăng hoạt
              động tương tác ngắn, giảm nội dung độc thoại liên tục, và theo dõi hiệu quả ở 2 tuần kế tiếp.
            </p>
          </article>

          <article className="card">
            <div className="card-head">
              <h2>Báo cáo điều kiện phòng học</h2>
              <span>Tổng hợp cấp lớp/khoa</span>
            </div>
            <p>
              Các phòng có ánh sáng yếu và nhiệt độ cao có tương quan với mức drowsy tăng. Nên ưu tiên xử lý
              điều kiện lớp học trước khi diễn giải theo năng lực người học.
            </p>
          </article>

          <article className="card">
            <div className="card-head">
              <h2>Cảnh báo đạo đức và pháp lý</h2>
              <span>Bắt buộc tuân thủ</span>
            </div>
            <ul className="risk-list">
              <li>Không hiển thị xếp hạng cá nhân sinh viên trên dashboard.</li>
              <li>Mọi quyết định cá nhân hóa bắt buộc có xác nhận của con người.</li>
              <li>Video gốc không lưu mặc định; nếu lưu phải giới hạn thời gian tự xóa.</li>
            </ul>
          </article>
        </section>
      )}

      {panel === "history" && (
        <section className="card history-table">
          <div className="card-head">
            <h2>Lịch sử phiên và chỉ số tổng hợp</h2>
            <span>Truy xuất có kiểm toán</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Mã phiên</th>
                <th>Thời gian</th>
                <th>Lớp</th>
                <th>Tập trung</th>
                <th>Phân tán</th>
                <th>Ghi chép</th>
                <th>Buồn ngủ</th>
                <th>Độ tin cậy</th>
                <th>Diễn giải</th>
                <th>Tương tác</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.date}</td>
                  <td>{row.className}</td>
                  <td>{row.attentive}%</td>
                  <td>{row.distracted}%</td>
                  <td>{row.noteTaking}%</td>
                  <td>{row.drowsyMinutes} phút</td>
                  <td>{row.confidence}%</td>
                  <td>{row.recommendation}</td>
                  <td>
                    {canViewSessionDetail ? (
                      <button className="session-pill" onClick={() => jumpToDashboardBySession(row.id)}>
                        Xem khung giờ liên quan
                      </button>
                    ) : (
                      <span className="muted-text">Ẩn chi tiết theo quyền</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {selectedSession && canViewSessionDetail && (
        <section className="card session-focus">
          <div className="card-head">
            <h2>Chi tiết phiên: {selectedSession.id}</h2>
            <button className="session-pill" onClick={() => setSelectedSessionId(null)}>
              Đóng
            </button>
          </div>
          <p>
            Lớp <strong>{selectedSession.className}</strong> lúc {selectedSession.date}: tập trung
            <strong> {selectedSession.attentive}%</strong>, phân tán <strong>{selectedSession.distracted}%</strong>,
            drowsy <strong>{selectedSession.drowsyMinutes} phút</strong>, confidence
            <strong> {selectedSession.confidence}%</strong>.
          </p>
          <p>
            Gợi ý sư phạm: {selectedSession.recommendation} Dữ liệu được dùng để cải thiện phương pháp dạy,
            không sử dụng cho kỷ luật cá nhân.
          </p>
        </section>
      )}

      {canTriggerGovernance && (
        <section className="card history-table">
          <div className="card-head">
            <h2>Nhật ký kiểm toán thao tác</h2>
            <span>20 bản ghi gần nhất</span>
          </div>
          <table className="audit-table">
            <thead>
              <tr>
                <th>Thời điểm</th>
                <th>Vai trò</th>
                <th>Hành động</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((row) => (
                <tr key={row.id}>
                  <td>{row.at}</td>
                  <td>{roleLabel[row.role]}</td>
                  <td>{row.action}</td>
                  <td>{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
