import os
import sys

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine
from app.models import schemas
from sqlalchemy.orm import Session

# Create tables if not exist (ensures DB is valid)
schemas.Base.metadata.create_all(bind=engine)

def list_projects():
    db = SessionLocal()
    try:
        projects = db.query(schemas.Project).all()
        print(f"Found {len(projects)} projects:")
        for p in projects:
            print(f"ID: {p.id} | Title: {p.title}")
    finally:
        db.close()

if __name__ == "__main__":
    list_projects()
