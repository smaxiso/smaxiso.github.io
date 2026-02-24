from app.database import SessionLocal
from app.models import schemas
import json

def update_cocoblu_role():
    db = SessionLocal()
    try:
        # 1. Update SiteConfig
        config = db.query(schemas.SiteConfig).filter(schemas.SiteConfig.id == 1).first()
        if config:
            print("Updating SiteConfig...")
            config.subtitle = "Building large-scale data platforms, real-time pipelines, and AI-driven analytics systems across fintech and retail domains using AWS, Kafka, and Spark ecosystems."
            config.about_description = "Data engineering lead focused on building scalable data platforms, real-time pipelines, and AI-driven analytics systems. Experienced in designing robust data solutions across fintech and retail domains. Strong focus on end-to-end ownership — from data ingestion to analytics enablement."
            config.years_experience = 4
            config.experience_months = 0 # Rounding down as per industry standard feedback
            config.site_title = "Sumit Kumar - Data Engineer (GenAI/ML) | Portfolio"
            config.about_title = "Data Engineering Lead"
        
        # 2. Update Gen Digital Experience
        gen_digital = db.query(schemas.Experience).filter(schemas.Experience.company.like("%Gen Digital%")).first()
        if gen_digital:
            print("Updating Gen Digital end date...")
            gen_digital.end_date = "2026-01"
            gen_digital.order = 1 # Move to second place
            
        # 3. Shift other experiences
        tcs = db.query(schemas.Experience).filter(schemas.Experience.company.like("%Tata Consultancy Services%")).first()
        if tcs:
            tcs.order = 2
            
        nitp = db.query(schemas.Experience).filter(schemas.Experience.company.like("%NIT Patna%")).first()
        if nitp:
            nitp.order = 3

        # 4. Add Cocoblu Experience
        cocoblu_exists = db.query(schemas.Experience).filter(schemas.Experience.company == "Cocoblu").first()
        if not cocoblu_exists:
            print("Adding Cocoblu experience...")
            cocoblu = schemas.Experience(
                company="Cocoblu",
                title="Senior Manager – DSIT",
                start_date="2026-02",
                end_date=None,
                description="Developing and leading data warehouse, data lake, and real-time pipeline initiatives enabling organization-wide retail analytics and automation.",
                technologies=["Spark", "Kafka", "AWS", "Python", "SQL"],
                order=0,
                company_logo="/assets/img/experience/cocoblu.png" # Placeholder or similar
            )
            db.add(cocoblu)
        else:
            print("Cocoblu experience already exists, updating...")
            cocoblu_exists.title = "Senior Manager – DSIT"
            cocoblu_exists.description = "Developing and leading data warehouse, data lake, and real-time pipeline initiatives enabling organization-wide retail analytics and automation."
            cocoblu_exists.start_date = "2026-02"
            cocoblu_exists.end_date = None
            cocoblu_exists.order = 0

        db.commit()
        print("Success: Database updated for Cocoblu role.")
    except Exception as e:
        db.rollback()
        print(f"Error updating database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    update_cocoblu_role()
