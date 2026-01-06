import sys
import os
# Add backend to path to import app modules
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.app.database import SessionLocal
from backend.app.models import schemas

def check_latest_post():
    db = SessionLocal()
    try:
        # Get the most recently updated post
        post = db.query(schemas.BlogPost).order_by(schemas.BlogPost.updated_at.desc()).first()
        if not post:
            print("No blog posts found.")
            return

        print(f"--- Debugging Post ID: {post.id} ---")
        print(f"Title: {post.title}")
        print(f"Slug: {post.slug}")
        print("--- Content Preview (First 500 chars) ---")
        print(post.content[:500])
        print("--- Content End ---")
        
        # Check for image URLs manually
        import re
        url_pattern = re.compile(r'(?:!\[.*?\]\((https?://[^)]+)\))|(?:src=["\'](https?://[^"\']+)["\'])')
        matches = url_pattern.findall(post.content)
        print(f"\nFound {len(matches)} image matches in content:")
        for m in matches:
            url = next((x for x in m if x), None)
            print(f"- {url}")

    finally:
        db.close()

if __name__ == "__main__":
    check_latest_post()
