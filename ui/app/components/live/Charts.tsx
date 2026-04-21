import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card } from "../ui/card";

type MetricData = {
  time: string;
  engagement: number;
  focus: number;
  focusedCount: number;
  distractedCount: number;
  confusedCount: number;
};

export function EngagementChart({ metricsHistory, isVideoFullscreen }: { metricsHistory: MetricData[], isVideoFullscreen: boolean }) {
  return (
    <Card className={`flex h-64 flex-col bg-surface-container-lowest p-6 ${isVideoFullscreen ? "flex-1 min-w-[300px]" : "w-full"}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-on-surface-variant text-sm font-medium">Engagement & Focus Trend</h3>
        <span className="material-symbols-outlined text-primary">monitoring</span>
      </div>
      <div className="flex-1 w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metricsHistory} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              contentStyle={{ borderRadius: "8px", fontSize: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Area type="monotone" dataKey="engagement" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorEngagement)" name="Engagement (%)" strokeWidth={2} isAnimationActive={false} />
            <Area type="monotone" dataKey="focus" stroke="#10b981" fillOpacity={1} fill="url(#colorFocus)" name="Focus Score" strokeWidth={2} isAnimationActive={false} />
          </AreaChart>
          </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function ActivityBreakdown({ metricsHistory, isVideoFullscreen }: { metricsHistory: MetricData[], isVideoFullscreen: boolean }) {
  return (
    <Card className={`flex h-64 flex-col bg-surface-container-lowest p-6 ${isVideoFullscreen ? "flex-1 min-w-[300px]" : "w-full"}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-on-surface-variant text-sm font-medium">Activity Breakdown</h3>
        <span className="material-symbols-outlined text-secondary">donut_large</span>
      </div>
      <div className="flex-1 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={
              metricsHistory.length > 0
                ? [
                    {
                      name: "Current",
                      FOCUSED: metricsHistory[metricsHistory.length - 1].focusedCount,
                      DISTRACTED: metricsHistory[metricsHistory.length - 1].distractedCount,
                      CONFUSED: metricsHistory[metricsHistory.length - 1].confusedCount,
                    },
                  ]
                : []
            }
            layout="vertical"
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "8px", fontSize: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
            <Bar dataKey="FOCUSED" stackId="a" fill="#10b981" radius={[4, 0, 0, 4]} isAnimationActive={false} />
            <Bar dataKey="DISTRACTED" stackId="a" fill="#f59e0b" isAnimationActive={false} />
            <Bar dataKey="CONFUSED" stackId="a" fill="#f43f5e" radius={[0, 4, 4, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-4 text-xs font-semibold text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>FOCUSED</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>DISTRACTED</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>CONFUSED</span>
      </div>
    </Card>
  );
}
