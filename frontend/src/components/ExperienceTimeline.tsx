"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getExperiences } from "@/lib/api";
import { Experience } from "@/types";
import { Calendar, MapPin, Code } from "lucide-react";

export default function ExperienceTimeline() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchExperiences() {
            try {
                const data = await getExperiences();
                setExperiences(data);
            } catch (error) {
                console.error("Failed to fetch experiences:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchExperiences();
    }, []);

    if (loading) {
        return (
            <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-12 space-y-4">
                        <div className="h-4 w-32 bg-slate-200 animate-pulse rounded mx-auto"></div>
                        <div className="h-10 w-64 bg-slate-200 animate-pulse rounded mx-auto"></div>
                    </div>

                    <div className="space-y-8 md:space-y-12">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col md:flex-row gap-8 items-center bg-white/50 rounded-xl p-4 animate-pulse">
                                <div className="w-full md:w-1/2 h-40 bg-slate-200 rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (experiences.length === 0) {
        return null;
    }

    return (
        <section id="experience" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]"></div>
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3">
                            My Journey
                        </h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                            Work Experience
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
                            Professional experience building data solutions across FinTech and Cybersecurity
                        </p>
                    </motion.div>
                </div>

                {/* Desktop: Horizontal Timeline */}
                <div className="hidden md:block relative pb-12">
                    {/* Timeline Line */}
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 rounded-full" />

                    {/* Experience Cards */}
                    <div className="grid grid-cols-1 gap-8 relative">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} items-center gap-8`}
                            >
                                {/* Timeline Dot */}
                                <div className="flex-shrink-0 w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full border-4 border-white dark:border-slate-900 shadow-lg z-10" />

                                {/* Experience Card */}
                                <div className={`flex-1 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow border border-slate-200 dark:border-slate-700">
                                        {/* Company Logo */}
                                        {exp.company_logo && (
                                            <div className="mb-4">
                                                <img
                                                    src={exp.company_logo}
                                                    alt={exp.company}
                                                    className="h-12 w-auto object-contain"
                                                />
                                            </div>
                                        )}

                                        {/* Title & Company */}
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            {exp.title}
                                        </h4>
                                        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
                                            {exp.company}
                                        </p>

                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm">
                                                {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Present"}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        {exp.description && (
                                            <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                                                {exp.description}
                                            </p>
                                        )}

                                        {/* Technologies */}
                                        {exp.technologies && exp.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {exp.technologies.slice(0, 5).map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                                {exp.technologies.length > 5 && (
                                                    <span className="px-3 py-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
                                                        +{exp.technologies.length - 5} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Mobile: Vertical Timeline */}
                <div className="md:hidden space-y-6">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative pl-8"
                        >
                            {/* Vertical Line */}
                            {index < experiences.length - 1 && (
                                <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
                            )}

                            {/* Timeline Dot */}
                            <div className="absolute left-0 top-2 w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full border-4 border-white dark:border-slate-900" />

                            {/* Experience Card */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
                                {/* Company Logo */}
                                {exp.company_logo && (
                                    <img
                                        src={exp.company_logo}
                                        alt={exp.company}
                                        className="h-10 w-auto object-contain mb-3"
                                    />
                                )}

                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                    {exp.title}
                                </h4>
                                <p className="text-md font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                    {exp.company}
                                </p>

                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-3 text-sm">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                        {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Present"}
                                    </span>
                                </div>

                                {exp.description && (
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                                        {exp.description}
                                    </p>
                                )}

                                {exp.technologies && exp.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {exp.technologies.slice(0, 4).map((tech, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {exp.technologies.length > 4 && (
                                            <span className="px-2 py-0.5 text-slate-500 dark:text-slate-400 text-xs">
                                                +{exp.technologies.length - 4}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Helper function to format dates
function formatDate(dateStr: string): string {
    const [year, month] = dateStr.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
}
