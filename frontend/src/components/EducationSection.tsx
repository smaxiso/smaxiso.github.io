'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { getConfig } from '@/lib/api';

interface EducationData {
    degree: string;
    institution: string;
    years: string;
}

export function EducationSection() {
    const [education, setEducation] = useState<EducationData | null>(null);

    useEffect(() => {
        getConfig()
            .then(data => {
                if (data.education_degree) {
                    setEducation({
                        degree: data.education_degree,
                        institution: data.education_institution,
                        years: data.education_years,
                    });
                }
            })
            .catch(err => console.error('Failed to load education:', err));
    }, []);

    if (!education) return null;

    return (
        <section id="education" className="py-20 md:py-28 relative bg-slate-50 dark:bg-black transition-colors">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-neutral-800 to-transparent opacity-50"></div>

            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                Education
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                            Academic Background
                        </h2>
                    </div>

                    {/* Education Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20 blur-md group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow">
                            {/* Degree */}
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                                {education.degree}
                            </h3>

                            {/* Institution */}
                            <p className="text-lg md:text-xl text-blue-600 dark:text-blue-400 font-semibold mb-4">
                                {education.institution}
                            </p>

                            {/* Years */}
                            <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-base md:text-lg font-medium">{education.years}</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
