from app.database import SessionLocal
from app.models.schemas import Skill

db = SessionLocal()
skills = db.query(Skill).all()

print(f"Total skills: {len(skills)}\n")

categories = {}
for s in skills:
    if s.category not in categories:
        categories[s.category] = []
    categories[s.category].append((s.name, s.level))

for cat, skill_list in categories.items():
    print(f"\n{cat}:")
    for name, level in skill_list[:5]:
        print(f"  {name}: {level if level else 'NULL'}")
    if len(skill_list) > 5:
        print(f"  ... and {len(skill_list) - 5} more")

db.close()
