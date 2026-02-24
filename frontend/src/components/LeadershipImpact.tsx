"use client";

import { motion } from "framer-motion";
import { Users, Lightbulb, TrendingUp, ShieldCheck } from "lucide-react";

const impactMetrics = [
    {
        icon: <Users className="w-6 h-6 text-blue-600" />,
        title: "Team Mentorship",
        description: "Mentoring junior engineers and interns, fostering a culture of technical excellence and best practices in data engineering.",
    },
    {
        icon: <Lightbulb className="w-6 h-6 text-amber-500" />,
        title: "Platform Design",
        description: "Contributing to data platform architecture decisions, ensuring scalability and reliability for organization-wide analytics.",
    },
    {
        icon: <TrendingUp className="w-6 h-6 text-green-600" />,
        title: "Operational Impact",
        description: "Driving initiatives that improved data processing efficiency by 30% and significantly reduced pipeline maintenance overhead.",
    },
    {
        icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
        title: "Data Governance",
        description: "Implementing robust data quality checks and security protocols across multiple high-impact data products.",
    }
];

export function LeadershipImpact() {
    return (
        <section className="py-24 bg-slate-50 dark:bg-neutral-900/50 transition-colors duration-300">
            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase">Impact & Leadership</h2>
                    <h3 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900 dark:text-white">Professional Influence</h3>
                    <p className="max-w-[700px] mx-auto text-slate-600 dark:text-gray-400 text-lg">
                        Beyond building pipelines, I focus on driving technical maturity, mentoring teams, and architecting solutions that scale with the business.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {impactMetrics.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 bg-white dark:bg-black rounded-3xl border border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all group"
                        >
                            <div className="mb-6 p-3 bg-slate-100 dark:bg-neutral-900 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h4>
                            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
