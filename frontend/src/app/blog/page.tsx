'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getPublishedPosts } from '@/lib/api';
import { BlogPost } from '@/types';
import { format } from 'date-fns';
import { Calendar, Clock, Tag, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getPublishedPosts();
                setPosts(data);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <main className="min-h-screen pt-24 pb-20 px-4 md:px-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-16 space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                        Tech Blog
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        Thoughts on engineering, design, and building products.
                    </motion.p>
                </div>

                {loading ? (
                    <div className="grid gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-48 rounded-2xl bg-white/40 animate-pulse" />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center p-12 glass-card rounded-2xl">
                        <p className="text-slate-500 text-lg">No posts published yet. Stay tuned!</p>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {posts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <Link href={`/blog/${post.slug}`} className="block glass-card p-4 md:p-8 rounded-2xl hover:bg-white/60 transition-all border border-white/50 hover:shadow-lg relative">
                                    <div className="flex flex-col-reverse md:flex-row md:items-start gap-4 md:gap-6">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-slate-500 mb-2">
                                                <span className="flex items-center gap-1 shrink-0">
                                                    <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                    {(() => {
                                                        const dateStr = post.created_at.endsWith('Z') ? post.created_at : `${post.created_at}Z`;
                                                        return format(new Date(dateStr), 'MMMM d, yyyy, h:mm a');
                                                    })()}
                                                </span>
                                                {post.tags && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {post.tags.split(',').slice(0, 3).map(tag => (
                                                            <span key={tag} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium whitespace-nowrap">
                                                                <Tag className="w-3 h-3" />
                                                                {tag.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>

                                            <p className="text-sm md:text-base text-slate-600 leading-relaxed line-clamp-3">
                                                {post.excerpt}
                                            </p>

                                            <div className="pt-2 flex items-center justify-between">
                                                <div className="text-blue-600 font-medium text-sm md:text-base flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Read more <span aria-hidden="true">&rarr;</span>
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        const url = `${window.location.origin}/blog/${post.slug}`;
                                                        const shareText = `Check out this blog: "${post.title}"`;

                                                        if (navigator.share) {
                                                            navigator.share({ title: post.title, text: shareText, url }).catch(console.error);
                                                        } else {
                                                            navigator.clipboard.writeText(url);
                                                            toast.success('Link copied!');
                                                        }
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all z-10"
                                                    title="Share"
                                                >
                                                    <Share2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {post.cover_image && (
                                            <div className="w-full md:w-48 aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 self-start">
                                                <img
                                                    src={post.cover_image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
