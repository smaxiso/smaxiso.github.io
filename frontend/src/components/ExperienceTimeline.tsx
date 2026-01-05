"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Experience } from "@/types";
import { ChevronDown, ArrowRight } from "lucide-react";

interface ExperienceTimelineProps {
    initialData?: Experience[];
}

export default function ExperienceTimeline({ initialData = [] }: ExperienceTimelineProps) {
    const [experiences, setExperiences] = useState<Experience[]>(initialData);

    useEffect(() => {
        // If no server data, we could fetch client side, but for now assumption is SSR is primary
        if (initialData.length > 0) {
            const sorted = [...initialData].sort((a, b) => (a.order || 0) - (b.order || 0));
            setExperiences(sorted);
        }
    }, [initialData]);

    if (!experiences || experiences.length === 0) return null;

    if (experiences.length === 0) return null;

    return (
        <section id="experience" className="py-24 bg-white dark:bg-black transition-colors duration-300">
            <div className="container max-w-5xl px-6 mx-auto">
                <div className="mb-20 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Experience
                    </h2>
                    <div className="h-1 w-20 bg-blue-600 rounded-full mx-auto"></div>
                </div>

                <div className="relative">
                    {/* Center Vertical Line (Desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-neutral-800 -translate-x-1/2" />

                    {/* Left Line (Mobile) */}
                    <div className="md:hidden absolute left-0 top-2 bottom-0 w-px bg-slate-200 dark:bg-neutral-800" />

                    <div className="space-y-12 md:space-y-24">
                        {experiences.map((exp, index) => (
                            <TimelineItem key={exp.id} exp={exp} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function TimelineItem({ exp, index }: { exp: Experience; index: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const isEven = index % 2 === 0;
    const isPresent = !exp.end_date || exp.end_date.toLowerCase() === "present";

    return (
        <div className={`relative md:flex items-start justify-between group ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>

            {/* Desktop Date Side (Opposite to Content) */}
            <div className={`hidden md:block w-[45%] pt-1 ${isEven ? 'text-right pr-12' : 'text-left pl-12'}`}>
                <div className="text-sm font-bold text-slate-900 dark:text-gray-100">
                    {formatDate(exp.start_date)}
                </div>
                <div className="text-xs text-slate-500 dark:text-gray-500 font-medium mt-1 uppercase tracking-wider">
                    {exp.end_date ? formatDate(exp.end_date) : "Present"}
                </div>
            </div>

            {/* Center Node */}
            <div className="absolute left-[-5px] md:left-1/2 top-2 z-10 md:-translate-x-1/2">
                <div className={`rounded-full transition-all duration-300 ${isPresent
                    ? "w-4 h-4 bg-green-500 border-4 border-white dark:border-black shadow-[0_0_0_4px_rgba(34,197,94,0.2)] dark:shadow-[0_0_0_4px_rgba(34,197,94,0.1)]"
                    : `w-3 h-3 bg-white dark:bg-black border-[3px] ${isOpen ? 'border-blue-600 scale-125' : 'border-slate-300 dark:border-neutral-700 group-hover:border-slate-400 dark:group-hover:border-neutral-500'}`
                    }`} />
            </div>

            {/* Content Side */}
            <div className={`w-full md:w-[45%] pl-8 md:pl-0 ${isEven ? 'md:text-left md:pl-12' : 'md:text-right md:pr-12'}`}>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="cursor-pointer group/card"
                >
                    {/* Mobile Date */}
                    <div className="md:hidden text-xs font-mono text-slate-500 dark:text-gray-500 mb-2">
                        {formatDate(exp.start_date)} — {exp.end_date ? formatDate(exp.end_date) : "Present"}
                    </div>

                    <div className={`flex flex-col gap-1 ${isEven ? 'md:items-start' : 'md:items-end'}`}>
                        <div className="flex items-center gap-3">
                            {/* Arrow visibility logic based on side */}
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors">
                                {exp.title}
                            </h3>
                            {/* Desktop Chevron only, mobile handled below */}
                            <ChevronDown
                                className={`hidden md:block w-5 h-5 text-slate-400 dark:text-neutral-600 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""}`}
                            />
                        </div>

                        <div className="text-lg text-slate-600 dark:text-gray-400 font-medium mt-1">
                            {exp.company}
                        </div>
                    </div>

                    {/* Mobile Chevron */}
                    <div className="md:hidden mt-2">
                        <ChevronDown className={`w-5 h-5 text-slate-400 dark:text-neutral-600 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""}`} />
                    </div>

                    {/* Pre-description teaser (collapsed) */}
                    {!isOpen && exp.description && (
                        <p className={`mt-3 text-sm text-slate-500 dark:text-neutral-500 line-clamp-2 leading-relaxed ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                            {/* Strip markdown for teaser */}
                            {exp.description.replace(/\*\*/g, "").slice(0, 120)}...
                        </p>
                    )}
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className={`pt-6 pb-2 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                                {/* Description with Bold Formatting */}
                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                    {exp.description && exp.description.split('\n\n').map((paragraph, idx) => (
                                        <p key={idx} className="whitespace-pre-line text-slate-600 dark:text-gray-400 leading-7 mb-4">
                                            {paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) =>
                                                part.startsWith('**') && part.endsWith('**') ? (
                                                    <strong key={i} className="text-slate-900 dark:text-gray-100 font-bold">
                                                        {part.slice(2, -2)}
                                                    </strong>
                                                ) : (
                                                    part
                                                )
                                            )}
                                        </p>
                                    ))}
                                </div>

                                {/* Tech Stack */}
                                {exp.technologies && exp.technologies.length > 0 && (
                                    <div className={`mt-6 flex flex-wrap gap-2 ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                                        {exp.technologies.map((tech, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 text-xs font-medium rounded-full border border-transparent hover:border-slate-300 dark:hover:border-neutral-700 transition-colors"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (!month) return year;
    return `${monthNames[parseInt(month) - 1]} ${year}`;
}
