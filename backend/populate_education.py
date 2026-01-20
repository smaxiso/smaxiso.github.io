from app.database import SessionLocal
from app.models.schemas import SiteConfig

db = SessionLocal()

try:
    config = db.query(SiteConfig).first()
    
    if config:
        # Update education fields
        config.education_degree = "B.Tech, Computer Science & Engineering"
        config.education_institution = "National Institute of Technology, Patna"
        config.education_years = "2017 - 2021"
        
        db.commit()
        print("✅ Education data updated successfully!")
        print(f"Degree: {config.education_degree}")
        print(f"Institution: {config.education_institution}")
        print(f"Years: {config.education_years}")
    else:
        print("❌ No site config found")
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()
