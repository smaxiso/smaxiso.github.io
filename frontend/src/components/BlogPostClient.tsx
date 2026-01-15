'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useScroll, useMotionValueEvent, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getPublishedPosts } from '@/lib/api';
import { BlogPost } from '@/types';
import { formatInTimeZone } from 'date-fns-tz';
import { ArrowLeft, Calendar, Clock, Tag, History as HistoryIcon, Share2, Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';
import BlogCardShare from './BlogCardShare';
import BlogReactions from './BlogReactions';
import BlogComments from './BlogComments';

// CodeBlock component with copy state management
function CodeBlock({ code, language }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        toast.success('Code copied to clipboard!');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-xl overflow-hidden my-6 shadow-lg border border-slate-200/50 dark:border-neutral-800">
            <div className="bg-[#1e1e1e] px-4 py-2 flex items-center gap-2 border-b border-white/10">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="ml-auto text-xs text-slate-400 font-mono opacity-50">{language}</span>
                <button
                    onClick={handleCopy}
                    className={`ml-2 p-1.5 rounded transition-all ${copied
                            ? 'text-green-400 bg-green-500/10'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                    title={copied ? 'Copied!' : 'Copy code'}
                    aria-label="Copy code to clipboard"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
            <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                customStyle={{
                    margin: 0,
                    borderRadius: '0 0 0.75rem 0.75rem',
                    padding: '1.5rem',
                    background: '#1e1e1e',
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}


export default function BlogPostClient({ slug, initialPost }: { slug: string; initialPost?: BlogPost }) {
    const router = useRouter();
    const [post, setPost] = useState<BlogPost | null>(initialPost || null);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(!initialPost); // Only show loading if no initial data

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

        // Optimization: Skip hide/show logic on mobile to prevent jitter
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        if (isMobile) return;

        if (latest < 100) {
            setIsNavbarHidden(false);
        } else if (isScrollingDown) {
            setIsNavbarHidden(true);
        } else if (isScrollingUp) {
            setIsNavbarHidden(false);
            // Set auto-hide timer for 5 seconds if we stop scrolling up
            const newTimer = setTimeout(() => {
                if (window.scrollY > 100) {
                    setIsNavbarHidden(true);
                }
            }, 5000);
            setTimer(newTimer);
        }
        setLastScrollY(latest);
    });

    useEffect(() => {
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [timer]);

    // Fetch post data only if not provided (dev mode fallback)
    useEffect(() => {
        if (initialPost) return; // Skip if we already have the data

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
    }, [slug, router, initialPost]);

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



    // Reading Progress
    const { scrollYProgress } = useScroll();

    if (loading) return (
        <div className="min-h-dvh pt-32 pb-20 container max-w-3xl mx-auto px-4 dark:bg-black">
            <div className="h-10 w-3/4 bg-slate-200 dark:bg-neutral-800 rounded-lg animate-pulse mb-6"></div>
            <div className="h-6 w-1/2 bg-slate-200 dark:bg-neutral-800 rounded-lg animate-pulse mb-12"></div>
            <div className="space-y-4">
                <div className="h-4 bg-slate-200 dark:bg-neutral-800 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 dark:bg-neutral-800 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-slate-200 dark:bg-neutral-800 rounded animate-pulse"></div>
            </div>
        </div>
    );

    if (!post) return null;

    return (
        <main className="min-h-dvh pt-24 pb-48 md:pb-32 relative bg-slate-50/50 dark:bg-black transition-colors duration-300">
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
                style={{ scaleX: scrollYProgress }}
            />

            {post.cover_image && (
                <div className="absolute top-0 left-0 right-0 h-[400px] w-full -z-10">
                    <img
                        src={post.cover_image}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-90 dark:opacity-60 mask-gradient"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-black"></div>
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

                <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    animate={{
                        opacity: isNavbarHidden ? 0 : 1,
                        y: isNavbarHidden ? -20 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="sticky top-4 transition-[top] duration-300 ease-in-out z-30 mb-8 pointer-events-none md:top-[var(--sticky-top)]"
                    style={{ '--sticky-top': isNavbarHidden ? '24px' : '96px' } as React.CSSProperties}
                >
                    <Link
                        href="/blog"
                        className="pointer-events-auto inline-flex items-center gap-2 text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl px-4 py-2 rounded-full border border-slate-200/60 dark:border-white/10 shadow-lg hover:shadow-xl dark:shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="md:hidden">Blogs</span>
                        <span className="hidden md:inline">Back to Blogs</span>
                    </Link>
                </motion.div>

                <header className="mb-12 text-left">
                    <div className="flex items-center justify-start gap-4 text-sm text-slate-500 dark:text-gray-400 mb-4">
                        <span className="flex items-center gap-1.5 bg-white/60 dark:bg-neutral-900/60 px-3 py-1 rounded-full border border-slate-100 dark:border-neutral-800">
                            <Calendar className="w-4 h-4" />
                            {(() => {
                                const dateStr = post.created_at.endsWith('Z') ? post.created_at : `${post.created_at}Z`;
                                return formatInTimeZone(new Date(dateStr), 'Asia/Kolkata', 'MMMM d, yyyy, h:mm a');
                            })()}
                        </span>
                        {post.updated_at && post.updated_at !== post.created_at && (
                            <span className="hidden sm:flex items-center gap-1.5 bg-white/60 dark:bg-neutral-900/60 px-3 py-1 rounded-full border border-slate-100 dark:border-neutral-800 text-slate-400 text-xs">
                                <HistoryIcon className="w-3.5 h-3.5" />
                                Updated: {(() => {
                                    const updateStr = post.updated_at.endsWith('Z') ? post.updated_at : `${post.updated_at}Z`;
                                    return formatInTimeZone(new Date(updateStr), 'Asia/Kolkata', 'MMM d, yyyy, h:mm a');
                                })()}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 bg-white/60 dark:bg-neutral-900/60 px-3 py-1 rounded-full border border-slate-100 dark:border-neutral-800">
                            <Clock className="w-4 h-4" />
                            {Math.ceil(post.content.length / 1000)} min read
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-neutral-400 mb-6 leading-tight pb-1">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center sm:justify-end mb-8">
                        <div className="flex items-center gap-2">
                            <BlogCardShare slug={slug} title={post.title} />
                        </div>
                    </div>
                </header>

                <div className="prose prose-sm md:prose-lg prose-slate dark:prose-invert prose-headings:font-bold prose-headings:text-slate-800 dark:prose-headings:text-white dark:prose-p:text-gray-300 dark:prose-li:text-gray-300 dark:prose-strong:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-700 dark:hover:prose-a:text-blue-300 max-w-none bg-white/40 dark:bg-neutral-900/30 backdrop-blur-sm px-4 pb-4 pt-px md:px-10 md:pb-10 md:pt-0.5 rounded-2xl md:rounded-3xl border border-white/50 dark:border-neutral-800 shadow-sm overflow-x-hidden break-words selection:bg-blue-100 dark:selection:bg-blue-900/30 selection:text-blue-900 dark:selection:text-blue-200">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            a: ({ node, ...props }) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-blue-300 dark:decoration-blue-700 hover:decoration-blue-800 transition-all font-medium" />
                            ),
                            h1: ({ node, ...props }) => <h2 {...props} className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-slate-900 dark:text-white border-b border-slate-200 dark:border-neutral-800 pb-4" />,
                            h2: ({ node, ...props }) => <h3 {...props} className="text-xl md:text-2xl font-bold mt-10 mb-5 text-slate-800 dark:text-gray-100" />,
                            h3: ({ node, ...props }) => <h4 {...props} className="text-lg md:text-xl font-bold mt-8 mb-4 text-slate-700 dark:text-gray-200" />,
                            blockquote: ({ node, ...props }) => <blockquote {...props} className="border-l-4 border-blue-400 pl-6 py-2 my-8 italic text-slate-600 dark:text-gray-400 bg-blue-50/50 dark:bg-blue-900/10 rounded-r-lg" />,
                            code: ({ className, children, ...props }: any) => {
                                const match = /language-(\w+)/.exec(className || '');
                                const isInline = !match;
                                const codeContent = String(children).replace(/\n$/, '');

                                if (isInline) {
                                    return (
                                        <code className={`${className} bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-gray-200 px-1.5 py-0.5 rounded-md font-mono text-[0.9em] border border-slate-200/50 dark:border-neutral-700 break-words`} {...props}>
                                            {children}
                                        </code>
                                    );
                                }

                                return <CodeBlock code={codeContent} language={match?.[1]} />;
                            },
                            img: ({ node, ...props }) => <img {...props} className="rounded-xl shadow-lg my-8 w-full h-auto max-w-full object-cover border border-white/20 dark:border-neutral-800" />,
                            hr: ({ node, ...props }) => <hr {...props} className="my-12 border-slate-200 dark:border-neutral-800 border-t-2 opacity-50" />,
                            ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-6 space-y-2 my-6 marker:text-blue-400 text-slate-700 dark:text-gray-300" />,
                            ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-6 space-y-2 my-6 marker:text-blue-400 font-medium text-slate-700 dark:text-gray-300" />,
                            li: ({ node, ...props }) => <li {...props} className="pl-1 text-slate-700 dark:text-gray-300" />,
                            strong: ({ node, ...props }) => <strong {...props} className="font-bold text-slate-900 dark:text-white" />,
                            p: ({ node, ...props }) => <p {...props} className="mb-4 leading-relaxed text-slate-700 dark:text-gray-300" />,
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

                {post.tags && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="w-full mx-auto mb-12 mt-16 px-1 py-1 sm:px-6 sm:py-6 bg-gradient-to-b from-slate-50/50 to-white/50 dark:from-neutral-900/30 dark:to-black/30 border border-slate-200/60 dark:border-neutral-800 rounded-3xl text-center backdrop-blur-sm"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-4 block">
                            Topics
                        </span>
                        <div className="flex flex-wrap justify-center gap-2">
                            {post.tags.split(',').map(tag => (
                                <span key={tag} className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-neutral-800 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-slate-200 dark:border-neutral-700 shadow-sm hover:scale-105 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-default">
                                    #{tag.trim()}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                <BlogReactions slug={slug} />

                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-neutral-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-slate-500 dark:text-gray-500 italic text-center md:text-left">
                            Thanks for reading!
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-slate-500 dark:text-gray-400 font-medium hidden sm:inline">Share this post:</span>
                            <BlogCardShare slug={slug} title={post.title} />
                        </div>
                        <style jsx>{`
                          .mask-gradient {
                            mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
                          }
                        `}</style>
                    </div>
                </div>

                <BlogComments />

                {/* Related Posts Section */}
                {relatedPosts.length > 0 && (
                    <div className="mt-16 mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-8 text-center">
                            You Might Also Like
                        </h2>
                        <div className={`grid gap-6 ${relatedPosts.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' : relatedPosts.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                            {relatedPosts.map((relatedPost) => (
                                <Link
                                    key={relatedPost.id}
                                    href={`/blog/${relatedPost.slug}`}
                                    className="group block bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-neutral-800 overflow-hidden hover:bg-white/60 dark:hover:bg-neutral-900/60 hover:shadow-lg transition-all"
                                >
                                    {relatedPost.cover_image && (
                                        <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-neutral-800">
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
                                                    <span key={tag} className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                                                        #{tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-2">
                                            {relatedPost.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Read more <span aria-hidden="true">&rarr;</span>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const url = `${window.location.origin}/blog/${relatedPost.slug}`;
                                                    const shareText = `Check out this blog: "${relatedPost.title}"`;

                                                    if (navigator.share) {
                                                        navigator.share({ title: relatedPost.title, text: shareText, url }).catch(console.error);
                                                    } else {
                                                        navigator.clipboard.writeText(url);
                                                        toast.success('Link copied!');
                                                    }
                                                }}
                                                className="p-1.5 text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all z-10"
                                                title="Share"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </button>
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
