from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()

class AlertManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

alert_manager = AlertManager()

@router.websocket("/ws/v1/alerts/live")
async def live_alerts(websocket: WebSocket):
    await alert_manager.connect(websocket)
    try:
        while True:
            # We don't expect the frontend to send data here, just listen
            await websocket.receive_text()
    except WebSocketDisconnect:
        alert_manager.disconnect(websocket)
