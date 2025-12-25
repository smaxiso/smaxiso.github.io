import json
import os
import sys

# Add backend directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import schemas

# Create tables if they don't exist (safety check)
schemas.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    try:
        # 1. Seed Projects
        projects_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'legacy/assets/data/work-data.json')
        if os.path.exists(projects_file):
            with open(projects_file, 'r') as f:
                data = json.load(f)
                print(f"Seeding projects from {projects_file}...")
                
                # Clear existing
                # db.query(schemas.Project).delete()
                
                for category_group in data:
                    cat_name = category_group.get('category', 'Other')
                    if 'projects' in category_group:
                        for p in category_group['projects']:
                            # Check if exists
                            existing = db.query(schemas.Project).filter(schemas.Project.id == p.get('id')).first()
                            if not existing:
                                db_project = schemas.Project(
                                    id=p.get('id'),
                                    title=p.get('title'),
                                    description=p.get('description'),
                                    category=cat_name,
                                    position=category_group.get('position'),
                                    company=category_group.get('company'),
                                    location=category_group.get('location'),
                                    startDate=p.get('startDate'),
                                    endDate=p.get('endDate'),
                                    image=p.get('image'),
                                    technologies=p.get('technologies', []),
                                    repository=p.get('repository'),
                                    website=p.get('website')
                                )
                                db.add(db_project)
                db.commit()
                print("Projects seeded!")

        # 2. Seed Skills
        skills_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'legacy/assets/data/skills-data.json')
        if os.path.exists(skills_file):
            with open(skills_file, 'r') as f:
                data = json.load(f)
                print(f"Seeding skills from {skills_file}...")
                
                # db.query(schemas.Skill).delete()
                if 'professional_skills' in data:
                    for category, skills in data['professional_skills'].items():
                        for s in skills:
                             # Check if exists (by name and category)
                            existing = db.query(schemas.Skill).filter(schemas.Skill.name == s.get('name'), schemas.Skill.category == category).first()
                            if not existing:
                                db_skill = schemas.Skill(
                                    category=category,
                                    name=s.get('name'),
                                    icon=s.get('icon'),
                                    level=s.get('level')
                                )
                                db.add(db_skill)
                db.commit()
                print("Skills seeded!")

        # 3. Seed Hobbies
        hobbies_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'legacy/assets/data/hobbies-data.json')
        if os.path.exists(hobbies_file):
            with open(hobbies_file, 'r') as f:
                data = json.load(f)
                print(f"Seeding hobbies from {hobbies_file}...")
                
                # db.query(schemas.Hobby).delete()
                if 'hobbies' in data:
                    for h in data['hobbies']:
                        existing = db.query(schemas.Hobby).filter(schemas.Hobby.name == h.get('name')).first()
                        if not existing:
                            db_hobby = schemas.Hobby(
                                name=h.get('name'),
                                icon=h.get('icon'),
                                description=h.get('description'),
                                link=h.get('link')
                            )
                            db.add(db_hobby)
                db.commit()
                print("Hobbies seeded!")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
