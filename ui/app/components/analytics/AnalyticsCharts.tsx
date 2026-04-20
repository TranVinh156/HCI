import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export function AnalyticsCharts({ chartData }: { chartData: any[] }) {
  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">analytics</span>
          <h3 className="text-xl font-bold text-slate-700">Không có dữ liệu</h3>
          <p className="text-slate-500 mt-2">Không tìm thấy dữ liệu buổi học nào trong khoảng thời gian phân tích đã chọn.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm xl:col-span-2 h-[420px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-slate-800">Historical Engagement & Focus</h3>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Trend Analysis</span>
        </div>
        <div className="flex-1 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEngAgg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFocAgg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="shortDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
              <Tooltip 
                 contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} 
                 labelStyle={{ fontWeight: "bold", color: "#334155", marginBottom: "8px" }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: '500' }} />
              <Area type="monotone" dataKey="engagement" name="Engagement %" stroke="#0ea5e9" fill="url(#colorEngAgg)" strokeWidth={3} isAnimationActive={false} />
              <Area type="monotone" dataKey="focus" name="Focus Score" stroke="#10b981" fill="url(#colorFocAgg)" strokeWidth={3} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-rows-2 gap-6 h-[420px]">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800">Anomalies Detected / Session</h3>
          </div>
          <div className="flex-1 w-full -ml-4 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="shortDate" hide />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} width={30}/>
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                <Bar dataKey="anomalies" name="Warnings/Alerts" fill="#f43f5e" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800">Participation Rate</h3>
          </div>
          <div className="flex-1 w-full -ml-4 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="shortDate" hide />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} width={30}/>
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                <Line type="step" dataKey="participation" name="Participation (%)" stroke="#f59e0b" strokeWidth={3} dot={{r: 3, fill: "#fff", strokeWidth: 2}} activeDot={{r: 6, fill: "#f59e0b"}} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
