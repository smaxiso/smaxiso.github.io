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

    if (loading) return <div className="py-20 text-center">Loading Projects...</div>;

    return <Projects projects={projects} />;
}
