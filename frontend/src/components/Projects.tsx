'use client'
import { motion } from "framer-motion"
import Image from "next/image"
import { Project } from "@/types"
import { cn } from "@/lib/utils"

interface ProjectsProps {
    projects: Project[]
}

export function Projects({ projects }: ProjectsProps) {
    // Filter projects if needed, or sort
    // For now display all

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <section id="work" className="py-20 bg-slate-50">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Work / Projects</h2>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                        Showcase of my professional work, internships, and side projects.
                    </p>
                </div>

                <motion.div
                    className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            className="group relative overflow-hidden rounded-2xl glass-card transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full border border-white/40"
                            variants={item}
                        >
                            {project.image && (
                                <div className="relative aspect-video overflow-hidden border-b border-white/20">
                                    <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                                    <Image
                                        src={project.image.startsWith('http') ? project.image : `/${project.image}`}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            )}
                            <div className="p-4 sm:p-6 flex flex-col flex-1 relative bg-white/30 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="px-2 py-1 rounded-md bg-blue-100/50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200/50">
                                        {project.category}
                                    </span>
                                    {project.startDate && (
                                        <span className="text-xs font-medium text-slate-500">
                                            {project.startDate} — <span className={!project.endDate ? "text-green-600 font-bold" : ""}>{project.endDate || 'Present'}</span>
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-blue-700 transition-colors">
                                    {project.title}
                                </h3>

                                <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                                    {project.technologies.slice(0, 4).map(tech => (
                                        <span key={tech} className="px-2.5 py-1 bg-white/60 text-slate-700 text-xs rounded-full font-medium border border-white/40 shadow-sm">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 4 && (
                                        <span className="px-2.5 py-1 bg-white/40 text-slate-500 text-xs rounded-full font-medium border border-white/20">
                                            +{project.technologies.length - 4}
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-slate-200/50">
                                    {project.repository && (
                                        <a href={project.repository} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                                            <i className='bx bxl-github text-xl'></i> Code
                                        </a>
                                    )}
                                    {project.website && (
                                        <a href={project.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors ml-auto">
                                            <i className='bx bx-link-external text-xl'></i> Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
