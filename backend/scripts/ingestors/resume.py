
import os
import sys
import requests
import tempfile
from pypdf import PdfReader

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))

from app.database import SessionLocal
from app.models import schemas

def get_resume_url_from_db():
    db = SessionLocal()
    # Try SiteConfig first
    config = db.query(schemas.SiteConfig).first()
    url = None
    site_domain = "https://smaxiso.web.app" # Default fallback

    if config:
        if config.site_url:
             site_domain = config.site_url.rstrip("/")
        if config.resume_url:
            url = config.resume_url
    
    # Check ResumeFiles if SiteConfig is empty or local
    if not url:
        resume = db.query(schemas.ResumeFile).filter(schemas.ResumeFile.is_active == 1).first()
        if resume:
            url = resume.url
            
    db.close()
    
    # Resolve relative URL
    if url and url.startswith("/"):
        url = f"{site_domain}{url}"
        
    return url



def ingest_resume(file_path="frontend/public/assets/sumit_kumar.pdf"):
    """
    Reads the PDF resume.
    Priority:
    1. Local File (dev environment)
    2. Remote URL from DB (prod environment)
    """
    # 1. Try Local File
    # Get project root (2 levels up from this file: scripts/ingestors/resume.py -> backend/ -> project root)
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../'))
    abs_path = os.path.join(project_root, file_path)
    
    if os.path.exists(abs_path):
        print(f"📄 Found local Resume PDF: {abs_path}")
        return extract_text_from_pdf(abs_path)
    else:
        print(f"⚠️ Local Resume not found at: {abs_path}")

    # 2. Try Remote URL
    print("🌐 Attempting to fetch Remote Resume URL from DB...")
    db_url = get_resume_url_from_db()
    
    chunks = []
    if db_url and db_url.startswith("http"):
        print(f"📥 Downloading Resume from: {db_url}")
        try:
            resp = requests.get(db_url)
            if resp.status_code == 200:
                # Save to temp file
                tf = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
                tf.write(resp.content)
                tf.close()
                
                # Extract
                chunks = extract_text_from_pdf(tf.name)
                
                # Cleanup
                os.unlink(tf.name)
            else:
                print(f"❌ Failed to download resume: {resp.status_code}")
        except Exception as e:
            print(f"❌ Error downloading resume: {e}")
    else:
        print("❌ No valid remote Resume URL found in Database.")


def extract_text_from_pdf(pdf_path):
    """
    Extract text from PDF as a SINGLE chunk (memory-efficient for Render)
    """
    try:
        reader = PdfReader(pdf_path)
        full_text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t:
                full_text += t + "\n\n"
            
        if full_text.strip():
            return [{
                "id": "resume_full_pdf",
                "text": full_text.strip(),
                "metadata": {
                    "source": "Resume PDF",
                    "type": "resume",
                    "title": "Sumit Kumar Resume"
                }
            }]
    except Exception as e:
        print(f"Error parsing PDF {pdf_path}: {e}")
        
    return []
