# 🚀 Portfolio & Admin Dashboard

A full-stack portfolio website with a powerful admin dashboard for content management.

[![Live Site](https://img.shields.io/badge/Live-smaxiso.web.app-blue)](https://smaxiso.web.app)
[![Admin Portal](https://img.shields.io/badge/Admin-Portal-green)](https://smaxiso.web.app/admin)

## 🌐 Live URLs

- **Portfolio**: [https://smaxiso.web.app](https://smaxiso.web.app)
- **Admin Dashboard**: [https://smaxiso.web.app/admin](https://smaxiso.web.app/admin)
- **Backend API (Primary)**: [https://smaxiso-github-io.vercel.app/api/v1](https://smaxiso-github-io.vercel.app/api/v1)
- **Backend API (Backup)**: [https://smaxiso-portfolio-backend.onrender.com/api/v1](https://smaxiso-portfolio-backend.onrender.com/api/v1)

## ✨ Features

### Public Portfolio
- **Responsive Design**: Mobile-first, fully responsive layout
- **High Availability**: Multi-region active-passive failover (Vercel + Render)
- **Dynamic Content**: All content loaded from backend API
- **AI Chatbot 🤖**: RAG-powered assistant (Gemini 1.5 + Pinecone) that answers questions using my Resume, GitHub, and Portfolio data.
- **Sections**: Hero, About, Skills, Projects, Blog, Guestbook, Contact
- **Tech Blog**: 
  - **⚡ Blazing Fast SSG**: Pre-rendered static pages (~100-200ms loads)
  - Markdown support with syntax highlighting
  - **Responsive Images**: Mobile-first with auto-scaling
  - Drag & drop + paste image uploads (mobile-friendly)
  - Related posts with intelligent tag matching
  - Multi-channel sharing (native share, WhatsApp, LinkedIn, Twitter)
  - Auto-copy to clipboard on social share
  - **Social Engagement 🚀**:
    - **Reactions**: Custom DB-backed emoji reactions (Heart, Rocket, Fire, etc.) with animated interaction.
    - **Comments**: Giscus (GitHub Discussions) integration for developer-focused community discussions.
  - Local timezone display for all dates

### SEO & Discoverability
- **Meta Tags**: Dynamic Open Graph and Twitter Card tags for perfect social previews
- **Structured Data**: JSON-LD BlogPosting schema for Google rich snippets
- **Sitemap**: Auto-generated `sitemap.xml` with all pages and blog posts
- **Robots.txt**: Optimized crawler directives
- **Internal Linking**: Related posts section for better SEO and engagement

### Admin Dashboard
- 🔐 **Secure Authentication**: Google Sign-in with email whitelist
- 🧠 **Knowledge Base Manager**: One-click ingestion to sync Resume & GitHub data with AI
- 💼 **Content Management**: Projects, Skills, Blog Posts, Guestbook, Profile, Social Links, Resumes
- 📝 **Blog Editor**: 
  - **State Persistence**: Auto-save drafts with deep linking (no data loss on refresh)
  - **Smart Image Upload**: Drag & drop, paste, or mobile file picker
  - **Client-side Compression**: Auto-resize (max 1920px) and compress (80% quality) before upload
  - Markdown editor with live preview
  - **Media Manager**: Audit and cleanup unused Cloudinary images
  - Search & sort functionality
- 🎨 **Profile Customization**:
  - Toggle "Open to Work" badge on/off from admin panel
  - No code changes needed to show/hide badge
  - Always-visible action icons (View, Edit, Delete)
  - Creation date display with local timezone
- 🎨 **Visual Icon Picker**: 70+ categorized icons with search
- 🔗 **Social Platform Presets**: Auto-detection from URLs
- 🎨 **Toast Notifications**: Beautiful in-app notifications
- 📱 **Mobile Optimized**: Fully responsive admin interface

### 🛡️ Robust Failover Architecture
- **Primary Backend**: Vercel Serverless (Fast, Global Edge Network)
- **Backup Backend**: Render (Full container instance)
- **Automatic Failover**: Frontend automatically detects API failures (503/429/Network Error) and switches to the backup seamlessly in real-time.
- **Zero Downtime**: Ensure portfolio availability even during platform outages.

## 🛠 Tech Stack

### Frontend
- Next.js 16 (App Router, Static Export)
- TypeScript, Tailwind CSS
- Firebase Auth & Hosting

### Backend
- FastAPI (Python)
- PostgreSQL (Neon), SQLAlchemy
- Firebase Admin SDK
- **Hosting**: Vercel (Primary) + Render (Backup)

## 📦 Project Structure

```
.
├── frontend/          # Next.js application
│   └── README.md     # Frontend documentation
├── backend/          # FastAPI application
│   └── README.md     # Backend documentation
└── README.md         # This file
```

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev  # http://localhost:3000
```

See [frontend/README.md](./frontend/README.md) for details.

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

See [backend/README.md](./backend/README.md) for details.

## 🔑 Admin Access

Admin portal restricted to: `sumit749284@gmail.com`

To add users, edit `backend/app/auth.py`.

## 📖 Documentation

- **Frontend Setup & Features**: [frontend/README.md](./frontend/README.md)
- **Backend API & Database**: [backend/README.md](./backend/README.md)

## 🚢 Deployment

### Automated CI/CD Pipeline
- **Frontend**: 
  - GitHub Actions → Build & Deploy to Firebase Hosting
  - **Auto-trigger**: On git push OR blog publish from admin
  - **Smart Triggers**: Only rebuilds when public content actually changes
- **Backend**: 
  - Primary: Vercel (auto-deploy from `main` branch)
  - Backup: Render (auto-deploy from `main` branch)

### Performance Optimizations
- **SSG (Static Site Generation)**: All blog pages pre-rendered at build time
- **Revalidation**: 1-hour cache refresh for blog pages
- **Image Optimization**: Client-side compression before upload
- **Load Times**: ~100-200ms for all blog pages

## 👤 Author

**Sumit Kumar**
- Portfolio: [smaxiso.web.app](https://smaxiso.web.app)
- LinkedIn: [@smaxiso](https://www.linkedin.com/in/smaxiso)
- GitHub: [@smaxiso](https://github.com/smaxiso)
- Email: sumit749284@gmail.com

---

Built with ❤️ using Next.js, FastAPI, and Firebase
