import sys
import os

# Add parent dir to path so we can import app modules
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from app.database import SessionLocal
from app.models.schemas import Project

def inspect_project():
    db = SessionLocal()
    try:
        title = "Smaxiso Writes"
        project = db.query(Project).filter(Project.title == title).first()
        
        if project:
            print(f"Project Found: {project.title}")
            print(f"ID: {project.id}")
            print(f"Image URL: {project.image}")
            print(f"Category: {project.category}")
            print(f"Technologies: {project.technologies}")
        else:
            print(f"Project '{title}' not found.")
            
    except Exception as e:
        print(f"Error inspecting database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    inspect_project()
