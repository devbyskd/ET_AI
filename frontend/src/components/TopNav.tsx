'use client';
import { Bell, ChevronDown, User, PlayCircle } from 'lucide-react';
import { useSafetyStore } from '@/store/useSafetyStore';

export default function TopNav() {
  const { escalationState, setEscalationState } = useSafetyStore();

  const triggerSimulation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'demo') {
      setEscalationState('NOMINAL');
      setTimeout(() => setEscalationState('WARNING'), 2000);
      setTimeout(() => setEscalationState('CONFIRMED_CRITICAL'), 5000);
      e.target.value = 'default';
    } else if (e.target.value === 'reset') {
      setEscalationState('NOMINAL');
      e.target.value = 'default';
    }
  };

  return (
    <div className="h-16 flex items-center justify-end px-8 border-b border-[#1a2c4e] bg-[#020816]">
      
      {/* Simulation/Demo Trigger (re-implemented for the new UI to keep the wow factor) */}
      <div className="mr-auto flex items-center gap-3">
        <div className="bg-[#1a2c4e] px-3 py-1.5 rounded-md flex items-center gap-2 border border-[#2a3c5e]">
          <PlayCircle size={16} className="text-blue-400" />
          <select 
            className="bg-transparent text-sm text-slate-200 outline-none cursor-pointer"
            onChange={triggerSimulation}
            defaultValue="default"
          >
            <option value="default" disabled>Select Demo Scenario...</option>
            <option value="demo">Trigger SIMOPS Anomaly</option>
            <option value="reset">Reset to Nominal</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">3</span>
        </button>

        <div className="h-8 w-px bg-[#1a2c4e]"></div>

        <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors bg-[#0a1f42] px-3 py-1.5 rounded-md border border-[#1a2c4e]">
          Plant 1
          <ChevronDown size={16} />
        </button>

        <div className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#1a2c4e] flex items-center justify-center border border-[#2a3c5e]">
            <User size={16} />
          </div>
          Safety Officer
          <ChevronDown size={14} className="ml-1" />
        </div>
      </div>
    </div>
  );
}
