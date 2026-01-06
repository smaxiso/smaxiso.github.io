from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models import schemas, pydantic_models
from app.utils import delete_cloudinary_image

router = APIRouter()

# Public: Get all published posts
@router.get("/", response_model=List[pydantic_models.BlogPost])
def read_published_posts(limit: int = 50, db: Session = Depends(get_db)):
    posts = db.query(schemas.BlogPost)\
        .filter(schemas.BlogPost.published == True)\
        .order_by(schemas.BlogPost.created_at.desc())\
        .limit(limit)\
        .all()
    return posts

# Public: Get single post by slug
@router.get("/{slug}", response_model=pydantic_models.BlogPost)
def read_post_by_slug(slug: str, db: Session = Depends(get_db)):
    post = db.query(schemas.BlogPost).filter(schemas.BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not post.published:
        # Ideally we might want to allow admins to see drafts, but for simplicity:
        # If accessing by slug publicly, generally we only show published.
        # But for admin preview, we might need a separate endpoint or just loosen this restriction
        # if the frontend handles it. 
        # For now, let's allow fetching by slug even if draft, BUT the list endpoint only shows published.
        # This allows "Preview Mode".
        pass 
    return post

# Admin: Get all posts (published + drafts)
@router.get("/admin/all", response_model=List[pydantic_models.BlogPost])
def read_all_posts(db: Session = Depends(get_db)):
    posts = db.query(schemas.BlogPost)\
        .order_by(schemas.BlogPost.created_at.desc())\
        .all()
    return posts

# Admin: Create Post
@router.post("/", response_model=pydantic_models.BlogPost)
def create_post(post: pydantic_models.BlogPostCreate, db: Session = Depends(get_db)):
    # Check slug uniqueness
    existing = db.query(schemas.BlogPost).filter(schemas.BlogPost.slug == post.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    current_time = datetime.utcnow().isoformat()
    db_post = schemas.BlogPost(
        title=post.title,
        slug=post.slug,
        content=post.content,
        excerpt=post.excerpt,
        tags=post.tags,
        cover_image=post.cover_image,
        published=post.published,
        created_at=current_time,
        updated_at=current_time
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

# Admin: Update Post
@router.put("/{id}", response_model=pydantic_models.BlogPost)
def update_post(id: int, post: pydantic_models.BlogPostCreate, db: Session = Depends(get_db)):
    db_post = db.query(schemas.BlogPost).filter(schemas.BlogPost.id == id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Check slug uniqueness only if changing
    if post.slug != db_post.slug:
        existing = db.query(schemas.BlogPost).filter(schemas.BlogPost.slug == post.slug).first()
        if existing:
            raise HTTPException(status_code=400, detail="Slug already exists")

    db_post.title = post.title
    db_post.slug = post.slug
    db_post.content = post.content
    db_post.excerpt = post.excerpt
    db_post.tags = post.tags


    # Handle Image Replacement
    if post.cover_image != db_post.cover_image:
        if db_post.cover_image:
            delete_cloudinary_image(db_post.cover_image)
        db_post.cover_image = post.cover_image

    db_post.published = post.published
    db_post.updated_at = datetime.utcnow().isoformat()
    
    db.commit()
    db.refresh(db_post)
    return db_post

# Admin: Delete Post
@router.delete("/{id}")
def delete_post(id: int, db: Session = Depends(get_db)):
    db_post = db.query(schemas.BlogPost).filter(schemas.BlogPost.id == id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Delete associated image from Cloudinary
    if db_post.cover_image:
        delete_cloudinary_image(db_post.cover_image)

    # Delete images used within content
    if db_post.content:
        import re
        # Regex to find markdown images: ![alt](url) or <img src="url">
        url_pattern = re.compile(r'(?:!\[.*?\]\((https?://[^)]+)\))|(?:src=["\'](https?://[^"\']+)["\'])')
        matches = url_pattern.findall(db_post.content)
        
        for match in matches:
            # Match returns tuple (markdown_url, html_url), filter empty
            img_url = next((m for m in match if m), None)
            if img_url:
                delete_cloudinary_image(img_url)

    db.delete(db_post)
    db.commit()
    return {"message": "Post deleted"}
