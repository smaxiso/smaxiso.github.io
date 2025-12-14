import siteConfig from "@/data/site-config.json";

export default function Footer() {
    return (
        <footer className="footer section">
            <div className="footer__container bd-grid container text-center">
                <h2 className="footer__title text-2xl font-bold mb-4">{siteConfig.site.author}</h2>
                <p className="footer__description mb-6 text-on-surface-variant">
                    {siteConfig.home.subtitle}
                </p>

                <div className="footer__socials flex justify-center gap-6 mb-8">
                    {siteConfig.footer.socialLinks.map((link) => (
                        <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer__social-link text-2xl text-on-surface hover:text-primary-600 transition-colors"
                        >
                            <i className={link.icon}></i>
                        </a>
                    ))}
                </div>

                <p className="footer__copy text-sm text-on-surface-variant">
                    {siteConfig.footer.copyright}
                </p>
            </div>
        </footer>
    );
}
