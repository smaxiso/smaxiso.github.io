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
        console.error("Error generating static params:", error);
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
