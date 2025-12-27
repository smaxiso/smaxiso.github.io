import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.database import SessionLocal
from app.models import schemas

def verify():
    db = SessionLocal()
    post = db.query(schemas.BlogPost).filter(schemas.BlogPost.slug == "google-antigravity-wsl-guide").first()
    if post:
        print("--- CONTENT START ---")
        print(post.content[:200])
        print("--- CONTENT END ---")
    else:
        print("Post not found")
    db.close()

if __name__ == "__main__":
    verify()
