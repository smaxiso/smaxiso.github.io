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
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Loading Experience...</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (experiences.length === 0) {
        return null; // Don't show section if no experiences
    }

    return (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <div className="container px-4 md:px-6">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">
                            My Journey
                        </h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Work Experience
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Professional experience building data solutions across FinTech and Cybersecurity
                        </p>
                    </motion.div>
                </div>

                {/* Desktop: Horizontal Timeline */}
                <div className="hidden md:block relative">
                    {/* Timeline Line */}
                    <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 dark:from-blue-800 dark:via-blue-600 dark:to-blue-800 -translate-y-1/2 rounded-full" />

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
                                <div className="absolute left-2 top-8 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-800" />
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
