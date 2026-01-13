from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict
from app.database import get_db
from app.models import schemas, pydantic_models

router = APIRouter()

# Get reactions for a specific post
@router.get("/{slug}", response_model=List[pydantic_models.BlogReaction])
def get_reactions(slug: str, db: Session = Depends(get_db)):
    reactions = db.query(schemas.BlogReaction).filter(schemas.BlogReaction.slug == slug).all()
    return reactions

# Increment reaction count
@router.post("/{slug}/{reaction_type}", response_model=pydantic_models.BlogReaction)
def react_to_post(slug: str, reaction_type: str, db: Session = Depends(get_db)):
    # Find existing reaction entry
    reaction = db.query(schemas.BlogReaction).filter(
        schemas.BlogReaction.slug == slug,
        schemas.BlogReaction.reaction_type == reaction_type
    ).first()
    
    if reaction:
        reaction.count += 1
    else:
        # Create new entry if doesn't exist
        reaction = schemas.BlogReaction(
            slug=slug,
            reaction_type=reaction_type,
            count=1
        )
        db.add(reaction)
    
    try:
        db.commit()
        db.refresh(reaction)
        return reaction
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
