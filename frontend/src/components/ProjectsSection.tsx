'use client'
import { useEffect, useState } from 'react';
import { Projects } from './Projects';
import { getProjects } from '@/lib/api';
import { Project } from '@/types';

export function ProjectsSection() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProjects().then(data => {
            // Sort projects: Present (no endDate) first, then by endDate desc, then startDate desc
            const sorted = data.sort((a, b) => {
                if (!a.endDate && b.endDate) return -1; // a is present, b is past
                if (a.endDate && !b.endDate) return 1;  // b is present, a is past

                // Both present or both past
                if (a.endDate && b.endDate && a.endDate !== b.endDate) {
                    return b.endDate.localeCompare(a.endDate);
                }

                // If end dates match (or both present), sort by start date
                if (a.startDate && b.startDate) {
                    return b.startDate.localeCompare(a.startDate);
                }
                return 0;
            });
            setProjects(sorted);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <section id="work" className="py-20 relative overflow-hidden bg-slate-50">
                <div className="container max-w-5xl px-4 md:px-6 mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <div className="h-12 w-80 bg-slate-200 animate-pulse rounded mx-auto mb-4"></div>
                        <div className="h-6 w-96 bg-slate-100 animate-pulse rounded mx-auto"></div>
                    </div>
                    {/* Carousel skeleton */}
                    <div className="max-w-5xl mx-auto mb-12 md:mb-16">
                        <div className="h-[450px] md:h-[500px] lg:h-[600px] bg-slate-200 animate-pulse rounded-xl"></div>
                    </div>
                    {/* Projects grid skeleton */}
                    <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-slate-200 animate-pulse rounded-2xl h-96"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return <Projects projects={projects} />;
}
