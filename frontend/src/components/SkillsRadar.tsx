"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { getSkills } from "@/lib/api";
import { Skill } from "@/types";
import { Sparkles } from "lucide-react";

export default function SkillsRadar() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [radarData, setRadarData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [animationProgress, setAnimationProgress] = useState(0);

    useEffect(() => {
        async function fetchSkills() {
            try {
                const data = await getSkills();
                setSkills(data);

                // Group skills by category and calculate average proficiency
                const categoryMap = new Map<string, { total: number; count: number }>();

                data.forEach((skill) => {
                    const proficiency = getLevelValue(skill.level || "");
                    if (!categoryMap.has(skill.category)) {
                        categoryMap.set(skill.category, { total: 0, count: 0 });
                    }
                    const cat = categoryMap.get(skill.category)!;
                    cat.total += proficiency;
                    cat.count += 1;
                });

                // Convert to radar chart format
                const chartData = Array.from(categoryMap.entries()).map(([category, { total, count }]) => ({
                    category,
                    proficiency: Math.round(total / count), // Average already 0-100
                }));

                setRadarData(chartData);
            } catch (error) {
                console.error("Failed to fetch skills:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSkills();
    }, []);

    // Animate chart entry
    useEffect(() => {
        if (!loading && radarData.length > 0) {
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
    }, [loading, radarData]);

    if (loading || radarData.length === 0) {
        return null;
    }

    const animatedData = radarData.map(item => ({
        ...item,
        proficiency: Math.round((item.proficiency * animationProgress) / 100)
    }));

    return (
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0 opacity-20">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-400 rounded-full"
                        initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%" }}
                        animate={{
                            y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                            x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                        <h2 className="text-sm font-bold tracking-widest text-blue-300 uppercase">
                            Expertise
                        </h2>
                        <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-cyan-200 to-indigo-200">
                        Skills Proficiency Matrix
                    </h3>
                    <p className="text-blue-200 max-w-2xl mx-auto text-lg">
                        Interactive visualization of technical expertise across domains
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                    {/* Enhanced Radar Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
                        <div className="relative bg-gradient-to-br from-slate-800/80 to-blue-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-400/30">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-20 blur-xl animate-pulse" />

                            <div className="relative">
                                <ResponsiveContainer width="100%" height={450}>
                                    <RadarChart data={animatedData}>
                                        <defs>
                                            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.6} />
                                                <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
                                            </linearGradient>
                                        </defs>
                                        <PolarGrid
                                            stroke="#60a5fa"
                                            strokeDasharray="3 3"
                                            strokeOpacity={0.3}
                                        />
                                        <PolarAngleAxis
                                            dataKey="category"
                                            tick={{ fill: "#bfdbfe", fontSize: 13, fontWeight: 600 }}
                                        />
                                        <PolarRadiusAxis
                                            angle={90}
                                            domain={[0, 100]}
                                            tick={{ fill: "#93c5fd", fontSize: 11 }}
                                            stroke="#60a5fa"
                                            strokeOpacity={0.3}
                                        />
                                        <Radar
                                            name="Proficiency"
                                            dataKey="proficiency"
                                            stroke="#60a5fa"
                                            fill="url(#radarGradient)"
                                            fillOpacity={0.7}
                                            strokeWidth={3}
                                            dot={{ r: 6, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                                            animationDuration={2000}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#1e293b",
                                                border: "2px solid #3b82f6",
                                                borderRadius: "12px",
                                                color: "#fff",
                                                padding: "12px",
                                                boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)"
                                            }}
                                            labelStyle={{ color: "#60a5fa", fontWeight: "bold", marginBottom: "4px" }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>

                    {/* Interactive Skills Legend */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-4"
                    >
                        <AnimatePresence mode="wait">
                            {Array.from(new Set(skills.map(s => s.category))).map((category, index) => {
                                const categorySkills = skills.filter(s => s.category === category);
                                const avgProficiency = radarData.find(d => d.category === category)?.proficiency || 0;
                                const isSelected = selectedCategory === category;

                                return (
                                    <motion.div
                                        key={category}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        onClick={() => setSelectedCategory(isSelected ? null : category)}
                                        className={`cursor-pointer group relative ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="relative bg-slate-800/60 backdrop-blur-sm p-5 rounded-xl border border-slate-700/50 group-hover:border-blue-400/50 transition-all shadow-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors flex items-center gap-2">
                                                    {category}
                                                    {isSelected && <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />}
                                                </h4>
                                                <motion.span
                                                    className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                                                    animate={{ scale: isSelected ? [1, 1.1, 1] : 1 }}
                                                    transition={{ repeat: isSelected ? Infinity : 0, duration: 2 }}
                                                >
                                                    {avgProficiency}%
                                                </motion.span>
                                            </div>

                                            {/* Animated progress bar */}
                                            <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden mb-3 relative">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${avgProficiency}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: index * 0.1 + 0.3, duration: 1, ease: "easeOut" }}
                                                    className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 rounded-full relative overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                                                </motion.div>
                                            </div>

                                            {/* Skills chips */}
                                            <AnimatePresence>
                                                {(isSelected || !selectedCategory) && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="flex flex-wrap gap-2"
                                                    >
                                                        {categorySkills.slice(0, isSelected ? 100 : 6).map((skill, i) => (
                                                            <motion.span
                                                                key={skill.id}
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ delay: i * 0.05 }}
                                                                whileHover={{ scale: 1.1, y: -2 }}
                                                                className="text-xs px-3 py-1.5 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white rounded-full font-medium shadow-lg border border-blue-400/30 backdrop-blur-sm hover:from-blue-500 hover:to-indigo-500 transition-all"
                                                            >
                                                                {skill.name}
                                                            </motion.span>
                                                        ))}
                                                        {!isSelected && categorySkills.length > 6 && (
                                                            <span className="text-xs px-3 py-1.5 text-blue-300 font-medium">
                                                                +{categorySkills.length - 6} more
                                                            </span>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* CSS for shimmer animation */}
            <style jsx global>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </section>
    );
}

// Helper function to convert level (string or number) to numeric value
function getLevelValue(level: string | undefined): number {
    if (!level) return 60; // Default if no level

    // If it's a numeric string (e.g., "70", "85", "95"), parse and return it
    const numericLevel = parseInt(level);
    if (!isNaN(numericLevel)) {
        return numericLevel;
    }

    // Otherwise, map text levels to numeric values (0-100 scale)
    const levelMap: { [key: string]: number } = {
        beginner: 40,
        intermediate: 60,
        advanced: 80,
        expert: 95,
    };
    return levelMap[level.toLowerCase()] || 60;
}

const [skills, setSkills] = useState<Skill[]>([]);
const [radarData, setRadarData] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    async function fetchSkills() {
        try {
            const data = await getSkills();
            setSkills(data);

            // Group skills by category and calculate average proficiency
            const categoryMap = new Map<string, { total: number; count: number }>();

            data.forEach((skill) => {
                const proficiency = getLevelValue(skill.level || "");
                if (!categoryMap.has(skill.category)) {
                    categoryMap.set(skill.category, { total: 0, count: 0 });
                }
                const cat = categoryMap.get(skill.category)!;
                cat.total += proficiency;
                cat.count += 1;
            });

            // Convert to radar chart format
            const chartData = Array.from(categoryMap.entries()).map(([category, { total, count }]) => ({
                category,
                proficiency: Math.round(total / count), // Average already 0-100
            }));

            setRadarData(chartData);
        } catch (error) {
            console.error("Failed to fetch skills:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchSkills();
}, []);

if (loading || radarData.length === 0) {
    return null;
}

return (
    <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container px-4 md:px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">
                    Expertise
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    Skills Proficiency
                </h3>
                <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Visual representation of my technical expertise across different domains
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                {/* Radar Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-2xl p-8 shadow-xl"
                >
                    <ResponsiveContainer width="100%" height={400}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                            <PolarAngleAxis
                                dataKey="category"
                                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                            />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#64748b" }} />
                            <Radar
                                name="Proficiency"
                                dataKey="proficiency"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.6}
                                strokeWidth={2}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "none",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Skills Legend */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    {Array.from(new Set(skills.map(s => s.category))).map((category, index) => {
                        const categorySkills = skills.filter(s => s.category === category);
                        const avgProficiency = radarData.find(d => d.category === category)?.proficiency || 0;

                        return (
                            <div key={category} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-slate-900 dark:text-white">{category}</h4>
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        {avgProficiency}%
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${avgProficiency}%` }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.8 }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {categorySkills.slice(0, 6).map((skill) => (
                                        <span
                                            key={skill.id}
                                            className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded"
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                    {categorySkills.length > 6 && (
                                        <span className="text-xs px-2 py-1 text-slate-500 dark:text-slate-400">
                                            +{categorySkills.length - 6} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    </section>
);
}

// Helper function to convert level (string or number) to numeric value
function getLevelValue(level: string | undefined): number {
    if (!level) return 60; // Default if no level

    // If it's a numeric string (e.g., "70", "85", "95"), parse and return it
    const numericLevel = parseInt(level);
    if (!isNaN(numericLevel)) {
        return numericLevel;
    }

    // Otherwise, map text levels to numeric values (0-100 scale)
    const levelMap: { [key: string]: number } = {
        beginner: 40,
        intermediate: 60,
        advanced: 80,
        expert: 95,
    };
    return levelMap[level.toLowerCase()] || 60;
}
