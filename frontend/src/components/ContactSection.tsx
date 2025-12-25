'use client'
import { motion } from "framer-motion"
import { useSiteConfig } from "@/context/ProfileContext"

export function ContactSection() {
    const siteConfig = useSiteConfig();
    return (
        <section id="contact" className="py-20 bg-slate-50">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-800">Get In Touch</h2>
                    <p className="mx-auto max-w-[600px] text-slate-500 text-lg">
                        Have a project in mind or just want to say hi? Feel free to reach out!
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
                    >
                        <form action="https://formspree.io/f/xqkreprr" method="POST" className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white"
                                    placeholder="Project Inquiry"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50 focus:bg-white resize-none"
                                    placeholder="How can I help you?"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:-translate-y-1 block text-center"
                            >
                                Send Message
                            </button>
                        </form>
                    </motion.div>

                    {/* Social Links */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Connect with me</h3>
                            <p className="text-slate-600 leading-relaxed mb-8">
                                I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {siteConfig.home.socialLinks.map((social) => (
                                <a
                                    key={social.platform}
                                    href={social.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group"
                                >
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors text-2xl">
                                        <i className={social.icon}></i>
                                    </div>
                                    <span className="text-lg font-medium text-slate-700 capitalize group-hover:text-blue-700 transition-colors">{social.platform}</span>
                                    <i className='bx bx-right-arrow-alt ml-auto text-xl text-slate-300 group-hover:text-blue-600 transition-colors'></i>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
