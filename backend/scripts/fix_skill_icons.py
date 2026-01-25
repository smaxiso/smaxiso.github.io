
import os
import sys

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models import schemas

def fix_skill_icons():
    db = SessionLocal()
    
    # Map of Skill Name -> New Boxicon Class
    updates = {
        "PySpark": "bx bxs-data",
        "ETL": "bx bx-transfer",
        "Airflow": "bx bx-wind",
        "Kafka (AWS MSK)": "bx bx-broadcast",
        "MySQL": "bx bxs-data",
        "Oracle": "bx bxs-data",
        "DocumentDB": "bx bxs-file-json",
        "Athena": "bx bx-search-alt",
        "DynamoDB": "bx bxs-bolt",
        "Django": "bx bxl-django",
        "FastAPI": "bx bxs-zap",
        "Flask": "bx bxs-flask",
        "Spring Boot": "bx bxl-spring-boot",
        "Jenkins": "bx bxl-jenkins",
        "TeamCity": "bx bxs-city",
        "Machine Learning": "bx bx-brain",
        "Generative AI": "bx bx-bot",
        "Unix Commands": "bx bx-terminal",
        "C++": "bx bxl-c-plus-plus",
        "Shell/Bash": "bx bx-terminal"
    }

    print("Starting Skill Icon Fix...")
    updated_count = 0
    
    for name, icon in updates.items():
        skill = db.query(schemas.Skill).filter(schemas.Skill.name == name).first()
        if skill:
            if skill.icon != icon:
                print(f"Updating '{name}': {skill.icon} -> {icon}")
                skill.icon = icon
                updated_count += 1
            else:
                 print(f"Skipping '{name}': Already correct.")
        else:
            print(f"Warning: Skill '{name}' not found.")
            
    if updated_count > 0:
        db.commit()
        print(f"\nSuccessfully updated {updated_count} skill icons.")
    else:
        print("\nNo changes needed.")
        
    db.close()

if __name__ == "__main__":
    fix_skill_icons()
