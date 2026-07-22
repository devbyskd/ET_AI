import uuid
from typing import List
from app.models.schemas import PermitCreateSchema, ActivePermit

class MockRepository:
    def __init__(self):
        self.permits = {} # permit_id -> ActivePermit
        self.telemetry_history = []
        
        # Pre-seed with the HOT_WORK permit for the demo
        self.issue_permit(PermitCreateSchema(
            zone_id="ZONE-MELT-04",
            task_type="HOT_WORK_WELDING",
            worker_id="W-99321",
            valid_until="2026-12-31T23:59:59Z"
        ))

    def issue_permit(self, permit: PermitCreateSchema) -> ActivePermit:
        permit_id = str(uuid.uuid4())
        active_permit = ActivePermit(
            permit_id=permit_id,
            zone_id=permit.zone_id,
            task_type=permit.task_type,
            worker_id=permit.worker_id
        )
        self.permits[permit_id] = active_permit
        return active_permit

    def get_active_permits_in_zone(self, zone_id: str) -> List[ActivePermit]:
        return [p for p in self.permits.values() if p.zone_id == zone_id]

    def log_telemetry(self, payload: dict):
        self.telemetry_history.append(payload)

# Global mock instance
db = MockRepository()
