'use client'
import { motion } from "framer-motion"
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

    return (
        <section id="skills" className="py-20 bg-white">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Technical Skills</h2>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                        Technologies and tools I work with professionally
                    </p>
                </div>

                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(groupedSkills).map(([category, categorySkills], index) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-bold border-b border-slate-100 pb-2 text-slate-800">{category}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {categorySkills.map((skill) => (
                                    <div key={skill.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-white hover:shadow-md transition-all border border-slate-100">
                                        <i className={`${skill.icon} text-2xl text-blue-600`}></i>
                                        <div>
                                            <h4 className="font-semibold text-sm text-slate-700">{skill.name}</h4>
                                            {skill.level && (
                                                <span className="text-xs text-slate-400">
                                                    {getProficiencyLabel(skill.level)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
