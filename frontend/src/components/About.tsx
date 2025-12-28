'use client'
import { motion } from "framer-motion"
import Image from "next/image"
import { useSiteConfig } from "@/context/ProfileContext"
import AnimatedCounter from "@/components/AnimatedCounter"

export function About() {
    const siteConfig = useSiteConfig();
    return (
        <section id="about" className="py-20 bg-white dark:bg-slate-900">
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
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8 text-center lg:text-left"
                    >
                        <div className="space-y-4">
                            <h2 className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">About Me</h2>
                            <h3 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900 dark:text-white">My Journey</h3>
                        </div>

                        <div className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed space-y-4">
                            <p>
                                {siteConfig.about.description}
                            </p>
                            <p className="hidden md:block">
                                I believe in the power of data to transform businesses and lives. My focus is on creating robust, scalable solutions that not only solve immediate problems but enable future growth.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">
                            {siteConfig.about.stats.map(stat => (
                                <div key={stat.label} className="text-center p-4 sm:p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow group">
                                    <h3 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 group-hover:scale-110 transition-transform inline-block">
                                        <AnimatedCounter end={parseInt(stat.number)} />+
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="pt-6">
                            <a href="/resume" className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-700 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-slate-700 dark:hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50">
                                <i className='bx bx-file-blank mr-2 text-lg'></i> View Resume
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
