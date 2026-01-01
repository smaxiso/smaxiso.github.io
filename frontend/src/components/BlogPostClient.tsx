'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getPublishedPosts } from '@/lib/api';
import { BlogPost } from '@/types';
import { format } from 'date-fns';
import { Share2, ArrowLeft, Calendar, Clock, Tag, History as HistoryIcon } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';

export default function BlogPostClient({ slug }: { slug: string }) {
    const router = useRouter();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    // Navbar Visibility Logic (Replicated from Navbar.tsx to sync position)
    const { scrollY } = useScroll();
    const [isNavbarHidden, setIsNavbarHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = lastScrollY;
        const diff = latest - previous;
        const isScrollingDown = diff > 0;
        const isScrollingUp = diff < 0;

        // Reset timer on any scroll
        if (timer) clearTimeout(timer);

        if (latest < 100) {
            setIsNavbarHidden(false);
        } else if (isScrollingDown) {
            setIsNavbarHidden(true);
        } else if (isScrollingUp) {
            setIsNavbarHidden(false);
            // Set auto-hide timer for 3 seconds if we stop scrolling up
            const newTimer = setTimeout(() => {
                if (window.scrollY > 100) {
                    setIsNavbarHidden(true);
                }
            }, 3000);
            setTimer(newTimer);
        }
        setLastScrollY(latest);
    });

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            try {
                const data = await getPostBySlug(slug);
                if (!data) {
                    router.replace('/404');
                    return;
                }
                setPost(data);
            } catch (error) {
                console.error('Failed to fetch post:', error);
                router.replace('/blog');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug, router]);

    // Fetch related posts
    useEffect(() => {
        if (!post) return;

        const fetchRelatedPosts = async () => {
            try {
                const allPosts = await getPublishedPosts();

                // Filter out current post
                const otherPosts = allPosts.filter(p => p.id !== post.id);

                // If only 1 or 0 other posts, don't show section
                if (otherPosts.length === 0) {
                    setRelatedPosts([]);
                    return;
                }

                // Match by tags
                const currentTags = post.tags ? post.tags.toLowerCase().split(',').map(t => t.trim()) : [];

                const scoredPosts = otherPosts.map(p => {
                    const postTags = p.tags ? p.tags.toLowerCase().split(',').map(t => t.trim()) : [];
                    const overlap = currentTags.filter(tag => postTags.includes(tag)).length;
                    return { post: p, score: overlap };
                });

                // Sort by relevance (score desc), then by date (newest first)
                scoredPosts.sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    return b.post.created_at.localeCompare(a.post.created_at);
                });

                // Take top 3
                const related = scoredPosts.slice(0, 3).map(s => s.post);
                setRelatedPosts(related);
            } catch (error) {
                console.error('Failed to fetch related posts:', error);
            }
        };

        fetchRelatedPosts();
    }, [post]);

    const handleShare = async () => {
        if (!post) return;

        const shareText = `Hey, see this blog by smaxiso: "${post.title}"`;
        const shareData = {
            title: post.title,
            text: shareText,
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
        <main className="min-h-screen pt-24 pb-48 md:pb-32 relative bg-slate-50/50">
            {post.cover_image && (
                <div className="absolute top-0 left-0 right-0 h-[400px] w-full -z-10">
                    <img
                        src={post.cover_image}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-90 mask-gradient"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50"></div>
                </div>
            )}

            <article className="container mx-auto max-w-3xl px-4">
                {/* JSON-LD Structured Data for SEO */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "BlogPosting",
                            "headline": post.title,
                            "description": post.excerpt || post.title,
                            "image": post.cover_image || "https://smaxiso.web.app/og-image.png",
                            "datePublished": post.created_at,
                            "dateModified": post.updated_at || post.created_at,
                            "author": {
                                "@type": "Person",
                                "name": "Sumit Kumar",
                                "url": "https://smaxiso.web.app",
                            },
                            "publisher": {
                                "@type": "Person",
                                "name": "Sumit Kumar",
                                "url": "https://smaxiso.web.app",
                            },
                            "mainEntityOfPage": {
                                "@type": "WebPage",
                                "@id": `https://smaxiso.web.app/blog/${post.slug}`,
                            },
                            "keywords": post.tags || "",
                        }),
                    }}
                />

                <div
                    className="sticky top-4 transition-[top] duration-300 ease-in-out z-30 mb-8 pointer-events-none md:top-[var(--sticky-top)]"
                    style={{ '--sticky-top': isNavbarHidden ? '24px' : '96px' } as React.CSSProperties}
                >
                    <Link
                        href="/blog"
                        className="pointer-events-auto inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm transition-all hover:shadow-md group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Blog
                    </Link>
                </div>

                <header className="mb-12 text-left">
                    <div className="flex items-center justify-start gap-4 text-sm text-slate-500 mb-4">
                        <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full border border-slate-100">
                            <Calendar className="w-4 h-4" />
                            {(() => {
                                const dateStr = post.created_at.endsWith('Z') ? post.created_at : `${post.created_at}Z`;
                                return format(new Date(dateStr), 'MMMM d, yyyy, h:mm a');
                            })()}
                        </span>
                        {post.updated_at && post.updated_at !== post.created_at && (
                            <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full border border-slate-100 text-slate-400 text-xs">
                                <HistoryIcon className="w-3.5 h-3.5" />
                                Updated: {(() => {
                                    const updateStr = post.updated_at.endsWith('Z') ? post.updated_at : `${post.updated_at}Z`;
                                    return format(new Date(updateStr), 'MMM d, yyyy, h:mm a');
                                })()}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full border border-slate-100">
                            <Clock className="w-4 h-4" />
                            {Math.ceil(post.content.length / 1000)} min read
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        {post.tags && (
                            <div className="flex flex-wrap justify-start gap-2">
                                {post.tags.split(',').map(tag => (
                                    <span key={tag} className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95 self-start sm:self-auto"
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>
                </header>

                <div className="prose prose-sm md:prose-lg prose-slate prose-headings:font-bold prose-headings:text-slate-800 prose-a:text-blue-600 hover:prose-a:text-blue-700 max-w-none bg-white/40 backdrop-blur-sm p-4 md:p-10 rounded-2xl md:rounded-3xl border border-white/50 shadow-sm overflow-x-hidden break-words selection:bg-blue-100 selection:text-blue-900">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            a: ({ node, ...props }) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-800 transition-all font-medium" />
                            ),
                            h1: ({ node, ...props }) => <h2 {...props} className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-slate-900 border-b border-slate-200 pb-4" />,
                            h2: ({ node, ...props }) => <h3 {...props} className="text-xl md:text-2xl font-bold mt-10 mb-5 text-slate-800" />,
                            h3: ({ node, ...props }) => <h4 {...props} className="text-lg md:text-xl font-bold mt-8 mb-4 text-slate-700" />,
                            blockquote: ({ node, ...props }) => <blockquote {...props} className="border-l-4 border-blue-400 pl-6 py-2 my-8 italic text-slate-600 bg-blue-50/50 rounded-r-lg" />,
                            code: ({ className, children, ...props }: any) => {
                                const match = /language-(\w+)/.exec(className || '');
                                const isInline = !match;
                                return !isInline ? (
                                    <div className="rounded-xl overflow-hidden my-6 shadow-lg border border-slate-200/50">
                                        <div className="bg-[#1e1e1e] px-4 py-2 flex items-center gap-2 border-b border-white/10">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                            </div>
                                            <span className="ml-auto text-xs text-slate-400 font-mono opacity-50">{match?.[1]}</span>
                                        </div>
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match?.[1]}
                                            PreTag="div"
                                            customStyle={{
                                                margin: 0,
                                                borderRadius: '0 0 0.75rem 0.75rem',
                                                padding: '1.5rem',
                                                background: '#1e1e1e', // Match VS Code Dark
                                            }}
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    </div>
                                ) : (
                                    <code className={`${className} bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded-md font-mono text-[0.9em] border border-slate-200/50 break-words`} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            img: ({ node, ...props }) => <img {...props} className="rounded-xl shadow-lg my-8 w-full object-cover border border-white/20" />,
                            hr: ({ node, ...props }) => <hr {...props} className="my-12 border-slate-200 border-t-2 opacity-50" />,
                            ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-6 space-y-2 my-6 marker:text-blue-400" />,
                            ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-6 space-y-2 my-6 marker:text-blue-400 font-medium text-slate-700" />,
                            li: ({ node, ...props }) => <li {...props} className="pl-1" />,
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

                            {/* Desktop Fallbacks */}
                            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                                <a
                                    href={`https://wa.me/?text=${encodeURIComponent(`Hey, check out this blog by smaxiso: "${post.title}" ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success('Link copied to clipboard!');
                                    }}
                                    className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-full transition-all"
                                    aria-label="Share on WhatsApp"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                </a>
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success('Link copied to clipboard!');
                                    }}
                                    className="p-2 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all"
                                    aria-label="Share on LinkedIn"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Hey, check out this blog by smaxiso: "${post.title}"`)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success('Link copied to clipboard!');
                                    }}
                                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-50 rounded-full transition-all"
                                    aria-label="Share on Twitter"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 4.15 4.15 0 00-.08 3.251 12.275 12.275 0 01-9.3-4.715 4.106 4.106 0 001.27 5.477 4.072 4.072 0 01-1.876-.517v.051a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <style jsx>{`
                          .mask-gradient {
                            mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
                          }
                        `}</style>
                    </div>
                </div>

                {/* Related Posts Section */}
                {relatedPosts.length > 0 && (
                    <div className="mt-16 mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center">
                            You Might Also Like
                        </h2>
                        <div className={`grid gap-6 ${relatedPosts.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' : relatedPosts.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                            {relatedPosts.map((relatedPost) => (
                                <Link
                                    key={relatedPost.id}
                                    href={`/blog/${relatedPost.slug}`}
                                    className="group block bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden hover:bg-white/60 hover:shadow-lg transition-all"
                                >
                                    {relatedPost.cover_image && (
                                        <div className="aspect-video overflow-hidden bg-slate-100">
                                            <img
                                                src={relatedPost.cover_image}
                                                alt={relatedPost.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    <div className="p-5 space-y-3">
                                        {relatedPost.tags && (
                                            <div className="flex flex-wrap gap-2">
                                                {relatedPost.tags.split(',').slice(0, 2).map(tag => (
                                                    <span key={tag} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                                        #{tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 line-clamp-2">
                                            {relatedPost.excerpt}
                                        </p>
                                        <div className="text-blue-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Read more <span aria-hidden="true">&rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </main>
    );
}
