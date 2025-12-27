
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

def split_resume_text(full_text):
    """
    Intelligently splits resume text into sections.
    """
    # Simple keyword-based splitting since we know the structure
    # Or just logical paragraphs.
    
    # Strategy: Fixed headers.
    headers = ["Education", "Experience", "Technical Skills", "Projects", "Achievements", "Certifications"]
    
    # We'll use a sliding window or regex, but given the variability, let's use a simpler overlapping chunk approach
    # which is robust for RAG. 
    # Chunk size: ~500 chars, Overlap: 50.
    
    text_len = len(full_text)
    chunk_size = 800 # Enough for a full job description
    overlap = 100
    
    chunks = []
    start = 0
    
    while start < text_len:
        end = start + chunk_size
        chunk_text = full_text[start:end]
        
        # Try to break at a newline
        last_newline = chunk_text.rfind('\n')
        if last_newline != -1 and end < text_len:
            end = start + last_newline + 1
            chunk_text = full_text[start:end]
            
        chunks.append({
            "id": f"resume_chunk_{start}",
            "text": chunk_text.strip(),
            "metadata": {
                "source": "Resume PDF",
                "type": "resume_fragment",
                "title": "Sumit Kumar Resume Part"
            }
        })
        
        start += (len(chunk_text) - overlap)
        
    return chunks

def extract_text_from_pdf(pdf_path):
    chunks = []
    try:
        reader = PdfReader(pdf_path)
        full_text = ""
        for page in reader.pages:
            t = page.extract_text()
            if t: full_text += t + "\n\n"
            
        if full_text.strip():
            # Use granular splitting
            chunks = split_resume_text(full_text.strip())
            
    except Exception as e:
        print(f"Error parsing PDF {pdf_path}: {e}")
        
    return chunks
