import { getPublishedPosts } from "@/lib/api";
import BlogPostClient from "@/components/BlogPostClient";

// Fetch all blog post slugs for static generation
export async function generateStaticParams() {
    try {
        const posts = await getPublishedPosts();
        return posts.map(post => ({ slug: post.slug }));
    } catch (error) {
        console.warn('Failed to fetch posts for static generation, using fallback:', error);
        // Fallback: Return known slugs to prevent build failures
        // Client will handle actual routing via BlogPostClient
        return [
            { slug: 'zero-downtime-portfolio-architecture' },
            { slug: 'google-antigravity-wsl-guide' }
        ];
    }
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const slug = (await params).slug
    return <BlogPostClient slug={slug} />
}
