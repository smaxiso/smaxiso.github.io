
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add parent dir to path to import app modules
sys.path.append(str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.models import schemas
import google.generativeai as genai
from pinecone import Pinecone, ServerlessSpec

# Load env
load_dotenv(Path(__file__).parent.parent / '.env')

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

if not GEMINI_API_KEY or not PINECONE_API_KEY:
    print("❌ Missing API Keys")
    sys.exit(1)

# Configure AI
genai.configure(api_key=GEMINI_API_KEY)
pc = Pinecone(api_key=PINECONE_API_KEY)

INDEX_NAME = "portfolio-rag"
DIMENSION = 768  # Output dimension for text-embedding-004

def get_text_embedding(text: str):
    try:
        # 'retrieval_document' task type optimizes for storage/retrieval
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document",
            title="Portfolio Content" 
        )
        return result['embedding']
    except Exception as e:
        print(f"Error embedding text: {e}")
        return None

def ingest_data():
    print("🚀 Starting Ingestion...")
    db = SessionLocal()
    
    # 1. Prepare Pinecone Index
    existing_indexes = [i.name for i in pc.list_indexes()]
    if INDEX_NAME not in existing_indexes:
        print(f"Creating index {INDEX_NAME}...")
        pc.create_index(
            name=INDEX_NAME,
            dimension=DIMENSION,
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )
    
    index = pc.Index(INDEX_NAME)
    
    vectors = []
    
    # helper
    def add_vector(id: str, text: str, meta: dict):
        print(f"  - Embedding: {id}")
        embedding = get_text_embedding(text)
        if embedding:
            vectors.append({
                "id": id,
                "values": embedding,
                "metadata": {**meta, "text": text}
            })

    # 2. Ingest Site Config (Bio, About)
    config = db.query(schemas.SiteConfig).first()
    if config:
        # Hero / Bio
        bio_text = f"Sumit is a {config.title}. {config.subtitle}. {config.greeting}"
        add_vector("bio-hero", bio_text, {"type": "bio", "section": "hero"})
        
        # About Section
        about_text = f"About Sumit: {config.about_description}. Years of Experience: {config.years_experience}. Projects Completed: {config.projects_completed}."
        add_vector("bio-about", about_text, {"type": "bio", "section": "about"})

    # 3. Ingest Skills
    skills = db.query(schemas.Skill).all()
    skills_text = "Sumit's technical skills include: " + ", ".join([f"{s.name} ({s.category}, {s.level}% proficiency)" for s in skills])
    add_vector("skills-summary", skills_text, {"type": "skills"})

    # 4. Ingest Projects
    projects = db.query(schemas.Project).all()
    for p in projects:
        # Create a rich description for each project
        proj_text = f"Project Title: {p.title}. Category: {p.category}. "
        proj_text += f"Technologies used: {', '.join(p.technologies)}. "
        proj_text += f"Description: {p.description}. "
        if p.company:
            proj_text += f"Role: {p.position} at {p.company} ({p.location}). "
        
        add_vector(f"project-{p.id}", proj_text, {"type": "project", "title": p.title})

    # 5. Ingest Blog Posts
    posts = db.query(schemas.BlogPost).filter(schemas.BlogPost.published == True).all()
    for post in posts:
        # Chunking blog posts might be needed for very long posts, but for now we take the summary/intro
        # Assuming description + first 1000 chars of content
        post_text = f"Blog Post: {post.title}. Summary: {post.excerpt}. Content: {post.content[:2000]}..."
        add_vector(f"blog-{post.id}", post_text, {"type": "blog", "title": post.title})

    # 6. Upload to Pinecone
    if vectors:
        print(f"📤 Upserting {len(vectors)} vectors to Pinecone...")
        # Upsert in batches of 100
        batch_size = 100
        for i in range(0, len(vectors), batch_size):
            batch = vectors[i:i+batch_size]
            index.upsert(vectors=batch)
        print("✅ Ingestion Complete!")
    else:
        print("⚠️ No data to ingest.")

if __name__ == "__main__":
    ingest_data()
