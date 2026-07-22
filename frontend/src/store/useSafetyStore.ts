import { create } from 'zustand';

export type EscalationState = 
  | 'NORMAL' 
  | 'WARNING' 
  | 'INVESTIGATING' 
  | 'PREDICTED_FAILURE' 
  | 'CONFIRMED_CRITICAL' 
  | 'EMERGENCY' 
  | 'POST_INCIDENT';

export interface Alert {
  id: string;
  title: string;
  loc: string;
  time: string;
  type: 'critical' | 'warning' | 'medium' | 'low';
}

export interface EnvData {
  temp: number;
  humidity: number;
  gas: number;
  wind: number;
}

interface SafetyState {
  escalationState: EscalationState;
  activeTab: string;
  riskScore: number;
  riskHistory: { time: string; risk: number }[];
  recentAlerts: Alert[];
  envData: EnvData;
  
  // Actions
  setEscalationState: (state: EscalationState) => void;
  setActiveTab: (tab: string) => void;
  setRiskScore: (score: number) => void;
  addRiskHistory: (risk: number) => void;
  addAlert: (alert: Alert) => void;
  updateEnvData: (data: Partial<EnvData>) => void;
  reset: () => void;
}

const initialEnv = { temp: 42.3, humidity: 67, gas: 0.12, wind: 8.2 };
const initialAlerts: Alert[] = [
  { id: '1', title: 'High Temp Detected', loc: 'Reactor R-101', time: '2 min ago', type: 'warning' },
  { id: '2', title: 'PPE Violation', loc: 'Zone 3', time: '5 min ago', type: 'warning' },
  { id: '3', title: 'Pressure Fluctuation', loc: 'Pump P-204', time: '7 min ago', type: 'medium' },
];
const initialHistory = Array.from({ length: 20 }, (_, i) => ({ time: `${i}s`, risk: 10 }));

export const useSafetyStore = create<SafetyState>((set, get) => ({
  escalationState: 'NORMAL',
  activeTab: 'Dashboard',
  riskScore: 10,
  riskHistory: initialHistory,
  recentAlerts: initialAlerts,
  envData: initialEnv,
  
  setEscalationState: (state) => set({ escalationState: state }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setRiskScore: (score) => set({ riskScore: score }),
  
  addRiskHistory: (risk) => set((state) => {
    const newHistory = [...state.riskHistory, { time: new Date().toLocaleTimeString().split(' ')[0], risk }];
    if (newHistory.length > 20) newHistory.shift(); // Keep last 20 ticks
    return { riskHistory: newHistory, riskScore: risk };
  }),
  
  addAlert: (alert) => set((state) => ({
    recentAlerts: [alert, ...state.recentAlerts].slice(0, 10) // Keep last 10
  })),
  
  updateEnvData: (data) => set((state) => ({ 
    envData: { ...state.envData, ...data } 
  })),

  reset: () => set({
    escalationState: 'NORMAL',
    riskScore: 10,
    riskHistory: initialHistory,
    recentAlerts: initialAlerts,
    envData: initialEnv,
  }),
}));
