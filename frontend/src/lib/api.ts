import { Project, Skill, Hobby, GuestbookEntry, BlogPost, Experience } from "@/types";
import { getAuth } from "firebase/auth";

export interface MediaResource {
    public_id: string;
    url: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    created_at: string;
    status: "active" | "orphaned";
    usage: string[];
}

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
            'Authorization': `Bearer ${token}`
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
            'Authorization': `Bearer ${token}`
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
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to delete project');
}

// Skill CRUD
export async function createSkill(skill: Partial<Skill>, token: string): Promise<Skill> {
    const res = await fetch(`${API_URL}/skills/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(skill),
    });
    if (!res.ok) throw new Error('Failed to create skill');
    return res.json();
}

export async function updateSkill(id: number, skill: Partial<Skill>, token: string): Promise<Skill> {
    const res = await fetch(`${API_URL}/skills/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(skill),
    });
    if (!res.ok) throw new Error('Failed to update skill');
    return res.json();
}

export async function deleteSkill(id: number, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/skills/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to delete skill');
}

// Guestbook CRUD
export async function getGuestbookEntries(limit = 50): Promise<GuestbookEntry[]> {
    const res = await fetch(`${API_URL}/guestbook?limit=${limit}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch guestbook');
    return res.json();
}

export async function submitGuestbookEntry(entry: { name: string, message: string }): Promise<GuestbookEntry> {
    const res = await fetch(`${API_URL}/guestbook/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
    });
    if (!res.ok) throw new Error('Failed to submit entry');
    return res.json();
}



// Blog
export async function getPublishedPosts(): Promise<BlogPost[]> {
    const res = await fetch(`${API_URL}/blog/`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
    const res = await fetch(`${API_URL}/blog/${slug}`, { cache: 'no-store' });
    if (!res.ok) {
        if (res.status === 404) return null as any; // Handle 404 gracefully in component
        throw new Error('Failed to fetch post');
    }
    return res.json();
}

export async function getAllPosts(): Promise<BlogPost[]> {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch(`${API_URL}/blog/admin/all`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch all posts');
    return res.json();
}

export async function createPost(post: Omit<BlogPost, 'id' | 'created_at'>): Promise<BlogPost> {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch(`${API_URL}/blog/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(post),
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
}

export async function updatePost(id: number, post: Omit<BlogPost, 'id' | 'created_at'>): Promise<BlogPost> {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch(`${API_URL}/blog/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(post),
    });
    if (!res.ok) throw new Error('Failed to update post');
    return res.json();
}

export async function deletePost(id: number): Promise<void> {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch(`${API_URL}/blog/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to delete post');
}

// Admin Guestbook
export async function getAllGuestbookEntries(token: string): Promise<GuestbookEntry[]> {
    const res = await fetch(`${API_URL}/guestbook/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch all entries');
    return res.json();
}

export async function approveGuestbookEntry(id: number, token: string): Promise<GuestbookEntry> {
    const res = await fetch(`${API_URL}/guestbook/${id}/approve`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to approve entry');
    return res.json();
}

export async function deleteGuestbookEntry(id: number, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/guestbook/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to delete entry');
}

// Media
export async function auditMedia(token: string): Promise<MediaResource[]> {
    const res = await fetch(`${API_URL}/media/audit`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to audit media');
    return res.json();
}

export async function deleteMedia(public_id: string, token: string): Promise<void> {
    // public_id can contain slashes, which might mess up URL params.
    // However, API is defined as /{public_id:path} so it should consume the rest of the path.
    // IMPORTANT: fetch handles URL encoding, but path param handling might need care.
    // If public_id is "folder/image", URL becomes .../media/folder/image.
    // FastAPI path param will capture "folder/image".
    const res = await fetch(`${API_URL}/media/${public_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete media');
}

// Experience CRUD
export async function getExperiences(): Promise<Experience[]> {
    const res = await fetch(`${API_URL}/experience/`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch experiences');
    return res.json();
}

export async function createExperience(experience: Omit<Experience, 'id'>, token: string): Promise<Experience> {
    const res = await fetch(`${API_URL}/experience/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(experience),
    });
    if (!res.ok) throw new Error('Failed to create experience');
    return res.json();
}

export async function updateExperience(id: number, experience: Omit<Experience, 'id'>, token: string): Promise<Experience> {
    const res = await fetch(`${API_URL}/experience/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(experience),
    });
    if (!res.ok) throw new Error('Failed to update experience');
    return res.json();
}

export async function deleteExperience(id: number, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/experience/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to delete experience');
}
