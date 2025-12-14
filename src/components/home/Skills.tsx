"use client";

import { useState } from "react";
import siteConfig from "@/data/site-config.json";
import skillsData from "@/data/skills-data.json";

export default function Skills() {
    const { skills: skillsConfig } = siteConfig;
    const categories = Object.keys(skillsData.professional_skills);
    const [activeTab, setActiveTab] = useState(categories[0]);

    return (
        <section className="skills section" id="skills">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="section-title mb-4">{skillsConfig.sectionTitle}</h2>
                    <p className="text-on-surface-variant max-w-2xl mx-auto">{skillsConfig.description}</p>
                </div>

                <div className="skills__container">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveTab(category)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === category
                                        ? "bg-primary-600 text-white shadow-lg transform -translate-y-1"
                                        : "bg-surface-2 text-on-surface hover:bg-surface-3"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Skills Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up">
                        {/* @ts-ignore */}
                        {skillsData.professional_skills[activeTab]?.map((skill: any, index: number) => (
                            <div
                                key={index}
                                className="bg-surface-1 p-6 rounded-xl border border-outline-variant hover:border-primary-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <i className={`${skill.icon} text-4xl mb-4 text-primary-600 group-hover:scale-110 transition-transform`}></i>
                                    <h3 className="font-semibold text-lg mb-2">{skill.name}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full bg-surface-2 text-on-surface-variant font-medium`}>
                                        {skill.level}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
