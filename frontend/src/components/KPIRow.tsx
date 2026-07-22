'use client';
import { AlertTriangle, Droplet, ClipboardList, ShieldCheck } from 'lucide-react';
import { useSafetyStore } from '@/store/useSafetyStore';

export default function KPIRow() {
  const { escalationState, recentAlerts, riskScore } = useSafetyStore();
  const isCritical = ['CONFIRMED_CRITICAL', 'EMERGENCY'].includes(escalationState);
  
  // Calculate dynamic KPIs based on the real-time store
  const activeAlerts = recentAlerts.length;
  const criticalAlerts = recentAlerts.filter(a => a.type === 'critical').length;
  
  const kpis = [
    {
      title: 'Active Alerts',
      value: activeAlerts,
      trend: isCritical ? '↑ Critical Spike' : '↑ 20% vs yesterday',
      trendColor: 'text-red-500',
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-500/10 border-red-500/30'
    },
    {
      title: 'High Risk Areas',
      value: criticalAlerts > 0 ? criticalAlerts + 2 : 2, // Base of 2
      trend: isCritical ? '↑ SIMOPS Detected' : '↑ 25% vs yesterday',
      trendColor: 'text-amber-500',
      icon: Droplet,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/10 border-amber-500/30'
    },
    {
      title: 'Active Permits',
      value: 18,
      trend: 'No change',
      trendColor: 'text-slate-400',
      icon: ClipboardList,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/30'
    },
    {
      title: 'Safety Score',
      value: `${(100 - riskScore).toFixed(0)}%`,
      trend: isCritical ? '↓ Catastrophic Drop' : '↑ Nominal',
      trendColor: isCritical ? 'text-red-500' : 'text-green-500',
      icon: ShieldCheck,
      iconColor: isCritical ? 'text-red-500' : 'text-green-500',
      iconBg: isCritical ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="bg-[#040f25] border border-[#1a2c4e] rounded-xl p-5 flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${kpi.iconBg} shrink-0 transition-colors duration-500`}>
            <kpi.icon size={24} className={kpi.iconColor} />
          </div>
          <div>
            <div className="text-sm text-slate-400 mb-1">{kpi.title}</div>
            <div className="text-2xl font-bold text-white mb-1">{kpi.value}</div>
            <div className={`text-xs ${kpi.trendColor} transition-colors duration-500`}>{kpi.trend}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
