/*===== SEO PERFORMANCE OPTIMIZATIONS =====*/

// Lazy loading for images
function enableLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        { href: 'assets/css/styles.css', as: 'style' },
        { href: 'assets/data/site-config.json', as: 'fetch', crossorigin: 'anonymous' },
        { href: 'assets/img/perfils/perfil3.png', as: 'image' }
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
        document.head.appendChild(link);
    });
}

// Add breadcrumb schema
function addBreadcrumbSchema() {
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://smaxiso.github.io"
            },
            {
                "@type": "ListItem", 
                "position": 2,
                "name": "Portfolio",
                "item": "https://smaxiso.github.io/#work"
            },
            {
                "@type": "ListItem",
                "position": 3, 
                "name": "Contact",
                "item": "https://smaxiso.github.io/#contact"
            }
        ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);
}

// Performance monitoring
function trackPerformanceMetrics() {
    if ('performance' in window && 'PerformanceObserver' in window) {
        // Core Web Vitals
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log(`${entry.name}: ${entry.value}`);
                // You can send these metrics to analytics
            }
        }).observe({ entryTypes: ['measure', 'navigation'] });

        // Track page load time
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page Load Time: ${loadTime}ms`);
        });
    }
}

// Initialize SEO optimizations
function initSEOOptimizations() {
    preloadCriticalResources();
    enableLazyLoading();
    addBreadcrumbSchema();
    trackPerformanceMetrics();
}

// Run optimizations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSEOOptimizations);
} else {
    initSEOOptimizations();
}
