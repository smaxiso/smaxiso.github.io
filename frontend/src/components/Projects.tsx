'use client'
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import Image from "next/image"
import { Project } from "@/types"
import { cn } from "@/lib/utils"

interface ProjectsProps {
    projects: Project[]
}

export function Projects({ projects }: ProjectsProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeCategory, setActiveCategory] = useState("All");

    // Extract unique categories
    const categories = ["All", ...Array.from(new Set(projects.map(p => p.category))).filter(Boolean)];

    // Filter projects
    const filteredProjects = activeCategory === "All"
        ? projects
        : projects.filter(p => p.category === activeCategory);

    // Normalize Project Data for Modal
    const handleProjectClick = (project: Project) => {
        // Map current Project structure to what Modal expects if needed, or update Modal interface
        // Current Project interface: image, website, repository, startDate, endDate
        // Modal interface expects: image_url, project_url, github_url, start_date, end_date
        // We will pass the project as-is and cast or adapt in the Prop pass
        setSelectedProject(project);
    };

    return (
        <section id="work" className="py-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-40 left-0 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-40 right-0 w-80 h-80 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-800">My Work / Projects</h2>
                    <p className="mx-auto max-w-[700px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Showcase of my professional work, internships, and side projects.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex justify-center mb-12 overflow-x-auto pb-4 hide-scrollbar">
                    <div className="flex gap-2 md:gap-4 px-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={cn(
                                    "px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-300 whitespace-nowrap",
                                    activeCategory === category
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                                        : "glass-card text-slate-600 hover:bg-white/80 hover:text-blue-600"
                                )}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    layout
                    className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <motion.div
                                layout
                                key={project.id}
                                onClick={() => handleProjectClick(project)}
                                className="group relative overflow-hidden rounded-2xl glass-card transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full border border-white/40 cursor-pointer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                {project.image && (
                                    <div className="relative aspect-video overflow-hidden border-b border-white/20">
                                        <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors z-10 duration-500"></div>

                                        {/* Category Sticker */}
                                        <div className="absolute top-3 left-3 z-20">
                                            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold uppercase tracking-wider shadow-sm border border-white/50">
                                                {project.category}
                                            </span>
                                        </div>

                                        <Image
                                            src={project.image.startsWith('http') ? project.image : `/${project.image}`}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                )}
                                <div className="p-4 sm:p-6 flex flex-col flex-1 relative bg-white/30 backdrop-blur-sm">
                                    {/* Date display moved to a cleaner spot */}
                                    {project.startDate && (
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="text-[10px] sm:text-xs font-medium text-slate-500 bg-slate-100/50 px-2 py-0.5 rounded-full border border-slate-200/50">
                                                {project.startDate} — <span className={!project.endDate ? "text-green-600 font-bold" : ""}>{project.endDate || 'Present'}</span>
                                            </span>
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-blue-700 transition-colors">
                                        {project.title}
                                    </h3>

                                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                                        {project.technologies.filter(Boolean).slice(0, 4).map(tech => (
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

                                    <div className="flex items-center text-sm font-medium text-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        View Details <i className='bx bx-right-arrow-alt ml-1 text-lg'></i>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Project Details Modal */}
                <ProjectModal
                    isOpen={!!selectedProject}
                    onClose={() => setSelectedProject(null)}
                    project={selectedProject ? {
                        ...selectedProject,
                        image_url: selectedProject.image || '',
                        project_url: selectedProject.website,
                        github_url: selectedProject.repository,
                        start_date: selectedProject.startDate,
                        end_date: selectedProject.endDate,
                        is_present: !selectedProject.endDate
                    } : null}
                />
            </div>
        </section>
    )
}

import { ProjectModal } from "./ProjectModal";
