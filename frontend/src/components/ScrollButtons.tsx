"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollButtons() {
    const [isVisible, setIsVisible] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }

            // Check if near bottom
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                setIsAtBottom(true);
            } else {
                setIsAtBottom(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    };

    return (
        <div className="fixed bottom-24 md:bottom-6 right-6 flex flex-col gap-3 z-40">
            <AnimatePresence>
                {/* Scroll to Top */}
                {isVisible && (
                    <motion.button
                        key="scroll-to-top"
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        onClick={scrollToTop}
                        className="bg-blue-600 backdrop-blur-md border border-white/20 p-3 rounded-full text-white hover:bg-blue-700 hover:scale-110 transition-all shadow-lg shadow-blue-600/30 group"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                )}

                {/* Scroll to Bottom */}
                {!isAtBottom && (
                    <motion.button
                        key="scroll-to-bottom"
                        initial={{ opacity: 0, scale: 0.5, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -20 }}
                        onClick={scrollToBottom}
                        className="bg-purple-600 backdrop-blur-md border border-white/20 p-3 rounded-full text-white hover:bg-purple-700 hover:scale-110 transition-all shadow-lg shadow-purple-600/30 group"
                        aria-label="Scroll to bottom"
                    >
                        <ArrowDown className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
