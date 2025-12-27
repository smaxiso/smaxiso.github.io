import os
import sys

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine
from app.models import schemas
from sqlalchemy.orm import Session

# Create tables if not exist
schemas.Base.metadata.create_all(bind=engine)

def add_vscode_project():
    db = SessionLocal()
    try:
        # 1. Delete the duplicate I accidentally created
        duplicate = db.query(schemas.Project).filter(schemas.Project.id == "vscode-extension").first()
        if duplicate:
            db.delete(duplicate)
            print("Deleted duplicate 'vscode-extension'.")

        # 2. Update the existing project
        target_id = "modalsp10"
        project = db.query(schemas.Project).filter(schemas.Project.id == target_id).first()
        
        if project:
            print(f"Propagating updates to {project.title} ({target_id})...")
            project.title = "VS Code Productivity Extension"  # Better title
            project.description = "Custom Visual Studio Code extension built to enhance developer workflows and automate repetitive coding tasks. Features include enhanced markdown previewing and snippet automation."
            project.repository = "https://github.com/smaxiso/vs-code-extension"
            project.technologies = ["TypeScript", "VS Code API", "Marked.js"]
            
            # Optional: Ensure category is correct
            # project.category = "Open Source" 
            
            db.commit()
            print("✅ Success! Project updated.")
        else:
            print(f"❌ Error: Project {target_id} not found!")
    
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()
    
if __name__ == "__main__":
    add_vscode_project()
