from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import PermitCreateSchema, ActivePermit
from app.services.repository import db

router = APIRouter()

@router.post("/issue", response_model=ActivePermit, status_code=201)
async def issue_permit(permit: PermitCreateSchema):
    # SIMOPS check happens here (or in AI layer). 
    # For MVP, we just issue it and let AI catch the conflict during ingestion.
    return db.issue_permit(permit)

@router.get("/active", response_model=List[ActivePermit])
async def get_active_permits(zone_id: str = None):
    if zone_id:
        return db.get_active_permits_in_zone(zone_id)
    return list(db.permits.values())
