'use client'
import { motion } from "framer-motion"
import Image from "next/image"
import { useSiteConfig } from "@/context/ProfileContext"
import AnimatedCounter from "@/components/AnimatedCounter"

export function About() {
    const siteConfig = useSiteConfig();
    return (
        <section id="about" className="py-20 bg-white dark:bg-black transition-colors duration-300">
            <div className="container px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    {/* Desktop Image - Hidden on Mobile */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="hidden lg:block relative aspect-square max-w-md mx-auto lg:mx-0 w-full rounded-2xl overflow-hidden shadow-2xl"
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
                            <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase">About Me</h2>
                            <h3 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900 dark:text-white">My Journey</h3>
                        </div>

                        {/* Mobile Image - Visible only on Mobile/Tablet */}
                        <div className="lg:hidden relative aspect-square max-w-sm mx-auto w-full rounded-2xl overflow-hidden shadow-2xl my-8">
                            <Image
                                src={siteConfig.about.image}
                                alt="About Sumit"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="text-slate-600 dark:text-gray-400 text-lg leading-relaxed space-y-4">
                            <p>
                                {siteConfig.about.description}
                            </p>
                            <p className="hidden md:block">
                                I believe in the power of data to transform businesses and lives. My focus is on creating robust, scalable solutions that not only solve immediate problems but enable future growth.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">
                            {siteConfig.about.stats.map(stat => (
                                <div key={stat.label} className="text-center p-4 sm:p-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-shadow group">
                                    <h3 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 group-hover:scale-110 transition-transform inline-block">
                                        <AnimatedCounter end={Number(stat.number)} decimals={stat.number % 1 !== 0 ? 1 : 0} />+
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="pt-6">
                            <a href="/resume" className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-900 dark:bg-white px-8 text-sm font-medium text-white dark:text-black shadow transition-colors hover:bg-slate-700 dark:hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50">
                                <i className='bx bx-file-blank mr-2 text-lg'></i> View Resume
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
