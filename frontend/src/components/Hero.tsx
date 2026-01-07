'use client'
import { motion } from "framer-motion"
import Image from "next/image"
import { useSiteConfig } from "@/context/ProfileContext"
import { cn } from "@/lib/utils"

export function Hero() {
    const siteConfig = useSiteConfig();

    return (
        <section className="min-h-screen flex items-center justify-center pt-16 pb-20 md:pb-0 relative overflow-hidden bg-white dark:bg-black transition-colors duration-300">
            {/* Background Elements - Professional Muted Tones */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-slate-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center gap-12 md:gap-20">
                <motion.div
                    className="flex-1 space-y-8 text-center md:text-left z-10"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block"
                        >
                            <span className="px-4 py-2 rounded-full glass-card dark:!bg-black dark:text-white dark:!border-white/15 dark:!shadow-[0_0_15px_rgba(255,255,255,0.07)] text-blue-700 text-sm font-bold tracking-wider uppercase shadow-sm border border-blue-100/50">
                                {siteConfig.home.greeting}
                            </span>
                        </motion.div>

                        <div className="space-y-2">
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                                {siteConfig.home.name}
                            </h1>
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 pb-2">
                                {siteConfig.home.title}
                            </h2>
                        </div>
                    </div>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 max-w-[600px] mx-auto md:mx-0 leading-relaxed font-normal">
                        {siteConfig.home.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-4">
                        <a href="#work" className="group relative inline-flex h-10 md:h-12 items-center justify-center overflow-hidden rounded-full bg-blue-600 px-6 font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-xl text-sm md:text-base">
                            <span className="mr-2">View My Work</span>
                            <i className='bx bx-right-arrow-alt text-xl transition-transform group-hover:translate-x-1'></i>
                        </a>
                        <a href="#contact" className="inline-flex h-10 md:h-12 items-center justify-center rounded-full glass-card dark:!bg-black dark:text-white dark:!border-white/15 dark:shadow-[0_0_15px_rgba(255,255,255,0.07)] px-6 font-medium text-slate-900 transition-all duration-300 hover:scale-105 hover:bg-white/80 dark:hover:!bg-black dark:hover:!shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:shadow-lg hover:border-blue-200 text-sm md:text-base">
                            Contact Me
                        </a>
                    </div>

                    <motion.div
                        className="flex gap-6 justify-center md:justify-start pt-8"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
                        }}
                    >
                        {siteConfig.home.socialLinks.map((social, index) => (
                            <motion.a
                                key={social.platform}
                                href={social.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-2xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                variants={{
                                    hidden: { opacity: 0, y: 30, scale: 0.5, filter: "blur(5px)" },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        filter: "blur(0px)",
                                        transition: { type: "spring", stiffness: 200, damping: 15 }
                                    }
                                }}
                                whileHover={{ scale: 1.2, y: -2 }}
                            >
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{
                                        duration: 3, // Fixed smoother duration
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.2, // Keep delay for staggered effect
                                        repeatType: "mirror" // Smoother easing return
                                    }}
                                    style={{ willChange: "transform", transform: "translateZ(0)" }} // Force hardware acceleration
                                >
                                    <i className={social.icon}></i>
                                </motion.div>
                            </motion.a>
                        ))}
                    </motion.div>
                </motion.div>

                <motion.div
                    className="flex-1 w-full max-w-[400px] md:max-w-[500px] relative z-10"
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                >
                    <div className="relative aspect-square rounded-[2.5rem] overflow-hidden glass-card dark:bg-neutral-900/30 dark:border-white/10 p-4 transition-transform duration-500 hover:scale-[1.02] hover:rotate-1">
                        <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-inner">
                            <Image
                                src={siteConfig.home.profileImage}
                                alt={siteConfig.home.name}
                                fill
                                className="object-cover object-top"
                                priority
                            />
                        </div>
                    </div>
                    {/* Floating Badge - Conditionally Rendered */}
                    {siteConfig?.show_work_badge && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="absolute -bottom-3 right-0 md:-bottom-6 md:-right-6 glass-card dark:!bg-neutral-900 dark:border-neutral-800 px-3 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 animate-pulse-slow z-20 shadow-lg border border-white/60"
                        >
                            <div className="relative">
                                <div className="w-2 h-2 md:w-3 md:h-3 bg-emerald-500 rounded-full"></div>
                                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                            </div>
                            <span className="font-medium text-[10px] md:text-sm text-slate-600 dark:text-white whitespace-nowrap">Open to Work</span>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    )
}
