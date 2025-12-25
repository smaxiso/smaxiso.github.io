from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class ProjectBase(BaseModel):
    id: str
    title: str
    description: str
    category: str
    position: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    image: Optional[str] = None
    technologies: List[str]
    repository: Optional[str] = None
    website: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    model_config = ConfigDict(from_attributes=True)

class SkillBase(BaseModel):
    category: str
    name: str
    icon: str
    level: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class HobbyBase(BaseModel):
    name: str
    icon: str
    description: str
    link: Optional[str] = None

class HobbyCreate(HobbyBase):
    pass

class Hobby(HobbyBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
