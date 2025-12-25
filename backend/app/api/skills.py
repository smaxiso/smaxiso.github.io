from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import schemas, pydantic_models
from app.auth import verify_token

router = APIRouter()

@router.get("/", response_model=List[pydantic_models.Skill])
def read_skills(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    skills = db.query(schemas.Skill).offset(skip).limit(limit).all()
    return skills

@router.post("/", response_model=pydantic_models.Skill, status_code=status.HTTP_201_CREATED)
def create_skill(skill: pydantic_models.SkillCreate, db: Session = Depends(get_db), user=Depends(verify_token)):
    db_skill = schemas.Skill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill
