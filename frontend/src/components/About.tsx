'use client'
import { motion } from "framer-motion"
import Image from "next/image"
import { siteConfig } from "@/config/site"

export function About() {
    return (
        <section id="about" className="py-20 bg-white">
            <div className="container px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative aspect-square max-w-md mx-auto lg:mx-0 w-full rounded-2xl overflow-hidden shadow-2xl"
                    >
                        <Image
                            src={siteConfig.about.image}
                            alt="About Sumit"
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, k: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6 text-center lg:text-left"
                    >
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{siteConfig.about.title}</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            {siteConfig.about.description}
                        </p>
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            {siteConfig.about.stats.map(stat => (
                                <div key={stat.label} className="text-center p-4 bg-slate-50 rounded-xl">
                                    <h3 className="text-3xl font-bold text-blue-600">{stat.number}+</h3>
                                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="pt-6">
                            <a href={siteConfig.site.url + "/assets/data/Sumit_resume.pdf"} className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-900 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50" download>
                                <i className='bx bx-download mr-2 text-lg'></i> Download Resume
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
