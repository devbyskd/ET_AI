import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.telemetry import router as telemetry_router
from app.api.v1.telemetry import telemetry_consumer, set_alert_callback
from app.api.v1.alerts import router as alerts_router
from app.api.v1.alerts import alert_manager
from app.api.v1.permits import router as permits_router

app = FastAPI(title="Vanguard Safety Backend (PS 1)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(telemetry_router, tags=["Telemetry"])
app.include_router(alerts_router, tags=["Alerts"])
app.include_router(permits_router, prefix="/api/v1/permits", tags=["Permits"])

@app.on_event("startup")
async def startup_event():
    # Wire the broadcaster callback
    set_alert_callback(alert_manager.broadcast)
    # Start the background consumer task for 5Hz ingestion
    asyncio.create_task(telemetry_consumer())
    print("Vanguard Safety Backend Started!")

@app.get("/")
def health_check():
    return {"status": "GREEN", "message": "Zero-Harm Operations Nominal"}
