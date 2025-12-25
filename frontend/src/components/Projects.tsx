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
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl border border-slate-100 flex flex-col h-full"
                            variants={item}
                        >
                            {project.image && (
                                <div className="relative aspect-video overflow-hidden bg-slate-100">
                                    <Image
                                        src={project.image.startsWith('http') ? project.image : `/${project.image}`}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">{project.category}</span>
                                    {project.startDate && <span className="text-xs text-slate-400">{project.startDate} - {project.endDate || 'Present'}</span>}
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                                <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">{project.description}</p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.technologies.slice(0, 4).map(tech => (
                                        <span key={tech} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 4 && (
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                                            +{project.technologies.length - 4}
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-4 mt-auto">
                                    {project.repository && (
                                        <a href={project.repository} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600">
                                            <i className='bx bxl-github text-lg'></i> Repository
                                        </a>
                                    )}
                                    {project.website && (
                                        <a href={project.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600">
                                            <i className='bx bx-link-external text-lg'></i> Live Demo
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
