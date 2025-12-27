'use client';

import { usePathname } from 'next/navigation';
import BlogPostClient from '@/components/BlogPostClient';

export default function PostFallbackPage() {
    const pathname = usePathname();
    // Pathname expected: /blog/my-slug
    // Extract slug:
    const slug = pathname?.split('/').pop() || '';

    if (!slug) {
        return <div className="min-h-screen pt-24 text-center">Loading...</div>;
    }

    return <BlogPostClient slug={slug} />;
}
