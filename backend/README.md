# Backend - Portfolio API

FastAPI backend providing REST API for portfolio content management.

## 🛠 Tech Stack

- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Database**: PostgreSQL (Neon)
- **ORM**: SQLAlchemy
- **Authentication**: Firebase Admin SDK
- **Deployment**: Render

## 📦 Project Structure

```
app/
├── api/                    # API route handlers
│   ├── config.py          # Site config endpoints
│   ├── projects.py        # Projects CRUD
│   ├── skills.py          # Skills CRUD
│   └── __init__.py
├── models/
│   ├── schemas.py         # SQLAlchemy models
│   └── pydantic_models.py # Pydantic schemas
├── auth.py                # Firebase token verification
└── database.py            # Database connection

scripts/
└── seed_config.py         # Database seeding script

main.py                    # Application entry point
requirements.txt           # Python dependencies
```

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- PostgreSQL database (or Neon account)

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Environment Variables

Create `.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Local Development (bypasses Firebase token verification)
LOCAL_DEV_MODE=true

# Production (optional - for Firebase Admin SDK with full credentials)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

**Production DATABASE_URL** (Neon):
```
postgresql://neondb_owner:PASSWORD@ep-long-cake-a5ddoq4z-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Development

```bash
uvicorn main:app --reload --port 8000
```

API available at [http://127.0.0.1:8000](http://127.0.0.1:8000)

Interactive docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## 📊 Database

### Models

#### SiteConfig (Singleton, id=1)
- Site metadata (title, description, author, URL)
- Hero section (greeting, name, title, subtitle, profile_image)
- About section (title, description, image, resume_url)
- Stats (years_experience, experience_months, projects_completed)
- Contact (email)
- Footer

#### Project
- Basic info (id, title, description, category)
- Work details (position, company, location, startDate, endDate)
- Metadata (image, technologies, repository, website)

#### Skill
- Category (e.g., "Languages", "Frameworks")
- Name (e.g., "Python", "React")
- Icon (Boxicons class, e.g., "bxl-python")
- Level (0-100, proficiency)

#### SocialLink
- Platform (e.g., "linkedin", "github")
- URL
- Icon (Boxicons class)
- is_active (boolean)

#### ResumeFile
- Name
- URL (Firebase Storage or local path)
- is_active (only one active resume)
- created_at

### Migrations

SQLAlchemy auto-creates tables on startup via:
```python
schemas.Base.metadata.create_all(bind=engine)
```

**Manual column addition** (if needed):
```bash
python -c "from app.database import SessionLocal; from sqlalchemy import text; db = SessionLocal(); db.execute(text('ALTER TABLE table_name ADD COLUMN column_name TYPE')); db.commit(); db.close()"
```

### Seeding

```bash
python scripts/seed_config.py
```

Seeds initial `SiteConfig` entry.

## 🔐 Authentication

### Firebase Admin SDK

Token verification with email whitelist.

**Whitelist** (`app/auth.py`):
```python
ALLOWED_EMAILS = ["sumit749284@gmail.com"]
```

### Local Development Mode

Set `LOCAL_DEV_MODE=true` in `.env` to bypass token verification:

```python
# Returns mock token for whitelisted email
if LOCAL_DEV_MODE:
    return {"email": ALLOWED_EMAILS[0], "uid": "local-dev-user"}
```

**⚠️ Never enable in production!**

### Auth Flow

1. Frontend sends Firebase ID token in `Authorization: Bearer <token>` header
2. Backend verifies token with Firebase Admin SDK
3. Extracts email from token
4. Checks email against whitelist
5. Returns 403 if unauthorized

## 📡 API Endpoints

### Config

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/config` | ❌ | Get site configuration |
| PUT | `/api/v1/config` | ✅ | Update site config |

### Projects

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/projects` | ❌ | List all projects |
| POST | `/api/v1/projects` | ✅ | Create project |
| PUT | `/api/v1/projects/{id}` | ✅ | Update project |
| DELETE | `/api/v1/projects/{id}` | ✅ | Delete project |

### Skills

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/skills` | ❌ | List all skills |
| POST | `/api/v1/skills` | ✅ | Create skill |
| PUT | `/api/v1/skills/{id}` | ✅ | Update skill |
| DELETE | `/api/v1/skills/{id}` | ✅ | Delete skill |

### Social Links

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/socials` | ❌ | List social links |
| POST | `/api/v1/socials` | ✅ | Create social link |
| PUT | `/api/v1/socials/{id}` | ✅ | Update social link |
| DELETE | `/api/v1/socials/{id}` | ✅ | Delete social link |

### Resumes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/resumes` | ❌ | List resume files |
| POST | `/api/v1/resumes` | ✅ | Create resume entry |
| PUT | `/api/v1/resumes/{id}` | ✅ | Update resume (set active) |
| DELETE | `/api/v1/resumes/{id}` | ✅ | Delete resume |

## 🔧 Router Configuration

**IMPORTANT**: Router order matters!

```python
# Specific routes BEFORE catch-all routes
app.include_router(config.router, prefix="/api/v1", tags=["config"])
app.include_router(skills.router, prefix="/api/v1/skills", tags=["skills"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
```

Config must come before projects (which has `/{project_id}` catch-all).

## 🚢 Deployment

### Render

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Environment Variables:**
- `DATABASE_URL`: Neon PostgreSQL connection string
- `GOOGLE_APPLICATION_CREDENTIALS`: (optional) Service account JSON
- `LOCAL_DEV_MODE`: `false` (or omit)

**Auto-deploy**: Connected to GitHub, deploys on push to `master`.

### Database (Neon)

PostgreSQL database hosted on Neon (serverless).

**Connection pooling**: Use `*-pooler.*.neon.tech` endpoint for better performance.

## 🔧 Development Tips

### Interactive API Docs

FastAPI auto-generates Swagger UI:
- **Swagger**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

### CORS

Enabled for all origins (development):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Production**: Restrict `allow_origins` to your frontend domain.

### Testing Endpoints

```bash
# Get config
curl http://127.0.0.1:8000/api/v1/config

# Get projects
curl http://127.0.0.1:8000/api/v1/projects

# Update config (with auth)
curl -X PUT http://127.0.0.1:8000/api/v1/config \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <firebase-token>" \
  -d '{"site_title": "New Title", ...}'
```

### Debugging

Enable detailed logs:
```bash
uvicorn main:app --reload --log-level debug
```

## 📄 License

Private and proprietary.

## 🔗 Related

- [Frontend Documentation](../frontend/README.md)
- [Root Documentation](../README.md)
