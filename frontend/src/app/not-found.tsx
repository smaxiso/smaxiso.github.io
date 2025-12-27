'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, MoveLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
            {/* Background Animations */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-8 sm:p-12 md:p-16 rounded-3xl text-center max-w-lg w-full border border-white/40 shadow-xl"
            >
                <motion.h1
                    className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                        delay: 0.2
                    }}
                >
                    404
                </motion.h1>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
                    Page Not Found
                </h2>

                <p className="text-slate-600 mb-8 leading-relaxed">
                    Oops! The page you're looking for seems to have vanished into the digital void.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
                    >
                        <Home size={18} />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-full border border-slate-200 hover:bg-slate-50 transition-all hover:scale-105"
                    >
                        <MoveLeft size={18} />
                        Go Back
                    </button>
                </div>
            </motion.div>
        </main>
    )
}
