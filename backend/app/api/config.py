from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import schemas, pydantic_models
from typing import List

router = APIRouter()

# --- Config ---
@router.get("/config", response_model=pydantic_models.SiteConfig)
def get_site_config(db: Session = Depends(get_db)):
    config = db.query(schemas.SiteConfig).filter(schemas.SiteConfig.id == 1).first()
    if not config:
        # Return default structure/errors or seed on fly (preferred: seed script handles this)
        raise HTTPException(status_code=404, detail="Config not initialized")
    return config

@router.put("/config", response_model=pydantic_models.SiteConfig)
def update_site_config(config: pydantic_models.SiteConfigUpdate, db: Session = Depends(get_db)):
    db_config = db.query(schemas.SiteConfig).filter(schemas.SiteConfig.id == 1).first()
    if not db_config:
        db_config = schemas.SiteConfig(id=1, **config.model_dump())
        db.add(db_config)
    else:
        for key, value in config.model_dump().items():
            setattr(db_config, key, value)
    
    db.commit()
    db.refresh(db_config)
    return db_config

# --- Socials ---
@router.get("/socials", response_model=List[pydantic_models.SocialLink])
def get_socials(db: Session = Depends(get_db)):
    return db.query(schemas.SocialLink).filter(schemas.SocialLink.is_active == 1).all()

@router.post("/socials", response_model=pydantic_models.SocialLink)
def create_social(social: pydantic_models.SocialLinkCreate, db: Session = Depends(get_db)):
    db_social = schemas.SocialLink(**social.model_dump())
    db.add(db_social)
    db.commit()
    db.refresh(db_social)
    return db_social

@router.put("/socials/{id}", response_model=pydantic_models.SocialLink)
def update_social(id: int, social: pydantic_models.SocialLinkCreate, db: Session = Depends(get_db)):
    db_social = db.query(schemas.SocialLink).filter(schemas.SocialLink.id == id).first()
    if not db_social:
        raise HTTPException(status_code=404, detail="Social link not found")
    
    for key, value in social.model_dump().items():
        setattr(db_social, key, value)
        
    db.commit()
    db.refresh(db_social)
    return db_social

@router.delete("/socials/{id}")
def delete_social(id: int, db: Session = Depends(get_db)):
    db_social = db.query(schemas.SocialLink).filter(schemas.SocialLink.id == id).first()
    if not db_social:
        raise HTTPException(status_code=404, detail="Social link not found")
        
    db.delete(db_social)
    db.commit()
    return {"message": "Deleted successfully"}
