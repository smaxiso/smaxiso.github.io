import { getPublishedPosts } from "@/lib/api";
import BlogPostClient from "@/components/BlogPostClient";

// Fetch params for all posts during build time
export async function generateStaticParams() {
    try {
        const posts = await getPublishedPosts();
        return posts.map((post) => ({
            slug: post.slug,
        }));
    } catch (error) {
        console.warn("Could not fetch posts during build (API might not be running). Falling back to dynamic rendering:", error);
        // Return empty array - pages will be generated on-demand at runtime
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
