from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin
if not firebase_admin._apps:
    # For production (Render), use ADC or environment variable
    # For local development, set GOOGLE_APPLICATION_CREDENTIALS or use projectId-only mode
    cred_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    
    if cred_path and os.path.exists(cred_path):
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
from app.api import projects, skills, config

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
