from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import schemas, pydantic_models

router = APIRouter()

@router.get("/", response_model=List[pydantic_models.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = db.query(schemas.Project).offset(skip).limit(limit).all()
    return projects

@router.post("/", response_model=pydantic_models.Project, status_code=status.HTTP_201_CREATED)
def create_project(project: pydantic_models.ProjectCreate, db: Session = Depends(get_db)):
    db_project = schemas.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.put("/{project_id}", response_model=pydantic_models.Project)
def update_project(project_id: str, project: pydantic_models.ProjectCreate, db: Session = Depends(get_db)):
    db_project = db.query(schemas.Project).filter(schemas.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project_data = project.model_dump(exclude_unset=True)
    for key, value in project_data.items():
        setattr(db_project, key, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: str, db: Session = Depends(get_db)):
    db_project = db.query(schemas.Project).filter(schemas.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(db_project)
    db.commit()
    return None
