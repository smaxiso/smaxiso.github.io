'use client'
import { motion } from "framer-motion"
import { useSiteConfig } from "@/context/ProfileContext"
import { useState } from "react"
import { useToast } from "@/context/ToastContext"
import confetti from "canvas-confetti"

export function ContactSection() {
    const siteConfig = useSiteConfig();
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const formElement = e.currentTarget;

        try {
            const response = await fetch("https://formspree.io/f/xqkreprr", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showToast("Message sent successfully! I'll get back to you soon.", "success");
                formElement.reset();
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#2563EB', '#4F46E5', '#10B981', '#F59E0B']
                });
            } else {
                showToast("Oops! Something went wrong. Please try again.", "error");
            }
        } catch (error) {
            showToast("Error sending message. Please check your connection.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-20 relative overflow-hidden bg-white dark:bg-black transition-colors duration-300">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="container max-w-5xl px-4 md:px-6 mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900 dark:text-white">Get In Touch</h2>
                    <p className="mx-auto max-w-[600px] text-slate-600 dark:text-gray-400 text-lg">
                        Have a project in mind or just want to say hi? Feel free to reach out!
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto items-start">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass-card dark:!bg-black dark:!backdrop-blur-none rounded-2xl p-4 sm:p-8 border border-white/40 dark:border-white/10 shadow-xl dark:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-white mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-white/60 dark:border-neutral-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all bg-white/50 dark:bg-neutral-900 focus:bg-white dark:focus:bg-black backdrop-blur-sm shadow-inner dark:text-white dark:placeholder-neutral-500"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-white mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-white/60 dark:border-neutral-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all bg-white/50 dark:bg-neutral-900 focus:bg-white dark:focus:bg-black backdrop-blur-sm shadow-inner dark:text-white dark:placeholder-neutral-500"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 dark:text-white mb-2">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    required
                                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-white/60 dark:border-neutral-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all bg-white/50 dark:bg-neutral-900 focus:bg-white dark:focus:bg-black backdrop-blur-sm shadow-inner dark:text-white dark:placeholder-neutral-500"
                                    placeholder="Project Inquiry"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-white mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={4}
                                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-white/60 dark:border-neutral-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all bg-white/50 dark:bg-neutral-900 focus:bg-white dark:focus:bg-black backdrop-blur-sm shadow-inner dark:text-white dark:placeholder-neutral-500"
                                    placeholder="How can I help you?"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 sm:py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-bold shadow-lg shadow-blue-200/50 dark:shadow-none transition-all hover:shadow-xl hover:-translate-y-1 active:translate-y-0 block text-center flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Social Links */}
                    <div className="space-y-8 flex flex-col justify-center h-full">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Connect with me</h3>
                            <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-8">
                                I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                            </p>
                        </div>

                        {(() => {
                            // Platform brand colors
                            const brandColors: Record<string, { icon: string; bg: string; hover: string }> = {
                                linkedin: {
                                    icon: 'text-[#0A66C2]',
                                    bg: 'hover:bg-[#0A66C2]/10 dark:hover:bg-[#0A66C2]/20',
                                    hover: 'group-hover:text-[#0A66C2]'
                                },
                                github: {
                                    icon: 'text-slate-800 dark:text-white',
                                    bg: 'hover:bg-slate-800/10 dark:hover:bg-white/10',
                                    hover: 'group-hover:text-slate-900 dark:group-hover:text-white'
                                },
                                email: {
                                    icon: 'text-blue-600 dark:text-blue-400',
                                    bg: 'hover:bg-blue-600/10 dark:hover:bg-blue-400/20',
                                    hover: 'group-hover:text-blue-700 dark:group-hover:text-blue-300'
                                },
                                whatsapp: {
                                    icon: 'text-[#25D366]',
                                    bg: 'hover:bg-[#25D366]/10 dark:hover:bg-[#25D366]/20',
                                    hover: 'group-hover:text-[#25D366]'
                                },
                                facebook: {
                                    icon: 'text-[#1877F2]',
                                    bg: 'hover:bg-[#1877F2]/10 dark:hover:bg-[#1877F2]/20',
                                    hover: 'group-hover:text-[#1877F2]'
                                },
                                instagram: {
                                    icon: 'text-[#E4405F]',
                                    bg: 'hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#E4405F] hover:to-[#833AB4] hover:text-white',
                                    hover: 'group-hover:text-[#E4405F]'
                                },
                                twitter: {
                                    icon: 'text-[#1DA1F2]',
                                    bg: 'hover:bg-[#1DA1F2]/10 dark:hover:bg-[#1DA1F2]/20',
                                    hover: 'group-hover:text-[#1DA1F2]'
                                },
                                medium: {
                                    icon: 'text-slate-800 dark:text-white',
                                    bg: 'hover:bg-slate-800/10 dark:hover:bg-white/10',
                                    hover: 'group-hover:text-slate-900 dark:group-hover:text-white'
                                },
                            };

                            // Categorize platforms
                            const primaryPlatforms = ['linkedin', 'github', 'email'];
                            const primary = siteConfig.home.socialLinks.filter(s =>
                                primaryPlatforms.includes(s.platform.toLowerCase())
                            );
                            const secondary = siteConfig.home.socialLinks.filter(s =>
                                !primaryPlatforms.includes(s.platform.toLowerCase())
                            );

                            return (
                                <div className="space-y-6">
                                    {/* Primary Professional Links */}
                                    {primary.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Professional</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {primary.map((social) => {
                                                    const colors = brandColors[social.platform.toLowerCase()] || brandColors.email;
                                                    return (
                                                        <a
                                                            key={social.platform}
                                                            href={social.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className={`group flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 ${colors.bg} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}
                                                        >
                                                            <i className={`${social.icon} text-xl ${colors.icon} group-hover:scale-110 transition-transform`}></i>
                                                            <span className={`font-semibold text-slate-700 dark:text-white capitalize ${colors.hover} transition-colors`}>
                                                                {social.platform}
                                                            </span>
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Secondary Social Links */}
                                    {secondary.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Social</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                {secondary.map((social) => {
                                                    const colors = brandColors[social.platform.toLowerCase()] || brandColors.email;
                                                    return (
                                                        <a
                                                            key={social.platform}
                                                            href={social.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className={`group flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 ${colors.bg} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}
                                                        >
                                                            <i className={`${social.icon} text-lg ${colors.icon} group-hover:scale-110 transition-transform`}></i>
                                                            <span className={`font-medium text-sm text-slate-700 dark:text-white capitalize ${colors.hover} transition-colors`}>
                                                                {social.platform}
                                                            </span>
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </section>
    )
}
