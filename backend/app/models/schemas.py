from sqlalchemy import Column, Integer, String, Text, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    category = Column(String)
    position = Column(String, nullable=True)
    company = Column(String, nullable=True)
    location = Column(String, nullable=True)
    startDate = Column(String, nullable=True)
    endDate = Column(String, nullable=True)
    image = Column(String, nullable=True)
    technologies = Column(JSON) # List of strings
    repository = Column(String, nullable=True)
    website = Column(String, nullable=True)

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True)
    name = Column(String)
    icon = Column(String)
    level = Column(String, nullable=True)

class Hobby(Base):
    __tablename__ = "hobbies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    icon = Column(String)
    description = Column(String)
    link = Column(String, nullable=True)

class SocialLink(Base):
    __tablename__ = "social_links"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, unique=True, index=True) # e.g. "linkedin"
    url = Column(String)
    icon = Column(String) # e.g. "bx bxl-linkedin"
    is_active = Column(Integer, default=1) # using Integer 0/1 for SQLite/Postgres compatibility

class SiteConfig(Base):
    __tablename__ = "site_config"
    
    id = Column(Integer, primary_key=True) # Singleton: always 1
    
    # Meta / SEO
    site_title = Column(String)
    site_description = Column(Text)
    site_author = Column(String)
    site_url = Column(String)
    
    # Home / Hero
    greeting = Column(String)
    name = Column(String)
    title = Column(String)
    subtitle = Column(Text)
    profile_image = Column(String)
    
    # About
    about_title = Column(String)
    about_description = Column(Text)
    about_image = Column(String)
    resume_url = Column(String)
    years_experience = Column(Integer)
    experience_months = Column(Integer, default=0)
    projects_completed = Column(Integer)
    
    # Contact
    contact_email = Column(String)
    
    # Work Status
    show_work_badge = Column(Boolean, default=True)
    
    # Footer
    footer_text = Column(String)

class ResumeFile(Base):
    __tablename__ = "resume_files"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String) # e.g. "Data Engineer Resume 2024"
    url = Column(String)
    is_active = Column(Integer, default=0)
    created_at = Column(String, nullable=True) # Optional: could be datetime

class GuestbookEntry(Base):
    __tablename__ = "guestbook"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    message = Column(Text)
    approved = Column(Integer, default=0) # 0=Pending, 1=Approved
    created_at = Column(String) # ISO timestamp

class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    slug = Column(String, unique=True, index=True)
    content = Column(Text) # Markdown content
    excerpt = Column(String)
    tags = Column(String) # JSON or comma-separated
    cover_image = Column(String, nullable=True)
    published = Column(Boolean, default=False)
    created_at = Column(String) # ISO timestamp
    updated_at = Column(String, nullable=True) # ISO timestamp used for "Last Updated"

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, index=True, nullable=False)
    company_logo = Column(String, nullable=True)  # URL or Cloudinary public_id
    title = Column(String, nullable=False)  # Job title
    start_date = Column(String, nullable=False)  # YYYY-MM format
    end_date = Column(String, nullable=True)  # YYYY-MM format, null if current
    description = Column(Text, nullable=True)
    technologies = Column(JSON, nullable=True)  # List of strings
    order = Column(Integer, default=0)  # For custom ordering (lower = shown first)
