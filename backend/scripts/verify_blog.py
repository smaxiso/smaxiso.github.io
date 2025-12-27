import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.database import SessionLocal
from app.models import schemas

db = SessionLocal()
posts = db.query(schemas.BlogPost).all()
print(f"Total Posts: {len(posts)}")
for p in posts:
    print(f"Post: {p.title}, Published: {p.published}, Slug: {p.slug}")
db.close()
