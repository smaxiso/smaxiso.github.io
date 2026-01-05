'use client'
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Project } from "@/types"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

interface ProjectsProps {
    projects: Project[]
}

export function Projects({ projects }: ProjectsProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeCategory, setActiveCategory] = useState("All");

    // Carousel state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Category tabs refs for scrolling
    const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    // Extract unique categories
    const categories = ["All", ...Array.from(new Set(projects.map(p => p.category))).filter(Boolean)];

    // Filter projects
    const filteredProjects = activeCategory === "All"
        ? projects
        : projects.filter(p => p.category === activeCategory);

    // Normalize Project Data for Modal
    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
    };

    // Handle category change with auto-scroll
    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);

        // Scroll the selected tab to center
        setTimeout(() => {
            tabRefs.current[category]?.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }, 100);
    };

    // Carousel navigation
    const nextProject = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
    };

    const prevProject = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
    };

    const goToProject = (index: number) => {
        setCurrentIndex(index);
    };

    // Auto-advance carousel
    useEffect(() => {
        if (isPaused || selectedProject) return;
        const interval = setInterval(() => {
            nextProject();
        }, 5000);
        return () => clearInterval(interval);
    }, [isPaused, selectedProject, projects.length]);

    const currentProject = projects[currentIndex];

    return (
        <section id="work" className="py-20 relative overflow-hidden bg-slate-50 dark:bg-black transition-colors duration-300">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-40 left-0 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-40 right-0 w-80 h-80 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container max-w-5xl px-4 md:px-6 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">My Work / Projects</h2>
                    <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Showcase of my professional work, internships, and side projects.
                    </p>
                </motion.div>

                {/* Project Carousel */}
                <div className="max-w-5xl mx-auto mb-12 md:mb-16">
                    {/* Featured Work Label */}
                    <div className="text-center mb-6">
                        <h3 className="text-sm font-bold tracking-widest text-blue-600 uppercase">
                            Featured Work
                        </h3>
                    </div>
                    <div className="relative">
                        {/* Main Carousel */}
                        <div className="relative h-[450px] md:h-[500px] lg:h-[600px] rounded-xl md:rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 backdrop-blur-sm border border-slate-200 dark:border-neutral-800">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0"
                                >
                                    <div className="flex flex-col md:grid md:grid-cols-2 h-full">
                                        {/* Project Image */}
                                        <div className="relative h-48 md:h-full bg-slate-700">
                                            {currentProject?.image && (
                                                <Image
                                                    src={currentProject.image.startsWith('http') ? currentProject.image : `/ ${currentProject.image} `}
                                                    alt={currentProject.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>

                                        {/* Project Details */}
                                        <div className="p-5 md:p-8 lg:p-12 flex flex-col justify-center bg-white dark:bg-neutral-900 overflow-y-auto">
                                            <span className="text-xs md:text-sm text-blue-600 font-semibold mb-2">
                                                {currentProject?.category}
                                            </span>
                                            <h4 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4 line-clamp-2">
                                                {currentProject?.title}
                                            </h4>
                                            <p className="text-slate-600 dark:text-gray-400 text-sm md:text-base mb-4 md:mb-6 line-clamp-3 md:line-clamp-4">
                                                {currentProject?.description}
                                            </p>

                                            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
                                                {currentProject?.technologies.slice(0, 5).map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 md:px-3 py-0.5 md:py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] md:text-sm rounded-full"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex flex-wrap gap-2 md:gap-4">
                                                {currentProject?.website && (
                                                    <a
                                                        href={currentProject.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        <i className='bx bx-link-external text-base md:text-lg'></i>
                                                        <span className="hidden sm:inline">Visit Project</span>
                                                        <span className="sm:hidden">Visit</span>
                                                    </a>
                                                )}
                                                {currentProject?.repository && (
                                                    <a
                                                        href={currentProject.repository}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 border border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-slate-300 text-sm md:text-base rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
                                                    >
                                                        <i className='bx bxl-github text-base md:text-lg'></i>
                                                        <span className="hidden sm:inline">View Code</span>
                                                        <span className="sm:hidden">Code</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            <button
                                onClick={prevProject}
                                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
                                aria-label="Previous project"
                            >
                                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-white" />
                            </button>
                            <button
                                onClick={nextProject}
                                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
                                aria-label="Next project"
                            >
                                <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
                            </button>

                            {/* Pause/Play Button */}
                            <button
                                onClick={() => setIsPaused(!isPaused)}
                                className="absolute bottom-2 md:bottom-4 right-2 md:right-4 p-2 md:p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
                                aria-label={isPaused ? "Play autoplay" : "Pause autoplay"}
                            >
                                {isPaused ? <Play className="w-4 h-4 md:w-5 md:h-5 text-white" /> : <Pause className="w-4 h-4 md:w-5 md:h-5 text-white" />}
                            </button>
                        </div>

                        {/* Carousel Indicators */}
                        <div className="flex justify-center gap-1.5 md:gap-2 mt-4 md:mt-6">
                            {projects.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToProject(index)}
                                    className={cn(
                                        "h-1.5 md:h-2 rounded-full transition-all",
                                        index === currentIndex
                                            ? "w-6 md:w-8 bg-blue-500"
                                            : "w-1.5 md:w-2 bg-slate-600 dark:bg-slate-400 hover:bg-slate-500"
                                    )}
                                    aria-label={`Go to project ${index + 1} `}
                                />
                            ))}
                        </div>
                    </div>
                </div>


                {/* Category Tabs */}
                <div className="relative mb-12">
                    {/* Scroll gradient indicators */}
                    <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-slate-50 to-transparent dark:from-black pointer-events-none z-10 md:hidden" />
                    <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-slate-50 to-transparent dark:from-black pointer-events-none z-10 md:hidden" />

                    <div className="overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
                        <div className="flex gap-2 md:gap-4 md:justify-center min-w-max md:min-w-0 px-8 md:px-0">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    ref={(el) => { tabRefs.current[category] = el; }}
                                    onClick={() => handleCategoryChange(category)}
                                    className={cn(
                                        "px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0",
                                        activeCategory === category
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                                            : "glass-card dark:!bg-neutral-900 dark:!backdrop-blur-none dark:text-white dark:!border-white/15 dark:hover:!bg-neutral-800 text-slate-600 hover:bg-white/80 hover:text-blue-600"
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scroll hint for mobile */}
                    <div className="md:hidden text-center -mt-2">
                        <div className="inline-flex items-center gap-1 text-xs text-slate-400">
                            <i className='bx bx-chevrons-left text-sm animate-pulse'></i>
                            <span>Swipe to see more</span>
                            <i className='bx bx-chevrons-right text-sm animate-pulse'></i>
                        </div>
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
                                className="group relative overflow-hidden rounded-2xl glass-card dark:bg-neutral-900 dark:!bg-black border border-white/40 dark:border-white/15 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full cursor-pointer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                {project.image && (
                                    <div className="relative aspect-video overflow-hidden border-b border-white/20 dark:border-white/10">
                                        <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors z-10 duration-500"></div>

                                        {/* Category Sticker */}
                                        <div className="absolute top-3 left-3 z-20">
                                            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold uppercase tracking-wider shadow-sm border border-white/50">
                                                {project.category}
                                            </span>
                                        </div>

                                        <Image
                                            src={project.image.startsWith('http') ? project.image : `/ ${project.image} `}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                )}
                                <div className="p-4 sm:p-6 flex flex-col flex-1 relative bg-white/30 dark:!bg-black backdrop-blur-sm">
                                    {/* Date display moved to a cleaner spot */}
                                    {project.startDate && (
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-gray-400 bg-slate-100/50 dark:bg-neutral-700/50 px-2 py-0.5 rounded-full border border-slate-200/50 dark:border-neutral-600">
                                                {project.startDate} — <span className={!project.endDate ? "text-green-600 dark:text-green-400 font-bold" : ""}>{project.endDate || 'Present'}</span>
                                            </span>
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                        {project.title}
                                    </h3>

                                    <p className="text-slate-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
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
