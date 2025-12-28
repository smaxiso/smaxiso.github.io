'use client'

import { useEffect } from 'react';

export function ScrollToTop() {
    useEffect(() => {
        // Enable browser's native scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'auto';
        }

        // Only handle hash navigation
        if (window.location.hash) {
            setTimeout(() => {
                const targetId = window.location.hash.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const yOffset = -80;
                    const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 500); // Wait for content to load
        }
    }, []);

    return null;
}
