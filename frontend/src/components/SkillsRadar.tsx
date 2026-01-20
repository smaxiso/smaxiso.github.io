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
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
                    proficiency: Math.round(total / count),
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
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Animated background particles - subtle */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
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
                        <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                        <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase">
                            Expertise
                        </h2>
                        <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">
                        Skills Proficiency Matrix
                    </h3>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Interactive visualization of technical expertise across domains
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto">
                    {/* Centered Radar Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl" />
                        <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-200">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-10 blur-xl animate-pulse" />

                            <div className="relative">
                                <ResponsiveContainer width="100%" height={isMobile ? 350 : 500}>
                                    <RadarChart data={animatedData}>
                                        <defs>
                                            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.6} />
                                                <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
                                            </linearGradient>
                                        </defs>
                                        <PolarGrid
                                            stroke="#94a3b8"
                                            strokeDasharray="3 3"
                                            strokeOpacity={0.4}
                                            className="dark:stroke-blue-400"
                                        />
                                        <PolarAngleAxis
                                            dataKey="category"
                                            tick={{ fill: "#475569", fontSize: isMobile ? 10 : 13, fontWeight: 600 }}
                                            className="dark:fill-blue-200"
                                        />
                                        <PolarRadiusAxis
                                            angle={90}
                                            domain={[0, 100]}
                                            tick={{ fill: "#64748b", fontSize: 11 }}
                                            stroke="#94a3b8"
                                            strokeOpacity={0.4}
                                            className="dark:stroke-blue-400"
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
