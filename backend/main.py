from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin
if not firebase_admin._apps:
    firebase_admin.initialize_app(options={'projectId': 'smaxiso'})

from app.database import engine
from app.models import schemas
from app.api import projects, skills, config

# Create tables
schemas.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Portfolio API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(skills.router, prefix="/api/v1/skills", tags=["skills"])
app.include_router(config.router, prefix="/api/v1", tags=["config"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Smaxiso Portfolio API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/wakeup")
def wakeup():
    return {"status": "awake"}

