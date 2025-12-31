import { getPublishedPosts } from "@/lib/api";
import BlogPostClient from "@/components/BlogPostClient";

// Fetch all blog post slugs for static generation
export async function generateStaticParams() {
    try {
        const posts = await getPublishedPosts();
        return posts.map(post => ({ slug: post.slug }));
    } catch (error) {
        console.warn('Failed to fetch posts for static generation:', error);
        // Return empty array - pages will be generated on-demand
        return [];
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
