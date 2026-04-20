export function AnalyticsStats({ averages }: { averages: { eng: number; focus: number; att: number; anom: number } }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-[box-shadow]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Avg Engagement</h3>
          <div className="p-2 bg-sky-50 rounded-lg">
            <span className="material-symbols-outlined text-sky-500 text-[20px]">insights</span>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-extrabold text-slate-800">{averages.eng}%</span>
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-[box-shadow]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Avg Focus Score</h3>
          <div className="p-2 bg-emerald-50 rounded-lg">
             <span className="material-symbols-outlined text-emerald-500 text-[20px]">psychology</span>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-extrabold text-slate-800">{averages.focus}<span className="text-xl text-slate-400">/100</span></span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-[box-shadow]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Avg Attendance</h3>
          <div className="p-2 bg-amber-50 rounded-lg">
            <span className="material-symbols-outlined text-amber-500 text-[20px]">groups</span>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-extrabold text-slate-800">{averages.att}%</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-[box-shadow]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Total Anomalies</h3>
          <div className="p-2 bg-rose-50 rounded-lg">
            <span className="material-symbols-outlined text-rose-500 text-[20px]">warning</span>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-extrabold text-rose-600">{averages.anom}</span>
        </div>
      </div>
    </div>
  );
}
