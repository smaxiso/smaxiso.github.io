from app.database import SessionLocal
from app.models import schemas

def reset_resume():
    db = SessionLocal()
    try:
        config = db.query(schemas.SiteConfig).filter(schemas.SiteConfig.id == 1).first()
        if config:
            config.resume_url = "/assets/sumit_kumar.pdf"
            db.commit()
            print("✅ Resume URL reset to: /assets/resume.pdf")
        else:
            print("❌ Config not found")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_resume()
