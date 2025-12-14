import Image from "next/image";
import Link from "next/link";
import siteConfig from "@/data/site-config.json";

export default function Hero() {
    const { home } = siteConfig;

    return (
        <section className="home min-h-screen flex items-center justify-center pt-16 relative overflow-hidden" id="home">
            {/* Background decoration or gradients can be added here or via CSS class 'home' */}

            <div className="container relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* Content */}
                    <div className="home__content text-center md:text-left order-2 md:order-1">
                        <span className="home__greeting block text-lg font-medium text-primary-600 mb-4 animate-fade-in-up">
                            {home.greeting}
                        </span>
                        <h1 className="home__title text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up delay-100">
                            I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">{home.name}</span>
                            <br />
                            <span className="text-4xl md:text-5xl text-on-surface">{home.title}</span>
                        </h1>
                        <p className="home__subtitle text-xl text-on-surface-variant mb-8 max-w-lg mx-auto md:mx-0 animate-fade-in-up delay-200">
                            {home.subtitle}
                        </p>

                        <div className="home__actions flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-12 animate-fade-in-up delay-300">
                            {home.ctaButtons.map((btn, index) => (
                                <Link
                                    key={index}
                                    href={btn.href}
                                    className={`btn ${btn.type === 'primary' ? 'btn-primary' : 'btn-ghost'}`}
                                >
                                    <i className={`${btn.icon} text-xl`}></i>
                                    {btn.label}
                                </Link>
                            ))}
                        </div>

                        <div className="home__social flex gap-6 justify-center md:justify-start animate-fade-in-up delay-400">
                            {home.socialLinks.slice(0, 5).map((link) => (
                                <a
                                    key={link.platform}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-2xl text-on-surface hover:text-primary-600 transition-colors transform hover:-translate-y-1"
                                    aria-label={link.ariaLabel}
                                >
                                    <i className={link.icon}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Profile Image */}
                    <div className="home__image flex justify-center order-1 md:order-2 animate-fade-in delay-200">
                        <div className="relative w-80 h-80 md:w-96 md:h-96">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
                            {/* SVG Blob or standard Image */}
                            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-surface-2 shadow-2xl">
                                <Image
                                    src={`/${home.profileImage.src}`}
                                    alt={home.profileImage.alt}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
