
import os
import sys

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models import schemas

def fix_jenkins_icon():
    db = SessionLocal()
    
    # Jenkins fallback
    # Boxicons doesn't have a Jenkins logo, so we use a 'cog' for automation/settings
    # or 'server' for build server. 'bxs-cog' implies configuration/automation.
    new_icon = "bx bxs-cog"
    
    skill = db.query(schemas.Skill).filter(schemas.Skill.name == "Jenkins").first()
    if skill:
        print(f"Updating 'Jenkins' icon: {skill.icon} -> {new_icon}")
        skill.icon = new_icon
        db.commit()
        print("Successfully updated Jenkins icon.")
    else:
        print("Jenkins skill not found.")
        
    db.close()

if __name__ == "__main__":
    fix_jenkins_icon()
