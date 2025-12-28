"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { getSkills } from "@/lib/api";
import { Skill } from "@/types";

export default function SkillsRadar() {
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
                    proficiency: Math.round((total / count) * 20), // Scale to 0-100
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

// Helper function to convert level string to numeric value
function getLevelValue(level: string): number {
    const levelMap: { [key: string]: number } = {
        beginner: 1,
        intermediate: 3,
        advanced: 4,
        expert: 5,
    };
    return levelMap[level.toLowerCase()] || 3; // Default to intermediate
}
