'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/api';
import { Project } from '@/types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export default function AdminPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/admin/login');
            } else {
                fetchData();
            }
        }
    }, [user, authLoading, router]);

    const fetchData = async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            setError('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProject) return;

        try {
            // Need token for auth if backend enforces it. passing 'mock' for now or user.accessToken
            const token = await user?.getIdToken() || '';

            if (editingProject.id && projects.some(p => p.id === editingProject.id)) {
                // Update
                await updateProject(editingProject.id, editingProject, token);
            } else {
                // Create
                // Ensure ID is present or backend generates it. Backend expects ID in body for now? 
                // schema says ID is string. User should provide or we generate.
                if (!editingProject.id) editingProject.id = editingProject.title?.toLowerCase().replace(/\s+/g, '-');
                await createProject(editingProject, token);
            }
            setEditingProject(null);
            fetchData();
        } catch (err) {
            setError('Failed to save project');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const token = await user?.getIdToken() || '';
            await deleteProject(id, token);
            fetchData();
        } catch (err) {
            setError('Failed to delete project');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);
        try {
            const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setEditingProject(prev => prev ? ({ ...prev, image: downloadURL }) : null);
        } catch (err) {
            console.error(err);
            setError('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    if (authLoading || loading) return <div className="p-10">Loading...</div>;

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex gap-4">
                    <span className="text-sm text-slate-500 self-center">Welcome, {user?.email}</span>
                    <button onClick={() => logout()} className="text-red-500 hover:text-red-700">Logout</button>
                </div>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

            {editingProject ? (
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold mb-4">{editingProject.id ? 'Edit Project' : 'New Project'}</h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">ID (Unique)</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={editingProject.id || ''}
                                    onChange={e => setEditingProject({ ...editingProject, id: e.target.value })}
                                    disabled={!!(editingProject.id && projects.some(p => p.id === editingProject.id))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={editingProject.title || ''}
                                    onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                className="w-full border p-2 rounded"
                                rows={4}
                                value={editingProject.description || ''}
                                onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={editingProject.category || ''}
                                    onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Image URL</label>
                                <div className="flex gap-2">
                                    <input
                                        className="w-full border p-2 rounded"
                                        value={editingProject.image || ''}
                                        onChange={e => setEditingProject({ ...editingProject, image: e.target.value })}
                                        placeholder="https://..."
                                    />
                                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border rounded px-3 py-2 flex items-center justify-center">
                                        <i className='bx bx-upload'></i>
                                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                    </label>
                                </div>
                                {uploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Technologies (comma separated)</label>
                            <input
                                className="w-full border p-2 rounded"
                                value={editingProject.technologies?.join(', ') || ''}
                                onChange={e => setEditingProject({ ...editingProject, technologies: e.target.value.split(',').map(s => s.trim()) })}
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2 text-slate-600 hover:text-slate-800">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Project</button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Projects</h2>
                        <button
                            onClick={() => setEditingProject({ technologies: [] })}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                        >
                            <i className='bx bx-plus'></i> Add Project
                        </button>
                    </div>
                    <div className="grid gap-4">
                        {projects.map(project => (
                            <div key={project.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded overflow-hidden relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={project.image?.startsWith('http') ? project.image : `/${project.image}`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{project.title}</h3>
                                        <p className="text-sm text-slate-500">{project.category}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingProject(project)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                        <i className='bx bx-edit text-xl'></i>
                                    </button>
                                    <button onClick={() => handleDelete(project.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                        <i className='bx bx-trash text-xl'></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
