'use client';
import { useEffect, useRef } from 'react';
import { useSafetyStore } from '@/store/useSafetyStore';

export default function BackendIntegrationWrapper() {
  const { escalationState, setEscalationState, addAlert, addRiskHistory, updateEnvData } = useSafetyStore();
  const stateRef = useRef(escalationState);
  stateRef.current = escalationState;

  // 1. Live Data Simulator (Runs constantly to make graphs move)
  useEffect(() => {
    const interval = setInterval(() => {
      const isCritical = ['CONFIRMED_CRITICAL', 'EMERGENCY'].includes(stateRef.current);
      const isWarning = ['WARNING', 'INVESTIGATING', 'PREDICTED_FAILURE'].includes(stateRef.current);

      // Generate slight jitter based on state
      const jitter = () => (Math.random() - 0.5) * 2;
      
      const newTemp = isCritical ? 48.5 + jitter() : 42.3 + jitter();
      const newHum = 67 + jitter();
      const newGas = isCritical ? 0.65 + jitter()*0.05 : isWarning ? 0.25 + jitter()*0.05 : 0.12 + jitter()*0.02;
      const newWind = isWarning || isCritical ? 3.2 + jitter()*0.5 : 8.2 + jitter();
      
      const baseRisk = isCritical ? 94 : isWarning ? 45 : 10;
      const newRisk = Math.max(0, Math.min(100, baseRisk + jitter()*2));

      updateEnvData({ temp: newTemp, humidity: newHum, gas: newGas, wind: newWind });
      addRiskHistory(newRisk);

    }, 1000); // 1Hz update for UI smoothness

    return () => clearInterval(interval);
  }, [addRiskHistory, updateEnvData]);

  // 2. FastAPI WebSocket Listener
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/v1/alerts/live');

    ws.onopen = () => {
      console.log('Connected to ZeroHarm AI Backend');
    }; ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        
        if (payload.current_risk_level === 'CRITICAL_RED') {
          setEscalationState('CONFIRMED_CRITICAL');
          addAlert({
            id: Date.now().toString(),
            title: 'SIMOPS BREACH DETECTED',
            loc: payload.zone_id || 'ZONE-MELT-04',
            time: 'Just now',
            type: 'critical'
          });
        } else if (payload.current_risk_level === 'AMBER') {
          setEscalationState('WARNING');
          addAlert({
            id: Date.now().toString(),
            title: 'Anomalous Telemetry',
            loc: payload.zone_id || 'ZONE-MELT-04',
            time: 'Just now',
            type: 'warning'
          });
        }
      } catch (e) {
        console.error('Failed to parse backend payload', e);
      }
    };

    return () => ws.close();
  }, [setEscalationState, addAlert]);

  return null;
}
