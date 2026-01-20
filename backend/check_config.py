from app.database import SessionLocal
from app.models.schemas import SiteConfig

db = SessionLocal()
config = db.query(SiteConfig).first()

if config:
    print("=== SITE CONFIG ===")
    print(f"Name: {config.name}")
    print(f"Title: {config.title}")
    print(f"Subtitle: {config.subtitle}")
    print(f"About Description: {config.about_description[:200] if config.about_description else 'None'}...")
else:
    print("No site config found")

db.close()
