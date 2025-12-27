
import os
import requests
import re
import sys

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))

from app.database import SessionLocal
from app.models import schemas

def get_project_urls_from_db():
    """
    Fetches projects from DB and returns list of dicts:
    [{'name': 'Title', 'url': 'github_url'}]
    """
    db = SessionLocal()
    projects = db.query(schemas.Project).all()
    github_projects = []
    
    for p in projects:
        if p.repository and "github.com" in p.repository:
            # Clean up URL (handle trailing slashes)
            url = p.repository.strip().rstrip('/')
            github_projects.append({
                "name": p.title,
                "url": url
            })
            
    db.close()
    return github_projects

def get_repo_details(url):
    """
    Extracts owner/repo from https://github.com/owner/repo
    """
    match = re.search(r"github\.com/([^/]+)/([^/]+)", url)
    if match:
        return match.group(1), match.group(2)
    return None, None

def fetch_readme(owner, repo):
    branches = ["main", "master"]
    for branch in branches:
        url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/README.md"
        try:
            resp = requests.get(url)
            if resp.status_code == 200:
                return resp.text
        except Exception as e:
            print(f"Error fetching README for {repo}: {e}")
    return None

def fetch_file_structure(owner, repo):
    api_url = f"https://api.github.com/repos/{owner}/{repo}"
    try:
        resp = requests.get(api_url)
        if resp.status_code == 200:
            data = resp.json()
            default_branch = data.get("default_branch", "main")
            
            # Get Tree
            tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1"
            tree_resp = requests.get(tree_url)
            if tree_resp.status_code == 200:
                tree_data = tree_resp.json()
                # Limit to first 200 files
                files = [item['path'] for item in tree_data.get('tree', []) if item['type'] == 'blob']
                return files[:200]
    except Exception as e:
        print(f"Error fetching tree for {repo}: {e}")
        
    return []

def ingest_github():
    print("🐙 Fetching Project URLs from Database...")
    projects = get_project_urls_from_db()
    chunks = []
    
    print(f"Found {len(projects)} GitHub projects in the Database.")
    
    for p in projects:
        owner, repo_name = get_repo_details(p['url'])
        if not owner or not repo_name:
            continue
            
        print(f"Processing GitHub: {repo_name}...")
        
        # 1. README
        readme_content = fetch_readme(owner, repo_name)
        if readme_content:
            chunks.append({
                "id": f"github_readme_{repo_name}",
                "text": f"# Project: {p['name']}\n## GitHub README\n{readme_content}",
                "metadata": {
                    "source": "GitHub",
                    "type": "readme",
                    "title": p['name'],
                    "url": p['url']
                }
            })
            
        # 2. Structure
        files = fetch_file_structure(owner, repo_name)
        if files:
            structure_str = "\n".join(files)
            chunks.append({
                "id": f"github_tree_{repo_name}",
                "text": f"# Project: {p['name']}\n## File Structure\nThe following files exist in the repository:\n{structure_str}",
                "metadata": {
                    "source": "GitHub",
                    "type": "structure",
                    "title": p['name'],
                    "url": p['url']
                }
            })
            
    return chunks
