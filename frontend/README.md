# Frontend - Portfolio & Admin Dashboard

Next.js 16 application with static export for portfolio and admin dashboard.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Boxicons, Lucide React
- **Authentication**: Firebase Auth
- **Storage**: Cloudinary (Images), Firebase Storage (Resumes)
- **Deployment**: Firebase Hosting (Static Export)

## 📦 Project Structure

```
src/
├── app/                    # App Router pages
│   ├── page.tsx           # Landing page (/)
│   ├── admin/             # Admin routes
│   │   ├── page.tsx       # Dashboard (/admin)
│   │   └── login/         # Login page
│   ├── resume/            # Resume page
│   └── layout.tsx         # Root layout
├── components/
│   ├── admin/             # Admin dashboard components
│   │   ├── ProfileEditor.tsx
│   │   ├── ProjectsEditor.tsx
│   │   ├── SkillsEditor.tsx
│   │   ├── BlogEditor.tsx
│   │   ├── GuestbookManager.tsx
│   │   ├── SocialsEditor.tsx
│   │   ├── ResumeEditor.tsx
│   │   └── IconPicker.tsx
│   └── sections/          # Public portfolio sections
│       ├── Hero.tsx
│       ├── About.tsx
│       ├── SkillsSection.tsx
│       ├── ProjectsSection.tsx
│       └── ContactSection.tsx
├── context/
│   ├── AuthContext.tsx    # Firebase authentication
│   ├── ProfileContext.tsx # Site configuration
│   └── ToastContext.tsx   # Toast notifications
├── lib/
│   ├── api.ts            # API client
│   ├── firebase.ts       # Firebase config
│   └── iconLibrary.ts    # Icon catalog (70+ icons)
└── config/
    └── site.ts           # Fallback site config

public/
└── assets/               # Static assets (images, resume)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

For production:
```env
NEXT_PUBLIC_API_URL=https://smaxiso-portfolio-backend.onrender.com/api/v1
```

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build

```bash
# Development build
npm run build

# Production build (static export)
npm run build
```

Output: `out/` directory (static HTML/CSS/JS)

## 🎨 Admin Dashboard Features

### Profile Editor
- Site metadata (title, description, author, URL)
- Hero section (greeting, name, title, subtitle)
- About section (title, description)
- Experience calculator (years + months → decimal)
- Image uploads (profile, about)
- Resume PDF management

### Projects Editor
- Full CRUD operations
- Project metadata:
  - Title, description, category
  - Position, company, location
  - Dates (start/end)
  - Technologies (multi-select)
  - Links (repository, demo)
  - Project images
- Search and filter
- Conditional save (only shows when changes detected)

### Skills Editor
- Visual icon picker (70+ categorized icons)
- Skill categories (Languages, Frameworks, Tools, etc.)
- Proficiency levels (0-100)
- Icon search and category filtering
- Tech-focused icon presets

### Socials Editor
- Platform presets (LinkedIn, GitHub, Twitter, etc.)
- Auto-detect platform from URL
- Custom icon selection
- Social-focused icon presets
- Active/inactive toggle

### Resume Manager
- Upload multiple resume versions
- Set active resume
- Preview and download
- Metadata management
- Preview and download

### Media Manager
- Visual audit tool to find and delete orphaned Cloudinary images.

### Blog Editor
- Markdown editor with live preview
- Cover image upload (Cloudinary)
- Tag management
- Published/Draft status toggle

### Guestbook Manager
- View all guestbook entries
- Approve/Reject moderation
- Delete spam entries

## 🔐 Authentication

Uses Firebase Authentication with Google Sign-in.

**Whitelist**: Admin access restricted to emails in `backend/app/auth.py`

### Auth Flow
1. User clicks "Sign in with Google"
2. Firebase authenticates user
3. Frontend sends ID token to backend
4. Backend verifies token + checks email whitelist
5. Access granted/denied

## 🎨 Components

### Context Providers
- **AuthContext**: Firebase auth state management
- **ProfileContext**: Site configuration & socials
- **ToastContext**: Toast notifications (success, error, info)

### Admin Components
- **ProfileEditor**: Site-wide settings
- **ProjectsEditor**: Project management
- **SkillsEditor**: Skills management  
- **SocialsEditor**: Social links management
- **ResumeEditor**: Resume file management
- **IconPicker**: Visual icon selection (70+ icons)

### Public Components
- **Hero**: Landing section with profile
- **About**: About section with stats
- **SkillsSection**: Tech stack showcase
- **ProjectsSection**: Portfolio grid
- **BlogSection**: Tech blog listing with search/filter
- **GuestbookSection**: Public guestbook with signatures
- **ContactSection**: Contact form

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Admin dashboard fully mobile-optimized
- Touch-friendly interfaces

## 🚢 Deployment

### Firebase Hosting

Automatic deployment via GitHub Actions on push to `master`.

**Manual deployment:**
```bash
npm run build
firebase deploy --only hosting
```

### Configuration

`firebase.json`:
```json
{
  "hosting": {
    "public": "out",
    "cleanUrls": true,
    "trailingSlash": false
  }
}
```

### GitHub Actions

Workflow: `.github/workflows/firebase-hosting.yml`

Triggers on push to `master`:
1. Checkout code
2. Install dependencies
3. Build Next.js app (`npm run build`)
4. Deploy to Firebase Hosting

## 🔧 Development Tips

### Hot Reload
Next.js dev server supports fast refresh. Changes reflect instantly.

### Static Export
Next.js is configured for static export (`output: 'export'` in `next.config.js`), generating pure HTML/CSS/JS.

### Icon Library
70+ categorized icons in `src/lib/iconLibrary.ts`:
- **Tech**: Programming languages, frameworks, tools
- **Social**: Social media platforms
- **General**: Common UI icons

### Toast Notifications
```tsx
import { useToast } from '@/context/ToastContext'

const { showToast } = useToast()

showToast('Success!', 'success')
showToast('Error occurred', 'error')
showToast('Info message', 'info')
```

## 📄 License

Private and proprietary.

## 🔗 Related

- [Backend Documentation](../backend/README.md)
- [Root Documentation](../README.md)
