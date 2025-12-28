'use client'
import { motion } from "framer-motion"
import Image from "next/image"
import { useSiteConfig } from "@/context/ProfileContext"
import { cn } from "@/lib/utils"

export function Hero() {
    const siteConfig = useSiteConfig();

    return (
        <section className="min-h-screen flex items-center justify-center pt-16 pb-20 md:pb-0 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
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
                            <span className="px-4 py-2 rounded-full glass-card text-blue-700 text-sm font-bold tracking-wider uppercase shadow-sm border border-blue-100/50">
                                {siteConfig.home.greeting}
                            </span>
                        </motion.div>

                        <div className="space-y-2">
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                                {siteConfig.home.name}
                            </h1>
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 pb-2">
                                {siteConfig.home.title}
                            </h2>
                        </div>
                    </div>

                    <p className="text-lg md:text-xl text-slate-600 max-w-[600px] mx-auto md:mx-0 leading-relaxed font-normal">
                        {siteConfig.home.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-4">
                        <a href="#work" className="group relative inline-flex h-10 md:h-12 items-center justify-center overflow-hidden rounded-full bg-blue-600 px-6 font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-xl text-sm md:text-base">
                            <span className="mr-2">View My Work</span>
                            <i className='bx bx-right-arrow-alt text-xl transition-transform group-hover:translate-x-1'></i>
                        </a>
                        <a href="#contact" className="inline-flex h-10 md:h-12 items-center justify-center rounded-full glass-card px-6 font-medium text-slate-900 transition-all duration-300 hover:scale-105 hover:bg-white/80 hover:shadow-lg hover:border-blue-200 text-sm md:text-base">
                            Contact Me
                        </a>
                    </div>

                    <div className="flex gap-6 justify-center md:justify-start pt-8">
                        {siteConfig.home.socialLinks.map((social) => (
                            <a
                                key={social.platform}
                                href={social.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-2xl text-slate-400 hover:text-blue-600 transition-all hover:-translate-y-1 hover:scale-110"
                            >
                                <i className={social.icon}></i>
                            </a>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    className="flex-1 w-full max-w-[400px] md:max-w-[500px] relative z-10"
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                >
                    <div className="relative aspect-square rounded-[2.5rem] overflow-hidden glass-card p-4 transition-transform duration-500 hover:scale-[1.02] hover:rotate-1">
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
                    {/* Floating Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="absolute -bottom-3 right-0 md:-bottom-6 md:-right-6 glass-card px-3 py-2 md:px-6 md:py-4 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 animate-bounce-slow z-20 shadow-lg"
                    >
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-semibold text-[10px] md:text-sm text-slate-700 whitespace-nowrap">Open to Work</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
