import Link from 'next/link';
import { getPublishedPosts } from '@/lib/api';
import { formatInTimeZone } from 'date-fns-tz';
import { Calendar, Tag } from 'lucide-react';
import BlogCardShare from '@/components/BlogCardShare';

// Force static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
    // Server-side data fetching at build time
    const posts = await getPublishedPosts();

    return (
        <main className="min-h-dvh pt-24 pb-20 px-4 md:px-6 relative overflow-hidden dark:bg-black transition-colors duration-300">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        Tech Blog
                    </h1>
                    <p className="text-slate-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Thoughts on engineering, design, and building products.
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center p-12 glass-card dark:glass-none dark:bg-neutral-900 dark:border-neutral-800 rounded-2xl">
                        <p className="text-slate-500 dark:text-gray-400 text-lg">No posts published yet. Stay tuned!</p>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {posts.map((post) => (
                            <article key={post.id} className="group relative block glass-card dark:bg-black dark:border-white/10 border border-white/50 p-4 md:p-8 rounded-2xl hover:bg-white/60 dark:hover:bg-neutral-900/50 transition-all hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                <div className="flex flex-col-reverse md:flex-row md:items-stretch gap-4 md:gap-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-slate-500 dark:text-gray-400 mb-2">
                                            <span className="flex items-center gap-1 shrink-0">
                                                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 dark:text-gray-500" />
                                                {(() => {
                                                    const dateStr = post.created_at.endsWith('Z') ? post.created_at : `${post.created_at}Z`;
                                                    return formatInTimeZone(new Date(dateStr), 'Asia/Kolkata', 'MMMM d, yyyy, h:mm a');
                                                })()}
                                            </span>
                                            {post.tags && (
                                                <div className="flex flex-wrap gap-2">
                                                    {post.tags.split(',').slice(0, 3).map(tag => (
                                                        <span key={tag} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium whitespace-nowrap">
                                                            <Tag className="w-3 h-3" />
                                                            {tag.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <Link href={`/blog/${post.slug}`} className="block">
                                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-neutral-400 group-hover:text-blue-600 dark:group-hover:text-transparent dark:group-hover:from-blue-200 dark:group-hover:to-blue-500 transition-colors line-clamp-2 pb-1">
                                                {post.title}
                                            </h2>
                                        </Link>

                                        <p className="text-sm md:text-base text-slate-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mt-auto">
                                            <Link href={`/blog/${post.slug}`} className="text-blue-600 dark:text-blue-400 font-medium text-sm md:text-base flex items-center gap-1 group-hover:gap-2 transition-all w-fit">
                                                Read more <span aria-hidden="true">&rarr;</span>
                                            </Link>
                                            <div className={`w-full sm:w-auto ${post.cover_image ? 'md:hidden' : ''}`}>
                                                <BlogCardShare slug={post.slug} title={post.title} />
                                            </div>
                                        </div>
                                    </div>

                                    {post.cover_image && (
                                        <div className="flex flex-col gap-4 flex-shrink-0 w-full md:w-48">
                                            <Link href={`/blog/${post.slug}`} className="w-full aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800 block">
                                                <img
                                                    src={post.cover_image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </Link>
                                            <div className="hidden md:flex justify-center w-full mt-auto">
                                                <BlogCardShare slug={post.slug} title={post.title} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
