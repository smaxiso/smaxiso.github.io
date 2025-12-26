'use client'
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Skill } from "@/types"

interface SkillsProps {
    skills: Skill[]
}

function getProficiencyLabel(level: string | number | undefined): string {
    const val = Number(level);
    if (isNaN(val)) return String(level); // Fallback if already text

    if (val >= 90) return 'Expert';
    if (val >= 80) return 'Advanced';
    if (val >= 60) return 'Intermediate';
    return 'Beginner';
}

export function Skills({ skills }: SkillsProps) {
    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
            acc[skill.category] = []
        }
        acc[skill.category].push(skill)
        return acc
    }, {} as Record<string, Skill[]>)

    // Collapsible state
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Initialize state based on screen width
        const isMobile = window.innerWidth < 768;
        const initialState = Object.keys(groupedSkills).reduce((acc, category) => {
            acc[category] = !isMobile; // Collapsed on mobile, expanded on desktop
            return acc;
        }, {} as Record<string, boolean>);
        setOpenCategories(initialState);
    }, [skills]); // Depend on skills to re-init if they change (unlikely but safe)

    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    return (
        <section id="skills" className="py-20 relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-800">Technical Skills</h2>
                    <p className="mx-auto max-w-[700px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Technologies and tools I work with professionally
                    </p>
                </div>

                <div className="grid gap-8 md:gap-12">
                    {Object.entries(groupedSkills).map(([category, categorySkills], index) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white/40 md:bg-transparent rounded-2xl md:rounded-none overflow-hidden"
                        >
                            <button
                                onClick={() => toggleCategory(category)}
                                className="w-full flex items-center justify-between p-4 md:p-0 md:mb-6 text-left group"
                            >
                                <h3 className="text-xl font-bold text-slate-800 md:border-b md:border-white/40 md:pb-2 inline-block">
                                    {category}
                                </h3>
                                <span className={`md:hidden text-2xl text-slate-500 transition-transform duration-300 ${openCategories[category] ? 'rotate-180' : ''}`}>
                                    <i className='bx bx-chevron-down'></i>
                                </span>
                            </button>

                            <motion.div
                                initial={false}
                                animate={{ height: openCategories[category] ? "auto" : 0, opacity: openCategories[category] ? 1 : 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden md:!h-auto md:!opacity-100"
                            >
                                <div className="grid grid-cols-1 min-[350px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 p-4 md:p-0 pt-0">
                                    {categorySkills.map((skill) => (
                                        <motion.div
                                            key={skill.id}
                                            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl glass-card hover:bg-white/60 hover:scale-105 hover:shadow-lg transition-all border border-white/50 group"
                                            whileHover={{ y: -5 }}
                                        >
                                            <div className="p-2 md:p-3 bg-white/50 rounded-full text-blue-600 text-xl md:text-2xl group-hover:text-blue-700 transition-colors shadow-sm">
                                                <i className={skill.icon}></i>
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-sm text-slate-800 truncate">{skill.name}</h4>
                                                {skill.level && (
                                                    <span className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block ${Number(skill.level) >= 90 ? 'bg-purple-100 text-purple-700' :
                                                        Number(skill.level) >= 80 ? 'bg-blue-100 text-blue-700' :
                                                            Number(skill.level) >= 60 ? 'bg-green-100 text-green-700' :
                                                                'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {getProficiencyLabel(skill.level)}
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
