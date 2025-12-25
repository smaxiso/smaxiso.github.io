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

# Social Link Models
class SocialLinkBase(BaseModel):
    platform: str
    url: str
    icon: str
    is_active: bool = True

class SocialLinkCreate(SocialLinkBase):
    pass

class SocialLink(SocialLinkBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# Site Config Models
class SiteConfigBase(BaseModel):
    site_title: str
    site_description: str
    site_author: str
    site_url: str
    greeting: str
    name: str
    title: str
    subtitle: str
    profile_image: str
    about_title: str
    about_description: str
    about_image: str
    resume_url: str
    years_experience: int
    projects_completed: int
    contact_email: str
    footer_text: str

class SiteConfigUpdate(SiteConfigBase):
    pass

class SiteConfig(SiteConfigBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# Resume Models
class ResumeBase(BaseModel):
    name: str
    url: str
    is_active: bool = False

class ResumeCreate(ResumeBase):
    pass

class ResumeFile(ResumeBase):
    id: int
    created_at: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


