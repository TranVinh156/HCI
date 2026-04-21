import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardShell } from "../../components/dashboard/DashboardShell";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { ContentCard } from "../../components/dashboard/ContentCard";
import { useVirtualRows } from "../../components/dashboard/useVirtualRows";
import { qualityRating } from "./data";
import { type OverviewMode, type OverviewSortKey, useOverviewDashboard } from "./useOverviewDashboard";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

const TABLE_VIEWPORT_HEIGHT = 520;
const TABLE_ROW_HEIGHT = 88;

function SortIcon({
  activeSortKey,
  currentSortKey,
  isDescending,
}: {
  activeSortKey: OverviewSortKey;
  currentSortKey: OverviewSortKey;
  isDescending: boolean;
}) {
  if (activeSortKey !== currentSortKey) {
    return <span className="material-symbols-outlined text-slate-300 text-sm">unfold_more</span>;
  }

  return (
    <span className="material-symbols-outlined text-sky-500 text-sm">
      {isDescending ? "arrow_downward" : "arrow_upward"}
    </span>
  );
}

export function OverviewDashboard({
  mode,
  lockedFacultyId,
}: {
  mode: OverviewMode;
  lockedFacultyId?: string;
}) {
  const overview = useOverviewDashboard({ mode, lockedFacultyId });
  const [tableScrollTop, setTableScrollTop] = useState(0);
  const virtualRows = useVirtualRows({
    itemCount: overview.filteredClasses.length,
    rowHeight: TABLE_ROW_HEIGHT,
    viewportHeight: TABLE_VIEWPORT_HEIGHT,
    scrollTop: tableScrollTop,
    overscan: 6,
  });
  const visibleClasses = useMemo(() => {
    if (virtualRows.endIndex < virtualRows.startIndex) {
      return [];
    }

    return overview.filteredClasses.slice(virtualRows.startIndex, virtualRows.endIndex + 1);
  }, [overview.filteredClasses, virtualRows.endIndex, virtualRows.startIndex]);

  return (
    <DashboardShell
      title={overview.labels.pageTitle}
      rightSlot={
        <Badge variant="secondary" className="gap-2 rounded-full px-3 py-1.5 text-violet-700">
          <span className="material-symbols-outlined text-sm">{overview.labels.pageBadgeIcon}</span>
          {overview.labels.pageBadge}
        </Badge>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          label="Tổng số lớp"
          value={overview.groupStats.reduce((total, group) => total + group.classCount, 0)}
          icon="class"
          iconBgClassName="bg-sky-50"
          iconClassName="text-sky-500"
        />
        <MetricCard label="Tổng sinh viên" value={overview.totalStudents} icon="groups" iconBgClassName="bg-emerald-50" iconClassName="text-emerald-500" />
        <MetricCard label="Tổng buổi học" value={overview.totalSessions} icon="event_note" iconBgClassName="bg-violet-50" iconClassName="text-violet-500" />
        <MetricCard label="TB Tương tác" value={overview.averageEngagement} unit="%" icon="insights" iconBgClassName="bg-sky-50" iconClassName="text-sky-500" />
        <MetricCard label="TB Tập trung" value={overview.averageFocus} unit="/100" icon="psychology" iconBgClassName="bg-amber-50" iconClassName="text-amber-500" />
        <MetricCard label="Cảnh báo (tổng)" value={overview.totalAnomalies} icon="warning" iconBgClassName="bg-rose-50" iconClassName="text-rose-500" />
      </div>

      <div className="bg-gradient-to-br from-sky-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-5">
          <span className="material-symbols-outlined text-yellow-300 text-3xl">military_tech</span>
          <div>
            <h3 className="font-headline font-bold text-xl">{overview.labels.topTitle}</h3>
            <p className="text-sky-200 text-sm">{overview.labels.topDescription}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {overview.topClasses.map((item, index) => {
            const score = Math.round((item.avgEngagement + item.avgFocus + item.avgAttendance) / 3);
            const medals = ["🥇", "🥈", "🥉"];
            return (
              <div key={item.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{medals[index]}</span>
                  <span className="font-bold text-sm">{item.code}</span>
                </div>
                <p className="font-semibold text-sm leading-snug mb-1">{item.subject}</p>
                <p className="text-sky-200 text-xs mb-3">{item.teacher}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20">
                    {overview.getGroupNameForClass(item)}
                  </span>
                  <span className="text-yellow-300 font-extrabold text-lg">
                    {score}
                    <span className="text-xs font-normal text-white/70">/100</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">
            {overview.labels.groupRankingTitle}
          </h3>
          {overview.groupStats.map((group, index) => (
            <div
              key={group.id}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                overview.activeGroup === group.id
                  ? "border-sky-400 bg-sky-50 shadow-md"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
              onClick={() => overview.setActiveGroup(overview.activeGroup === group.id ? "all" : group.id)}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${group.bgColor} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${group.textColor}`}>{group.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{group.name}</p>
                <p className="text-xs text-slate-500">{group.classCount} lớp · TB {group.score}/100</p>
              </div>
              <div className="flex items-center gap-2">
                {index === 0 && <span className="text-lg">🏆</span>}
                <div className="w-12 h-12 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke={group.color}
                      strokeWidth="3"
                      strokeDasharray={`${group.score} ${100 - group.score}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-slate-700">
                    {group.score}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="xl:col-span-3 grid gap-6 xl:grid-rows-2">
          <ContentCard
            title={overview.labels.compareTitle}
            className="flex min-h-[320px] flex-col"
            bodyClassName="flex-1 p-5 pt-0"
          >
            <div className="h-[260px] w-full xl:h-full xl:min-h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overview.comparisonChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} width={30} />
                  <Tooltip
                    contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                  <Bar dataKey="Tương tác" fill="#0ea5e9" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  <Bar dataKey="Tập trung" fill="#10b981" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  <Bar dataKey="Điểm danh" fill="#f59e0b" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ContentCard>

          <ContentCard
            title={overview.labels.radarTitle}
            className="flex min-h-[320px] flex-col"
            bodyClassName="flex-1 p-5 pt-0"
          >
            <div className="h-[260px] w-full xl:h-full xl:min-h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={overview.radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#64748b" }} />
                  {overview.groupStats.map((group) => (
                    <Radar
                      key={group.id}
                      name={group.shortName}
                      dataKey={group.shortName}
                      stroke={group.color}
                      fill={group.color}
                      fillOpacity={0.08}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  ))}
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                  <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </ContentCard>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              {overview.labels.tableTitle}
              {overview.activeGroup !== "all" && (
                <span className="ml-2 normal-case font-semibold text-sky-600">
                  · {overview.groupById.get(overview.activeGroup)?.name}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {overview.filteredClasses.length} lớp · Nhấn tiêu đề cột để sắp xếp
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => overview.setActiveGroup("all")}
              variant={overview.activeGroup === "all" ? "default" : "secondary"}
              size="sm"
            >
              {overview.labels.allFilterLabel}
            </Button>
            {overview.groupStats.map((group) => (
              <Button
                key={group.id}
                onClick={() => overview.setActiveGroup(overview.activeGroup === group.id ? "all" : group.id)}
                variant={overview.activeGroup === group.id ? "default" : "secondary"}
                size="sm"
                className={overview.activeGroup === group.id ? "" : `${group.bgColor} ${group.textColor}`}
              >
                {group.shortName}
              </Button>
            ))}
          </div>
        </div>

        <div
          className="overflow-auto h-[520px]"
          onScroll={(event) => setTableScrollTop(event.currentTarget.scrollTop)}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Lớp</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Giảng viên</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  {overview.labels.groupLabelShort}
                </th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                  SV
                </th>
                <th
                  className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-sky-600 transition-colors"
                  onClick={() => overview.toggleSort("avgEngagement")}
                >
                  <span className="flex items-center justify-center gap-1">
                    Tương tác
                    <SortIcon activeSortKey={overview.sortKey} currentSortKey="avgEngagement" isDescending={overview.sortDesc} />
                  </span>
                </th>
                <th
                  className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-sky-600 transition-colors hidden lg:table-cell"
                  onClick={() => overview.toggleSort("avgFocus")}
                >
                  <span className="flex items-center justify-center gap-1">
                    Tập trung
                    <SortIcon activeSortKey={overview.sortKey} currentSortKey="avgFocus" isDescending={overview.sortDesc} />
                  </span>
                </th>
                <th
                  className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-sky-600 transition-colors"
                  onClick={() => overview.toggleSort("avgAttendance")}
                >
                  <span className="flex items-center justify-center gap-1">
                    Điểm danh
                    <SortIcon activeSortKey={overview.sortKey} currentSortKey="avgAttendance" isDescending={overview.sortDesc} />
                  </span>
                </th>
                <th
                  className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-sky-600 transition-colors hidden md:table-cell"
                  onClick={() => overview.toggleSort("totalAnomalies")}
                >
                  <span className="flex items-center justify-center gap-1">
                    Cảnh báo
                    <SortIcon activeSortKey={overview.sortKey} currentSortKey="totalAnomalies" isDescending={overview.sortDesc} />
                  </span>
                </th>
                <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Đánh giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {virtualRows.paddingTop > 0 && (
                <tr>
                  <td colSpan={9} style={{ height: virtualRows.paddingTop }} />
                </tr>
              )}

              {visibleClasses.map((item) => {
                const group = overview.groupById.get(overview.getGroupIdForClass(item));
                const rating = qualityRating(item.avgEngagement, item.avgFocus, item.avgAttendance);
                const overallScore = Math.round((item.avgEngagement + item.avgFocus + item.avgAttendance) / 3);
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors h-[88px]">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-sky-800 text-xs">{item.code}</p>
                      <p className="text-slate-700 font-medium text-sm">{item.subject}</p>
                      <p className="text-xs text-slate-400">{item.sessionsHeld} buổi</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-slate-700 text-sm">{item.teacher}</p>
                      <p className="text-xs text-slate-400">{item.department}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      {group && (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${group.bgColor} ${group.textColor}`}>
                          <span className="material-symbols-outlined text-[14px]">{group.icon}</span>
                          {group.shortName}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                      <span className="text-slate-600 font-medium">{item.studentCount}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-slate-800">{item.avgEngagement}%</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-400 rounded-full" style={{ width: `${item.avgEngagement}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center hidden lg:table-cell">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-slate-800">{item.avgFocus}</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${item.avgFocus}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-slate-800">{item.avgAttendance}%</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${item.avgAttendance}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center hidden md:table-cell">
                      <span
                        className={`font-bold ${
                          item.totalAnomalies > 30
                            ? "text-rose-600"
                            : item.totalAnomalies > 15
                              ? "text-amber-600"
                              : "text-emerald-600"
                        }`}
                      >
                        {item.totalAnomalies}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${rating.color}`}>
                          {rating.label}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{overallScore}/100</span>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {virtualRows.paddingBottom > 0 && (
                <tr>
                  <td colSpan={9} style={{ height: virtualRows.paddingBottom }} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {overview.groupStats.map((group) => (
          <div
            key={group.id}
            className={`rounded-2xl border-2 p-5 ${overview.activeGroup === group.id ? "border-sky-400" : "border-slate-200"} bg-white shadow-sm hover:shadow-md transition-all cursor-pointer`}
            onClick={() => overview.setActiveGroup(overview.activeGroup === group.id ? "all" : group.id)}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg ${group.bgColor} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${group.textColor}`}>{group.icon}</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{group.shortName}</h4>
                <p className="text-xs text-slate-400">
                  {group.classCount} lớp · {group.studentCount} SV
                </p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Điểm trung bình</span>
                <span className="font-bold text-slate-800">{group.score}/100</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${group.score}%`, backgroundColor: group.color }} />
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-emerald-600 font-semibold">{group.excellentCount} lớp xuất sắc</span>
                {group.needsWorkCount > 0 && (
                  <span className="text-rose-500 font-semibold">{group.needsWorkCount} cần cải thiện</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
