from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials
import os
from dotenv import load_dotenv

load_dotenv()

import json

# Initialize Firebase Admin
if not firebase_admin._apps:
    # 1. Try explicit JSON content from env (Best for Koyeb/Render/Fly without files)
    firebase_creds_json = os.getenv('FIREBASE_CREDENTIALS_JSON')
    
    # 2. Try file path from env
    cred_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

    if firebase_creds_json:
        try:
            cred_dict = json.loads(firebase_creds_json)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            print("✅ Firebase Admin initialized from FIREBASE_CREDENTIALS_JSON env var")
        except Exception as e:
            print(f"❌ Failed to load FIREBASE_CREDENTIALS_JSON: {e}")
            # Fallback to no-auth or project-id only if strict auth not strictly required for read
            firebase_admin.initialize_app(options={'projectId': 'smaxiso'})

    elif cred_path and os.path.exists(cred_path):
        # Use service account file
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        print(f"✅ Firebase Admin initialized with service account from {cred_path}")
    else:
        # Use project ID only (works for token verification without storage/firestore)
        firebase_admin.initialize_app(options={'projectId': 'smaxiso'})
        print("⚠️  Firebase Admin initialized with project ID only (token verification works, but no Firestore/Storage)")

from app.database import engine
from app.models import schemas
from app.api import projects, skills, config, guestbook, blog, media, chat, admin, experience

# Create tables
schemas.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://smaxiso.web.app",
        "https://smaxiso.firebaseapp.com",
        "https://smaxiso.github.io"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers - ORDER MATTERS!
# Specific routes must come before catch-all routes
app.include_router(config.router, prefix="/api/v1", tags=["config"])
app.include_router(skills.router, prefix="/api/v1/skills", tags=["skills"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(guestbook.router, prefix="/api/v1/guestbook", tags=["guestbook"])
app.include_router(blog.router, prefix="/api/v1/blog", tags=["blog"])
app.include_router(media.router, prefix="/api/v1/media", tags=["media"])
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(experience.router, prefix="/api/v1/experience", tags=["experience"])

@app.get("/")
def read_root():
    return {"message": "Portfolio API is running!"}

@app.get("/health")
@app.get("/ping")
def health_check():
    """Health check endpoint for monitoring and cron jobs"""
    return {
        "status": "healthy",
        "message": "Backend is awake and running",
        "service": "Portfolio API"
    }
