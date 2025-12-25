from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import schemas
from app.api import projects, skills

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

@app.get("/")
def read_root():
    return {"message": "Welcome to Smaxiso Portfolio API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/wakeup")
def wakeup():
    return {"status": "awake"}

