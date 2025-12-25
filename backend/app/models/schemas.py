from sqlalchemy import Column, Integer, String, Text, JSON
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
    projects_completed = Column(Integer)
    
    # Contact
    contact_email = Column(String)
    
    # Footer
    footer_text = Column(String)

