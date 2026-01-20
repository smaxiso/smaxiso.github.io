'use client'
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Skill } from "@/types"
import { ParticleNetwork3D } from "@/components/ParticleNetwork3D"

interface SkillsProps {
    skills: Skill[]
}

function getProficiencyLabel(level: string | number | undefined): string {
    const val = Number(level);
    if (isNaN(val)) return String(level);

    if (val >= 90) return 'Expert';
    if (val >= 80) return 'Advanced';
    if (val >= 60) return 'Intermediate';
    return 'Beginner';
}

function getLevelValue(level: string | undefined): number {
    if (!level) return 60;
    const numericLevel = parseInt(level);
    if (!isNaN(numericLevel)) {
        return numericLevel;
    }
    const levelMap: { [key: string]: number } = {
        beginner: 40,
        intermediate: 60,
        advanced: 80,
        expert: 95,
    };
    return levelMap[level.toLowerCase()] || 60;
}

export function Skills({ skills }: SkillsProps) {
    const groupedSkills = skills.reduce((acc, skill) => {
        if (!skill.category) return acc;
        if (!acc[skill.category]) {
            acc[skill.category] = []
        }
        acc[skill.category].push(skill)
        return acc
    }, {} as Record<string, Skill[]>)

    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
    const [particleData, setParticleData] = useState<any[]>([]);

    useEffect(() => {
        const initialState = Object.keys(groupedSkills).reduce((acc, category) => {
            acc[category] = false;
            return acc;
        }, {} as Record<string, boolean>);
        setOpenCategories(initialState);

        const categoryMap = new Map<string, { total: number; count: number }>();
        skills.forEach((skill) => {
            const proficiency = getLevelValue(skill.level || "");
            if (!categoryMap.has(skill.category)) {
                categoryMap.set(skill.category, { total: 0, count: 0 });
            }
            const cat = categoryMap.get(skill.category)!;
            cat.total += proficiency;
            cat.count += 1;
        });

        const chartData = Array.from(categoryMap.entries()).map(([category, { total, count }]) => ({
            label: category,
            value: Math.round(total / count),
        }));
        setParticleData(chartData);
    }, [skills]);

    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    return (
        <section id="skills" className="py-20 relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-black dark:to-neutral-900 transition-colors duration-300">
            <div className="container max-w-6xl px-4 md:px-6 mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-800 dark:text-white">Technical Skills</h2>
                    <p className="mx-auto max-w-[700px] text-slate-600 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Technologies and tools I work with professionally
                    </p>
                </div>

                {/* 3D Particle Network - WebGL */}
                {particleData.length > 0 && (
                    <div className="max-w-5xl mx-auto mb-16">
                        <ParticleNetwork3D
                            data={particleData}
                            height="400px"
                            className="md:!h-[600px]"
                        />
                    </div>
                )}

                {/* Skills Grid */}
                <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(groupedSkills).map(([category, categorySkills], index) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-slate-200 dark:border-neutral-800 hover:shadow-xl transition-shadow overflow-hidden"
                        >
                            <button
                                onClick={() => toggleCategory(category)}
                                className="w-full flex items-center justify-between p-5 md:p-6 md:pb-4 md:border-b md:border-slate-200 dark:md:border-neutral-800 md:mb-6 text-left group md:cursor-default"
                            >
                                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                                    {category}
                                </h3>
                                <span className={`md:hidden text-xl text-slate-500 transition-transform duration-300 ${openCategories[category] ? 'rotate-180' : ''}`}>
                                    <i className='bx bx-chevron-down'></i>
                                </span>
                            </button>

                            <motion.div
                                initial={false}
                                animate={{
                                    height: openCategories[category] ? "auto" : 0,
                                    opacity: openCategories[category] ? 1 : 0
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden md:!h-auto md:!opacity-100"
                            >
                                <div className="px-5 pb-5 md:px-6 md:pb-6 md:pt-0 space-y-2.5 md:space-y-3">
                                    {categorySkills.map((skill) => (
                                        <motion.div
                                            key={skill.id}
                                            whileHover={{ x: 4 }}
                                            className="flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-2.5 md:gap-3 flex-1 min-w-0">
                                                <div className="p-1.5 md:p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 text-base md:text-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors flex-shrink-0">
                                                    <i className={skill.icon}></i>
                                                </div>
                                                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs md:text-sm truncate">
                                                    {skill.name}
                                                </span>
                                            </div>
                                            {skill.level && (
                                                <span className={`text-[9px] md:text-[10px] font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex-shrink-0 ml-1.5 md:ml-2 whitespace-nowrap ${Number(skill.level) >= 90 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                                                    Number(skill.level) >= 80 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                                        Number(skill.level) >= 60 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                                            'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                    }`}>
                                                    {getProficiencyLabel(skill.level)}
                                                </span>
                                            )}
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
