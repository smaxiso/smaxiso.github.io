
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from app.auth import verify_token
# Import the orchestrator script
# Note: We need to import main from script. Use relative import or sys.path
import sys
import os

# Ensure backend root is in path to import scripts
sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
from scripts.ingest_v2 import main as run_ingestion

router = APIRouter()

@router.post("/ingest")
async def trigger_ingestion(background_tasks: BackgroundTasks, user=Depends(verify_token)):
    """
    Triggers the Knowledge Base Ingestion in the background.
    Protected by Admin Token.
    """
    try:
        # Run ingestion in background to avoid timeout
        background_tasks.add_task(run_ingestion)
        return {"message": "Knowledge Base Ingestion started in background."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
