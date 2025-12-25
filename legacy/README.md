# Sumit Kumar's Portfolio 🚀

> Modern, responsive portfolio website showcasing my journey as a **Machine Learning Engineer** and **Data Pipeline Architect** with expertise in FinTech & Cybersecurity.

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=github-pages)](https://smaxiso.github.io)
[![Use Template](https://img.shields.io/badge/Use-Template-blue?style=for-the-badge&logo=github)](https://github.com/smaxiso/smaxiso.github.io/generate)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/smaxiso)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=for-the-badge&logo=github)](https://github.com/smaxiso)

## 🌟 Overview

Welcome to my professional portfolio! This repository showcases a modern, **fully config-driven** website built with vanilla HTML, CSS, and JavaScript. Perfect as a **template for your own portfolio** - all content is managed through JSON files, no HTML editing required!

### 🎯 What I Do
- **Machine Learning Engineer** at Gen Digital (formerly NortonLifeLock)
- **Data Pipeline Architect** specializing in real-time transaction processing
- **FinTech & Cybersecurity** domain expertise from PayPal systems work
- **Full-Stack Development** for academic and social impact projects

### 📋 **Want to use this as a template? Jump to [Template Usage Guide](#-using-as-a-template)!**

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Modern Design** | Material Design 3 with professional aesthetics |
| 📱 **Mobile-First** | Fully responsive across all device sizes |
| ⚡ **Performance** | Optimized loading with smooth animations |
| 🚀 **3D Effects** | Professional 3D animations and micro-interactions |
| 📊 **Config-Driven** | 100% JSON-driven content - no HTML editing needed! |
| 🔧 **Template Ready** | Perfect for creating your own portfolio |
| 🔍 **SEO Ready** | Semantic HTML with proper meta tags |
| ♿ **Accessible** | ARIA labels and keyboard navigation |
| 📧 **Contact Form** | Integrated contact functionality |

## 🚀 **Using as a Template**

This portfolio is designed to be **easily customizable** for your own use! Everything is config-driven through JSON files.

### 🎯 **Quick Template Setup**

1. **Click "Use this template"** button above or [click here](https://github.com/smaxiso/smaxiso.github.io/generate)
2. **Name your repository**: `yourusername.github.io` (for GitHub Pages)
3. **Clone your new repository**
4. **Follow the customization guide below**

### 📋 **Essential Files to Customize**

#### **🗂️ Data Files (JSON) - Main Customization**
```
📋 MUST CHANGE:
├── assets/data/site-config.json       ← All personal info, navigation, contact
├── assets/data/skills-data.json       ← Your technical skills  
├── assets/data/work-data.json         ← Your projects & experience
├── assets/data/hobbies-data.json      ← Your personal interests
├── assets/data/resume-config.json     ← Resume page configuration
```

#### **🖼️ Images to Replace**
```
📋 REPLACE IMAGES:
├── assets/img/perfils/your-photo.png  ← Your profile photo (400x400px)
├── assets/img/about/your-about.jpg    ← About section photo (500x600px)  
├── assets/img/work/*.png              ← Your project screenshots (800x600px)
├── assets/data/your-resume.pdf        ← Your actual resume PDF
```

#### **📝 Site Configuration Example**
```json
// assets/data/site-config.json
{
  "meta": {
    "title": "Your Name - Portfolio",  // ← Change this
    "description": "Your description",  // ← Change this  
    "keywords": "your, keywords, here", // ← Change this
    "author": "Your Name"              // ← Change this
  },
  "home": {
    "greeting": "Hi there! 👋",         // ← Customize greeting
    "name": "Your Name",               // ← Change this
    "title": "Your Job Title",         // ← Change this
    "subtitle": "Your description...",  // ← Change this
    "profileImage": {
      "src": "assets/img/perfils/your-photo.png", // ← Change path
      "alt": "Your Name - Profile"     // ← Change this
    },
    "socialLinks": [
      {
        "platform": "LinkedIn",
        "url": "https://linkedin.com/in/your-profile", // ← Change URL
        "icon": "bx bxl-linkedin"
      },
      {
        "platform": "GitHub",
        "url": "https://github.com/your-username",     // ← Change URL  
        "icon": "bx bxl-github"
      }
    ]
  },
  "contact": {
    "contactInfo": [
      {
        "icon": "bx bx-envelope",
        "label": "Email", 
        "value": "your.email@example.com"  // ← Change your email
      },
      {
        "icon": "bx bx-map",
        "label": "Location",
        "value": "Your City, Country"      // ← Change your location
      }
    ]
  }
}
```

#### **🛠️ Skills Configuration**
```json
// assets/data/skills-data.json
{
  "professional_skills": {
    "Programming Languages": [
      {
        "name": "Your Programming Language",  // ← Change skill name
        "icon": "bx bxl-python",             // ← Change icon
        "level": "Expert"                    // ← Beginner/Intermediate/Advanced/Expert
      }
    ],
    "Your Category": [                      // ← Add your own categories
      // ... your skills
    ]
  }
}
```

#### **💼 Projects Configuration**
```json
// assets/data/work-data.json
[
  {
    "title": "Your Project Title",              // ← Change this
    "subtitle": "Your Project Subtitle",        // ← Change this  
    "description": "Your project description...", // ← Change this
    "image": "assets/img/work/your-project.png", // ← Change image path
    "technologies": ["Tech1", "Tech2"],         // ← Change technologies
    "links": [
      {
        "type": "github",
        "url": "https://github.com/your-username/project", // ← Change URL
        "label": "View Code"
      },
      {
        "type": "demo", 
        "url": "https://your-project-demo.com",           // ← Change URL
        "label": "Live Demo"
      }
    ]
  }
]
```

### 🎨 **Template Customization Checklist**

- [ ] **Update `site-config.json`** with your personal information
- [ ] **Replace profile photo** in `assets/img/perfils/`
- [ ] **Add your skills** in `skills-data.json`
- [ ] **Add your projects** in `work-data.json`  
- [ ] **Update social media links** in site config
- [ ] **Replace project images** in `assets/img/work/`
- [ ] **Upload your resume PDF** to `assets/data/`
- [ ] **Update contact information** in site config
- [ ] **Test locally** by opening `index.html`
- [ ] **Deploy to GitHub Pages** or your preferred hosting

### 🚀 **Deployment Options**

1. **GitHub Pages** (Recommended)
   - Repository name: `yourusername.github.io`
   - Push to `main` branch
   - Enable Pages in repository settings

2. **Netlify**
   - Connect your GitHub repository
   - Auto-deployment on every push

3. **Vercel**
   - Import your GitHub project
   - Instant deployment with custom domains

### 📋 **File Structure for Template Users**
```
your-portfolio/
├── 📄 index.html                    ✅ Keep as-is (template structure)
├── 📄 pages/resume.html             ✅ Keep as-is (template structure)
├── 📁 assets/
│   ├── 📁 css/                      ✅ Keep as-is (styling)
│   ├── 📁 js/                       ✅ Keep as-is (functionality)
│   ├── 📁 data/                     📝 CUSTOMIZE ALL JSON FILES
│   │   ├── site-config.json         📝 Your personal info
│   │   ├── skills-data.json         📝 Your skills
│   │   ├── work-data.json           📝 Your projects  
│   │   ├── hobbies-data.json        📝 Your hobbies
│   │   ├── resume-config.json       📝 Resume page config
│   │   └── your-resume.pdf          📝 Your resume PDF
│   └── 📁 img/                      🖼️ REPLACE ALL IMAGES
│       ├── perfils/your-photo.png   🖼️ Your profile photo
│       ├── about/your-about.jpg     🖼️ Your about photo
│       └── work/project-*.png       🖼️ Your project images
```

**💡 Pro Tip**: This template is 100% config-driven! You only need to edit JSON files and replace images - no HTML/CSS knowledge required!

## 🛠️ Technologies Used

### Frontend Stack
```
HTML5 + CSS3 + Vanilla JavaScript
```

### Libraries & Tools
- **ScrollReveal.js** - Smooth scroll animations
- **Boxicons** - Modern icon library
- **Font Awesome** - Additional icon sets
- **Google Fonts** - Inter & JetBrains Mono typography
- **Formspree** - Contact form backend

### Design System
- **Material Design 3** principles
- **CSS Custom Properties** for theming
- **Component-based** architecture
- **Mobile-first** responsive design

## 📁 Project Structure

```
smaxiso.github.io/
├── 📄 index.html                    # Main portfolio page
├── 📄 README.md                     # Project documentation
├── � pages/                        # Additional pages
│   └── resume.html                  # Professional resume viewer
├── 📁 assets/
│   ├── 📁 css/
│   │   ├── styles.css               # Main stylesheet (Material Design 3)
│   │   └── resume.css               # Resume page specific styles
│   ├── 📁 js/
│   │   └── main.js                  # Interactive functionality & API calls
│   ├── 📁 data/                     # JSON data management
│   │   ├── skills-data.json         # Technical skills with proficiency levels
│   │   ├── work-data.json           # Work experience & projects
│   │   ├── hobbies-data.json        # Personal interests
│   │   └── Sumit_resume.pdf         # Professional resume
│   ├── 📁 img/                      # Image assets
│   │   ├── � about/                # About section images
│   │   │   ├── about1.jpg
│   │   │   └── about2.jpg
│   │   ├── 📁 others/               # Miscellaneous images
│   │   │   ├── max.png
│   │   │   └── photo2.jpg
│   │   ├── 📁 perfils/              # Profile images
│   │   │   ├── perfil1.png
│   │   │   └── perfil2.png
│   │   ├── 📁 skills/               # Skills section assets
│   │   │   └── skill_banner.jpg
│   │   └── 📁 work/                 # Project showcase images
│   │       ├── gen_digital_transaction_pipeline.png
│   │       ├── data_migration_framework.png
│   │       ├── lynx_framework_optimization.png
│   │       ├── reporting_framework.png
│   │       ├── fuzzy_control_system_for_forest_fire_detection.png
│   │       ├── joint_image_compression_and_encryption.jpg
│   │       ├── digital_image_compression.png
│   │       ├── image_classification_using_cnn.png
│   │       ├── youtube_spam_comment_filtering.jpeg
│   │       ├── school_chale_ham.png
│   │       ├── bihar_covid_help.png
│   │       ├── android_bloatware_removal_guide.png
│   │       └── work1-6.jpg           # Fallback project images
│   └── 📁 scss/
│       └── styles.scss              # Sass source (if using preprocessing)
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Code editor (VS Code recommended)
- Basic knowledge of HTML/CSS/JavaScript

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/smaxiso/smaxiso.github.io.git
   cd smaxiso.github.io
   ```

2. **Open the project**
   ```bash
   code .                    # VS Code
   # or open index.html in your browser
   ```

3. **Customize content**
   - Update personal info in `index.html`
   - Modify `assets/data/` JSON files
   - Replace images in `assets/img/`
   - Update resume PDF

4. **Deploy**
   - **GitHub Pages**: Push to `main` branch
   - **Netlify**: Connect repository for auto-deployment
   - **Vercel**: Import project for instant deployment

## 🎨 Customization Guide

### 🚀 Config-Driven Content Management

**Your website is now 100% config-driven!** All content is managed through JSON configuration files, making updates incredibly easy without touching HTML.

#### Main Site Configuration
```javascript
// assets/data/site-config.json - Controls ALL static content
{
  "site": {
    "title": "Your Name - Professional Title",
    "description": "Your meta description...",
    "author": "Your Name"
  },
  "home": {
    "greeting": "Hi there! 👋",
    "name": "Your Name",
    "title": "Your Professional Title",
    "subtitle": "Your compelling subtitle...",
    "socialLinks": [...]
  },
  "about": {
    "sectionTitle": "About Me",
    "subtitle": "Who I Am",
    "title": "Your Professional Title",
    "mainText": "Your bio...",
    "stats": [...]
  }
}
```

#### Quick Content Updates
To update your website content:

1. **Personal Information**: Edit `site-config.json` → `home` section
2. **About Section**: Edit `site-config.json` → `about` section  
3. **Navigation**: Edit `site-config.json` → `navigation` section
4. **Contact Form**: Edit `site-config.json` → `contact` section
5. **Footer**: Edit `site-config.json` → `footer` section

#### Dynamic Data
```json
// assets/data/work-data.json - Projects and experience
// assets/data/skills-data.json - Technical skills
// assets/data/hobbies-data.json - Personal interests
```

### 📝 Content Management Examples

#### Update Your Name and Title
```json
{
  "home": {
    "name": "Jane Smith",
    "title": "Senior Software Engineer",
    "subtitle": "Building scalable applications with React and Node.js"
  }
}
```

#### Add New Social Platform
```json
{
  "home": {
    "socialLinks": [
      {
        "platform": "tiktok",
        "url": "https://tiktok.com/@yourhandle",
        "icon": "bx bxl-tiktok",
        "ariaLabel": "TikTok Profile"
      }
    ]
  }
}
```

#### Modify About Section
```json
{
  "about": {
    "stats": [
      { "number": 6, "label": "Years Experience" },
      { "number": 25, "label": "Projects Completed" },
      { "number": 10, "label": "Technologies Mastered" }
    ],
    "mainText": "Your updated professional summary..."
  }
}
```

### Professional Data
```json
// assets/data/work-data.json
{
  "category": "Work Experience",
  "position": "Your Position",
  "company": "Your Company",
  "projects": [...]
}
```

### Skills Configuration
```json
// assets/data/skills-data.json
{
  "professional_skills": {
    "Programming Languages": [
      {
        "name": "Python",
        "level": "Expert",
        "icon": "bx bxl-python"
      }
    ]
  }
}
```

### Styling System
```css
/* Customize CSS variables in styles.css */
:root {
  --primary-500: #4caf50;    /* Primary brand color */
  --font-primary: "Inter";    /* Main typography */
  --space-4: 1rem;           /* Spacing scale */
}
```

## 📊 Project Highlights

### 🏢 Professional Experience
- **Gen Digital**: Real-time transaction normalization, Data Lake design
- **TCS**: PayPal systems optimization, Lynx Framework enhancement
- **NIT Patna**: ML research internship with 90% accuracy achievement

### 🎓 Academic Projects
- **Joint Image Compression & Encryption**: 5.2 compression ratio, 99.69% NPCR
- **CNN Image Classification**: 87.44% training accuracy on CIFAR10
- **YouTube Spam Filter**: 96.21% classification accuracy

### 🌟 Side Projects
- **School Chale Ham**: K-12 education platform (Express.js + MongoDB + Next.js)
- **Bihar COVID Help**: Community resource sharing during pandemic
- **Android Bloatware Guide**: Technical documentation website

## 🔧 Performance Optimization

### Image Optimization
```bash
# Recommended tools
- TinyPNG for compression
- WebP format for modern browsers
- Lazy loading implementation
```

### CSS Optimization
```css
/* Efficient animations using transforms */
.element {
  transform: translateY(0);
  transition: transform 0.3s ease;
}
```

### JavaScript Best Practices
```javascript
// Efficient DOM queries
const elements = document.querySelectorAll('.class');
// Debounced scroll handlers
// Intersection Observer for animations
```

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| IE | 11 | ⚠️ Limited Support |

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Test across multiple browsers
- Optimize images before committing
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material Design 3** for design inspiration
- **ScrollReveal.js** for smooth animations
- **Formspree** for contact form functionality
- **GitHub Pages** for free hosting
- **Open source community** for continuous inspiration

## 📞 Contact & Connect

- **Website**: [smaxiso.github.io](https://smaxiso.github.io)
- **LinkedIn**: [linkedin.com/in/smaxiso](https://linkedin.com/in/smaxiso)
- **GitHub**: [github.com/smaxiso](https://github.com/smaxiso)
- **Email**: sumit749284@gmail.com
- **Medium**: [smaxiso.medium.com](https://smaxiso.medium.com)

---

⭐ **If you find this project helpful, please give it a star!** ⭐

*Built with ❤️ by Sumit Kumar*

---

## 📋 **Complete Template Customization Reference**

*This section provides a comprehensive guide for developers who want to use this portfolio as a template.*

### 🎯 **Template Features**
- **100% Config-Driven**: All content managed through JSON files
- **No HTML Knowledge Required**: Just edit JSON files and replace images
- **Professional Design**: Modern Material Design 3 aesthetics
- **Mobile-First**: Fully responsive across all devices
- **Performance Optimized**: Fast loading with smooth animations

### 📝 **Complete Data File Reference**

#### **1. Main Site Configuration (`site-config.json`)**
Controls all static content including navigation, home section, about section, contact info, and footer.

```json
{
  "meta": {
    "title": "Your Name - Portfolio",
    "description": "Your professional description for SEO",
    "keywords": "your, professional, keywords, here",
    "author": "Your Name"
  },
  "navigation": {
    "logo": "YourName",
    "menuItems": [
      { "href": "#home", "label": "Home" },
      { "href": "#about", "label": "About" },
      { "href": "#skills", "label": "Skills" },
      { "href": "#work", "label": "Work" },
      { "href": "#hobbies", "label": "Hobbies" },
      { "href": "#contact", "label": "Contact" }
    ]
  },
  "home": {
    "greeting": "Hi there! 👋",
    "name": "Your Full Name",
    "title": "Your Professional Title",
    "subtitle": "Your compelling professional description...",
    "profileImage": {
      "src": "assets/img/perfils/your-photo.png",
      "alt": "Your Name - Professional Profile"
    },
    "ctaButtons": [
      {
        "label": "Resume",
        "href": "pages/resume.html",
        "icon": "bx bx-file",
        "type": "primary"
      },
      {
        "label": "Contact Me",
        "href": "#contact",
        "icon": "bx bx-message-dots",
        "type": "secondary"
      }
    ],
    "socialLinks": [
      {
        "platform": "LinkedIn",
        "url": "https://linkedin.com/in/your-profile",
        "icon": "bx bxl-linkedin",
        "ariaLabel": "LinkedIn Profile"
      },
      {
        "platform": "GitHub",
        "url": "https://github.com/your-username",
        "icon": "bx bxl-github",
        "ariaLabel": "GitHub Profile"
      },
      {
        "platform": "Twitter",
        "url": "https://twitter.com/your-handle",
        "icon": "bx bxl-twitter",
        "ariaLabel": "Twitter Profile"
      }
    ]
  },
  "about": {
    "sectionTitle": "About Me",
    "subtitle": "Who I Am",
    "title": "Your Professional Identity",
    "mainText": "Your professional summary and background...",
    "expandableContent": [
      "Detailed background information...",
      "Your career journey and experiences...",
      "What drives your passion for your field..."
    ],
    "image": {
      "src": "assets/img/about/your-about-photo.jpg",
      "alt": "Your Name - About Photo"
    },
    "stats": [
      {
        "icon": "bx bx-briefcase",
        "number": 5,
        "label": "Years Experience"
      },
      {
        "icon": "bx bx-award",
        "number": 20,
        "label": "Projects Completed"
      },
      {
        "icon": "bx bx-happy",
        "number": 50,
        "label": "Happy Clients"
      }
    ],
    "actions": [
      {
        "label": "Download CV",
        "href": "assets/data/your-resume.pdf",
        "icon": "bx bx-download",
        "download": "Your_Name_Resume.pdf"
      }
    ]
  },
  "contact": {
    "sectionTitle": "Get In Touch",
    "form": {
      "action": "https://formspree.io/f/your-form-id",
      "method": "POST"
    },
    "contactInfo": [
      {
        "icon": "bx bx-phone",
        "label": "Phone",
        "value": "+1 (555) 123-4567"
      },
      {
        "icon": "bx bx-envelope",
        "label": "Email",
        "value": "your.email@example.com"
      },
      {
        "icon": "bx bx-map",
        "label": "Location",
        "value": "Your City, Country"
      }
    ]
  },
  "footer": {
    "title": "Your Name",
    "socialLinks": [
      // Same structure as home.socialLinks
    ],
    "copyright": "© 2024 Your Name. All rights reserved."
  }
}
```

#### **2. Skills Configuration (`skills-data.json`)**
Organize your technical skills by categories with proficiency levels.

```json
{
  "professional_skills": {
    "Programming Languages": [
      {
        "name": "Python",
        "icon": "bx bxl-python",
        "level": "Expert"
      },
      {
        "name": "JavaScript",
        "icon": "bx bxl-javascript",
        "level": "Advanced"
      },
      {
        "name": "Java",
        "icon": "bx bxl-java",
        "level": "Intermediate"
      }
    ],
    "Web Technologies": [
      {
        "name": "React",
        "icon": "bx bxl-react",
        "level": "Advanced"
      },
      {
        "name": "Node.js",
        "icon": "bx bxl-nodejs",
        "level": "Advanced"
      }
    ],
    "Cloud Platforms": [
      {
        "name": "AWS",
        "icon": "bx bxl-amazon",
        "level": "Intermediate"
      },
      {
        "name": "GCP",
        "icon": "bx bxl-google-cloud",
        "level": "Intermediate"
      }
    ],
    "Databases": [
      {
        "name": "MySQL",
        "icon": "fas fa-database",
        "level": "Advanced"
      },
      {
        "name": "MongoDB",
        "icon": "fas fa-database",
        "level": "Intermediate"
      }
    ]
  }
}
```

**Skill Levels**: Use `"Beginner"`, `"Intermediate"`, `"Advanced"`, or `"Expert"`

#### **3. Projects/Work Configuration (`work-data.json`)**
Showcase your projects and professional experience.

```json
[
  {
    "title": "Your Amazing Project",
    "subtitle": "Brief project description",
    "description": "Detailed description of what the project does and its impact...",
    "image": "assets/img/work/your-project-screenshot.png",
    "technologies": ["React", "Node.js", "MongoDB", "AWS"],
    "links": [
      {
        "type": "github",
        "url": "https://github.com/your-username/project-repo",
        "label": "View Code"
      },
      {
        "type": "demo",
        "url": "https://your-project-demo.com",
        "label": "Live Demo"
      },
      {
        "type": "article",
        "url": "https://medium.com/@your-username/project-article",
        "label": "Read Article"
      }
    ],
    "details": {
      "overview": "Comprehensive overview of the project, its purpose, and goals...",
      "keyFeatures": [
        "Feature 1: Description of main functionality",
        "Feature 2: Another important feature",
        "Feature 3: Additional capabilities"
      ],
      "technicalHighlights": [
        "Technical achievement 1",
        "Performance improvement details",
        "Architecture decisions and benefits"
      ],
      "impact": "Quantifiable results and impact of the project...",
      "challenges": "Technical challenges faced and how they were overcome...",
      "learnings": "Key takeaways and skills developed during the project..."
    }
  }
]
```

#### **4. Personal Interests (`hobbies-data.json`)**
Share your personality through interests and hobbies.

```json
[
  {
    "name": "Photography",
    "icon": "fas fa-camera",
    "description": "Capturing moments and exploring creative composition"
  },
  {
    "name": "Travel",
    "icon": "fas fa-globe",
    "description": "Exploring new cultures and gaining global perspectives"
  },
  {
    "name": "Cooking",
    "icon": "fas fa-utensils",
    "description": "Experimenting with international cuisines and flavors"
  }
]
```

#### **5. Resume Page Configuration (`resume-config.json`)**
Configure the dedicated resume page (optional but recommended).

```json
{
  "meta": {
    "title": "Resume - Your Name",
    "description": "Your Name's Professional Resume - Your Professional Title"
  },
  "navigation": {
    "logo": "YourName",
    "logoHref": "../index.html",
    "menuItems": [
      { "href": "../index.html#home", "label": "Home" },
      { "href": "../index.html#about", "label": "About" },
      { "href": "../index.html#skills", "label": "Skills" },
      { "href": "../index.html#work", "label": "Work" },
      { "href": "../index.html#contact", "label": "Contact" }
    ]
  },
  "header": {
    "name": "Your Full Name",
    "title": "Your Professional Title | Your Specialization"
  },
  "actions": {
    "buttons": [
      {
        "href": "../assets/data/your-resume.pdf",
        "label": "Download PDF",
        "class": "btn btn-primary",
        "icon": "bx bx-download",
        "download": "Your_Name_Resume.pdf"
      },
      {
        "href": "../assets/data/your-resume.pdf",
        "label": "Open in New Tab",
        "class": "btn btn-outline",
        "icon": "bx bx-external-link",
        "target": "_blank"
      },
      {
        "href": "../index.html",
        "label": "Back to Portfolio",
        "class": "btn btn-secondary",
        "icon": "bx bx-arrow-back"
      }
    ]
  },
  "pdfViewer": {
    "src": "../assets/data/your-resume.pdf#toolbar=1&navpanes=1&scrollbar=1&page=1&zoom=page-fit",
    "title": "Your Name's Professional Resume"
  }
}
```

### 🖼️ **Image Requirements & Recommendations**

#### **Profile Photos**
- **Location**: `assets/img/perfils/`
- **Recommended size**: 400x400px
- **Format**: PNG with transparent background preferred
- **Aspect ratio**: 1:1 (square)
- **File size**: Under 500KB for optimal loading

#### **About Section Photos**  
- **Location**: `assets/img/about/`
- **Recommended size**: 500x600px
- **Format**: JPG or PNG
- **Aspect ratio**: 5:6 (portrait orientation)
- **File size**: Under 800KB

#### **Project Screenshots**
- **Location**: `assets/img/work/`
- **Recommended size**: 800x600px
- **Format**: PNG for UI screenshots, JPG for photos
- **Aspect ratio**: 4:3 or 16:9
- **File size**: Under 1MB each

#### **Resume PDF**
- **Location**: `assets/data/`
- **Format**: PDF
- **File size**: Under 5MB
- **Naming**: Use descriptive names like `Your_Name_Resume.pdf`

### 🎨 **Optional Customizations**

#### **Color Scheme**
Edit CSS variables in `assets/css/styles.css`:

```css
:root {
  /* Primary Colors */
  --primary-500: #your-brand-color;
  --primary-600: #darker-shade;
  
  /* Accent Colors */
  --accent-500: #your-accent-color;
  
  /* Text Colors */
  --text-primary: #your-text-color;
  --text-secondary: #your-secondary-text;
}
```

#### **Typography**
```css
:root {
  --font-primary: "Your-Preferred-Font", sans-serif;
  --font-secondary: "Your-Secondary-Font", serif;
}
```

### 🚀 **Deployment Guide**

#### **GitHub Pages (Recommended)**
1. Repository name: `yourusername.github.io`
2. Push your customized code to `main` branch
3. Go to repository Settings → Pages
4. Source: Deploy from a branch → `main` → `/ (root)`
5. Your site will be live at: `https://yourusername.github.io`

#### **Custom Domain (Optional)**
1. Add `CNAME` file to repository root with your domain
2. Configure DNS with your domain provider
3. Enable "Enforce HTTPS" in GitHub Pages settings

#### **Alternative Hosting**
- **Netlify**: Drag & drop deployment with form handling
- **Vercel**: Git-based deployment with edge optimization  
- **Firebase Hosting**: Google's hosting with CDN
- **Surge.sh**: Simple static hosting for quick demos

### ✅ **Pre-Launch Checklist**

- [ ] **Content Review**
  - [ ] All personal information updated in `site-config.json`
  - [ ] Professional email and contact details correct
  - [ ] Social media links point to your profiles
  - [ ] All project links are working and current

- [ ] **Visual Assets**
  - [ ] Profile photo updated and properly sized
  - [ ] About section photo replaced
  - [ ] All project screenshots updated
  - [ ] Resume PDF uploaded and linked correctly

- [ ] **Technical Testing**
  - [ ] All navigation links work properly
  - [ ] Contact form submits successfully
  - [ ] Mobile responsiveness tested
  - [ ] Page loading speed optimized
  - [ ] All external links open correctly

- [ ] **SEO & Analytics**
  - [ ] Meta descriptions updated
  - [ ] Page titles optimized
  - [ ] Google Analytics added (optional)
  - [ ] Favicon added (optional)

### 🆘 **Common Issues & Solutions**

#### **Images Not Loading**
- Check file paths in JSON configurations
- Ensure image files are in correct directories
- Verify image file names match exactly (case-sensitive)

#### **Contact Form Not Working**
- Set up Formspree account and get form endpoint
- Update form action URL in `site-config.json`
- Test form submission thoroughly

#### **Styling Issues**
- Clear browser cache and reload
- Check for CSS file loading errors in browser console
- Verify all CSS files are in correct locations

#### **GitHub Pages Not Updating**
- Check repository settings for Pages configuration
- Ensure you're pushing to the correct branch (`main`)
- GitHub Pages can take a few minutes to update

### 🎯 **Tips for Success**

1. **Keep Content Concise**: Attention spans are short online
2. **Use Action Words**: Start descriptions with strong verbs
3. **Quantify Achievements**: Include numbers and metrics where possible
4. **Show Personality**: Let your unique voice shine through
5. **Update Regularly**: Keep content fresh and current
6. **Test Everywhere**: Check on different devices and browsers
7. **Get Feedback**: Ask others to review before going live

---

**🎉 Congratulations!** You now have a professional, modern portfolio that's easy to maintain and update. The config-driven approach means you can focus on showcasing your work rather than wrestling with code.

**Need help?** Feel free to [open an issue](https://github.com/smaxiso/smaxiso.github.io/issues) or reach out!