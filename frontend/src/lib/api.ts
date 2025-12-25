import { Project, Skill, Hobby } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export async function getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_URL}/projects`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
}

export async function getSkills(): Promise<Skill[]> {
    const res = await fetch(`${API_URL}/skills`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
}

// Project CRUD
export async function createProject(project: Partial<Project>, token: string): Promise<Project> {
    const res = await fetch(`${API_URL}/projects/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}` // Backend needs update to accept this
        },
        body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
}

export async function updateProject(id: string, project: Partial<Project>, token: string): Promise<Project> {
    const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
}

export async function deleteProject(id: string, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: {
            // 'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to delete project');
}
