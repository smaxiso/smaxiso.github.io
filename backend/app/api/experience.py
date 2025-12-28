from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.database import get_db
from app.models import schemas
from app.auth import verify_token

router = APIRouter()

# Pydantic models for request/response
class ExperienceBase(BaseModel):
    company: str
    company_logo: str | None = None
    title: str
    start_date: str  # YYYY-MM
    end_date: str | None = None  # YYYY-MM or null for current
    description: str | None = None
    technologies: List[str] | None = None
    order: int = 0

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(ExperienceBase):
    pass

class ExperienceResponse(ExperienceBase):
    id: int

    class Config:
        from_attributes = True


# Public endpoint - Get all experiences
@router.get("/", response_model=List[ExperienceResponse])
def get_experiences(db: Session = Depends(get_db)):
    """
    Get all work experiences, ordered by custom order field (ascending)
    """
    experiences = db.query(schemas.Experience).order_by(schemas.Experience.order).all()
    return experiences


# Admin endpoint - Create experience
@router.post("/", response_model=ExperienceResponse)
def create_experience(
    experience: ExperienceCreate,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    """
    Create a new work experience entry (admin only)
    """
    db_experience = schemas.Experience(**experience.dict())
    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)
    return db_experience


# Admin endpoint - Update experience
@router.put("/{experience_id}", response_model=ExperienceResponse)
def update_experience(
    experience_id: int,
    experience: ExperienceUpdate,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    """
    Update an existing work experience entry (admin only)
    """
    db_experience = db.query(schemas.Experience).filter(schemas.Experience.id == experience_id).first()
    if not db_experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    for key, value in experience.dict().items():
        setattr(db_experience, key, value)
    
    db.commit()
    db.refresh(db_experience)
    return db_experience


# Admin endpoint - Delete experience
@router.delete("/{experience_id}")
def delete_experience(
    experience_id: int,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    """
    Delete a work experience entry (admin only)
    """
    db_experience = db.query(schemas.Experience).filter(schemas.Experience.id == experience_id).first()
    if not db_experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    db.delete(db_experience)
    db.commit()
    return {"message": "Experience deleted successfully"}
