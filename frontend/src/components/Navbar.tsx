"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();

    if (pathname === '/resume' || pathname === '/admin') return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-4 pointer-events-none">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/20 rounded-full px-3 py-2 md:px-6 md:py-3 flex items-center gap-2 md:gap-8 shadow-2xl max-w-[98vw] overflow-x-auto hide-scrollbar whitespace-nowrap"
            >
                <div className="flex items-center gap-2 md:gap-6 text-xs md:text-sm font-medium text-slate-200">
                    <Link href="/#work" className="hover:text-blue-400 transition-colors">Work</Link>
                    <Link href="/#about" className="hover:text-blue-400 transition-colors">About</Link>
                    <Link href="/#skills" className="hover:text-blue-400 transition-colors">Skills</Link>
                </div>

                <div className="w-px h-3 md:h-4 bg-white/20 shrink-0"></div>

                <Link href="/" className="font-bold text-base md:text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 shrink-0">
                    SK
                </Link>

                <div className="w-px h-3 md:h-4 bg-white/20 shrink-0"></div>

                <div className="flex items-center gap-2 md:gap-6 text-xs md:text-sm font-medium text-slate-200">
                    <Link href="/guestbook" className="flex items-center gap-1.5 md:gap-2 hover:text-purple-400 transition-colors group">
                        <Book className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-translate-y-0.5 transition-transform" />
                        Guestbook
                    </Link>
                    <Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link>
                    <Link href="/resume" className="hover:text-blue-400 transition-colors">Resume</Link>
                    <Link href="/#contact" className="hover:text-blue-400 transition-colors">Contact</Link>
                </div>
            </motion.div>
        </nav>
    );
}
