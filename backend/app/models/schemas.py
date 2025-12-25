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
