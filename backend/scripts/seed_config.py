from app.database import SessionLocal, engine
from app.models import schemas, pydantic_models

def seed_config():
    db = SessionLocal()
    
    # 1. Seed SiteConfig
    existing_config = db.query(schemas.SiteConfig).filter(schemas.SiteConfig.id == 1).first()
    if not existing_config:
        print("Seeding SiteConfig...")
        config = schemas.SiteConfig(
            id=1,
            site_title="Sumit Kumar - Data Engineer & ML Specialist | Portfolio",
            site_description="Experienced Data Engineer & Machine Learning specialist with 4+ years in FinTech & Cybersecurity.",
            site_author="Sumit Kumar",
            site_url="https://smaxiso.github.io",
            
            greeting="Hi there! 👋",
            name="Sumit Kumar",
            title="Data Engineer & ML Enthusiast",
            subtitle="Passionate about building scalable data pipelines, real-time analytics systems, and exploring machine learning solutions for cybersecurity and financial wellness domains.",
            profile_image="/assets/img/perfils/perfil3.png",
            
            about_title="Machine Learning & Data Engineer",
            about_description="I'm Sumit Kumar, a data-driven problem solver with experience in building large-scale ETL systems, developing real-time data pipelines, and working with high-impact data products across FinTech and cybersecurity domains.",
            about_image="/assets/img/about/about2.jpg",
            resume_url="/assets/data/Sumit_resume.pdf",
            years_experience=4,
            projects_completed=15,
            
            contact_email="sumit749284@gmail.com",
            footer_text="© 2024 Sumit. All rights reserved."
        )
        db.add(config)
        db.commit()
    else:
        print("SiteConfig already exists.")

    # 2. Seed SocialLinks
    socials = [
        {"platform": "linkedin", "url": "https://www.linkedin.com/in/smaxiso/", "icon": "bx bxl-linkedin"},
        {"platform": "github", "url": "https://www.github.com/smaxiso", "icon": "bx bxl-github"},
        {"platform": "email", "url": "mailto:sumit749284@gmail.com", "icon": "bx bx-envelope"},
        {"platform": "whatsapp", "url": "https://wa.me/917549980508?text=Hello%20Sumit%20", "icon": "bx bxl-whatsapp"},
        {"platform": "facebook", "url": "https://www.facebook.com/smaxiso", "icon": "bx bxl-facebook"},
        {"platform": "instagram", "url": "https://www.instagram.com/smaxiso", "icon": "bx bxl-instagram"},
        {"platform": "twitter", "url": "https://twitter.com/smaxiso", "icon": "bx bxl-twitter"},
        {"platform": "medium", "url": "https://smaxiso.medium.com/", "icon": "bx bxl-medium"},
    ]

    for social in socials:
        exists = db.query(schemas.SocialLink).filter(schemas.SocialLink.platform == social["platform"]).first()
        if not exists:
            print(f"Adding social: {social['platform']}")
            db_social = schemas.SocialLink(**social, is_active=1)
            db.add(db_social)
    
    db.commit()
    db.close()
    print("Seeding complete!")

if __name__ == "__main__":
    seed_config()
