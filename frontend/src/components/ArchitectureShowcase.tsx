"use client";

import { motion } from "framer-motion";
import { Database, Zap, HardDrive } from "lucide-react";
import { useState } from "react";

// --- SVG Diagrams ---

const CdcDiagram = () => (
    <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
            <marker id="cdc-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#6366f1" />
            </marker>
        </defs>
        {/* Node: PostgreSQL */}
        <rect x="10" y="70" width="110" height="60" rx="10" fill="#1e293b" stroke="#6366f1" strokeWidth="1.5" />
        <text x="65" y="95" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">PostgreSQL</text>
        <text x="65" y="115" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Source DB</text>

        {/* Arrow 1 */}
        <line x1="120" y1="100" x2="155" y2="100" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#cdc-arrow)" />

        {/* Node: Debezium */}
        <rect x="155" y="70" width="110" height="60" rx="10" fill="#1e293b" stroke="#6366f1" strokeWidth="1.5" />
        <text x="210" y="95" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">Debezium</text>
        <text x="210" y="115" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">CDC Connector</text>

        {/* Arrow 2 */}
        <line x1="265" y1="100" x2="300" y2="100" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#cdc-arrow)" />

        {/* Node: Kafka */}
        <rect x="300" y="60" width="110" height="80" rx="10" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
        <text x="355" y="88" textAnchor="middle" fill="#a5b4fc" fontSize="10" fontFamily="monospace" fontWeight="bold">Apache Kafka</text>
        <text x="355" y="105" textAnchor="middle" fill="#818cf8" fontSize="9" fontFamily="monospace">Message Bus</text>
        <text x="355" y="122" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">event-stream-topic</text>

        {/* Arrow 3 → Snowflake */}
        <line x1="410" y1="88" x2="450" y2="68" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#cdc-arrow)" />
        {/* Arrow 4 → S3 */}
        <line x1="410" y1="112" x2="450" y2="132" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#cdc-arrow)" />

        {/* Node: Snowflake */}
        <rect x="450" y="40" width="135" height="50" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="517" y="62" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontFamily="monospace">Snowflake</text>
        <text x="517" y="79" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Analytics DW</text>

        {/* Node: S3 */}
        <rect x="450" y="110" width="135" height="50" rx="10" fill="#1e293b" stroke="#34d399" strokeWidth="1.5" />
        <text x="517" y="132" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">AWS S3</text>
        <text x="517" y="149" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Data Lake</text>

        {/* Latency label */}
        <text x="190" y="170" textAnchor="middle" fill="#4ade80" fontSize="9" fontFamily="monospace">⚡ &lt;100ms latency</text>
    </svg>
);

const DataLakeDiagram = () => (
    <svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
            <marker id="dl-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#0ea5e9" />
            </marker>
        </defs>

        {/* Node: Sources */}
        <rect x="10" y="80" width="95" height="60" rx="10" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" />
        <text x="57" y="105" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">Data Sources</text>
        <text x="57" y="123" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">APIs / DBs / Apps</text>

        <line x1="105" y1="110" x2="140" y2="110" stroke="#0ea5e9" strokeWidth="1.5" markerEnd="url(#dl-arrow)" />

        {/* Bronze */}
        <rect x="140" y="65" width="100" height="90" rx="10" fill="#1c1917" stroke="#f97316" strokeWidth="1.5" />
        <text x="190" y="88" textAnchor="middle" fill="#fb923c" fontSize="10" fontFamily="monospace" fontWeight="bold">BRONZE</text>
        <text x="190" y="104" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">Raw Zone</text>
        <text x="190" y="120" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">AWS S3</text>
        <text x="190" y="137" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">s3://raw-bucket/</text>

        <line x1="240" y1="110" x2="275" y2="110" stroke="#0ea5e9" strokeWidth="1.5" markerEnd="url(#dl-arrow)" />

        {/* Silver */}
        <rect x="275" y="65" width="100" height="90" rx="10" fill="#1a1a2e" stroke="#a78bfa" strokeWidth="1.5" />
        <text x="325" y="88" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontFamily="monospace" fontWeight="bold">SILVER</text>
        <text x="325" y="104" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">Processed Zone</text>
        <text x="325" y="120" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Apache Hudi</text>
        <text x="325" y="137" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">ACID + Incremental</text>

        <line x1="375" y1="110" x2="410" y2="110" stroke="#0ea5e9" strokeWidth="1.5" markerEnd="url(#dl-arrow)" />

        {/* Gold */}
        <rect x="410" y="65" width="100" height="90" rx="10" fill="#14291a" stroke="#4ade80" strokeWidth="1.5" />
        <text x="460" y="88" textAnchor="middle" fill="#86efac" fontSize="10" fontFamily="monospace" fontWeight="bold">GOLD</text>
        <text x="460" y="104" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">Analytics Zone</text>
        <text x="460" y="120" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">AWS Athena</text>
        <text x="460" y="137" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Business Reports</text>

        {/* Storage cost label */}
        <text x="300" y="190" textAnchor="middle" fill="#4ade80" fontSize="9" fontFamily="monospace">✅ 40% storage cost reduction with Hudi compaction</text>
    </svg>
);

const RealtimeDiagram = () => (
    <svg viewBox="0 0 600 210" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
            <marker id="rt-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
            </marker>
        </defs>

        {/* Producers */}
        <rect x="10" y="50" width="100" height="45" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="60" y="70" textAnchor="middle" fill="#fcd34d" fontSize="9" fontFamily="monospace">Apps / IoT</text>
        <text x="60" y="85" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Producers</text>

        <rect x="10" y="105" width="100" height="45" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="60" y="125" textAnchor="middle" fill="#fcd34d" fontSize="9" fontFamily="monospace">Microservices</text>
        <text x="60" y="140" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Event Emitters</text>

        <line x1="110" y1="72" x2="150" y2="95" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#rt-arrow)" />
        <line x1="110" y1="127" x2="150" y2="110" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#rt-arrow)" />

        {/* Kafka */}
        <rect x="150" y="75" width="110" height="60" rx="10" fill="#1c1917" stroke="#fbbf24" strokeWidth="2" />
        <text x="205" y="100" textAnchor="middle" fill="#fcd34d" fontSize="10" fontFamily="monospace" fontWeight="bold">Apache Kafka</text>
        <text x="205" y="116" textAnchor="middle" fill="#78716c" fontSize="8" fontFamily="monospace">1B+ events/day</text>

        <line x1="260" y1="105" x2="300" y2="105" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#rt-arrow)" />

        {/* Logstash */}
        <rect x="300" y="75" width="110" height="60" rx="10" fill="#1e293b" stroke="#a78bfa" strokeWidth="1.5" />
        <text x="355" y="100" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontFamily="monospace">Logstash</text>
        <text x="355" y="116" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Transform + Route</text>

        <line x1="410" y1="105" x2="445" y2="105" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#rt-arrow)" />

        {/* ES + Kibana stack */}
        <rect x="445" y="65" width="130" height="50" rx="8" fill="#1e293b" stroke="#34d399" strokeWidth="1.5" />
        <text x="510" y="85" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">Elasticsearch</text>
        <text x="510" y="101" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Index + Search</text>

        <rect x="445" y="125" width="130" height="50" rx="8" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.5" />
        <text x="510" y="145" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="monospace">Kibana</text>
        <text x="510" y="161" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Live Dashboards</text>

        <line x1="510" y1="115" x2="510" y2="125" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#rt-arrow)" />

        <text x="300" y="190" textAnchor="middle" fill="#4ade80" fontSize="9" fontFamily="monospace">⚡ Sub-500ms processing latency end-to-end</text>
    </svg>
);

// --- Main Component ---

const architectures = [
    {
        id: "cdc",
        title: "CDC Pipeline",
        icon: <Zap className="w-6 h-6 text-amber-500" />,
        description: "Real-time Change Data Capture (CDC) pipeline enabling low-latency data replication from transactional databases to analytics hubs.",
        components: ["PostgreSQL", "Debezium", "Apache Kafka", "Snowflake", "AWS S3"],
        impact: "Reduced data latency by 95%, from hours to seconds.",
        Diagram: CdcDiagram,
    },
    {
        id: "datalake",
        title: "Modern Data Lake",
        icon: <Database className="w-6 h-6 text-blue-500" />,
        description: "High-performance medallion architecture using Apache Hudi for ACID transactions and incremental processing on AWS S3.",
        components: ["AWS S3", "Apache Hudi", "AWS Athena", "PySpark"],
        impact: "Enabled point-in-time recovery and reduced storage costs by 40%.",
        Diagram: DataLakeDiagram,
    },
    {
        id: "realtime",
        title: "Real-time Analytics",
        icon: <HardDrive className="w-6 h-6 text-green-500" />,
        description: "Sub-second event processing pipeline for real-time dashboarding and alerting in high-throughput environments.",
        components: ["Apache Kafka", "Logstash", "Elasticsearch", "Kibana"],
        impact: "Processes over 1B events per day with <500ms latency.",
        Diagram: RealtimeDiagram,
    }
];

export function ArchitectureShowcase() {
    const [selectedId, setSelectedId] = useState(architectures[0].id);
    const selected = architectures.find(a => a.id === selectedId)!;

    return (
        <section id="architecture" className="py-24 bg-white dark:bg-black transition-colors duration-300">
            <div className="container max-w-7xl mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase">Architecture Deep Dive</h2>
                    <h3 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900 dark:text-white">Scalable Data Systems</h3>
                    <p className="max-w-[700px] mx-auto text-slate-600 dark:text-gray-400 text-lg">
                        Visualizing the complex data foundations I&apos;ve built. These architectures are designed for high throughput, reliability, and business impact.
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
                            className="bg-slate-50 dark:bg-neutral-900/50 rounded-3xl p-8 border border-slate-200 dark:border-neutral-800 h-full"
                        >
                            <div className="mb-6">
                                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                    {selected.title}
                                </h4>
                                <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                                    {selected.description}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h5 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Core Components</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {selected.components.map(comp => (
                                            <span key={comp} className="px-3 py-1 bg-white dark:bg-neutral-800 text-slate-700 dark:text-gray-300 text-xs font-medium rounded-full border border-slate-200 dark:border-neutral-700 shadow-sm">
                                                {comp}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3">Business Impact</h5>
                                    <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-xl text-green-700 dark:text-green-400 font-medium italic text-sm">
                                        &ldquo;{selected.impact}&rdquo;
                                    </div>
                                </div>
                            </div>

                            {/* Actual SVG Diagram */}
                            <div className="rounded-2xl overflow-hidden bg-slate-900 dark:bg-black border border-slate-700 dark:border-neutral-800 p-4">
                                <selected.Diagram />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
