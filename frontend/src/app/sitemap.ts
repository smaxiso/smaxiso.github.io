import { MetadataRoute } from 'next'
import { getPublishedPosts } from '@/lib/api'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://smaxiso.web.app'

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/guestbook`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/resume`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
    ]

    // Dynamic blog posts
    try {
        const posts = await getPublishedPosts()
        const blogPosts = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.updated_at || post.created_at),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }))

        return [...staticPages, ...blogPosts]
    } catch (error) {
        console.error('Failed to fetch posts for sitemap:', error)
        return staticPages
    }
}
