```javascript
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Briefcase, Home, Mail, User, FileText, Menu, X, Code, FileUser } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Auto-hide timer ref
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = lastScrollY;
        const diff = latest - previous;
        const isScrollingDown = diff > 0;
        const isScrollingUp = diff < 0;

        // Reset timer on any scroll
        if (timer) clearTimeout(timer);

        if (latest < 100) {
            // Always show at top
            setHidden(false);
        } else if (isScrollingDown) {
            // Hide immediately on scroll down
            setHidden(true);
        } else if (isScrollingUp) {
            // Show on scroll up
            setHidden(false);
            
            // Set auto-hide timer for 3 seconds if we stop scrolling up
            const newTimer = setTimeout(() => {
                // Check if we are still not at top
                if (window.scrollY > 100) {
                    setHidden(true);
                }
            }, 3000);
            setTimer(newTimer);
        }

        setLastScrollY(latest);
    });

    if (pathname === '/resume' || pathname === '/admin') return null;

    // Desktop Nav Items
    const desktopNavItems = [
        { href: "/#work", label: "Work" },
        { href: "/#about", label: "About" },
        { href: "/#skills", label: "Skills" },
        { href: "/#contact", label: "Contact", icon: Mail },
    ];

    // Mobile Bottom Bar Items (Primary)
    const mobilePrimaryItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/#work", label: "Work", icon: Briefcase },
        { href: "/blog", label: "Blog", icon: FileText },
        { href: "/guestbook", label: "Guests", icon: Book },
    ];

    // Mobile Menu Items (Secondary)
    const mobileSecondaryItems = [
        { href: "/#about", label: "About", icon: User },
        { href: "/#skills", label: "Skills", icon: Code },
        { href: "/resume", label: "Resume", icon: FileUser },
        { href: "/#contact", label: "Contact", icon: Mail },
    ];

    return (
        <>
            {/* Desktop: Smart Floating Top Pill */}
            <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 justify-center py-6 px-4 pointer-events-none">
                <motion.div
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ 
                        y: hidden ? -100 : 0, 
                        opacity: hidden ? 0 : 1 
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl"
                >
                    <div className="flex items-center gap-6 text-sm font-medium text-slate-200">
                        {desktopNavItems.map(item => (
                            <Link key={item.label} href={item.href} className="hover:text-blue-400 transition-colors">
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="w-px h-4 bg-white/20 shrink-0"></div>

                    <Link href="/" className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 shrink-0">
                        SK
                    </Link>

                    <div className="w-px h-4 bg-white/20 shrink-0"></div>

                    <div className="flex items-center gap-6 text-sm font-medium text-slate-200">
                        <Link href="/guestbook" className="flex items-center gap-2 hover:text-purple-400 transition-colors group">
                            <Book className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                            Guestbook
                        </Link>
                        <Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link>
                        <Link href="/resume" className="hover:text-blue-400 transition-colors">Resume</Link>
                        <Link href="/#contact" className="hover:text-blue-400 transition-colors">Contact</Link>
                    </div>
                </motion.div>
            </nav>

            {/* Mobile: Experience */}
            <div className="md:hidden">
                {/* Secondary Menu Popup */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                            />

                            {/* Menu Panel */}
                            <motion.div
                                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                                className="fixed bottom-24 right-4 z-50 w-48 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                            >
                                <div className="p-2 space-y-1">
                                    {mobileSecondaryItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Fixed Bottom Bar */}
                <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-t border-white/10 pb-safe pt-2 px-2 md:px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                    <div className="flex justify-between items-center w-full max-w-sm mx-auto">
                        {mobilePrimaryItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                            
                            return (
                                <Link 
                                    key={item.label} 
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex flex - col items - center gap - 1 p - 1 md: p - 2 flex - 1 min - w - [40px] md: min - w - [60px] transition - colors ${
    isActive ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
} `}
                                >
                                    <Icon className={`w - 5 h - 5 md: w - 5 md: h - 5 ${ isActive ? 'fill-blue-400/20' : '' } `} />
                                    <span className="text-[9px] md:text-[10px] font-medium">{item.label}</span>
                                </Link>
                            );
                        })}

                        {/* More Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`flex flex - col items - center gap - 1 p - 1 md: p - 2 flex - 1 min - w - [40px] md: min - w - [60px] transition - colors ${
    isMobileMenuOpen ? 'text-white' : 'text-slate-400 hover:text-slate-200'
} `}
                        >
                            <div className={`p - 0.5 rounded - full transition - all ${ isMobileMenuOpen ? 'bg-white/10' : '' } `}>
                                {isMobileMenuOpen ? (
                                    <X className="w-5 h-5 md:w-5 md:h-5" />
                                ) : (
                                    <Menu className="w-5 h-5 md:w-5 md:h-5" />
                                )}
                            </div>
                            <span className="text-[9px] md:text-[10px] font-medium">More</span>
                        </button>
                    </div>
                </nav>
            </div>
        </>
    );
}
