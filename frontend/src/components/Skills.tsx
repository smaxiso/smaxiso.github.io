'use client'
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Skill } from "@/types"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts"

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
    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        if (!skill.category) return acc; // Skip empty categories
        if (!acc[skill.category]) {
            acc[skill.category] = []
        }
        acc[skill.category].push(skill)
        return acc
    }, {} as Record<string, Skill[]>)

    // Collapsible state
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

    // Radar chart data
    const [radarData, setRadarData] = useState<any[]>([]);
    const [animationProgress, setAnimationProgress] = useState(0);

    useEffect(() => {
        // Initialize state based on screen width
        const isMobile = window.innerWidth < 768;
        const initialState = Object.keys(groupedSkills).reduce((acc, category) => {
            acc[category] = false; // Collapsed by default on all devices
            return acc;
        }, {} as Record<string, boolean>);
        setOpenCategories(initialState);

        // Calculate radar chart data
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
            category,
            proficiency: Math.round(total / count),
        }));
        setRadarData(chartData);
    }, [skills]);

    // Animate chart entry
    useEffect(() => {
        if (radarData.length > 0) {
            const interval = setInterval(() => {
                setAnimationProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 20);
            return () => clearInterval(interval);
        }
    }, [radarData]);

    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const animatedData = radarData.map(item => ({
        ...item,
        proficiency: Math.round((item.proficiency * animationProgress) / 100)
    }));

    return (
        <section id="skills" className="py-20 relative overflow-hidden bg-white dark:bg-black transition-colors duration-300">
            <div className="container max-w-5xl px-4 md:px-6 mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-800 dark:text-white">Technical Skills</h2>
                    <p className="mx-auto max-w-[700px] text-slate-600 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Technologies and tools I work with professionally
                    </p>
                </div>

                {/* Radar Chart Visualization */}
                {radarData.length > 0 && (
                    <div className="max-w-3xl mx-auto mb-12 md:mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative"
                        >
                            {/* Subtle background glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-slate-50/50 dark:from-blue-900/10 dark:to-slate-800/10 rounded-2xl blur-3xl" />

                            <div className="relative bg-white dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-lg border border-slate-200/60 dark:border-neutral-800">
                                <div className="relative">
                                    <ResponsiveContainer width="100%" height={320} className="md:!h-[400px]">
                                        <RadarChart data={animatedData}>
                                            <defs>
                                                {/* Professional gradient - muted blue */}
                                                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                                                    <stop offset="50%" stopColor="#60a5fa" stopOpacity={0.2} />
                                                    <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.15} />
                                                </linearGradient>
                                            </defs>

                                            {/* Grid with subtle styling */}
                                            <PolarGrid
                                                stroke="#cbd5e1"
                                                strokeWidth={1}
                                                strokeOpacity={0.4}
                                            />

                                            {/* Category labels - professional font */}
                                            <PolarAngleAxis
                                                dataKey="category"
                                                tick={{
                                                    fill: "#475569", // Will need custom component/styling for full dark mode support on SVGs, but consistent color often works. Better to use standard slate-400 for both.
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    fontFamily: 'Inter, system-ui, sans-serif'
                                                }}
                                                className="text-[10px] md:text-[12px] fill-slate-600 dark:fill-slate-400"
                                                tickLine={false}
                                            />

                                            {/* Radius axis - clean styling */}
                                            <PolarRadiusAxis
                                                angle={90}
                                                domain={[0, 100]}
                                                tick={{
                                                    fill: "#64748b",
                                                    fontSize: 10,
                                                    fontFamily: 'Inter, system-ui, sans-serif'
                                                }}
                                                stroke="#cbd5e1"
                                                strokeOpacity={0.3}
                                                tickCount={5}
                                                className="fill-slate-500 dark:fill-slate-500"
                                            />

                                            {/* Main radar area - professional styling */}
                                            <Radar
                                                name="Proficiency"
                                                dataKey="proficiency"
                                                stroke="#3b82f6"
                                                fill="url(#radarGradient)"
                                                fillOpacity={0.6}
                                                strokeWidth={2}
                                                dot={{
                                                    r: 4,
                                                    fill: "#3b82f6",
                                                    stroke: "#fff",
                                                    strokeWidth: 2
                                                }}
                                                className="md:!stroke-[2.5]"
                                                animationDuration={1500}
                                                animationEasing="ease-out"
                                            />

                                            {/* Clean, minimal tooltip */}
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "var(--background)",
                                                    borderColor: "var(--border)",
                                                    color: "var(--foreground)",
                                                    borderRadius: "8px",
                                                    padding: "8px 12px",
                                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                                                    fontSize: "13px",
                                                    fontFamily: 'Inter, system-ui, sans-serif'
                                                }}
                                                labelStyle={{
                                                    color: "var(--muted-foreground)",
                                                    fontWeight: 600,
                                                    marginBottom: "2px",
                                                    fontSize: "13px"
                                                }}
                                                formatter={(value: any) => [`${value}%`, 'Proficiency']}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>

                                    {/* Professional legend */}
                                    <div className="mt-6 flex justify-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-neutral-800 rounded-full border border-slate-200 dark:border-neutral-700">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300">Skill Proficiency Level</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}


                {/* Skills Grid - Multi-column layout */}
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
                            {/* Category Header - Clickable on mobile */}
                            <button
                                onClick={() => toggleCategory(category)}
                                className="w-full flex items-center justify-between p-5 md:p-6 md:pb-4 md:border-b md:border-slate-200 dark:md:border-neutral-800 md:mb-6 text-left group md:cursor-default"
                            >
                                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                                    {category}
                                </h3>
                                {/* Chevron for mobile only */}
                                <span className={`md:hidden text-xl text-slate-500 transition-transform duration-300 ${openCategories[category] ? 'rotate-180' : ''}`}>
                                    <i className='bx bx-chevron-down'></i>
                                </span>
                            </button>

                            {/* Skills List - Collapsible on mobile, always visible on desktop */}
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
