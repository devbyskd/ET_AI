from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime
from typing_extensions import TypedDict

class TelemetryMetrics(BaseModel):
    ch4_ppm: float
    ventilation_rpm: float
    temp_c: float

class TelemetryPayload(BaseModel):
    sensor_id: str
    zone_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metrics: TelemetryMetrics

class PermitCreateSchema(BaseModel):
    zone_id: str
    task_type: str
    worker_id: str
    valid_until: datetime

class ActivePermit(BaseModel):
    permit_id: str
    zone_id: str
    task_type: str
    worker_id: str

# LangGraph State
class SafetyState(TypedDict):
    event_id: str
    zone_id: str
    telemetry_payload: dict
    active_permits: List[dict]
    contextual_statutes: List[str]
    current_risk_level: str
    agent_reasoning: str
    action_directive: str
