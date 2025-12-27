'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '@/lib/api';
import { BlogPost } from '@/types';
import { format } from 'date-fns';
import { Calendar, ArrowLeft, Clock, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogPostClient({ slug }: { slug: string }) {
    const router = useRouter();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            try {
                const data = await getPostBySlug(slug);
                if (!data) {
                    router.push('/404');
                    return;
                }
                setPost(data);
            } catch (error) {
                console.error('Failed to fetch post:', error);
                router.push('/blog');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug, router]);

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    if (loading) return (
        <div className="min-h-screen pt-32 pb-20 container max-w-3xl mx-auto px-4">
            <div className="h-10 w-3/4 bg-slate-200 rounded-lg animate-pulse mb-6"></div>
            <div className="h-6 w-1/2 bg-slate-200 rounded-lg animate-pulse mb-12"></div>
            <div className="space-y-4">
                <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse"></div>
            </div>
        </div>
    );

    if (!post) return null;

    return (
        <main className="min-h-screen pt-24 pb-20 relative bg-slate-50/50">
            {post.cover_image && (
                <div className="absolute top-0 left-0 right-0 h-[400px] w-full -z-10">
                    <img
                        src={post.cover_image}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-20 mask-gradient"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50"></div>
                </div>
            )}

            <article className="container mx-auto max-w-3xl px-4">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                </Link>

                <header className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-4">
                        <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full border border-slate-100">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(post.created_at), 'MMMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full border border-slate-100">
                            <Clock className="w-4 h-4" />
                            {Math.ceil(post.content.length / 1000)} min read
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {post.tags && (
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            {post.tags.split(',').map(tag => (
                                <span key={tag} className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                    #{tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                <div className="prose prose-sm md:prose-lg prose-slate prose-headings:font-bold prose-headings:text-slate-800 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-img:rounded-xl prose-img:shadow-lg max-w-none bg-white/40 backdrop-blur-sm p-3 md:p-10 rounded-2xl md:rounded-3xl border border-white/50 shadow-sm overflow-x-hidden break-words">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            a: ({ node, ...props }) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-800 transition-all" />
                            ),
                            h1: ({ node, ...props }) => <h2 {...props} className="text-2xl font-bold mt-8 mb-4" />, // Demote H1 to H2 inside content to avoid conflict with page title
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-center">
                    <div className="text-slate-500 italic">
                        Thanks for reading!
                    </div>
                    <button
                        onClick={copyLink}
                        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                    >
                        <Share2 className="w-5 h-5" />
                        Share this post
                    </button>
                </div>
            </article>
        </main>
    );
}
