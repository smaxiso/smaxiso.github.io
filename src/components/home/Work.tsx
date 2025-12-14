"use client";

import Image from "next/image";
import siteConfig from "@/data/site-config.json";
import workData from "@/data/work-data.json";

export default function Work() {
    const { work: workConfig } = siteConfig;

    return (
        <section className="work section" id="work">
            <div className="container">
                <h2 className="section-title text-center mb-16">{workConfig.sectionTitle}</h2>

                <div className="space-y-20">
                    {workData.map((categoryGroup, index) => (
                        <div key={index} className="work__category-group">
                            <h3 className="text-2xl font-bold mb-8 border-l-4 border-primary-500 pl-4">{categoryGroup.category}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {categoryGroup.projects.map((project: any) => (
                                    <div
                                        key={project.id}
                                        className="card group hover:shadow-xl transition-all duration-300 border border-outline-variant rounded-2xl overflow-hidden bg-surface-1 flex flex-col"
                                    >
                                        {/* Project Image */}
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <Image
                                                src={`/${project.image}`}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            <div className="absolute bottom-4 left-4 text-white">
                                                {/* @ts-ignore */}
                                                {project.company && <span className="text-xs font-medium bg-primary-600 px-2 py-1 rounded mb-1 inline-block">{project.company}</span>}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h4 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">{project.title}</h4>

                                            {/* Dates */}
                                            {/* @ts-ignore */}
                                            {project.startDate && (
                                                <p className="text-xs text-on-surface-variant mb-4 font-mono">
                                                    {project.startDate} - {project.endDate}
                                                </p>
                                            )}

                                            <p className="text-sm text-on-surface-variant line-clamp-3 mb-6 flex-1">
                                                {project.description}
                                            </p>

                                            {/* Tech Stack */}
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {project.technologies.slice(0, 3).map((tech: string, i: number) => (
                                                    <span key={i} className="text-xs px-2 py-1 bg-surface-2 rounded text-on-surface variant-surface font-medium">
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.technologies.length > 3 && (
                                                    <span className="text-xs px-2 py-1 bg-surface-2 rounded text-on-surface-variant">+{project.technologies.length - 3}</span>
                                                )}
                                            </div>

                                            {/* Links */}
                                            <div className="flex gap-4 mt-auto">
                                                {/* @ts-ignore */}
                                                {project.website && (
                                                    <a href={project.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                                        <i className='bx bx-link-external'></i> Live Demo
                                                    </a>
                                                )}
                                                {/* @ts-ignore */}
                                                {project.repository && (
                                                    <a href={project.repository} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                                        <i className='bx bxl-github'></i> Code
                                                    </a>
                                                )}
                                                {/* @ts-ignore */}
                                                {!project.website && !project.repository && (
                                                    <span className="text-sm text-on-surface-variant italic">Internal / Private</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
