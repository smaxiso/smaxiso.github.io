'use client'
import { motion } from "framer-motion"
import { useSiteConfig } from "@/context/ProfileContext"

export function ContactSection() {
    const siteConfig = useSiteConfig();
    return (
        <section id="contact" className="py-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900">Get In Touch</h2>
                    <p className="mx-auto max-w-[600px] text-slate-600 text-lg">
                        Have a project in mind or just want to say hi? Feel free to reach out!
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto items-start">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass-card rounded-2xl p-4 sm:p-8 border border-white/40 shadow-xl"
                    >
                        <form action="https://formspree.io/f/xqkreprr" method="POST" className="space-y-4 sm:space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-white/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/50 focus:bg-white backdrop-blur-sm shadow-inner"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-white/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/50 focus:bg-white backdrop-blur-sm shadow-inner"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    required
                                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-white/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/50 focus:bg-white backdrop-blur-sm shadow-inner"
                                    placeholder="Project Inquiry"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={4}
                                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-white/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/50 focus:bg-white backdrop-blur-sm shadow-inner resize-none"
                                    placeholder="How can I help you?"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 sm:py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-200/50 transition-all hover:shadow-xl hover:-translate-y-1 block text-center"
                            >
                                Send Message
                            </button>
                        </form>
                    </motion.div>

                    {/* Social Links */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Connect with me</h3>
                            <p className="text-slate-600 leading-relaxed mb-8">
                                I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                            {siteConfig.home.socialLinks.map((social) => (
                                <a
                                    key={social.platform}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl glass-card hover:bg-white/80 hover:scale-[1.02] border border-white/40 shadow-sm hover:shadow-lg transition-all group"
                                >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-blue-100/50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors text-xl sm:text-2xl shadow-inner">
                                        <i className={social.icon}></i>
                                    </div>
                                    <span className="text-base sm:text-lg font-medium text-slate-800 capitalize group-hover:text-blue-700 transition-colors bg-transparent">{social.platform}</span>
                                    <i className='bx bx-right-arrow-alt ml-auto text-xl text-slate-400 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1'></i>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
