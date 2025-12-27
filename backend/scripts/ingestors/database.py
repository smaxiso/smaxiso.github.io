
import sys
import os

# Add backend to path for imports to work
sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))

from app.database import SessionLocal
from app.models import schemas

def ingest_projects():
    db = SessionLocal()
    projects = db.query(schemas.Project).all()
    results = []
    
    for p in projects:
        # Create a rich markdown description
        content = f"""
# Project: {p.title}
Category: {p.category}
Tech Stack: {", ".join(p.technologies) if p.technologies else "N/A"}
Date: {p.startDate} - {p.endDate if p.endDate else "Present"}

## Description
{p.description}

## Additional Info
Position: {p.position}
Company: {p.company}
Repository: {p.repository}
        """.strip()
        
        results.append({
            "id": f"project_{p.id}",
            "text": content,
            "metadata": {
                "source": "Database",
                "type": "project",
                "title": p.title,
                "url": p.repository
            }
        })
    db.close()
    return results

def ingest_skills():
    db = SessionLocal()
    skills = db.query(schemas.Skill).all()
    # Group skills by category for better context
    categories = {}
    for s in skills:
        if s.category not in categories:
            categories[s.category] = []
        categories[s.category].append(f"{s.name} ({s.level})")
    
    results = []
    for cat, skill_list in categories.items():
        content = f"Sumit has the following skills in {cat}:\n- " + "\n- ".join(skill_list)
        results.append({
            "id": f"skills_{cat}",
            "text": content,
            "metadata": {
                "source": "Database",
                "type": "skills",
                "title": f"Skills: {cat}"
            }
        })
    db.close()
    return results

def ingest_blogs():
    db = SessionLocal()
    posts = db.query(schemas.BlogPost).filter(schemas.BlogPost.published == True).all()
    results = []
    
    for post in posts:
        # Markdown content is already rich
        content = f"""
# Blog Post: {post.title}
Summary: {post.excerpt}
Tags: {post.tags}

{post.content}
        """.strip()
        
        results.append({
            "id": f"blog_{post.slug}",
            "text": content,
            "metadata": {
                "source": "Blog",
                "type": "blog",
                "title": post.title
            }
        })
    db.close()
    return results

def ingest_database():
    return ingest_projects() + ingest_skills() + ingest_blogs()
