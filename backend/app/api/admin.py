
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from app.auth import verify_token
# Import the orchestrator script
# Note: We need to import main from script. Use relative import or sys.path
import sys
import os
from datetime import datetime

# Ensure backend root is in path to import scripts
sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
from scripts.ingest_v2 import main as run_ingestion

router = APIRouter()

# In-memory status tracker
INGESTION_STATUS = {
    "status": "idle",  # idle | running | completed | failed
    "lastRun": None,
    "lastCompleted": None,
    "error": None
}

def update_status(new_status: str, error: str = None):
    INGESTION_STATUS["status"] = new_status
    INGESTION_STATUS["lastRun"] = datetime.utcnow().isoformat()
    if new_status == "completed":
        INGESTION_STATUS["lastCompleted"] = datetime.utcnow().isoformat()
        INGESTION_STATUS["error"] = None
    elif new_status == "failed":
        INGESTION_STATUS["error"] = error

def run_ingestion_with_status():
    """Wrapper to track ingestion status"""
    update_status("running")
    try:
        run_ingestion()
        update_status("completed")
    except Exception as e:
        update_status("failed", str(e))
        print(f"Ingestion failed: {e}")

@router.get("/ingest/status")
async def get_ingestion_status(user=Depends(verify_token)):
    """Get current ingestion status"""
    return INGESTION_STATUS

@router.post("/ingest")
async def trigger_ingestion(background_tasks: BackgroundTasks, user=Depends(verify_token)):
    """
    Triggers the Knowledge Base Ingestion in the background.
    Protected by Admin Token.
    """
    if INGESTION_STATUS["status"] == "running":
        raise HTTPException(status_code=409, detail="Ingestion already in progress")
    
    try:
        # Run ingestion in background with status tracking
        background_tasks.add_task(run_ingestion_with_status)
        return {"message": "Knowledge Base Ingestion started in background."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
