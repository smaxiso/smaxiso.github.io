'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BlogPost } from '@/types';
import { getAllPosts, createPost, updatePost, deletePost } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { uploadFile } from '@/lib/cloudinary';
import { Trash2, Edit, Plus, FileText, Check, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export function BlogEditor() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { token } = useAuth();

    // State Hooks - MUST be first
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

    // Initial State
    const initialPostState: Partial<BlogPost> = {
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        tags: '',
        cover_image: '',
        published: false
    };

    const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>(initialPostState);
    const [originalPost, setOriginalPost] = useState<Partial<BlogPost>>(initialPostState);

    // Derived State
    const hasChanges = JSON.stringify(currentPost) !== JSON.stringify(originalPost);

    const filteredPosts = posts
        .filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.slug.includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'newest') return b.created_at.localeCompare(a.created_at);
            if (sortBy === 'oldest') return a.created_at.localeCompare(b.created_at);
            return a.title.localeCompare(b.title);
        });

    // Effects
    useEffect(() => {
        if (token) fetchPosts();
    }, [token]);

    useEffect(() => {
        const mode = searchParams.get('mode');
        if (mode === 'editor') {
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    }, [searchParams]);

    const fetchPosts = async () => {
        try {
            const data = await getAllPosts();
            setPosts(data);
        } catch (error) {
            toast.error('Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    };

    const openEditor = (post?: BlogPost) => {
        const postToEdit = post || initialPostState;
        setCurrentPost(postToEdit);
        setOriginalPost(postToEdit);
        router.push('?mode=editor');
    };

    const closeEditor = () => {
        router.back();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);
        try {
            const downloadURL = await uploadFile(file);
            setCurrentPost(prev => ({ ...prev, cover_image: downloadURL }));
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hasChanges) return;

        setSaving(true);
        try {
            if (!currentPost.title || !currentPost.slug || !currentPost.content) {
                toast.error('Please fill required fields (Title, Slug, Content)');
                setSaving(false);
                return;
            }

            const postData = {
                title: currentPost.title,
                slug: currentPost.slug,
                content: currentPost.content,
                excerpt: currentPost.excerpt || '',
                tags: currentPost.tags || '',
                cover_image: currentPost.cover_image || null,
                published: currentPost.published || false
            };

            if (currentPost.id) {
                await updatePost(currentPost.id, postData as any);
                toast.success('Post updated!');
            } else {
                await createPost(postData as any);
                toast.success('Post created!');
            }

            closeEditor();
            await fetchPosts();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to save post');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            await deletePost(id);
            toast.success('Post deleted');
            fetchPosts();
        } catch (error) {
            toast.error('Failed to delete post');
        }
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    // Render Logic - Conditional Returns happen AFTER all hooks
    if (loading) return <div>Loading posts...</div>;

    if (isEditing) {
        return (
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm relative animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{currentPost.id ? 'Edit Post' : 'New Post'}</h2>
                    <button
                        onClick={closeEditor}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                value={currentPost.title}
                                onChange={(e) => {
                                    const newTitle = e.target.value;
                                    setCurrentPost(prev => {
                                        const shouldUpdateSlug = !prev.slug || prev.slug === generateSlug(prev.title || '');
                                        return {
                                            ...prev,
                                            title: newTitle,
                                            slug: shouldUpdateSlug ? generateSlug(newTitle) : prev.slug
                                        };
                                    });
                                }}
                                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                            <input
                                type="text"
                                value={currentPost.slug}
                                onChange={(e) => setCurrentPost(prev => ({ ...prev, slug: e.target.value }))}
                                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                        <div
                            className={`flex gap-2 p-2 rounded-lg border-2 border-dashed transition-colors ${uploading ? 'bg-blue-50 border-blue-300' : 'border-slate-300 hover:border-blue-400'}`}
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            onDrop={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    const file = e.dataTransfer.files[0];
                                    setUploading(true);
                                    try {
                                        const downloadURL = await uploadFile(file);
                                        setCurrentPost(prev => ({ ...prev, cover_image: downloadURL }));
                                        toast.success("Image uploaded!");
                                    } catch (err) {
                                        console.error(err);
                                        toast.error('Failed to upload image');
                                    } finally {
                                        setUploading(false);
                                    }
                                }
                            }}
                        >
                            <input
                                type="text"
                                value={currentPost.cover_image || ''}
                                onChange={(e) => setCurrentPost(prev => ({ ...prev, cover_image: e.target.value }))}
                                className="flex-1 p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="https://... or Drag & Drop Image Here"
                            />
                            <label className={`cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg px-4 py-2 flex items-center justify-center transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <span className="text-sm font-medium text-slate-600 whitespace-nowrap">{uploading ? 'Uploading...' : 'Upload'}</span>
                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" disabled={uploading} />
                            </label>
                        </div>
                        {currentPost.cover_image && (
                            <div className="mt-3 relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
                                <img
                                    src={currentPost.cover_image}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setCurrentPost(prev => ({ ...prev, cover_image: '' }))}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove Image"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={currentPost.tags || ''}
                            onChange={(e) => setCurrentPost(prev => ({ ...prev, tags: e.target.value }))}
                            className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="React, Next.js, Engineering"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Excerpt</label>
                        <textarea
                            value={currentPost.excerpt || ''}
                            onChange={(e) => setCurrentPost(prev => ({ ...prev, excerpt: e.target.value }))}
                            className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none h-20"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium">Content (Markdown)</label>
                            <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Markdown Cheat Sheet</a>
                        </div>
                        <textarea
                            value={currentPost.content || ''}
                            onChange={(e) => setCurrentPost(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none h-96 font-mono text-sm"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={currentPost.published}
                            onChange={(e) => setCurrentPost(prev => ({ ...prev, published: e.target.checked }))}
                            id="published"
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="published" className="text-sm font-medium text-slate-700">Publish immediately</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={closeEditor}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!hasChanges && !uploading && !saving}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-all shadow-sm flex items-center gap-2 font-medium ${(!hasChanges || uploading || saving) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-md active:scale-95'}`}
                        >
                            {uploading ? (
                                <><span>Uploading...</span></>
                            ) : saving ? (
                                <><span>Saving...</span></>
                            ) : (
                                <><Check size={18} /><span>Save Post</span></>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/40 p-4 rounded-xl border border-white/50 backdrop-blur-sm gap-4">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900">Blog Posts</h2>
                    <p className="text-slate-500 text-sm">{filteredPosts.length} posts found</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm w-full sm:w-48"
                    />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title">Title A-Z</option>
                    </select>
                    <button
                        onClick={() => openEditor()}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all text-sm font-medium whitespace-nowrap"
                    >
                        <Plus size={18} />
                        New Post
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredPosts.map((post) => (
                    <div key={post.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white/60 hover:bg-white/80 rounded-xl border border-white/60 scroll-smooth hover:shadow-md transition-all gap-3 sm:gap-0">
                        <div className="flex-1 min-w-0 w-full sm:w-auto sm:mr-4">
                            <div className="flex items-center flex-wrap gap-2 mb-1">
                                <FileText size={18} className="text-slate-400 shrink-0" />
                                <h3 className="font-bold text-slate-800 break-words text-sm sm:text-base leading-tight">{post.title}</h3>
                                {post.published ? (
                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium border border-green-200 shrink-0">
                                        Published
                                    </span>
                                ) : (
                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium border border-amber-200 shrink-0">
                                        Draft
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-slate-500 font-mono">
                                <span className="truncate">/{post.slug}</span>
                                <span className="hidden sm:inline text-slate-300">•</span>
                                <span title={post.created_at}>
                                    {new Date(post.created_at.endsWith('Z') ? post.created_at : `${post.created_at}Z`).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 w-full sm:w-auto opacity-100 transition-opacity">
                            <a
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                title="View Live"
                            >
                                <Eye size={18} />
                            </a>
                            <button
                                onClick={() => openEditor(post)}
                                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                                title="Edit"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(post.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredPosts.length === 0 && (
                    <div className="text-center py-12 text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
                        {searchQuery ? 'No posts match your search.' : 'No blog posts found. Create your first one!'}
                    </div>
                )}
            </div>
        </div>
    );
}
