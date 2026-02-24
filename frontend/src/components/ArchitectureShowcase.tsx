"use client";

import { motion } from "framer-motion";
import { Database, Zap, HardDrive, Settings } from "lucide-react";
import { useState } from "react";

const architectures = [
    {
        id: "cdc",
        title: "CDC Pipeline",
        icon: <Zap className="w-6 h-6 text-amber-500" />,
        description: "Real-time Change Data Capture (CDC) pipeline enabling low-latency data replication from transactional databases to analytics hubs.",
        components: ["PostgreSQL", "Debezium", "Apache Kafka", "Snowflake"],
        impact: "Reduced data latency by 95%, from hours to seconds."
    },
    {
        id: "datalake",
        title: "Modern Data Lake",
        icon: <Database className="w-6 h-6 text-blue-500" />,
        description: "High-performance data lake architecture using Apache Hudi for ACID transactions and incremental processing on AWS S3.",
        components: ["AWS S3", "Apache Hudi", "AWS Athena", "PySpark"],
        impact: "Enabled point-in-time recovery and reduced storage costs by 40%."
    },
    {
        id: "realtime",
        title: "Real-time Analytics",
        icon: <HardDrive className="w-6 h-6 text-green-500" />,
        description: "Sub-second event processing pipeline for real-time dashboarding and alerting in high-throughput environments.",
        components: ["Apache Kafka", "Logstash", "Elasticsearch", "Kibana"],
        impact: "Processes over 1B events per day with <500ms latency."
    }
];

export function ArchitectureShowcase() {
    const [selectedId, setSelectedId] = useState(architectures[0].id);

    return (
        <section id="architecture" className="py-24 bg-white dark:bg-black transition-colors duration-300">
            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase">Architecture Deep Dive</h2>
                    <h3 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900 dark:text-white">Scalable Data Systems</h3>
                    <p className="max-w-[700px] mx-auto text-slate-600 dark:text-gray-400 text-lg">
                        Visualizing the complex data foundations I've built. These architectures are designed for high throughput, reliability, and business impact.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Architecture Selector */}
                    <div className="lg:col-span-1 space-y-4">
                        {architectures.map((arch) => (
                            <button
                                key={arch.id}
                                onClick={() => setSelectedId(arch.id)}
                                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${selectedId === arch.id
                                        ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 shadow-md translate-x-2"
                                        : "bg-white dark:bg-neutral-900 border-slate-100 dark:border-neutral-800 hover:border-blue-100 dark:hover:border-blue-900"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${selectedId === arch.id ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-neutral-800 text-slate-500"}`}>
                                        {arch.icon}
                                    </div>
                                    <span className={`text-lg font-bold ${selectedId === arch.id ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-gray-300"}`}>
                                        {arch.title}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Architecture Detail View */}
                    <div className="lg:col-span-2">
                        <motion.div
                            key={selectedId}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-50 dark:bg-neutral-900/50 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-neutral-800 h-full"
                        >
                            <div className="mb-8">
                                <h4 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                    {architectures.find(a => a.id === selectedId)?.title}
                                </h4>
                                <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                                    {architectures.find(a => a.id === selectedId)?.description}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h5 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Core Components</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {architectures.find(a => a.id === selectedId)?.components.map(comp => (
                                            <span key={comp} className="px-3 py-1 bg-white dark:bg-neutral-800 text-slate-700 dark:text-gray-300 text-sm font-medium rounded-full border border-slate-200 dark:border-neutral-700 shadow-sm">
                                                {comp}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-4">Business Impact</h5>
                                    <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-xl text-green-700 dark:text-green-400 font-medium italic">
                                        "{architectures.find(a => a.id === selectedId)?.impact}"
                                    </div>
                                </div>
                            </div>

                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 p-8 flex items-center justify-center group">
                                <div className="text-center space-y-4">
                                    <Settings className="w-12 h-12 text-slate-300 dark:text-neutral-700 mx-auto animate-spin-slow" />
                                    <p className="text-slate-400 dark:text-neutral-600 font-mono text-sm tracking-tight italic">
                                        [ High Resolution Architecture Diagram Visualization ]
                                    </p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
