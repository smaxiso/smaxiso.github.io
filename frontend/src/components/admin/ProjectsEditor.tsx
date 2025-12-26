'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/api';
import { Project } from '@/types';
import { uploadFile } from '@/lib/cloudinary';

export function ProjectsEditor() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
    const [originalProject, setOriginalProject] = useState<Partial<Project> | null>(null);
    const [uploading, setUploading] = useState(false);

    const hasChanges = editingProject && originalProject && JSON.stringify(editingProject) !== JSON.stringify(originalProject);

    useEffect(() => {
        fetchData();
    }, []);

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
            const token = await user?.getIdToken() || '';
            if (editingProject.id && projects.some(p => p.id === editingProject.id)) {
                await updateProject(editingProject.id, editingProject, token);
            } else {
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
            const downloadURL = await uploadFile(file);
            setEditingProject(prev => prev ? ({ ...prev, image: downloadURL }) : null);
        } catch (err) {
            console.error(err);
            setError('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="p-4 text-center">Loading projects...</div>;

    return (
        <div className="space-y-4 sm:space-y-6">
            {error && <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded text-sm">{error}</div>}

            {editingProject ? (
                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-lg border">
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{editingProject.id ? 'Edit Project' : 'New Project'}</h2>
                    <form onSubmit={handleSave} className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="col-span-1 sm:col-span-1">
                                <label className="block text-xs sm:text-sm font-medium mb-1">ID</label>
                                <input
                                    className="w-full border p-2 rounded text-sm"
                                    value={editingProject.id || ''}
                                    onChange={e => setEditingProject({ ...editingProject, id: e.target.value })}
                                    disabled={!!(editingProject.id && projects.some(p => p.id === editingProject.id))}
                                />
                            </div>
                            <div className="col-span-1 sm:col-span-1">
                                <label className="block text-xs sm:text-sm font-medium mb-1">Title</label>
                                <input
                                    className="w-full border p-2 rounded text-sm"
                                    value={editingProject.title || ''}
                                    onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium mb-1">Description</label>
                            <textarea
                                className="w-full border p-2 rounded text-sm"
                                rows={4}
                                value={editingProject.description || ''}
                                onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium mb-1">Category</label>
                                <input
                                    className="w-full border p-2 rounded text-sm"
                                    value={editingProject.category || ''}
                                    onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium mb-1">Image URL</label>
                                <div className="flex gap-1 sm:gap-2">
                                    <input
                                        className="w-full border p-2 rounded text-sm"
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
                            <label className="block text-xs sm:text-sm font-medium mb-1">Technologies (comma separated)</label>
                            <input
                                className="w-full border p-2 rounded text-sm"
                                value={editingProject.technologies?.join(', ') || ''}
                                onChange={e => setEditingProject({ ...editingProject, technologies: e.target.value.split(',').map(s => s.trim()) })}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium mb-1">Live URL</label>
                                <input className="w-full border p-2 rounded text-sm" value={editingProject.website || ''} onChange={e => setEditingProject({ ...editingProject, website: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium mb-1">GitHub URL</label>
                                <input className="w-full border p-2 rounded text-sm" value={editingProject.repository || ''} onChange={e => setEditingProject({ ...editingProject, repository: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
                            <button type="button" onClick={() => { setEditingProject(null); setOriginalProject(null); }} className="w-full sm:w-auto px-4 py-2 text-slate-600 hover:text-slate-800 border border-slate-300 rounded">Cancel</button>
                            {hasChanges && (
                                <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 animate-in fade-in slide-in-from-right-2 duration-200">
                                    Save Project
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <h2 className="text-lg sm:text-xl font-semibold">All Projects</h2>
                        <button
                            onClick={() => {
                                const newProj = { technologies: [] };
                                setEditingProject(newProj);
                                setOriginalProject(newProj);
                            }}
                            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2 text-sm"
                        >
                            <i className='bx bx-plus'></i> Add Project
                        </button>
                    </div>
                    <div className="grid gap-3 sm:gap-4">
                        {projects.map(project => (
                            <div key={project.id} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 overflow-hidden">
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded overflow-hidden relative flex-shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={project.image?.startsWith('http') ? project.image : `/${project.image}`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0 overflow-hidden">
                                        <h3 className="font-bold text-sm sm:text-base truncate break-all">{project.title}</h3>
                                        <p className="text-xs sm:text-sm text-slate-500 truncate">{project.category}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between sm:justify-end gap-2 sm:gap-2 flex-shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 mt-1 sm:mt-0">
                                    <button onClick={() => { setEditingProject(project); setOriginalProject(project); }} className="flex-1 sm:flex-none flex items-center justify-center gap-1 p-2 text-blue-600 hover:bg-blue-50 rounded border sm:border-0 border-blue-100">
                                        <i className='bx bx-edit text-xl'></i>
                                        <span className="sm:hidden text-xs font-medium">Edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(project.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-1 p-2 text-red-600 hover:bg-red-50 rounded border sm:border-0 border-red-100">
                                        <i className='bx bx-trash text-xl'></i>
                                        <span className="sm:hidden text-xs font-medium">Delete</span>
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
