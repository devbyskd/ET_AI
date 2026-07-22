'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSafetyStore } from '@/store/useSafetyStore';
import { Thermometer, Droplets, Cloud, Wind } from 'lucide-react';

export default function RightPanel() {
  const { riskHistory, envData } = useSafetyStore();

  const envGrid = [
    { label: 'Temp.', value: `${envData.temp.toFixed(1)}°C`, icon: Thermometer, color: envData.temp > 45 ? 'text-red-500' : 'text-orange-500' },
    { label: 'Humidity', value: `${envData.humidity.toFixed(0)}%`, icon: Droplets, color: 'text-blue-400' },
    { label: 'Gas (ppm)', value: envData.gas.toFixed(2), icon: Cloud, color: envData.gas > 0.5 ? 'text-red-500' : envData.gas > 0.2 ? 'text-amber-500' : 'text-green-500' },
    { label: 'Wind Speed', value: `${envData.wind.toFixed(1)} km/h`, icon: Wind, color: envData.wind < 5 ? 'text-amber-500' : 'text-purple-400' },
  ];

  return (
    <div className="flex flex-col gap-4 h-full">
      
      {/* Risk Trend Chart (Now Real-Time) */}
      <div className="bg-[#040f25] border border-[#1a2c4e] rounded-xl p-4">
        <h3 className="text-white font-semibold mb-4 text-sm flex justify-between">
          <span>Live Risk Velocity</span>
          <span className="text-[10px] text-green-500 animate-pulse border border-green-500/30 px-2 py-0.5 rounded">LIVE 1Hz</span>
        </h3>
        <div className="h-[120px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={riskHistory}>
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '4px' }}
                itemStyle={{ color: '#ef4444' }}
              />
              <Line 
                type="monotone" 
                dataKey="risk" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: '#ef4444' }}
                isAnimationActive={false} // Disable recharts animation for pure real-time feel
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Environmental Conditions */}
      <div className="bg-[#040f25] border border-[#1a2c4e] rounded-xl p-4">
        <h3 className="text-white font-semibold mb-4 text-sm">Environmental Conditions</h3>
        <div className="grid grid-cols-4 gap-2">
          {envGrid.map((env, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-2 bg-[#020816] rounded border border-[#1a2c4e] transition-colors duration-300">
              <env.icon size={16} className={`${env.color} mb-2`} />
              <div className="text-[10px] text-slate-400">{env.label}</div>
              <div className="text-sm font-bold text-white tabular-nums">{env.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Camera Feeds */}
      <div className="bg-[#040f25] border border-[#1a2c4e] rounded-xl p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold text-sm">Active Camera Feeds</h3>
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all →</button>
        </div>
        <div className="grid grid-cols-3 gap-2 flex-1">
          {[1, 2, 3].map((cam) => (
            <div key={cam} className="bg-[#020816] rounded border border-[#1a2c4e] relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 group-hover:scale-105 transition-transform duration-500"></div>
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] pointer-events-none"></div>
              
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-[8px] text-white font-mono">CAM 0{cam}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
