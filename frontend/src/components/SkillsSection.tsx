'use client'
import { useEffect, useState } from 'react';
import { Skills } from './Skills';
import { getSkills } from '@/lib/api';
import { Skill } from '@/types';

export function SkillsSection({ initialData }: { initialData?: Skill[] }) {
    const [skills, setSkills] = useState<Skill[]>(initialData || []);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (initialData) return;

        getSkills().then(data => {
            setSkills(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [initialData]);

    if (loading) {
        return (
            <section id="skills" className="py-20 relative overflow-hidden bg-white">
                <div className="container max-w-5xl px-4 md:px-6 mx-auto relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <div className="h-12 w-64 bg-slate-200 animate-pulse rounded mx-auto"></div>
                        <div className="h-6 w-96 bg-slate-100 animate-pulse rounded mx-auto"></div>
                    </div>
                    {/* Radar chart skeleton */}
                    <div className="max-w-3xl mx-auto mb-12 md:mb-16">
                        <div className="h-[350px] md:h-[450px] bg-slate-100 animate-pulse rounded-2xl"></div>
                    </div>
                    {/* Skills grid skeleton */}
                    <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-64"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return <Skills skills={skills} />;
}
