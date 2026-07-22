'use client';

import { useSafetyStore } from '@/store/useSafetyStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Zap, XOctagon } from 'lucide-react';

export default function EmergencyModal() {
  const { escalationState, reset } = useSafetyStore();

  const show = ['CONFIRMED_CRITICAL', 'EMERGENCY'].includes(escalationState);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          {/* Strobe background effect */}
          <motion.div 
            animate={{ opacity: [0, 0.1, 0] }} 
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute inset-0 bg-industrial-red pointer-events-none"
          />

          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-slate-950 border border-industrial-red rounded-xl shadow-[0_0_50px_rgba(239,68,68,0.3)] max-w-2xl w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-industrial-red text-white p-4 flex items-center gap-3">
              <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
                <AlertOctagon size={32} />
              </motion.div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest">COMPOUND HAZARD DETECTED</h2>
                <div className="text-xs font-mono font-bold">CATASTROPHIC RISK IMPENDING</div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded text-center">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-1">AI Confidence Metric</div>
                  <div className="text-2xl font-black text-white">97.2% Match</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded text-center">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-1">Lead Time to Breach</div>
                  <div className="text-2xl font-black text-industrial-amber">02m 45s</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded">
                <div className="text-slate-400 text-xs font-bold uppercase mb-3 border-b border-slate-800 pb-2">Evidence Grid</div>
                <ul className="text-sm font-mono space-y-2 text-slate-300">
                  <li><span className="text-industrial-red font-bold">CRITICAL:</span> Methane (CH4) density exceeded 0.60 PPM.</li>
                  <li><span className="text-industrial-red font-bold">CRITICAL:</span> DGMS Rule 127 Violation (Ventilation &lt; 800 RPM).</li>
                  <li><span className="text-industrial-red font-bold">CRITICAL:</span> Active Ignition Source: Permit #38 (Welding).</li>
                  <li><span className="text-industrial-amber font-bold">PERSONNEL:</span> 4 Workers identified in blast radius.</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <button className="flex items-center justify-center gap-2 bg-industrial-red hover:bg-red-600 text-white font-bold py-3 rounded transition-colors uppercase tracking-wide">
                  <XOctagon size={18} />
                  Initiate Evacuation
                </button>
                <button 
                  onClick={reset}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded transition-colors uppercase tracking-wide border border-slate-700"
                >
                  <Zap size={18} />
                  Isolate Valves (Reset)
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
