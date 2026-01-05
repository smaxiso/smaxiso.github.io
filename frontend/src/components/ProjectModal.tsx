'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github, Calendar, Tag } from 'lucide-react'
import Image from 'next/image'

// Reuse the Project interface or import it if shared
// Ideally this should be imported from @/context/ProfileContext or where it's defined
interface Project {
    id: string
    title: string
    description: string
    technologies: string[]
    image_url: string
    project_url?: string
    github_url?: string
    category: string
    start_date?: string
    end_date?: string
    is_present?: boolean
}

interface ProjectModalProps {
    project: Project | null
    isOpen: boolean
    onClose: () => void
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    // Handle Back Button & History
    useEffect(() => {
        if (isOpen) {
            // Push state when opened
            window.history.pushState({ modalOpen: true }, '', '#project-details')

            const handlePopState = () => {
                // If back button pressed, close modal
                onClose()
            }

            window.addEventListener('popstate', handlePopState)

            return () => {
                window.removeEventListener('popstate', handlePopState)
                // If closing manually (not via back button), revert URL
                if (window.location.hash === '#project-details') {
                    window.history.back()
                }
            }
        }
    }, [isOpen, onClose])

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && project && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
                    >
                        {/* Modal Card */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 100 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 100 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-4xl h-full sm:h-auto sm:max-h-[85vh] bg-white dark:bg-black rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col glass-card border-0 sm:border border-white/20 dark:border-white/10 relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
                            >
                                <X size={20} />
                            </button>

                            {/* Scrollable Content Area */}
                            <div className="overflow-y-auto custom-scrollbar flex-1">
                                {/* Hero Image */}
                                <div className="relative h-48 sm:h-64 md:h-80 w-full bg-slate-100 dark:bg-neutral-900">
                                    <Image
                                        src={project.image_url}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{project.title}</h2>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-left bg-white dark:bg-black">
                                    {/* Left: Description */}
                                    <div className="md:col-span-2 space-y-6">
                                        {/* Metadata Row */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
                                                {project.category}
                                            </span>
                                            {project.start_date && (
                                                <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-500 dark:text-gray-300 bg-slate-100 dark:bg-neutral-900 px-3 py-1 rounded-full border border-slate-200 dark:border-neutral-800">
                                                    <Calendar size={14} />
                                                    <span>
                                                        {new Date(project.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                        {' - '}
                                                        {project.is_present
                                                            ? 'Present'
                                                            : project.end_date
                                                                ? new Date(project.end_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
                                                                : ''
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                                About the Project
                                            </h3>
                                            <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                                                {project.description}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                                                <Tag size={16} className="text-blue-600 dark:text-blue-400" />
                                                Technologies
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {project.technologies.filter(Boolean).map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="px-3 py-1.5 bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-slate-200 dark:border-neutral-800 hover:bg-blue-50 dark:hover:bg-neutral-800 hover:text-blue-700 dark:hover:text-white hover:border-blue-200 dark:hover:border-neutral-700 transition-colors"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 dark:bg-neutral-900 p-6 rounded-xl border border-slate-200 dark:border-neutral-800 sticky top-0">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Links</h3>
                                            <div className="space-y-3">
                                                {project.project_url && (
                                                    <a
                                                        href={project.project_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                                    >
                                                        <ExternalLink size={18} />
                                                        Live Demo
                                                    </a>
                                                )}
                                                {project.github_url && (
                                                    <a
                                                        href={project.github_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-black text-slate-700 dark:text-white border border-slate-200 dark:border-neutral-800 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-gray-200 transition-all"
                                                    >
                                                        <Github size={18} />
                                                        View Code
                                                    </a>
                                                )}
                                                {!project.project_url && !project.github_url && (
                                                    <div className="text-center text-sm text-slate-500 dark:text-gray-500 italic py-2">
                                                        No public links available
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
