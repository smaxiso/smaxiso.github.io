import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal
from app.models.schemas import Skill

db = SessionLocal()

def run():
    print("Syncing skills to match resume...")

    # Delete old skills
    db.query(Skill).delete()
    
    # Insert new skills from main.tex
    new_skills = [
        # Programming Languages
        Skill(name="Python", category="Programming Languages", icon="", level="Expert"),
        Skill(name="C++", category="Programming Languages", icon="", level="Advanced"),
        Skill(name="Java", category="Programming Languages", icon="", level="Expert"),
        Skill(name="SQL", category="Programming Languages", icon="", level="Expert"),
        Skill(name="Shell/Bash", category="Programming Languages", icon="", level="Intermediate"),
        
        # Databases
        Skill(name="Redshift", category="Databases", icon="", level="Expert"),
        Skill(name="BigQuery", category="Databases", icon="", level="Expert"),
        Skill(name="Snowflake", category="Databases", icon="", level="Advanced"),
        Skill(name="DynamoDB", category="Databases", icon="", level="Expert"),
        Skill(name="DocumentDB", category="Databases", icon="", level="Advanced"),
        Skill(name="Oracle", category="Databases", icon="", level="Advanced"),
        Skill(name="MySQL", category="Databases", icon="", level="Expert"),
        
        # Cloud & Infrastructure
        Skill(name="AWS (Bedrock, ECS, S3, Glue)", category="Cloud & Infrastructure", icon="", level="Expert"),
        Skill(name="GCP", category="Cloud & Infrastructure", icon="", level="Advanced"),
        Skill(name="Docker", category="Cloud & Infrastructure", icon="", level="Advanced"),
        
        # Frameworks & APIs
        Skill(name="FastAPI", category="Frameworks & APIs", icon="", level="Expert"),
        Skill(name="React", category="Frameworks & APIs", icon="", level="Advanced"),
        Skill(name="Spring Boot", category="Frameworks & APIs", icon="", level="Advanced"),
        Skill(name="PySpark", category="Frameworks & APIs", icon="", level="Expert"),
        Skill(name="SP-API", category="Frameworks & APIs", icon="", level="Expert"),
        Skill(name="Airflow", category="Frameworks & APIs", icon="", level="Expert"),
        
        # AI & Operations Research
        Skill(name="Gemini", category="AI & Operations Research", icon="", level="Expert"),
        Skill(name="Claude", category="AI & Operations Research", icon="", level="Expert"),
        Skill(name="Langchain", category="AI & Operations Research", icon="", level="Advanced"),
        Skill(name="MILP (PuLP)", category="AI & Operations Research", icon="", level="Advanced"),
        Skill(name="ADMM", category="AI & Operations Research", icon="", level="Advanced")
    ]
    
    db.add_all(new_skills)
    db.commit()
    print("Database Skills fully synchronized with resume!")

if __name__ == "__main__":
    run()
