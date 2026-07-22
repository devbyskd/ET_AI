'use client';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useSafetyStore } from '@/store/useSafetyStore';
import { AlertTriangle, AlertCircle } from 'lucide-react';

export default function AlertCharts() {
  const { recentAlerts } = useSafetyStore();

  const totalAlerts = recentAlerts.length;
  
  const criticalCount = recentAlerts.filter(a => a.type === 'critical').length;
  const warningCount = recentAlerts.filter(a => a.type === 'warning').length;
  const mediumCount = recentAlerts.filter(a => a.type === 'medium').length;
  const lowCount = recentAlerts.filter(a => a.type === 'low').length;

  const data = [
    { name: 'Critical', value: criticalCount > 0 ? criticalCount : 0.1, color: '#ef4444', actual: criticalCount }, 
    { name: 'High', value: warningCount > 0 ? warningCount : 0.1, color: '#f59e0b', actual: warningCount },    
    { name: 'Medium', value: mediumCount > 0 ? mediumCount : 0.1, color: '#eab308', actual: mediumCount },                   
    { name: 'Low', value: lowCount > 0 ? lowCount : 0.1, color: '#22c55e', actual: lowCount },     
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      
      {/* Alerts Summary (Donut Chart) */}
      <div className="bg-[#040f25] border border-[#1a2c4e] rounded-xl p-4 flex-1">
        <h3 className="text-white font-semibold mb-4 text-sm">Alerts Summary</h3>
        <div className="flex items-center h-32">
          <div className="w-1/2 h-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={false} // Disable animation to prevent flickering on live updates
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.actual === 0 ? '#1e293b' : entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-white leading-none">{totalAlerts}</span>
              <span className="text-[10px] text-slate-400">Total</span>
            </div>
          </div>
          
          <div className="w-1/2 flex flex-col justify-center gap-2 pl-4">
            {data.map((entry, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-slate-300">{entry.name}</span>
                </div>
                <span className="text-white font-medium">{entry.actual}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts List */}
      <div className="bg-[#040f25] border border-[#1a2c4e] rounded-xl p-4 flex-1 overflow-hidden flex flex-col">
        <h3 className="text-white font-semibold mb-4 text-sm">Recent Alerts</h3>
        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {recentAlerts.slice(0, 5).map((alert) => (
            <div key={alert.id} className="flex items-start justify-between bg-[#020816] p-2 rounded border border-[#1a2c4e]">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 shrink-0">
                  {alert.type === 'critical' ? (
                    <AlertTriangle size={14} className="text-red-500 animate-pulse" />
                  ) : alert.type === 'warning' ? (
                    <AlertTriangle size={14} className="text-amber-500" />
                  ) : (
                    <AlertCircle size={14} className="text-yellow-500" />
                  )}
                </div>
                <div>
                  <div className={`text-xs font-medium ${alert.type === 'critical' ? 'text-red-400' : 'text-slate-200'}`}>
                    {alert.title}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{alert.loc}</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 shrink-0 tabular-nums">{alert.time}</div>
            </div>
          ))}
          {recentAlerts.length === 0 && (
            <div className="text-center text-xs text-slate-500 py-4">No recent alerts</div>
          )}
        </div>
        <div className="mt-3 pt-3 border-t border-[#1a2c4e] text-right">
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all alerts →</button>
        </div>
      </div>

    </div>
  );
}
