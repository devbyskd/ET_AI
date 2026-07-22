import asyncio
import websockets
import json
import time

async def run_simulation():
    uri = "ws://localhost:8000/ws/v1/telemetry/stream"
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to Telemetry Stream")
            
            print("\n[T=0] Sending Nominal Telemetry (GREEN)")
            payload = {
                "sensor_id": "GAS-CH4-04",
                "zone_id": "ZONE-MELT-04",
                "metrics": {"ch4_ppm": 0.05, "ventilation_rpm": 950, "temp_c": 32.5}
            }
            await websocket.send(json.dumps(payload))
            await asyncio.sleep(2)
            
            print("\n[T=2] Power Sag - Fan drops, but gas is okay (GREEN)")
            payload["metrics"] = {"ch4_ppm": 0.05, "ventilation_rpm": 750, "temp_c": 32.5}
            await websocket.send(json.dumps(payload))
            await asyncio.sleep(2)
            
            print("\n[T=4] The Hidden SIMOPS Breach - Fan low + Gas ticks up + Hot Work active (RED expected)")
            payload["metrics"] = {"ch4_ppm": 0.60, "ventilation_rpm": 750, "temp_c": 35.0}
            await websocket.send(json.dumps(payload))
            await asyncio.sleep(2)
            
            print("\nSimulation Complete. Check Backend Console for Emergency Orchestrator Logs.")
    except ConnectionRefusedError:
        print("Ensure the FastAPI server is running: `uvicorn main:app --reload`")

if __name__ == "__main__":
    asyncio.run(run_simulation())
