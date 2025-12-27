'use client';

import { useState, useEffect } from 'react';
import { BlogPost } from '@/types';
import { getAllPosts, createPost, updatePost, deletePost } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Trash2, Edit, Plus, FileText, Check, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export function BlogEditor() {
    const { token } = useAuth();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        tags: '',
        cover_image: '',
        published: false
    });

    useEffect(() => {
        if (token) fetchPosts();
    }, [token]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!currentPost.title || !currentPost.slug || !currentPost.content) {
                toast.error('Please fill required fields (Title, Slug, Content)');
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

            if (isEditing && currentPost.id) {
                await updatePost(currentPost.id, postData as any);
                toast.success('Post updated!');
            } else {
                await createPost(postData as any);
                toast.success('Post created!');
            }

            setIsEditing(false);
            setCurrentPost({
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                tags: '',
                cover_image: '',
                published: false
            });
            fetchPosts();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to save post');
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

    const handleEdit = (post: BlogPost) => {
        setCurrentPost(post);
        setIsEditing(true);
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    if (loading) return <div>Loading posts...</div>;

    if (isEditing) {
        return (
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{currentPost.id ? 'Edit Post' : 'New Post'}</h2>
                    <button
                        onClick={() => setIsEditing(false)}
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
                                    setCurrentPost(prev => ({
                                        ...prev,
                                        title: e.target.value,
                                        // Auto-generate slug if new post
                                        slug: !currentPost.id ? generateSlug(e.target.value) : prev.slug
                                    }));
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
                        <input
                            type="text"
                            value={currentPost.cover_image || ''}
                            onChange={(e) => setCurrentPost(prev => ({ ...prev, cover_image: e.target.value }))}
                            className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="https://..."
                        />
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

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                        >
                            <Check size={18} />
                            Save Post
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/40 p-4 rounded-xl border border-white/50 backdrop-blur-sm">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900">Blog Posts</h2>
                    <p className="text-slate-500 text-sm">{posts.length} posts found</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentPost({ title: '', slug: '', excerpt: '', content: '', tags: '', cover_image: '', published: false });
                        setIsEditing(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all text-sm font-medium"
                >
                    <Plus size={18} />
                    New Post
                </button>
            </div>

            <div className="grid gap-4">
                {posts.map((post) => (
                    <div key={post.id} className="group flex items-center justify-between p-4 bg-white/60 hover:bg-white/80 rounded-xl border border-white/60 scroll-smooth hover:shadow-md transition-all">
                        <div className="flex-1 min-w-0 mr-4">
                            <div className="flex items-center gap-2 mb-1">
                                <FileText size={18} className="text-slate-400" />
                                <h3 className="font-bold text-slate-800 truncate">{post.title}</h3>
                                {post.published ? (
                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium border border-green-200">
                                        Published
                                    </span>
                                ) : (
                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium border border-amber-200">
                                        Draft
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 font-mono">/{post.slug}</p>
                        </div>

                        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <a
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Live"
                            >
                                <Eye size={18} />
                            </a>
                            <button
                                onClick={() => handleEdit(post)}
                                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(post.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="text-center py-12 text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
                        No blog posts found. Create your first one!
                    </div>
                )}
            </div>
        </div>
    );
}
