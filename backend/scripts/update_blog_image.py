import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.database import SessionLocal
from app.models import schemas

def update_image():
    db = SessionLocal()
    post = db.query(schemas.BlogPost).filter(schemas.BlogPost.slug == "google-antigravity-wsl-guide").first()
    if post:
        # Using a reliable placeholder if I can't find the exact one, or a known working one
        # Let's use a nice tech gradient or a generic unsplash one for "code"
        post.cover_image = "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2574&auto=format&fit=crop" 
        db.commit()
        print("Updated cover image")
    else:
        print("Post not found")
    db.close()

if __name__ == "__main__":
    update_image()
