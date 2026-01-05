"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
    end: number;
    duration?: number;
    suffix?: string;
    decimals?: number;
}

export default function AnimatedCounter({
    end,
    duration = 2000,
    suffix = "",
    decimals = 0
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!isInView || hasAnimated.current) return;

        hasAnimated.current = true;
        const startTime = Date.now();
        const startValue = 0;
        let animationFrame: number;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = startValue + (end - startValue) * easeOut;

            setCount(current);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                // Ensure we always end with the exact value
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        // Cleanup and force final value
        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            // Guarantee the final value is set
            setCount(end);
        };
    }, [isInView, end, duration]);

    return (
        <span ref={ref}>
            {count.toFixed(decimals)}
            {suffix}
        </span>
    );
}
