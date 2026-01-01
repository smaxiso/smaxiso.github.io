"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getExperiences } from "@/lib/api";
import { Experience } from "@/types";
import { Calendar, MapPin, Code, Plus } from "lucide-react";

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

                {/* Desktop: Progressive Roadmap */}
                <div className="hidden md:block relative pb-20">
                    {/* SVG Path Container */}
                    <div className="absolute left-0 top-0 bottom-0 w-full pointer-events-none z-0">
                        <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            className="w-full h-full"
                        >
                            <motion.path
                                d="M 50 0 L 50 100" // Simple vertical line for now, can be complex curve later
                                fill="none"
                                strokeWidth="4"
                                className="stroke-slate-200 dark:stroke-slate-700"
                            />
                            <motion.path
                                d="M 50 0 L 50 100"
                                fill="none"
                                strokeWidth="4"
                                className="stroke-blue-500 blur-sm"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                        </svg>
                    </div>

                    {/* Timeline Line (Center) - Replaced by SVG above conceptually, but keeping div for structure if needed */}
                    {/* <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 -translate-x-1/2" /> */}

                    {/* Experience Nodes */}
                    <div className="relative z-10 space-y-24">
                        {experiences.map((exp, index) => (
                            <TimelineNode key={exp.id} exp={exp} index={index} />
                        ))}
                    </div>
                </div>

                {/* Mobile: Interactive Vertical Timeline */}
                <div className="md:hidden space-y-8 relative">
                    {/* Mobile Line */}
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700" />

                    {experiences.map((exp, index) => (
                        <MobileTimelineNode key={exp.id} exp={exp} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// Sub-component for Desktop Node
function TimelineNode({ exp, index }: { exp: Experience; index: number }) {
    const isEven = index % 2 === 0;
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`flex items-start justify-between w-full ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
        >
            {/* Date Side */}
            <div className={`w-[42%] ${isEven ? 'text-right pr-12' : 'text-left pl-12'} pt-4`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Present"}
                </div>
            </div>

            {/* Center Node */}
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full border-4 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] z-20 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 group"
                >
                    {exp.company_logo ? (
                        <div className="w-full h-full rounded-full overflow-hidden p-3 bg-white">
                            <img src={exp.company_logo} alt={exp.company} className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <MapPin className="w-6 h-6 text-blue-600 group-hover:text-blue-500 transition-colors" />
                    )}
                </button>
            </div>

            {/* Content Side */}
            <div className={`w-[42%] ${isEven ? 'text-left pl-12' : 'text-right pr-12'}`}>
                <motion.div
                    layout
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all cursor-pointer group relative overflow-hidden"
                >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{exp.title}</h4>
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-4">{exp.company}</p>

                    <motion.div
                        animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                        initial={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        {/* Description */}
                        {exp.description && (
                            <div className="prose prose-sm dark:prose-invert mb-6 text-left">
                                <p className="whitespace-pre-line text-slate-600 dark:text-slate-400">{exp.description}</p>
                            </div>
                        )}

                        {/* Skills Unlocked */}
                        {exp.technologies && exp.technologies.length > 0 && (
                            <div className="space-y-2 text-left">
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Skills Unlocked</p>
                                <div className="flex flex-wrap gap-2">
                                    {exp.technologies.map((tech, i) => (
                                        <span
                                            key={i}
                                            className="px-2.5 py-1 bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg border border-blue-200/50 dark:border-blue-800/50"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {!isExpanded && (
                        <div className="flex items-center gap-1 text-xs font-semibold text-blue-500 mt-2 uppercase tracking-wide">
                            <Plus className="w-3 h-3" /> Click to Expand
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}

// Sub-component for Mobile Node
function MobileTimelineNode({ exp, index }: { exp: Experience; index: number }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="pl-12 relative"
        >
            {/* Mobile Dot */}
            <div className="absolute left-2.5 top-6 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-slate-900 z-10 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />

            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-lg border border-slate-200 dark:border-slate-700 active:scale-[0.98] transition-all"
            >
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{exp.title}</h4>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{exp.company}</p>
                    </div>
                    {exp.company_logo && (
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-1.5 border border-slate-100">
                            <img src={exp.company_logo} alt={exp.company} className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 bg-slate-100 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg w-fit">
                    <Calendar className="w-3 h-3" />
                    {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : "Present"}
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            {/* Description */}
                            {exp.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 whitespace-pre-line leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                                    {exp.description}
                                </p>
                            )}

                            {/* Technologies */}
                            {exp.technologies && exp.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pb-2">
                                    {exp.technologies.map((tech, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-[10px] font-medium rounded-md border border-blue-100 dark:border-blue-800/30"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isExpanded && (
                    <div className="text-center w-full pt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1">
                            Read More <Code className="w-3 h-3" />
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}


// Helper function to format dates
function formatDate(dateStr: string): string {
    const [year, month] = dateStr.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
}
