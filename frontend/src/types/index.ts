export interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    position?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    image?: string;
    technologies: string[];
    repository?: string;
    website?: string;
}

export interface Skill {
    id: number;
    category: string;
    name: string;
    icon: string;
    level?: string;
}

export interface Hobby {
    id: number;
    name: string;
    icon: string;
    description: string;
    link?: string;
}
