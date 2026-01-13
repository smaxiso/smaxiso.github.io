'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Rocket, Zap, PartyPopper, Flame, Lightbulb } from 'lucide-react';
import { API_URL } from '@/lib/api';

interface Reaction {
    slug: string;
    reaction_type: string;
    count: number;
}

const REACTIONS = [
    { type: 'heart', icon: Heart, label: 'Love it', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-900/30' },
    { type: 'rocket', icon: Rocket, label: 'Deep', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-900/30' },
    { type: 'mindblown', icon: Zap, label: 'Insightful', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10', border: 'border-yellow-200 dark:border-yellow-900/30' },
    { type: 'fire', icon: Flame, label: 'Hot', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10', border: 'border-orange-200 dark:border-orange-900/30' },
    { type: 'party', icon: PartyPopper, label: 'Fun', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', border: 'border-purple-200 dark:border-purple-900/30' },
    { type: 'lightbulb', icon: Lightbulb, label: 'Helpful', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-900/30' },
];

export default function BlogReactions({ slug }: { slug: string }) {
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});
    const [plusOneVisible, setPlusOneVisible] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);

    // Load initial data
    useEffect(() => {
        const fetchReactions = async () => {
            try {
                const res = await fetch(`${API_URL}/reactions/${slug}`);
                if (res.ok) {
                    const data: Reaction[] = await res.json();
                    const newCounts: Record<string, number> = {};
                    data.forEach(r => newCounts[r.reaction_type] = r.count);
                    setCounts(newCounts);
                }
            } catch (error) {
                console.error('Failed to fetch reactions:', error);
            } finally {
                setLoading(false);
            }
        };

        // Load user's local state
        const stored = localStorage.getItem(`reactions-${slug}`);
        if (stored) {
            setUserReactions(JSON.parse(stored));
        }

        fetchReactions();
    }, [slug]);

    const handleReact = async (type: string) => {
        if (userReactions[type]) return; // Already reacted

        // Optimistic update
        setCounts(prev => ({
            ...prev,
            [type]: (prev[type] || 0) + 1
        }));

        const newUserReactions = { ...userReactions, [type]: true };
        setUserReactions(newUserReactions);
        localStorage.setItem(`reactions-${slug}`, JSON.stringify(newUserReactions));

        // Show +1 animation
        setPlusOneVisible(prev => ({ ...prev, [type]: true }));

        // Hide +1 after animation
        setTimeout(() => {
            setPlusOneVisible(prev => ({ ...prev, [type]: false }));
        }, 1000);

        // API Call
        try {
            await fetch(`${API_URL}/reactions/${slug}/${type}`, { method: 'POST' });
        } catch (error) {
            // Revert on failure (silent)
            console.error('Failed to save reaction');
        }
    };

    if (loading) return <div className="h-16" />;

    return (
        <div className="flex flex-col items-center justify-center gap-6 py-8 my-8">
            <span className="text-sm font-medium text-slate-500 dark:text-gray-400 uppercase tracking-widest text-[10px]">
                What did you think?
            </span>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-12">
                {REACTIONS.map(({ type, icon: Icon, label, color, bg, border }) => (
                    <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReact(type)}
                        disabled={userReactions[type]}
                        className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-300 ${userReactions[type]
                            ? `${bg} ${border} shadow-sm cursor-default ring-1 ring-offset-2 ring-offset-white dark:ring-offset-black ${color.replace('text-', 'ring-')}`
                            : `bg-white dark:bg-neutral-900 border-slate-100 dark:border-neutral-800 hover:border-slate-200 dark:hover:border-neutral-700 hover:shadow-md`
                            }`}
                    >
                        <Icon
                            className={`w-5 h-5 transition-colors ${userReactions[type] ? `fill-current ${color}` : color
                                }`}
                        />
                        <span className={`text-sm font-semibold transition-colors ${userReactions[type] ? color : 'text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white'
                            }`}>
                            {counts[type] || 0}
                        </span>

                        {/* Tooltip Label */}
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium text-slate-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {label}
                        </span>

                        {/* Floating +1 animation on click */}
                        <AnimatePresence>
                            {plusOneVisible[type] && (
                                <motion.span
                                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, y: -25, scale: 1.2 }}
                                    exit={{ opacity: 0, y: -40 }}
                                    transition={{ duration: 0.5 }}
                                    className={`absolute -top-2 left-1/2 -translate-x-1/2 font-bold ${color}`}
                                >
                                    +1
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
