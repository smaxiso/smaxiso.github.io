
import os
import sys
# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models import schemas

def list_projects():
    db = SessionLocal()
    projects = db.query(schemas.Project).all()
    print("CURRENT PROJECTS & GITHUB URLs:")
    print("-" * 60)
    for p in projects:
        url = p.repository if p.repository else "(No URL)"
        print(f"[{p.title}] -> {url}")
    print("-" * 60)
    db.close()

if __name__ == "__main__":
    list_projects()
