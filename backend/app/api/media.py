from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import cloudinary.api
import cloudinary.uploader
from pydantic import BaseModel

from app.database import get_db
from app.models import schemas
from app.auth import verify_token
# Ensure cloudinary is configured (imported from utils)
import app.utils 

router = APIRouter()

class MediaResource(BaseModel):
    public_id: str
    url: str
    secure_url: str
    format: str
    width: int
    height: int
    bytes: int
    created_at: str
    status: str # "active" | "orphaned"
    usage: List[str] = []

@router.get("/audit", response_model=List[MediaResource])
def audit_media(db: Session = Depends(get_db), user=Depends(verify_token)):
    try:
        # 1. Fetch all images from Cloudinary (with pagination loop if needed, but starting simple)
        # max_results default is 10, let's bump to 500
        result = cloudinary.api.resources(
            type="upload",
            resource_type="image",
            max_results=500
        )
        resources = result.get('resources', [])
        
        # 2. Build set of used URLs from DB
        used_urls = set()
        
        # Site Config
        config = db.query(schemas.SiteConfig).first()
        if config:
            if config.profile_image: used_urls.add(config.profile_image)
            if config.about_image: used_urls.add(config.about_image)
            
        # Projects
        projects = db.query(schemas.Project).filter(schemas.Project.image.isnot(None)).all()
        for p in projects:
            used_urls.add(p.image)
            
        # Blog Posts
        posts = db.query(schemas.BlogPost).filter(schemas.BlogPost.cover_image.isnot(None)).all()
        for p in posts:
            used_urls.add(p.cover_image)
            
        # 3. Analyze Resources
        analyzed_resources = []
        for res in resources:
            public_id = res.get('public_id')
            url = res.get('url')
            secure_url = res.get('secure_url')
            
            # Check usage
            # Cloudinary URLs might vary (http vs https, transformations). 
            # Best way is to check if public_id exists in any of the DB URLs.
            # But DB URLs are full URLs.
            # Let's check strict inclusion of public_id in the DB URL string.
            # This is safer than exact URL match because of potential transformations/versions.
            
            usage_list = []
            is_active = False
            
            for used_url in used_urls:
                # Simple check: is public_id in the used_url?
                # e.g. public_id="folder/image", used_url=".../folder/image.png"
                if public_id in used_url:
                    is_active = True
                    # Try to identify source for better UX
                    if config and used_url == config.profile_image: usage_list.append("Profile Image")
                    elif config and used_url == config.about_image: usage_list.append("About Image")
                    else:
                        # Check projects
                        proj = next((p for p in projects if p.image == used_url), None)
                        if proj: usage_list.append(f"Project: {proj.title}")
                        
                        # Check posts
                        post = next((p for p in posts if p.cover_image == used_url), None)
                        if post: usage_list.append(f"Blog: {post.title}")
                    
                    # Break early if found (unless we want ALL usages, but one is enough to mark active)
                    # Let's keep scanning to show comprehensive usage if possible, but for performance maybe break?
                    # Let's match all for better info.
            
            status_val = "active" if is_active else "orphaned"
            
            analyzed_resources.append(MediaResource(
                public_id=public_id,
                url=url,
                secure_url=secure_url,
                format=res.get('format', ''),
                width=res.get('width', 0),
                height=res.get('height', 0),
                bytes=res.get('bytes', 0),
                created_at=res.get('created_at', ''),
                status=status_val,
                usage=list(set(usage_list)) # dedupe
            ))
            
        return analyzed_resources

    except Exception as e:
        print(f"Error auditing media: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{public_id:path}") # :path allows slashes in public_id
def delete_media(public_id: str, db: Session = Depends(get_db), user=Depends(verify_token)):
    try:
        result = cloudinary.uploader.destroy(public_id)
        if result.get('result') == 'ok':
            return {"message": "Image deleted successfully"}
        else:
            raise HTTPException(status_code=400, detail=f"Failed to delete: {result}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
