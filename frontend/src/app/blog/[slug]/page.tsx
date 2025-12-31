import { getPublishedPosts, getPostBySlug } from "@/lib/api";
import BlogPostClient from "@/components/BlogPostClient";
import { Metadata } from "next";

// Generate dynamic metadata for SEO
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const slug = (await params).slug;

    try {
        const post = await getPostBySlug(slug);

        if (!post) {
            return {
                title: 'Post Not Found',
                description: 'The requested blog post could not be found.',
            };
        }

        const url = `https://smaxiso.web.app/blog/${slug}`;
        const title = `${post.title} | Sumit Kumar`;
        const description = post.excerpt || post.title;
        const image = post.cover_image || 'https://smaxiso.web.app/og-image.png';

        return {
            title,
            description,
            keywords: post.tags?.split(',').map(t => t.trim()).join(', '),
            authors: [{ name: 'Sumit Kumar' }],
            creator: 'Sumit Kumar',
            publisher: 'Sumit Kumar',
            alternates: {
                canonical: url,
            },
            openGraph: {
                title,
                description,
                url,
                siteName: 'Sumit Kumar - Portfolio',
                images: [
                    {
                        url: image,
                        width: 1200,
                        height: 630,
                        alt: post.title,
                    },
                ],
                locale: 'en_US',
                type: 'article',
                publishedTime: post.created_at,
                modifiedTime: post.updated_at || post.created_at,
                authors: ['Sumit Kumar'],
                tags: post.tags?.split(',').map(t => t.trim()),
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [image],
                creator: '@smaxiso',
            },
        };
    } catch (error) {
        console.error('Failed to generate metadata:', error);
        return {
            title: 'Blog Post',
            description: 'Read this blog post by Sumit Kumar',
        };
    }
}

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
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug
    return <BlogPostClient slug={slug} />
}
