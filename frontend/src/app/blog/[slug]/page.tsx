import { getPublishedPosts } from "@/lib/api";
import BlogPostClient from "@/components/BlogPostClient";

// Fetch params for all posts during build time
// Bypass API fetch during build to prevent CI failures.
// Real paths will be handled by client-side fallback.
export function generateStaticParams() {
    return [{ slug: 'latest' }];
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const slug = (await params).slug
    return <BlogPostClient slug={slug} />
}
