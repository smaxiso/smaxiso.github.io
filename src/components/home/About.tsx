"use client";

import { useState } from "react";
import Image from "next/image";
import siteConfig from "@/data/site-config.json";

export default function About() {
    const { about } = siteConfig;
    const [expanded, setExpanded] = useState(false);

    return (
        <section className="about section" id="about">
            <div className="container">
                <h2 className="section-title">{about.sectionTitle}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Image Side */}
                    <div className="about__image-container relative flex justify-center">
                        <div className="relative w-72 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Image
                                src={`/${about.profileImage.src}`}
                                alt={about.profileImage.alt}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 w-full bg-surface-0/90 backdrop-blur-sm p-4">
                                <div className="flex justify-around text-center">
                                    {about.stats.map((stat, idx) => (
                                        <div key={idx}>
                                            <span className="block text-xl font-bold text-primary-600">{stat.number}+</span>
                                            <span className="text-xs text-on-surface-variant">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="about__content">
                        <span className="block text-primary-600 font-medium mb-2">{about.subtitle}</span>
                        <h3 className="text-3xl font-bold mb-6">{about.title}</h3>
                        <p className="text-on-surface-variant mb-6 leading-relaxed">
                            {about.mainText}
                        </p>

                        {/* Expandable Content */}
                        <div className={`overflow-hidden transition-all duration-500 ${expanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
                            <div className="space-y-4 pb-6">
                                {about.expandableContent.map((item, index) => {
                                    if (item.type === 'highlights') {
                                        return (
                                            <ul key={index} className="list-disc list-inside space-y-2 ml-4 text-on-surface">
                                                {item.items && item.items.map((li, i) => (
                                                    <li key={i}>{li}</li>
                                                ))}
                                            </ul>
                                        );
                                    }
                                    return (
                                        <p key={index} className="text-on-surface-variant" dangerouslySetInnerHTML={{ __html: item.content || '' }} />
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors mb-8"
                        >
                            {expanded ? 'Show Less' : 'Read More'}
                            <i className={`bx bx-chevron-down transition-transform ${expanded ? 'rotate-180' : ''}`}></i>
                        </button>

                        {/* Actions */}
                        <div className="flex gap-4">
                            {about.actions.map((btn, index) => (
                                <a
                                    key={index}
                                    href={btn.href}
                                    className={`btn ${btn.type === 'primary' ? 'btn-primary' : 'btn-outline'}`}
                                    download={btn.download}
                                >
                                    <i className={`${btn.icon} text-lg`}></i>
                                    {btn.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
