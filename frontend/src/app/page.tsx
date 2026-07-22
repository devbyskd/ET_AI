'use client';
import { useSafetyStore } from '@/store/useSafetyStore';
import KPIRow from '@/components/KPIRow';
import LivePlantOverview from '@/components/LivePlantOverview';
import AlertCharts from '@/components/AlertCharts';
import RightPanel from '@/components/RightPanel';
import BackendIntegrationWrapper from '@/components/BackendIntegrationWrapper';

export default function Dashboard() {
  const { activeTab } = useSafetyStore();

  return (
    <div className="w-full h-full flex flex-col">
      {/* Invisible component that mounts the WebSocket hook & Live Simulator */}
      <BackendIntegrationWrapper />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white tracking-wide">{activeTab} Overview</h1>
      </div>

      {activeTab === 'Dashboard' ? (
        <>
          <KPIRow />
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
            {/* Left Column: Live Plant (Spans 5 cols) */}
            <div className="col-span-5 flex flex-col">
              <LivePlantOverview />
            </div>

            {/* Middle Column: Alerts Summary & Recent (Spans 4 cols) */}
            <div className="col-span-4 flex flex-col">
              <AlertCharts />
            </div>

            {/* Right Column: Risk Trend, Env, CCTV (Spans 3 cols) */}
            <div className="col-span-3 flex flex-col">
              <RightPanel />
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-[#1a2c4e] rounded-xl bg-[#040f25]/50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-300 mb-2">{activeTab} Module</h2>
            <p className="text-slate-500">This module is not licensed for the current Hackathon Demo Environment.</p>
          </div>
        </div>
      )}
    </div>
  );
}
