# 🚀 Portfolio & Admin Dashboard

A full-stack portfolio website with a powerful admin dashboard for content management. Built with Next.js, FastAPI, and Firebase.

[![Live Site](https://img.shields.io/badge/Live-smaxiso.web.app-blue)](https://smaxiso.web.app)
[![Admin Portal](https://img.shields.io/badge/Admin-Portal-green)](https://smaxiso.web.app/admin)

## 🌐 Live URLs

- **Portfolio**: [https://smaxiso.web.app](https://smaxiso.web.app)
- **Admin Dashboard**: [https://smaxiso.web.app/admin](https://smaxiso.web.app/admin)
- **Admin Login**: [https://smaxiso.web.app/admin/login](https://smaxiso.web.app/admin/login)
- **Backend API**: [https://smaxiso-portfolio-backend.onrender.com/api/v1](https://smaxiso-portfolio-backend.onrender.com/api/v1)

## ✨ Features

### Public Portfolio
- **Responsive Design**: Mobile-first, fully responsive layout
- **Dynamic Content**: All content loaded from backend API
- **Sections**:
  - Hero section with profile image and social links
  - About section with stats (experience, projects)
  - Skills showcase with categorized tech stack
  - Projects portfolio with filtering
  - Contact form integration (Formspree)

### Admin Dashboard
- **🔐 Secure Authentication**: Google Sign-in with email whitelist
- **📝 Profile Management**: Edit all site content, upload images
- **💼 Projects Editor**: Full CRUD for projects with rich metadata
- **🛠 Skills Manager**: Visual icon picker with 70+ categorized icons
- **🔗 Social Links**: Platform presets with auto-detection from URLs
- **📄 Resume Manager**: Upload and manage multiple resume versions
- **🎨 Toast Notifications**: Beautiful in-app notifications
- **💾 Auto-Save Detection**: Save button only appears when changes are made
- **📱 Mobile Optimized**: Fully responsive admin interface

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router, Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Boxicons, Lucide React
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (Neon)
- **ORM**: SQLAlchemy
- **Authentication**: Firebase Admin SDK
- **Hosting**: Render

## 📦 Project Structure

```
.
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   │   └── admin/   # Admin dashboard components
│   │   ├── context/     # React contexts (Auth, Profile, Toast)
│   │   ├── lib/         # Utility functions & API client
│   │   └── config/      # Site configuration
│   ├── public/          # Static assets
│   └── firebase.json    # Firebase Hosting config
│
└── backend/             # FastAPI application
    ├── app/
    │   ├── api/        # API routes
    │   ├── models/     # Database models & Pydantic schemas
    │   ├── auth.py     # Authentication utilities
    │   └── database.py # Database connection
    ├── main.py         # Application entry point
    └── requirements.txt
```

## 🚀 Local Development

### Prerequisites
- Node.js 20+
- Python 3.9+
- PostgreSQL database (or use Neon)

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1" > .env.local

# Run development server
npm run dev
```

Visit http://localhost:3000

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://user:pass@host/db
LOCAL_DEV_MODE=true
EOF

# Run development server
uvicorn main:app --reload --port 8000
```

API available at http://127.0.0.1:8000

### Environment Variables

#### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

#### Backend (`backend/.env`)
```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Local Development (bypasses Firebase token verification)
LOCAL_DEV_MODE=true

# Production (optional - for Firebase Admin SDK with credentials)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

## 🔑 Admin Access

The admin portal is restricted to whitelisted email addresses. To add authorized users:

1. Edit `backend/app/auth.py`
2. Add email to `ALLOWED_EMAILS` list:
   ```python
   ALLOWED_EMAILS = ["sumit749284@gmail.com", "your-email@gmail.com"]
   ```
3. Redeploy backend

## 📝 API Documentation

### Endpoints

#### Config
- `GET /api/v1/config` - Get site configuration
- `PUT /api/v1/config` - Update site config (auth required)

#### Projects
- `GET /api/v1/projects` - List all projects
- `POST /api/v1/projects` - Create project (auth required)
- `PUT /api/v1/projects/{id}` - Update project (auth required)
- `DELETE /api/v1/projects/{id}` - Delete project (auth required)

#### Skills
- `GET /api/v1/skills` - List all skills
- `POST /api/v1/skills` - Create skill (auth required)
- `PUT /api/v1/skills/{id}` - Update skill (auth required)
- `DELETE /api/v1/skills/{id}` - Delete skill (auth required)

#### Social Links
- `GET /api/v1/socials` - List social links
- `POST /api/v1/socials` - Create social link (auth required)
- `PUT /api/v1/socials/{id}` - Update social link (auth required)
- `DELETE /api/v1/socials/{id}` - Delete social link (auth required)

#### Resumes
- `GET /api/v1/resumes` - List resume files
- `POST /api/v1/resumes` - Upload resume (auth required)
- `PUT /api/v1/resumes/{id}` - Update resume metadata (auth required)
- `DELETE /api/v1/resumes/{id}` - Delete resume (auth required)

## 🚢 Deployment

### Frontend (Firebase Hosting)
Automatic deployment via GitHub Actions on push to `master`:

```bash
# Manual deployment
cd frontend
npm run build
firebase deploy --only hosting
```

### Backend (Render)
Connected to GitHub repository with auto-deploy on push.

**Environment variables on Render:**
- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_APPLICATION_CREDENTIALS`: (optional) Service account JSON

## 🎨 Admin Dashboard Features

### Profile Editor
- Update site metadata (title, description, author)
- Edit hero section (greeting, name, title, subtitle)
- Manage about section (title, description)
- Upload and preview images (profile, about)
- Set years of experience (years + months, displayed as decimal)
- Track projects completed

### Projects Editor
- Add/Edit/Delete projects
- Rich project metadata:
  - Title, description, category
  - Position, company, location
  - Start/end dates
  - Technologies used
  - Repository & website links
  - Project images
- Search and filter projects

### Skills Editor
- Visual icon picker with 70+ icons
- Categorize skills (Languages, Frameworks, Tools, etc.)
- Set skill proficiency (0-100)
- Search and manage skills

### Socials Editor
- Platform presets (LinkedIn, GitHub, Twitter, etc.)
- Auto-detect platform from URL
- Custom icon selection
- Toggle active/inactive status

### Resume Manager
- Upload multiple resume versions
- Set active resume (displayed on site)
- Manage resume metadata

## 🔧 Development Tips

### Local Development Mode
The backend supports `LOCAL_DEV_MODE` to bypass Firebase authentication:

```env
LOCAL_DEV_MODE=true
```

This allows testing admin features without Firebase credentials.

### Building for Production
```bash
# Frontend
cd frontend
npm run build  # Creates static export in 'out/'

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📄 License

This project is private and proprietary.

## 👤 Author

**Sumit Kumar**
- Portfolio: [https://smaxiso.web.app](https://smaxiso.web.app)
- LinkedIn: [https://www.linkedin.com/in/smaxiso](https://www.linkedin.com/in/smaxiso)
- GitHub: [https://github.com/smaxiso](https://github.com/smaxiso)
- Email: sumit749284@gmail.com

---

Built with ❤️ using Next.js, FastAPI, and Firebase
