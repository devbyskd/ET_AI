from app.models.schemas import SafetyState
from app.services.repository import db

# Mocking the Vector DB Retrieval for Speed
STATUTES = [
    "DGMS Clause 4.2.1: No hot work is permitted if ventilation is degraded > 20% OR if Methane is > 0.5%."
]

def stream_ingestion_agent(state: SafetyState) -> SafetyState:
    """Agent 1: Deterministic check of raw thresholds"""
    payload = state["telemetry_payload"]
    metrics = payload.get("metrics", {})
    
    # Sub-50ms hard-coded threshold check
    # If Methane > 1.25 alone, it's critical.
    if metrics.get("ch4_ppm", 0) > 1.25:
        state["current_risk_level"] = "CRITICAL_RED"
        state["agent_reasoning"] = "Hard threshold breach: Methane > 1.25%"
        return state
        
    # Anomaly detected: slightly low fan OR slight gas increase -> Route to AI
    if metrics.get("ventilation_rpm", 950) < 800 or metrics.get("ch4_ppm", 0) > 0.4:
        # We need AI to correlate this with SIMOPS
        # 1. Fetch active permits from Mock Graph DB
        permits = db.get_active_permits_in_zone(state["zone_id"])
        state["active_permits"] = [p.dict() for p in permits]
        # 2. Fetch statutes from Mock Vector DB
        state["contextual_statutes"] = STATUTES
        
        state["current_risk_level"] = "PENDING_AI_REVIEW"
    else:
        state["current_risk_level"] = "GREEN"
        
    return state

def risk_correlation_agent(state: SafetyState) -> SafetyState:
    """Agent 2: The LLM Spatial-Temporal Reasoner.
       In a full implementation, this calls an LLM (e.g. ChatOpenAI).
       For speed and reliability in the hackathon MVP, we use a deterministic rule engine 
       that mimics the strict LLM prompt output."""
    
    if state["current_risk_level"] != "PENDING_AI_REVIEW":
        return state
        
    metrics = state["telemetry_payload"].get("metrics", {})
    permits = state["active_permits"]
    
    is_hot_work = any("HOT_WORK" in p["task_type"] for p in permits)
    ch4 = metrics.get("ch4_ppm", 0)
    vent = metrics.get("ventilation_rpm", 950)
    
    # The "Hidden SIMOPS Breach" Logic (Low Fan + Gas + Hot Work)
    if is_hot_work and (ch4 > 0.5 or vent < 760):
        state["current_risk_level"] = "CRITICAL_RED"
        state["agent_reasoning"] = f"Compound Risk: Methane at {ch4}% and Fan at {vent} RPM overlapping with Active Hot-Work Permit. Violation of DGMS Clause 4.2.1."
        state["action_directive"] = "IMMEDIATE_POWER_ISOLATION"
    else:
        state["current_risk_level"] = "AMBER"
        state["agent_reasoning"] = "Anomaly detected but no SIMOPS conflict found."
        state["action_directive"] = "ALERT_OFFICER"
        
    return state

def emergency_orchestrator_agent(state: SafetyState) -> SafetyState:
    """Agent 3: Triggers IoT commands if RED"""
    if state["current_risk_level"] == "CRITICAL_RED":
        # In a real app, this sends MQTT/IoT commands to relays
        print(f"EMERGENCY ORCHESTRATOR: {state['action_directive']} in {state['zone_id']}")
    return state
