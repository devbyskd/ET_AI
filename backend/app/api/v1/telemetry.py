import asyncio
import json
import uuid
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.models.schemas import TelemetryPayload, SafetyState
from app.agents.workflow import safety_workflow
from app.services.repository import db
# from app.api.v1.alerts import alert_manager # We'll handle this in main.py or dependency injection

router = APIRouter()

# Global in-memory queue for 5Hz SCADA ingestion
telemetry_queue = asyncio.Queue()

# We will define a global callback to broadcast alerts 
# This avoids circular imports for the hackathon MVP
broadcast_alert_callback = None

def set_alert_callback(callback):
    global broadcast_alert_callback
    broadcast_alert_callback = callback

@router.websocket("/ws/v1/telemetry/stream")
async def telemetry_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            # Unpivot nested JSON logic: Validate via Pydantic
            telemetry = TelemetryPayload(**payload)
            # Push to queue (Non-blocking)
            await telemetry_queue.put(telemetry)
    except WebSocketDisconnect:
        print("Telemetry Edge Device Disconnected")

async def telemetry_consumer():
    """Background task to process the queue"""
    while True:
        telemetry: TelemetryPayload = await telemetry_queue.get()
        
        # 1. Path A: Persistence
        db.log_telemetry(telemetry.dict())
        
        # 2. Path B: Intelligence
        initial_state: SafetyState = {
            "event_id": str(uuid.uuid4()),
            "zone_id": telemetry.zone_id,
            "telemetry_payload": telemetry.dict(),
            "active_permits": [],
            "contextual_statutes": [],
            "current_risk_level": "UNKNOWN",
            "agent_reasoning": "",
            "action_directive": ""
        }
        
        # Run LangGraph workflow
        final_state = safety_workflow.invoke(initial_state)
        
        # 3. Broadcaster
        if final_state["current_risk_level"] in ["AMBER", "CRITICAL_RED"]:
            if broadcast_alert_callback:
                await broadcast_alert_callback(final_state)
                
        telemetry_queue.task_done()
