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

    const handleShare = async () => {
        if (!post) return;

        const shareData = {
            title: post.title,
            text: post.excerpt,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                // Success
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
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
                <div className="sticky top-4 md:top-28 z-30 mb-8 pointer-events-none">
                    <Link
                        href="/blog"
                        className="pointer-events-auto inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm transition-all hover:shadow-md group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Blog
                    </Link>
                </div>

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

                <div className="mt-12 pt-8 border-t border-slate-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-slate-500 italic text-center md:text-left">
                            Thanks for reading!
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Native Share / Copy Link */}
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>

                            {/* Desktop Fallbacks (Visible if native share might fail or just extra convenience) */}
                            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-50 rounded-full transition-all"
                                    aria-label="Share on Twitter"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 4.15 4.15 0 00-.08 3.251 12.275 12.275 0 01-9.3-4.715 4.106 4.106 0 001.27 5.477 4.072 4.072 0 01-1.876-.517v.051a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all"
                                    aria-label="Share on LinkedIn"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </main>
    );
}
