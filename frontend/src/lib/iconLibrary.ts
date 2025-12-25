// Icon library for Skills and Socials editors
export interface IconDefinition {
    name: string;
    class: string;
    keywords: string[];
    category: 'social' | 'tech' | 'general';
}

export interface SocialPlatform {
    platform: string;
    icon: string;
    urlPattern: RegExp;
    placeholder: string;
}

// Tech/Dev icons (primarily for skills)
export const TECH_ICONS: IconDefinition[] = [
    { name: 'React', class: 'bx bxl-react', keywords: ['react', 'frontend', 'javascript', 'js'], category: 'tech' },
    { name: 'Vue', class: 'bx bxl-vuejs', keywords: ['vue', 'frontend', 'javascript', 'js'], category: 'tech' },
    { name: 'Angular', class: 'bx bxl-angular', keywords: ['angular', 'frontend', 'typescript', 'ts'], category: 'tech' },
    { name: 'JavaScript', class: 'bx bxl-javascript', keywords: ['javascript', 'js', 'frontend', 'backend'], category: 'tech' },
    { name: 'TypeScript', class: 'bx bxl-typescript', keywords: ['typescript', 'ts', 'javascript'], category: 'tech' },
    { name: 'Python', class: 'bx bxl-python', keywords: ['python', 'backend', 'ai', 'ml'], category: 'tech' },
    { name: 'Java', class: 'bx bxl-java', keywords: ['java', 'backend', 'android'], category: 'tech' },
    { name: 'C++', class: 'bx bxl-c-plus-plus', keywords: ['cpp', 'c++', 'c plus plus'], category: 'tech' },
    { name: 'Go', class: 'bx bxl-go-lang', keywords: ['go', 'golang', 'backend'], category: 'tech' },
    { name: 'Node.js', class: 'bx bxl-nodejs', keywords: ['node', 'nodejs', 'backend', 'javascript'], category: 'tech' },
    { name: 'Django', class: 'bx bxl-django', keywords: ['django', 'python', 'backend', 'web'], category: 'tech' },
    { name: 'Flask', class: 'bx bxl-flask', keywords: ['flask', 'python', 'backend', 'web'], category: 'tech' },
    { name: 'Spring', class: 'bx bxl-spring-boot', keywords: ['spring', 'java', 'backend'], category: 'tech' },
    { name: 'Docker', class: 'bx bxl-docker', keywords: ['docker', 'container', 'devops'], category: 'tech' },
    { name: 'Kubernetes', class: 'bx bxl-kubernetes', keywords: ['kubernetes', 'k8s', 'devops', 'container'], category: 'tech' },
    { name: 'AWS', class: 'bx bxl-aws', keywords: ['aws', 'amazon', 'cloud', 'devops'], category: 'tech' },
    { name: 'Git', class: 'bx bxl-git', keywords: ['git', 'version control', 'devops'], category: 'tech' },
    { name: 'PostgreSQL', class: 'bx bxl-postgresql', keywords: ['postgresql', 'postgres', 'database', 'sql'], category: 'tech' },
    { name: 'MongoDB', class: 'bx bxl-mongodb', keywords: ['mongodb', 'mongo', 'database', 'nosql'], category: 'tech' },
    { name: 'Redis', class: 'bx bxl-redis', keywords: ['redis', 'cache', 'database'], category: 'tech' },
    { name: 'Tailwind CSS', class: 'bx bxl-tailwind-css', keywords: ['tailwind', 'css', 'frontend', 'styling'], category: 'tech' },
    { name: 'Bootstrap', class: 'bx bxl-bootstrap', keywords: ['bootstrap', 'css', 'frontend'], category: 'tech' },
    { name: 'Sass', class: 'bx bxl-sass', keywords: ['sass', 'scss', 'css', 'frontend'], category: 'tech' },
    { name: 'Figma', class: 'bx bxl-figma', keywords: ['figma', 'design', 'ui', 'ux'], category: 'tech' },
    { name: 'Firebase', class: 'bx bxl-firebase', keywords: ['firebase', 'google', 'backend', 'database'], category: 'tech' },
    { name: 'GraphQL', class: 'bx bxl-graphql', keywords: ['graphql', 'api', 'backend'], category: 'tech' },
    { name: 'HTML5', class: 'bx bxl-html5', keywords: ['html', 'html5', 'frontend', 'web'], category: 'tech' },
    { name: 'CSS3', class: 'bx bxl-css3', keywords: ['css', 'css3', 'frontend', 'styling'], category: 'tech' },
];

// Social media icons
export const SOCIAL_ICONS: IconDefinition[] = [
    { name: 'LinkedIn', class: 'bx bxl-linkedin', keywords: ['linkedin', 'professional', 'network'], category: 'social' },
    { name: 'GitHub', class: 'bx bxl-github', keywords: ['github', 'code', 'git'], category: 'social' },
    { name: 'Twitter/X', class: 'bx bxl-twitter', keywords: ['twitter', 'x', 'social'], category: 'social' },
    { name: 'Instagram', class: 'bx bxl-instagram', keywords: ['instagram', 'social', 'photos'], category: 'social' },
    { name: 'Facebook', class: 'bx bxl-facebook', keywords: ['facebook', 'social'], category: 'social' },
    { name: 'YouTube', class: 'bx bxl-youtube', keywords: ['youtube', 'video', 'social'], category: 'social' },
    { name: 'Medium', class: 'bx bxl-medium', keywords: ['medium', 'blog', 'writing'], category: 'social' },
    { name: 'Dev.to', class: 'bx bxl-dev-to', keywords: ['dev', 'devto', 'blog'], category: 'social' },
    { name: 'Stack Overflow', class: 'bx bxl-stack-overflow', keywords: ['stackoverflow', 'stack', 'qa'], category: 'social' },
    { name: 'Dribbble', class: 'bx bxl-dribbble', keywords: ['dribbble', 'design', 'portfolio'], category: 'social' },
    { name: 'Behance', class: 'bx bxl-behance', keywords: ['behance', 'design', 'portfolio'], category: 'social' },
    { name: 'Discord', class: 'bx bxl-discord', keywords: ['discord', 'chat', 'community'], category: 'social' },
    { name: 'Slack', class: 'bx bxl-slack', keywords: ['slack', 'chat', 'work'], category: 'social' },
    { name: 'Telegram', class: 'bx bxl-telegram', keywords: ['telegram', 'chat', 'messaging'], category: 'social' },
    { name: 'WhatsApp', class: 'bx bxl-whatsapp', keywords: ['whatsapp', 'chat', 'messaging'], category: 'social' },
    { name: 'Email', class: 'bx bx-envelope', keywords: ['email', 'mail', 'contact'], category: 'social' },
    { name: 'Website', class: 'bx bx-link', keywords: ['website', 'web', 'link', 'url'], category: 'social' },
];

// General purpose icons
export const GENERAL_ICONS: IconDefinition[] = [
    { name: 'Code', class: 'bx bx-code', keywords: ['code', 'programming', 'dev'], category: 'general' },
    { name: 'Terminal', class: 'bx bx-terminal', keywords: ['terminal', 'command', 'cli'], category: 'general' },
    { name: 'Database', class: 'bx bx-data', keywords: ['database', 'data', 'storage'], category: 'general' },
    { name: 'Server', class: 'bx bx-server', keywords: ['server', 'backend', 'hosting'], category: 'general' },
    { name: 'Cloud', class: 'bx bx-cloud', keywords: ['cloud', 'hosting', 'saas'], category: 'general' },
    { name: 'Mobile', class: 'bx bx-mobile', keywords: ['mobile', 'phone', 'app'], category: 'general' },
    { name: 'Desktop', class: 'bx bx-desktop', keywords: ['desktop', 'computer', 'pc'], category: 'general' },
    { name: 'Brain/AI', class: 'bx bx-brain', keywords: ['ai', 'ml', 'brain', 'intelligence'], category: 'general' },
    { name: 'Chip', class: 'bx bx-chip', keywords: ['chip', 'processor', 'hardware'], category: 'general' },
    { name: 'Cog/Settings', class: 'bx bx-cog', keywords: ['settings', 'config', 'gear'], category: 'general' },
    { name: 'Rocket', class: 'bx bx-rocket', keywords: ['rocket', 'launch', 'fast'], category: 'general' },
    { name: 'Shield/Security', class: 'bx bx-shield', keywords: ['security', 'protect', 'safe'], category: 'general' },
    { name: 'Chart/Analytics', class: 'bx bx-line-chart', keywords: ['chart', 'analytics', 'data'], category: 'general' },
    { name: 'Book/Docs', class: 'bx bx-book', keywords: ['book', 'docs', 'documentation'], category: 'general' },
    { name: 'Palette/Design', class: 'bx bx-palette', keywords: ['palette', 'design', 'color', 'art'], category: 'general' },
];

// All icons combined
export const ALL_ICONS: IconDefinition[] = [
    ...TECH_ICONS,
    ...SOCIAL_ICONS,
    ...GENERAL_ICONS,
];

// Social platform presets with auto-detection
export const SOCIAL_PLATFORM_PRESETS: SocialPlatform[] = [
    { platform: 'LinkedIn', icon: 'bx bxl-linkedin', urlPattern: /linkedin\.com/i, placeholder: 'https://linkedin.com/in/username' },
    { platform: 'GitHub', icon: 'bx bxl-github', urlPattern: /github\.com/i, placeholder: 'https://github.com/username' },
    { platform: 'Twitter/X', icon: 'bx bxl-twitter', urlPattern: /(twitter\.com|x\.com)/i, placeholder: 'https://twitter.com/username' },
    { platform: 'Instagram', icon: 'bx bxl-instagram', urlPattern: /instagram\.com/i, placeholder: 'https://instagram.com/username' },
    { platform: 'Facebook', icon: 'bx bxl-facebook', urlPattern: /facebook\.com/i, placeholder: 'https://facebook.com/username' },
    { platform: 'YouTube', icon: 'bx bxl-youtube', urlPattern: /youtube\.com/i, placeholder: 'https://youtube.com/@channel' },
    { platform: 'Medium', icon: 'bx bxl-medium', urlPattern: /medium\.com/i, placeholder: 'https://medium.com/@username' },
    { platform: 'Dev.to', icon: 'bx bxl-dev-to', urlPattern: /dev\.to/i, placeholder: 'https://dev.to/username' },
    { platform: 'Stack Overflow', icon: 'bx bxl-stack-overflow', urlPattern: /stackoverflow\.com/i, placeholder: 'https://stackoverflow.com/users/...' },
    { platform: 'Dribbble', icon: 'bx bxl-dribbble', urlPattern: /dribbble\.com/i, placeholder: 'https://dribbble.com/username' },
    { platform: 'Behance', icon: 'bx bxl-behance', urlPattern: /behance\.net/i, placeholder: 'https://behance.net/username' },
    { platform: 'Discord', icon: 'bx bxl-discord', urlPattern: /discord\.(gg|com)/i, placeholder: 'https://discord.gg/invite' },
    { platform: 'Telegram', icon: 'bx bxl-telegram', urlPattern: /(t\.me|telegram\.me)/i, placeholder: 'https://t.me/username' },
    { platform: 'WhatsApp', icon: 'bx bxl-whatsapp', urlPattern: /wa\.me/i, placeholder: 'https://wa.me/1234567890' },
    { platform: 'Email', icon: 'bx bx-envelope', urlPattern: /^mailto:/i, placeholder: 'mailto:email@example.com' },
    { platform: 'Custom/Other', icon: 'bx bx-link', urlPattern: /.*/, placeholder: 'https://yourwebsite.com' },
];

// Utility function to search icons
export function searchIcons(query: string, category?: 'social' | 'tech' | 'general'): IconDefinition[] {
    const normalizedQuery = query.toLowerCase().trim();

    let icons = category ? ALL_ICONS.filter(icon => icon.category === category) : ALL_ICONS;

    if (!normalizedQuery) return icons;

    return icons.filter(icon =>
        icon.name.toLowerCase().includes(normalizedQuery) ||
        icon.keywords.some(keyword => keyword.includes(normalizedQuery))
    );
}

// Auto-detect social platform from URL
export function detectPlatformFromUrl(url: string): SocialPlatform | null {
    for (const platform of SOCIAL_PLATFORM_PRESETS) {
        if (platform.urlPattern.test(url)) {
            return platform;
        }
    }
    return null;
}
