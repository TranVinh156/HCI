import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { AnalyticsStats } from "../components/analytics/AnalyticsStats";
import { AnalyticsCharts } from "../components/analytics/AnalyticsCharts";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { SectionHeading } from "../components/dashboard/SectionHeading";
import { useAuth } from "../auth";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

type FilterType = "sessions" | "weeks" | "custom";

const mockHistoricalData = Array.from({ length: 150 }, (_, i) => {
  const d = new Date();
  // Zero out time so date comparisons are stable.
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (149 - i));
  const baseFocus = 65 + Math.random() * 25;
  const baseEng = 70 + Math.random() * 20;
  return {
    timestamp: d.getTime(),
    dateStr: d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0'),
    date: d.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" }),
    shortDate: d.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit" }),
    focus: Math.round(baseFocus),
    engagement: Math.round(baseEng),
    anomalies: Math.floor(Math.random() * 15),
    attendance: Math.round(80 + Math.random() * 20),
    participation: Math.round(50 + Math.random() * 30),
    isSessionDay: Math.random() > 0.4, // Roughly 60% of the last 150 days include a session.
  };
}).filter(day => day.isSessionDay);

export default function SessionAnalytics() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const classCode = searchParams.get("class")?.trim() ?? "";
  const isClassManagementFlow = user?.role === "teacher" || user?.role === "student";

  const [filterType, setFilterType] = useState<FilterType>("sessions");
  const [sessionCount, setSessionCount] = useState<number>(10);
  const [weekCount, setWeekCount] = useState<number>(4);
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date(); 
    d.setDate(d.getDate() - 14); 
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0');
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0');
  });
  
  const chartData = useMemo(() => {
    if (filterType === "sessions") {
      return mockHistoricalData.slice(-sessionCount);
    } else if (filterType === "weeks") {
      const cutoffTime = new Date();
      cutoffTime.setHours(0,0,0,0);
      cutoffTime.setDate(cutoffTime.getDate() - (weekCount * 7));
      return mockHistoricalData.filter(d => d.timestamp >= cutoffTime.getTime());
    } else {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime() + (24 * 60 * 60 * 1000) - 1; // End of the end date
      return mockHistoricalData.filter(d => d.timestamp >= start && d.timestamp <= end);
    }
  }, [filterType, sessionCount, weekCount, startDate, endDate]);

  const averages = useMemo(() => {
    if (chartData.length === 0) return { focus: 0, eng: 0, anom: 0, att: 0 };
    const sums = chartData.reduce((acc, curr) => ({
      focus: acc.focus + curr.focus,
      eng: acc.eng + curr.engagement,
      anom: acc.anom + curr.anomalies,
      att: acc.att + curr.attendance
    }), { focus: 0, eng: 0, anom: 0, att: 0 });
    return {
      focus: Math.round(sums.focus / chartData.length),
      eng: Math.round(sums.eng / chartData.length),
      anom: sums.anom,
      att: Math.round(sums.att / chartData.length)
    };
  }, [chartData]);

  return (
    <DashboardShell
      title={classCode ? `Session Analytics - ${classCode}` : "Analytics Dashboard"}
      subtitle={classCode ? "Class Management child view" : undefined}
      rightSlot={
        isClassManagementFlow ? (
          <Link
            to="/"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-surface-container-lowest px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Class Management
          </Link>
        ) : undefined
      }
    >
      <SectionHeading
        title="Teaching Quality & Engagement"
        description={
          classCode
            ? `Aggregated metrics for ${classCode} across historical sessions`
            : "Aggregated metrics across historical sessions"
        }
      />

      <Card>
        <CardContent className="flex flex-wrap items-end gap-5 p-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Analysis scope</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-primary/30 transition-all min-w-[200px] cursor-pointer"
          >
            <option value="sessions">Recent sessions</option>
            <option value="weeks">Recent weeks</option>
            <option value="custom">Custom range</option>
          </select>
        </div>

        {filterType === "sessions" && (
          <div className="flex flex-col gap-1.5 animate-in fade-in zoom-in duration-200 block">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Session count</label>
            <select
              value={sessionCount}
              onChange={(e) => setSessionCount(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer"
            >
              <option value={5}>Last 5 sessions</option>
              <option value={10}>Last 10 sessions</option>
              <option value={20}>Last 20 sessions</option>
              <option value={50}>Last 50 sessions</option>
              <option value={100}>Last 100 sessions</option>
            </select>
          </div>
        )}

        {filterType === "weeks" && (
          <div className="flex flex-col gap-1.5 animate-in fade-in zoom-in duration-200 block">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Weeks</label>
            <select
              value={weekCount}
              onChange={(e) => setWeekCount(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer"
            >
              <option value={1}>Last 1 week</option>
              <option value={2}>Last 2 weeks</option>
              <option value={4}>4 weeks (1 month)</option>
              <option value={8}>8 weeks (2 months)</option>
              <option value={12}>12 weeks (3 months)</option>
            </select>
          </div>
        )}

        {filterType === "custom" && (
          <>
            <div className="flex flex-col gap-1.5 animate-in fade-in zoom-in duration-200 block">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-1.5 animate-in fade-in zoom-in duration-200 block">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
              />
            </div>
          </>
        )}

        <div className="flex-1"></div>

        <Badge variant="secondary" className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600">
          Currently analyzing: <span className="font-bold text-primary">{chartData.length}</span> sessions
        </Badge>
        </CardContent>
      </Card>

      <AnalyticsStats averages={averages} />

      <AnalyticsCharts chartData={chartData} />
    </DashboardShell>
  );
}
