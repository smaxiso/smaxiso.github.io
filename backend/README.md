# Backend - Portfolio API

FastAPI backend providing REST API for portfolio content management.

## 🛠 Tech Stack

- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Database**: PostgreSQL (Neon)
- **ORM**: SQLAlchemy
- **Authentication**: Firebase Admin SDK
- **Storage**: Cloudinary (Image Management)
- **AI/ML**: Google Gemini 1.5 (LLM), Pinecone (Vector DB)
- **Deployment**: Vercel (Primary), Render (Backup)

## 📦 Project Structure

```
app/
├── api/                    # API route handlers
│   ├── config.py          # Site config endpoints
│   ├── projects.py        # Projects CRUD
│   ├── skills.py          # Skills CRUD
│   ├── blog.py            # Blog CRUD & Image Cleanup
│   ├── guestbook.py       # Guestbook CRUD
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
requirements.txt           # Python dependencies
```

## 🧠 AI & RAG Configuration

The backend powers an AI Chatbot using **Google Gemini** (LLM) and **Pinecone** (Vector DB).

### Setup
1.  **Env Variables**: Ensure `GEMINI_API_KEY` and `PINECONE_API_KEY` are set.
2.  **Ingestion**:
    -   **Manual**: Run `python scripts/ingest_v2.py`.
    -   **Live**: Use the "Update Knowledge Base" button in the Admin Portal.
3.  **Data Sources**:
    -   **Resume**: `resume_url` from SiteConfig (or local `assets/sumit_kumar.pdf`).
    -   **GitHub**: Repository URLs from `Projects` table.
    -   **Database**: Projects, Skills, and Blog Posts.

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

# Cloudinary (Images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI (RAG)
GEMINI_API_KEY=your_gemini_key
PINECONE_API_KEY=your_pinecone_key

# Auto-Deploy (GitHub Actions trigger)
GITHUB_TOKEN=ghp_your_personal_access_token
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
- is_active

#### BlogReaction
- slug (string, index)
- reaction_type (string, e.g., "heart")
- count (integer)
- unique_constraint(slug, reaction_type)

### Migrations

SQLAlchemy auto-creates tables on startup via:
```python
schemas.Base.metadata.create_all(bind=engine)
```

### Migrations

**Run database migrations** (e.g., adding new columns):
```bash
python scripts/run_migration.py
```

This script is idempotent (safe to run multiple times) and automatically checks if changes already exist.

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

### Blog
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/blog` | ❌ | List published posts |
| GET | `/api/v1/blog/{slug}` | ❌ | Get post by slug |
| GET | `/api/v1/blog/admin/all` | ✅ | List all posts (incl. drafts) |
| POST | `/api/v1/blog` | ✅ | Create post (triggers rebuild if published) |
| PUT | `/api/v1/blog/{id}` | ✅ | Update post (triggers rebuild if published/unpublishing) |
| DELETE | `/api/v1/blog/{id}` | ✅ | Delete post + images (triggers rebuild) |

### Reactions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/reactions/{slug}` | ❌ | Get reaction counts for a post |
| POST | `/api/v1/reactions/{slug}/{type}` | ❌ | Increment reaction count (e.g. "heart") |

### Guestbook
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/guestbook` | ❌ | List approved entries |
| POST | `/api/v1/guestbook` | ❌ | Create entry (pending approval) |
| GET | `/api/v1/guestbook/admin/all` | ✅ | List all entries (pending & approved) |
| PUT | `/api/v1/guestbook/{id}/approve` | ✅ | Approve entry |
| DELETE | `/api/v1/guestbook/{id}` | ✅ | Delete entry |

### Media
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/media/audit` | ✅ | Scan Cloudinary + DB for orphaned/active images |
| DELETE | `/api/v1/media/{public_id}` | ✅ | Delete specific asset |

**Media Audit Logic:**
- Scans all Cloudinary assets
- Checks usage in: `SiteConfig`, `Project.image`, `BlogPost.cover_image`, and `BlogPost.content` (inline images)
- Returns list with `status`: `"active"` or `"orphaned"`
- Used by Admin Media Manager to show which images can be safely deleted

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

### Vercel (Primary)

**Configuration**:
- `vercel.json`: Defines Python runtime and rewrites.
- `requirements.txt`: Standard Python dependencies.

**Environment Variables**:
- `DATABASE_URL`: Supported.
- `FIREBASE_CREDENTIALS_JSON`: **Required**. Use minified JSON string of service account (Vercel cannot read local files).
- `GEMINI_API_KEY`, `PINECONE_API_KEY`, `CLOUDINARY_*`: Same as Render.
- `GITHUB_TOKEN`: **Required for auto-deploy**. Personal Access Token with `repo` scope to trigger GitHub Actions.

**Auto-Deploy Integration**:
- When blog posts are published/updated/deleted, backend triggers GitHub Actions via `repository_dispatch`
- GitHub Actions rebuilds and redeploys the frontend to Firebase Hosting
- Smart triggers: only rebuilds when public content actually changes

**Limitations**:
- **Background Tasks**: Not supported (max 10s execution). Ingestion must be triggered elsewhere.
- **Cold Starts**: Typically faster than Render free tier.

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
