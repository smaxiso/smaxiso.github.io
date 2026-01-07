import { Project, Skill, Hobby, GuestbookEntry, BlogPost, Experience } from "@/types";
import { getAuth } from "firebase/auth";

export interface SiteConfig {
    id: number;
    site_title: string;
    site_description: string;
    site_author: string;
    site_url: string;
    greeting: string;
    name: string;
    title: string;
    subtitle: string;
    profile_image: string;
    about_title: string;
    about_description: string;
    about_image: string;
    resume_url: string;
    years_experience: number;
    experience_months: number;
    projects_completed: number;
    contact_email: string;
    show_work_badge: boolean;
    footer_text: string;
}

export interface SocialLink {
    id: number;
    platform: string;
    url: string;
    icon: string;
    is_active: boolean;
}

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
const BACKUP_API_URL = process.env.NEXT_PUBLIC_BACKUP_API_URL;

async function fetchWithFailover(path: string, options?: RequestInit) {
    // 1. Try Primary
    try {
        const primaryUrl = `${API_URL}${path}`;
        const res = await fetch(primaryUrl, options);
        // If 503 (Render suspended) or network error, verify ok
        if (res.ok) return res;
        // If 5xx error, treat as failure and try backup
        if (res.status >= 500) throw new Error(`Primary API Error: ${res.status}`);
        return res; // 4xx errors are valid application responses (e.g. 404)
    } catch (error) {
        // 2. Try Backup if configured
        if (BACKUP_API_URL) {
            console.warn(`Primary API failed (${error}), switching to backup: ${BACKUP_API_URL}`);
            const backupUrl = `${BACKUP_API_URL}${path}`;
            return fetch(backupUrl, options);
        }
        throw error; // No backup, rethrow
    }
}


export async function getConfig(): Promise<SiteConfig> {
    const res = await fetchWithFailover(`/config`);
    if (!res.ok) throw new Error('Failed to fetch config');
    return res.json();
}

export async function getSocials(): Promise<SocialLink[]> {
    const res = await fetchWithFailover(`/socials`);
    if (!res.ok) throw new Error('Failed to fetch socials');
    return res.json();
}

export async function updateConfig(config: Partial<SiteConfig>, token: string): Promise<SiteConfig> {
    const res = await fetchWithFailover(`/config`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.detail) throw new Error(typeof errorData.detail === 'string' ? errorData.detail : 'Validation error');
        throw new Error('Failed to update config');
    }
    return res.json();
}


export async function createSocial(social: Partial<SocialLink>, token: string): Promise<SocialLink> {
    const res = await fetchWithFailover(`/socials/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(social),
    });
    if (!res.ok) throw new Error('Failed to create social link');
    return res.json();
}

export async function updateSocial(id: number, social: Partial<SocialLink>, token: string): Promise<SocialLink> {
    const res = await fetchWithFailover(`/socials/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(social),
    });
    if (!res.ok) throw new Error('Failed to update social link');
    return res.json();
}

export async function deleteSocial(id: number, token: string): Promise<void> {
    const res = await fetchWithFailover(`/socials/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to delete social link');
}

export async function getProjects(): Promise<Project[]> {
    const res = await fetchWithFailover(`/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
}

export async function getSkills(): Promise<Skill[]> {
    const res = await fetchWithFailover(`/skills`);
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
}

// Project CRUD
export async function createProject(project: Partial<Project>, token: string): Promise<Project> {
    const res = await fetchWithFailover(`/projects/`, {
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
    const res = await fetchWithFailover(`/projects/${id}`, {
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
    const res = await fetchWithFailover(`/projects/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to delete project');
}

// Skill CRUD
export async function createSkill(skill: Partial<Skill>, token: string): Promise<Skill> {
    const res = await fetchWithFailover(`/skills/`, {
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
    const res = await fetchWithFailover(`/skills/${id}`, {
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
    const res = await fetchWithFailover(`/skills/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to delete skill');
}

// Guestbook CRUD
export async function getGuestbookEntries(limit = 50): Promise<GuestbookEntry[]> {
    const res = await fetchWithFailover(`/guestbook?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch guestbook');
    return res.json();
}

export async function submitGuestbookEntry(entry: { name: string, message: string }): Promise<GuestbookEntry> {
    const res = await fetchWithFailover(`/guestbook/`, {
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
    const res = await fetchWithFailover(`/blog/`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
    const res = await fetchWithFailover(`/blog/${slug}`);
    if (!res.ok) {
        if (res.status === 404) return null as any; // Handle 404 gracefully in component
        throw new Error('Failed to fetch post');
    }
    return res.json();
}

export async function getAllPosts(): Promise<BlogPost[]> {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();
    const res = await fetchWithFailover(`/blog/admin/all`, {
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
    const res = await fetchWithFailover(`/blog/`, {
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
    const res = await fetchWithFailover(`/blog/${id}`, {
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
    const res = await fetchWithFailover(`/blog/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to delete post');
}

// Admin Guestbook
export async function getAllGuestbookEntries(token: string): Promise<GuestbookEntry[]> {
    const res = await fetchWithFailover(`/guestbook/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch all entries');
    return res.json();
}

export async function approveGuestbookEntry(id: number, token: string): Promise<GuestbookEntry> {
    const res = await fetchWithFailover(`/guestbook/${id}/approve`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to approve entry');
    return res.json();
}

export async function deleteGuestbookEntry(id: number, token: string): Promise<void> {
    const res = await fetchWithFailover(`/guestbook/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to delete entry');
}

// Media
export async function auditMedia(token: string): Promise<MediaResource[]> {
    const res = await fetchWithFailover(`/media/audit`, {
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
    const res = await fetchWithFailover(`/media/${public_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to delete media');
}

// Experience CRUD
export async function getExperiences(): Promise<Experience[]> {
    const res = await fetchWithFailover(`/experience/`);
    if (!res.ok) throw new Error('Failed to fetch experiences');
    return res.json();
}

export async function createExperience(experience: Omit<Experience, 'id'>, token: string): Promise<Experience> {
    const res = await fetchWithFailover(`/experience/`, {
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
    const res = await fetchWithFailover(`/experience/${id}`, {
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
    const res = await fetchWithFailover(`/experience/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to delete experience');
}
