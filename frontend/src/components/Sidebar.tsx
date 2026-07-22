'use client';
import { Home, Activity, Bell, Cpu, ShieldAlert, Network, ClipboardList, BarChart3, Settings } from 'lucide-react';
import { useSafetyStore } from '@/store/useSafetyStore';

export default function Sidebar() {
  const { activeTab, setActiveTab } = useSafetyStore();

  const navItems = [
    { icon: Home, label: 'Dashboard' },
    { icon: Activity, label: 'Monitoring' },
    { icon: Bell, label: 'Alerts' },
    { icon: Cpu, label: 'AI Assistant' },
    { icon: ShieldAlert, label: 'Risk Engine' },
    { icon: Network, label: 'Knowledge Graph' },
    { icon: ClipboardList, label: 'Permits' },
    { icon: BarChart3, label: 'Reports' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 h-screen bg-[#040f25] border-r border-[#1a2c4e] flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <ShieldAlert size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-wide">ZeroHarm <span className="text-blue-500">AI</span></span>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item, idx) => {
          const isActive = activeTab === item.label;
          return (
            <button
              key={idx} 
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-[#0f3470] text-blue-400 font-medium border-l-4 border-blue-500' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0a1f42]'
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 m-4 bg-[#0a1f42] rounded-lg border border-[#1a2c4e]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse"></div>
          <span className="text-xs font-semibold text-slate-300">System Status</span>
        </div>
        <div className="text-[10px] text-green-500 mt-1 ml-4">All Systems Operational</div>
      </div>
    </div>
  );
}
