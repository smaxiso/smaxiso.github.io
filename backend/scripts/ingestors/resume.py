
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
    if config and config.resume_url:
        url = config.resume_url
    
    # Check ResumeFiles if SiteConfig is empty or local
    if not url:
        resume = db.query(schemas.ResumeFile).filter(schemas.ResumeFile.is_active == 1).first()
        if resume:
            url = resume.url
            
    db.close()
    return url

def extract_text_from_pdf(pdf_path):
    """
    Helper to extract text from a PDF file path.
    """
    chunks = []
    try:
        reader = PdfReader(pdf_path)
        full_text = ""
        
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                full_text += text + "\n\n"
        
        if full_text.strip():
            chunks.append({
                "id": "resume_full_pdf",
                "text": full_text.strip(),
                "metadata": {
                    "source": "Resume PDF",
                    "type": "resume",
                    "title": "Sumit Kumar Resume"
                }
            })
    except Exception as e:
        print(f"Error parsing PDF {pdf_path}: {e}")
        
    return chunks

def ingest_resume(file_path="frontend/public/assets/sumit_kumar.pdf"):
    """
    Reads the PDF resume.
    Priority:
    1. Local File (dev environment)
    2. Remote URL from DB (prod environment)
    """
    # 1. Try Local File
    # Fix path resolution: file_path is relative to project root usually
    # But we might be running from backend/
    
    # Let's check absolute path relative to CWD
    abs_path = os.path.abspath(file_path)
    
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

    return chunks
