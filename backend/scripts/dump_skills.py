
import os
import sys
import json

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models import schemas

def dump_skills():
    db = SessionLocal()
    skills = db.query(schemas.Skill).all()
    
    output = []
    for s in skills:
        output.append({
            "name": s.name,
            "category": s.category,
            "icon": s.icon
        })
    
    print(json.dumps(output, indent=2))
    db.close()

if __name__ == "__main__":
    dump_skills()
