from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models import schemas, pydantic_models
from app.auth import verify_token

router = APIRouter()

# Public: Get Approved Entries
@router.get("/", response_model=List[pydantic_models.GuestbookEntry])
def read_approved_entries(limit: int = 50, db: Session = Depends(get_db)):
    entries = db.query(schemas.GuestbookEntry)\
        .filter(schemas.GuestbookEntry.approved == 1)\
        .order_by(schemas.GuestbookEntry.created_at.desc())\
        .limit(limit)\
        .all()
    return entries

# Public: Submit Entry
@router.post("/", response_model=pydantic_models.GuestbookEntry, status_code=status.HTTP_201_CREATED)
def create_entry(entry: pydantic_models.GuestbookEntryCreate, db: Session = Depends(get_db)):
    db_entry = schemas.GuestbookEntry(
        **entry.model_dump(),
        approved=0, # Pending approval
        created_at=datetime.utcnow().isoformat()
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

# Admin: Get All (Pending First)
@router.get("/all", response_model=List[pydantic_models.GuestbookEntry])
def read_all_entries(db: Session = Depends(get_db), user=Depends(verify_token)):
    entries = db.query(schemas.GuestbookEntry)\
        .order_by(schemas.GuestbookEntry.approved.asc(), schemas.GuestbookEntry.created_at.desc())\
        .all()
    # Ordered by approved asc (0 first -> pending)
    return entries

# Admin: Approve
@router.put("/{entry_id}/approve", response_model=pydantic_models.GuestbookEntry)
def approve_entry(entry_id: int, db: Session = Depends(get_db), user=Depends(verify_token)):
    db_entry = db.query(schemas.GuestbookEntry).filter(schemas.GuestbookEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    db_entry.approved = 1
    db.commit()
    db.refresh(db_entry)
    return db_entry

# Admin: Delete
@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(entry_id: int, db: Session = Depends(get_db), user=Depends(verify_token)):
    db_entry = db.query(schemas.GuestbookEntry).filter(schemas.GuestbookEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    db.delete(db_entry)
    db.commit()
    return None
