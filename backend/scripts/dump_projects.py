
import os
import sys
import json

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models import schemas

def dump_projects():
    db = SessionLocal()
    projects = db.query(schemas.Project).all()
    
    output = []
    for p in projects:
        output.append({
            "title": p.title,
            "description": p.description,
            "technologies": p.technologies
        })
    
    print(json.dumps(output, indent=2))
    db.close()

if __name__ == "__main__":
    dump_projects()
