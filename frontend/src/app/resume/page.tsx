'use client'
import { motion } from "framer-motion"
import { useSiteConfig } from "@/context/ProfileContext"
import Link from "next/link"
import { ArrowLeft, Download, FileText } from "lucide-react"

export default function ResumePage() {
    const siteConfig = useSiteConfig()
    const resumeUrl = siteConfig.resume

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-black flex flex-col">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass-header dark:glass-none dark:bg-black border-b border-white/20 dark:border-white/10 px-6 py-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
                >
                    <ArrowLeft size={20} />
                    <span className="hidden sm:inline">Back to Portfolio</span>
                </Link>

                <h1 className="text-lg font-bold text-slate-900 dark:text-white hidden md:block">
                    {siteConfig.home.name} - Resume
                </h1>

                <a
                    href={resumeUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all font-medium text-sm"
                >
                    <Download size={18} />
                    <span>Download PDF</span>
                </a>
            </header>

            {/* Content - Fixed to fill screen below header */}
            <div className="fixed inset-0 top-16 z-0 flex justify-center bg-slate-200 dark:bg-neutral-900">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full lg:max-w-5xl h-full bg-white dark:bg-neutral-800 flex flex-col shadow-2xl"
                >
                    {!resumeUrl ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500 dark:text-gray-400">
                            <FileText size={48} className="mb-4 text-slate-300 dark:text-neutral-700" />
                            <p>Resume loading or not available...</p>
                        </div>
                    ) : (
                        <div className="flex-1 relative bg-slate-200 dark:bg-neutral-900 h-full">
                            <iframe
                                src={`${resumeUrl}#view=FitH`}
                                className="w-full h-full border-none"
                                title="Resume PDF"
                            >
                            </iframe>

                            {/* Fallback overlay if iframe fails visually (though iframe doesn't support fallback content the same way object does, we can keep a link below if needed, but the header download covers it) */}
                            <div className="md:hidden absolute bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur text-center text-sm text-slate-500 dark:text-gray-400">
                                Tap "Download PDF" above if resume doesn't appear.
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    )
}
