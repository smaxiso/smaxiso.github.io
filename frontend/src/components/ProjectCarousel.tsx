"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { getProjects } from "@/lib/api";
import { Project } from "@/types";
import Image from "next/image";

export default function ProjectCarousel() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const data = await getProjects();
                // Show only top 6 projects
                setProjects(data.slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    // Auto-play functionality
    useEffect(() => {
        if (!isPlaying || projects.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % projects.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [isPlaying, projects.length]);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    };

    if (loading || projects.length === 0) {
        return null;
    }

    const currentProject = projects[currentIndex];

    return (
        <section className="py-20 bg-slate-50">
            <div className="container px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-2">
                        Featured Work
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Project Showcase</h3>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Highlighting key projects that demonstrate my technical capabilities
                    </p>
                </motion.div>

                <div className="max-w-5xl mx-auto">
                    <div className="relative">
                        {/* Main Carousel */}
                        <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden bg-white backdrop-blur-sm border border-slate-200">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0"
                                >
                                    <div className="grid md:grid-cols-2 h-full">
                                        {/* Project Image */}
                                        <div className="relative h-64 md:h-full bg-slate-700">
                                            {currentProject.image ? (
                                                <Image
                                                    src={currentProject.image}
                                                    alt={currentProject.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-6xl text-slate-600">
                                                    <i className="bx bx-code-alt"></i>
                                                </div>
                                            )}
                                        </div>

                                        {/* Project Details */}
                                        <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                                            <span className="text-sm text-blue-600 font-semibold mb-2">
                                                {currentProject.category}
                                            </span>
                                            <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                                                {currentProject.title}
                                            </h4>
                                            <p className="text-slate-600 mb-6 line-clamp-4">
                                                {currentProject.description}
                                            </p>

                                            {/* Technologies */}
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {currentProject.technologies.slice(0, 5).map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Links */}
                                            <div className="flex gap-4">
                                                {currentProject.website && (
                                                    <a
                                                        href={currentProject.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                                                    >
                                                        View Live
                                                    </a>
                                                )}
                                                {currentProject.repository && (
                                                    <a
                                                        href={currentProject.repository}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors flex items-center gap-2"
                                                    >
                                                        <i className="bx bxl-github"></i> GitHub
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Controls */}
                            <button
                                onClick={goToPrev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
                                aria-label="Previous project"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
                                aria-label="Next project"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Play/Pause Button */}
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="absolute bottom-4 right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
                                aria-label={isPlaying ? "Pause autoplay" : "Resume autoplay"}
                            >
                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Dots Indicator */}
                        <div className="flex justify-center gap-2 mt-6">
                            {projects.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 rounded-full transition-all ${index === currentIndex
                                        ? "w-8 bg-blue-500"
                                        : "w-2 bg-slate-600 hover:bg-slate-500"
                                        }`}
                                    aria-label={`Go to project ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
