'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function BlogComments() {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-neutral-800">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">
                Discussion
            </h2>
            <Giscus
                id="comments"
                repo="smaxiso/smaxiso.github.io"
                repoId="R_kgDONa1wLw"
                category="General"
                categoryId="DIC_kwDONa1wL84Ck5yM" // To be found via API or inspecting Giscus or using "General" ID
                mapping="pathname"
                strict="0"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme={currentTheme === 'dark' ? 'dark_tritanopia' : 'light'}
                lang="en"
                loading="lazy"
            />
        </div>
    );
}
