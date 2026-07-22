'use client';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Droplet, Wind } from 'lucide-react';
import { useSafetyStore } from '@/store/useSafetyStore';

export default function LivePlantOverview() {
  const { escalationState } = useSafetyStore();
  
  const isCritical = ['CONFIRMED_CRITICAL', 'EMERGENCY'].includes(escalationState);
  const isWarning = ['WARNING', 'INVESTIGATING', 'PREDICTED_FAILURE'].includes(escalationState);

  // Define some static node positions for the "Isometric" view
  const nodes = [
    { id: 'N1', top: '20%', left: '25%', type: 'normal' },
    { id: 'N2', top: '40%', left: '15%', type: 'critical' },
    { id: 'N3', top: '70%', left: '30%', type: 'warning' },
    { id: 'N4', top: '30%', left: '60%', type: 'normal' },
    { id: 'N5', top: '65%', left: '75%', type: 'normal' },
  ];

  // The targeted SIMOPS zone that we animate during a demo
  const targetZone = { top: '50%', left: '50%' };

  return (
    <div className="bg-[#040f25] border border-[#1a2c4e] rounded-xl flex flex-col overflow-hidden h-[400px]">
      <div className="p-4 border-b border-[#1a2c4e] flex justify-between items-center bg-[#040f25] z-10">
        <h3 className="text-white font-semibold">Live Plant Overview</h3>
      </div>
      
      <div className="flex-1 relative overflow-hidden bg-[#020816]">
        {/* Thematic Blueprint Grid Background */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(rgba(30, 58, 138, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 58, 138, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'rotateX(60deg) rotateZ(-45deg) scale(2)',
          transformOrigin: 'center center'
        }}></div>

        {/* Static Background Nodes (Simulating the 3D plant) */}
        {nodes.map((node) => (
          <div 
            key={node.id}
            className={`absolute w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg transform -translate-x-1/2 -translate-y-1/2 ${
              node.type === 'normal' ? 'bg-green-500/20 border-green-500 text-green-500' :
              node.type === 'warning' ? 'bg-amber-500/20 border-amber-500 text-amber-500' :
              'bg-red-500/20 border-red-500 text-red-500'
            }`}
            style={{ top: node.top, left: node.left }}
          >
            {node.type === 'normal' ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
          </div>
        ))}

        {/* Dynamic Focus Zone (The SIMOPS Breach) */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          style={{ top: targetZone.top, left: targetZone.left }}
        >
          {/* Heatmap Glow */}
          <motion.div 
            className={`absolute w-64 h-64 rounded-full blur-[80px] pointer-events-none ${
              isCritical ? 'bg-red-600/40' : isWarning ? 'bg-amber-500/30' : 'bg-transparent'
            }`}
            animate={{ 
              scale: isCritical ? [1, 1.2, 1] : 1,
              opacity: isCritical ? [0.5, 0.8, 0.5] : 0.5
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />

          <motion.div 
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-[0_0_20px_currentColor] relative z-10 ${
              isCritical ? 'bg-red-500/30 border-red-500 text-red-500' :
              isWarning ? 'bg-amber-500/30 border-amber-500 text-amber-500' :
              'bg-green-500/30 border-green-500 text-green-500'
            }`}
            animate={isCritical ? { y: [0, -10, 0] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {isCritical || isWarning ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
          </motion.div>
          
          <div className="mt-2 bg-[#040f25]/90 border border-[#1a2c4e] px-3 py-1.5 rounded text-xs font-mono relative z-10 backdrop-blur">
            <div className="text-slate-400">ZONE-MELT-04</div>
            {isCritical && <div className="text-red-500 font-bold mt-1">SIMOPS BREACH</div>}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex gap-4 text-xs text-slate-400 bg-[#040f25]/80 px-4 py-2 rounded-full border border-[#1a2c4e] backdrop-blur">
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Normal</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Warning</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> Critical</div>
        </div>
      </div>
    </div>
  );
}
