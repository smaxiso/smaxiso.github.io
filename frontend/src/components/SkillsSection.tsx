'use client'
import { useEffect, useState } from 'react';
import { Skills } from './Skills';
import { getSkills } from '@/lib/api';
import { Skill } from '@/types';

export function SkillsSection() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSkills().then(data => {
            setSkills(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="py-20 text-center">Loading Skills...</div>;

    return <Skills skills={skills} />;
}
