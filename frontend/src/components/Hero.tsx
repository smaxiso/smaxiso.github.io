'use client'
import { motion } from "framer-motion"
import Image from "next/image"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function Hero() {
    return (
        <section className="min-h-screen flex items-center justify-center pt-16 bg-gradient-to-br from-background to-secondary/10 overflow-hidden relative">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] opacity-20"></div>

            <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <motion.div
                    className="flex-1 space-y-6 text-center md:text-left"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                        {siteConfig.home.greeting}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900">
                        {siteConfig.home.name} <br />
                        <span className="text-blue-600">{siteConfig.home.title}</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-[600px] mx-auto md:mx-0 leading-relaxed">
                        {siteConfig.home.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                        <a href="#work" className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-8 text-base font-medium text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700">
                            View Work
                        </a>
                        <a href="#contact" className="inline-flex h-12 items-center justify-center rounded-full border-2 border-slate-200 bg-white px-8 text-base font-medium text-slate-900 shadow-sm transition-transform hover:scale-105 hover:border-blue-600 hover:text-blue-600">
                            Contact Me
                        </a>
                    </div>
                    <div className="flex gap-6 justify-center md:justify-start pt-6">
                        {siteConfig.home.socialLinks.map((social) => (
                            <a
                                key={social.platform}
                                href={social.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-2xl text-slate-400 hover:text-blue-600 transition-colors"
                            >
                                <i className={social.icon}></i>
                            </a>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    className="flex-1 w-full max-w-[400px] md:max-w-[500px]"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                        <Image
                            src={siteConfig.home.profileImage}
                            alt={siteConfig.home.name}
                            fill
                            className="object-cover object-top"
                            priority
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
