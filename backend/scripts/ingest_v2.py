
import os
import sys
import google.generativeai as genai
from pinecone import Pinecone
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import Ingestors
from scripts.ingestors.resume import ingest_resume
from scripts.ingestors.database import ingest_database
from scripts.ingestors.github import ingest_github

# Load Env
load_dotenv()

INDEX_NAME = "portfolio-index" # Synchronized with chat.py

def get_services():
    """Lazy configuration for production safety"""
    gemini_key = os.getenv("GEMINI_API_KEY")
    pinecone_key = os.getenv("PINECONE_API_KEY")
    
    if not gemini_key or not pinecone_key:
        print("❌ Error: Missing API Keys in environment")
        return None, None

    genai.configure(api_key=gemini_key)
    pc = Pinecone(api_key=pinecone_key)
    return genai, pc

def get_embedding(text):
    try:
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']
    except Exception as e:
        print(f"Embedding Error: {e}")
        return None

def main():
    print("🚀 Starting Knowledge Base Ingestion...")
    
    # Initialize services
    genai_client, pc = get_services()
    if not genai_client or not pc:
        print("❌ Ingestion aborted due to missing services")
        return

    all_chunks = []
    
    # 1. Resume
    print("\n📄 Processing Resume...")
    all_chunks.extend(ingest_resume())
    
    # 2. Database (Projects, Skills, Blogs)
    print("\n🗄️ Processing Database...")
    all_chunks.extend(ingest_database())
    
    # 3. GitHub
    print("\n🐙 Processing GitHub...")
    all_chunks.extend(ingest_github())
    
    print(f"\nTotal Chunks to Ingest: {len(all_chunks)}")
    
    # 4. Embed & Upsert
    from pinecone import ServerlessSpec
    
    existing_indexes = pc.list_indexes().names()
    if INDEX_NAME not in existing_indexes:
        print(f"Creating index '{INDEX_NAME}'...")
        pc.create_index(
            name=INDEX_NAME,
            dimension=768, # Gemini 004 dimension
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            ) 
        )
    
    index = pc.Index(INDEX_NAME)
    
    vectors_to_upsert = []
    batch_size = 50
    
    print("\n✨ Generating Embeddings & Upserting to Pinecone...")
    
    for i, chunk in enumerate(all_chunks):
        embedding = get_embedding(chunk['text'])
        if embedding:
            # Sanitize metadata: Pinecone doesn't allow None
            clean_metadata = {k: (v if v is not None else "") for k, v in chunk['metadata'].items()}
            
            vectors_to_upsert.append({
                "id": chunk['id'],
                "values": embedding,
                "metadata": {
                    "text": chunk['text'],
                    **clean_metadata
                }
            })
            
        # Batch Upsert
        if len(vectors_to_upsert) >= batch_size or i == len(all_chunks) - 1:
            if vectors_to_upsert:
                index.upsert(vectors=vectors_to_upsert)
                print(f"   Upserted batch {i+1}/{len(all_chunks)}")
                vectors_to_upsert = []

    print("\n✅ Knowledge Base Update Complete!")

if __name__ == "__main__":
    main()
