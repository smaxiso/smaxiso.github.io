import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal
from app.models.schemas import SiteConfig

db = SessionLocal()

def run():
    config = db.query(SiteConfig).first()
    if not config:
        print("No config found in DB!")
        return

    config.site_title = "Sumit Kumar - Data Engineer (GenAI/ML) | Portfolio"
    config.site_description = "Experienced Data Engineer & Gen AI Specialist driving data engineering excellence, Agentic AI, and GenAI systems across FinTech, Cybersecurity, and Retail."
    config.site_author = "Sumit Kumar"
    config.site_url = "https://smaxiso.github.io"
    config.greeting = "Hi there! 👋"
    config.name = "Sumit Kumar"
    config.title = "Data Engineer (GenAI/ML)"
    config.subtitle = "Architecting enterprise data platforms, robust ingestion engines, and autonomous Agentic AI pipelines across fintech and retail domains using AWS, Redshift, Kafka, and Generative AI ecosystems."
    config.profile_image = "https://res.cloudinary.com/dehpzaqrd/image/upload/v1766744888/ja0wzypaoovwigm0qzfw.jpg"
    config.about_title = "Data Engineering Lead"
    config.about_description = "Data engineering lead focused on building highly-scalable data platforms, real-time pipelines, and autonomous AI systems. Experienced in driving data engineering excellence across fintech and retail domains—from Redshift bulk ingestion engines to LLM-driven Agentic AI architectures."
    config.about_image = "https://res.cloudinary.com/dehpzaqrd/image/upload/v1766728626/smaxiso_portfolio/about/yyjt7kw7dyo38ca3qm2u.jpg"
    config.resume_url = "/assets/sumit_kumar.pdf"
    config.years_experience = 5
    config.projects_completed = 19
    config.show_work_badge = True

    db.commit()
    print("Database SiteConfig updated successfully!")

if __name__ == "__main__":
    run()
