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
            setProjects(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="py-20 text-center">Loading Projects...</div>;

    return <Projects projects={projects} />;
}
