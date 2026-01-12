'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BlogPost } from '@/types';
import { getAllPosts, createPost, updatePost, deletePost } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { uploadFile } from '@/lib/cloudinary';
import { Trash2, Edit, Plus, FileText, Check, X, Eye, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCallback } from 'react';
import debounce from 'lodash.debounce';

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

    // Slug validation state
    const [slugValidation, setSlugValidation] = useState<{
        checking: boolean;
        isDuplicate: boolean;
        message: string;
    }>({
        checking: false,
        isDuplicate: false,
        message: ''
    });

    // Track if slug was manually edited (to prevent auto-overwrite)
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

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

    // Restore State from URL & LocalStorage
    useEffect(() => {
        const mode = searchParams.get('mode');
        const idParam = searchParams.get('id');

        if (mode === 'editor') {
            setIsEditing(true);

            // If we have posts loaded, try to find the post
            if (posts.length > 0 || idParam === 'new') {
                const draftKey = `blog_draft_${idParam || 'new'}`;
                const savedDraft = localStorage.getItem(draftKey);

                let basePost = initialPostState;

                if (idParam && idParam !== 'new') {
                    const found = posts.find(p => p.id === parseInt(idParam));
                    if (found) basePost = found;
                }

                // Conflict Resolution: Draft > DB
                if (savedDraft) {
                    try {
                        const parsed = JSON.parse(savedDraft);
                        setCurrentPost(parsed);
                        if (JSON.stringify(parsed) !== JSON.stringify(basePost)) {
                            toast('Restored unsaved draft', { icon: '📂' });
                        }
                    } catch (e) {
                        setCurrentPost(basePost);
                    }
                } else {
                    setCurrentPost(basePost);
                }

                setOriginalPost(basePost);
            }
        } else {
            setIsEditing(false);
            setCurrentPost(initialPostState);
        }
    }, [searchParams, posts]);

    // Auto-Save Draft
    useEffect(() => {
        if (!isEditing) return;

        const draftKey = `blog_draft_${currentPost.id || 'new'}`;

        // Only save if different from original
        if (JSON.stringify(currentPost) !== JSON.stringify(originalPost)) {
            localStorage.setItem(draftKey, JSON.stringify(currentPost));
        }
    }, [currentPost, isEditing, originalPost]);

    // Reset manual edit flag when opening new/existing post
    useEffect(() => {
        setIsSlugManuallyEdited(false);
        setSlugValidation({ checking: false, isDuplicate: false, message: '' });
    }, [currentPost.id]);

    // Debounced slug availability check
    const checkSlugAvailability = useCallback(
        debounce((slug: string, currentPostId?: number) => {
            if (!slug) {
                setSlugValidation({ checking: false, isDuplicate: false, message: '' });
                return;
            }

            setSlugValidation({ checking: true, isDuplicate: false, message: 'Checking...' });

            // Check against local posts array
            const duplicate = posts.find(p =>
                p.slug === slug && p.id !== currentPostId
            );

            if (duplicate) {
                setSlugValidation({
                    checking: false,
                    isDuplicate: true,
                    message: `Already used by "${duplicate.title}"`
                });
            } else {
                setSlugValidation({
                    checking: false,
                    isDuplicate: false,
                    message: '✓ Available'
                });
            }
        }, 500),
        [posts]
    );

    // Title change handler with auto-slug generation
    const handleTitleChange = (newTitle: string) => {
        setCurrentPost({ ...currentPost, title: newTitle });

        // Auto-generate slug from title ONLY if user hasn't manually edited it
        if (!isSlugManuallyEdited) {
            const autoSlug = generateSlug(newTitle);
            setCurrentPost(prev => ({ ...prev, title: newTitle, slug: autoSlug }));
            checkSlugAvailability(autoSlug, currentPost.id);
        }
    };

    // Slug change handler with manual tracking
    const handleSlugChange = (newSlug: string) => {
        setIsSlugManuallyEdited(true); // Mark as manually edited
        setCurrentPost({ ...currentPost, slug: newSlug });
        checkSlugAvailability(newSlug, currentPost.id);
    };


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
        // Just push URL, useEffect handles the rest
        const id = post ? post.id : 'new';
        router.push(`?mode=editor&id=${id}`);
    };

    const closeEditor = () => {
        // Clear draft on explicit cancel
        const draftKey = `blog_draft_${currentPost.id || 'new'}`;
        localStorage.removeItem(draftKey);
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

            // Clear draft on success
            const draftKey = `blog_draft_${currentPost.id || 'new'}`;
            localStorage.removeItem(draftKey);

            // Helper to return to list (preserve blog tab)
            router.push('/admin?tab=blog'); // Stay on Blog tab
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

    // Drag & Drop State
    const [isDragging, setIsDragging] = useState(false);

    const insertAtCursor = (textToInsert: string) => {
        const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = currentPost.content || '';
        const newText = text.substring(0, start) + textToInsert + text.substring(end);

        setCurrentPost(prev => ({ ...prev, content: newText }));

        // Restore cursor position after the inserted text
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
            textarea.focus();
        }, 0);
    };

    const handleEditorPaste = async (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = items[i].getAsFile();
                if (file) await uploadAndInsertImage(file);
            }
        }
    };

    const handleEditorDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0 && files[0].type.startsWith('image/')) {
            await uploadAndInsertImage(files[0]);
        }
    };

    const uploadAndInsertImage = async (file: File) => {
        // 1. Insert Placeholder
        const placeholder = `![${file.name}](uploading...)`;
        insertAtCursor(placeholder);

        const toastId = toast.loading('Uploading image...');
        setUploading(true);

        try {
            // 2. Upload
            const url = await uploadFile(file);
            const finalMarkdown = `![${file.name}](${url})`;

            // 3. Replace Placeholder with Final URL
            setCurrentPost(prev => {
                const newContent = prev.content ? prev.content.replace(placeholder, finalMarkdown) : '';
                return { ...prev, content: newContent };
            });

            toast.success('Image inserted!', { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload image', { id: toastId });

            // On error, maybe remove placeholder?
            setCurrentPost(prev => {
                const newContent = prev.content ? prev.content.replace(placeholder, '') : '';
                return { ...prev, content: newContent };
            });
        } finally {
            setUploading(false);
        }
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
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={currentPost.slug}
                                    onChange={(e) => handleSlugChange(e.target.value)}
                                    className={`w-full p-2 rounded-lg border ${slugValidation.isDuplicate
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-slate-300 focus:ring-blue-500'
                                        } focus:ring-2 outline-none pr-10`}
                                    required
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    {slugValidation.checking && (
                                        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                    )}
                                    {!slugValidation.checking && slugValidation.isDuplicate && (
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    )}
                                    {!slugValidation.checking && !slugValidation.isDuplicate && currentPost.slug && (
                                        <Check className="h-5 w-5 text-green-500" />
                                    )}
                                </div>
                            </div>
                            {slugValidation.message && (
                                <p className={`text-sm mt-1 ${slugValidation.isDuplicate ? 'text-red-500' : 'text-green-600'
                                    }`}>
                                    {slugValidation.message}
                                </p>
                            )}
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
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 hidden sm:inline">Drag & drop or paste images directly</span>
                                <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg px-3 py-1 flex items-center gap-1 transition-colors text-xs font-medium text-blue-700">
                                    <span>📷</span>
                                    <span>Insert Image</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                await uploadAndInsertImage(file);
                                                // Reset input so same file can be selected again
                                                e.target.value = '';
                                            }
                                        }}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                        </div>
                        <div
                            className={`relative rounded-lg transition-all ${isDragging ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleEditorDrop}
                        >
                            <textarea
                                id="content-editor"
                                value={currentPost.content || ''}
                                onChange={(e) => setCurrentPost(prev => ({ ...prev, content: e.target.value }))}
                                onPaste={handleEditorPaste}
                                className={`w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none h-96 font-mono text-sm ${isDragging ? 'bg-blue-50/50' : ''}`}
                                required
                                placeholder="Write your post here... (Drag & Drop images works!)"
                            />
                            {isDragging && (
                                <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 pointer-events-none rounded-lg">
                                    <div className="bg-white px-4 py-2 rounded-full shadow-sm text-blue-600 font-bold border border-blue-100">
                                        Drop image to upload
                                    </div>
                                </div>
                            )}
                        </div>
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
                            disabled={!hasChanges || uploading || saving || slugValidation.isDuplicate || !currentPost.slug}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-all shadow-sm flex items-center gap-2 font-medium ${(!hasChanges || uploading || saving || slugValidation.isDuplicate || !currentPost.slug) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-700 hover:shadow-md active:scale-95'}`}
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
            </div >
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
