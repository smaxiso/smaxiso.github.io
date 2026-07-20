import sys
import os
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal
from app.models.schemas import Experience, Project, Skill, SocialLink

db = SessionLocal()

def run():
    print("--- EXPERIENCES ---")
    exps = db.query(Experience).all()
    for e in exps:
        print(f"Company: {e.company}\nTitle: {e.title}\nDates: {e.start_date} - {e.end_date}\nDesc: {e.description[:100]}...\n")
        
    print("--- PROJECTS ---")
    projs = db.query(Project).all()
    for p in projs:
        print(f"ID: {p.id}\nTitle: {p.title}\nDesc: {p.description[:100]}...\n")
        
    print("--- SKILLS ---")
    skills = db.query(Skill).all()
    cats = {}
    for s in skills:
        cats.setdefault(s.category, []).append(s.name)
    for c, s_list in cats.items():
        print(f"{c}: {', '.join(s_list)}")

    print("--- SOCIALS ---")
    socials = db.query(SocialLink).all()
    for s in socials:
        print(f"{s.platform}: {s.url} (Active: {s.is_active})")

if __name__ == "__main__":
    run()
