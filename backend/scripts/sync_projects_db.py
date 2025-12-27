
import os
import sys

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models import schemas

def parse_project_urls(file_path="project_urls.txt"):
    """
    Parses the project_urls.txt file to get a list of (Project Name, GitHub URL).
    Returns list of dicts.
    """
    abs_path = os.path.abspath(file_path)
    if not os.path.exists(abs_path):
        print(f"Project URLs file not found at: {abs_path}")
        return []
        
    projects = []
    with open(abs_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    # Skip header and separator lines
    start_parsing = False
    for line in lines:
        if "GitHub URL" in line:
            start_parsing = True
            continue
        if "---" in line:
            continue
        if not start_parsing:
            continue
            
        parts = line.split("|")
        if len(parts) >= 2:
            name = parts[0].strip()
            url = parts[1].strip()
            
            # Simple validation: Must be a non-empty string and not "Not Available"
            if url and "Not Available" not in url:
                projects.append({"name": name, "url": url})
                 
    return projects

def sync_db():
    print("🚀 Starting Database Sync...")
    
    # 1. Parse File
    updates = parse_project_urls("project_urls.txt")
    print(f"Found {len(updates)} projects with URLs to update.")
    
    # 2. Update DB
    db = SessionLocal()
    updated_count = 0
    
    for item in updates:
        project_name = item['name']
        new_url = item['url']
        
        # Find project by title (case-insensitive mostly, but let's try exact first)
        db_project = db.query(schemas.Project).filter(schemas.Project.title == project_name).first()
        
        if db_project:
            if db_project.repository != new_url:
                print(f"Updating '{project_name}': {db_project.repository} -> {new_url}")
                db_project.repository = new_url
                updated_count += 1
            else:
                # print(f"Skipping '{project_name}': Already up to date.")
                pass
        else:
            print(f"⚠️ Warning: Project '{project_name}' not found in database.")
            
    if updated_count > 0:
        db.commit()
        print(f"\n✅ Successfully updated {updated_count} projects in the database.")
    else:
        print("\n✅ Database is already up to date.")
        
    db.close()

if __name__ == "__main__":
    sync_db()
