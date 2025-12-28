interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular";
}

export default function Skeleton({
    className = "",
    variant = "rectangular",
}: SkeletonProps) {
    const baseClasses = "animate-pulse bg-slate-200 dark:bg-slate-700";

    const variantClasses = {
        text: "h-4 rounded",
        circular: "rounded-full",
        rectangular: "rounded-md",
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            aria-label="Loading..."
        />
    );
}

// Pre-composed skeleton components for common use cases
export function ProjectCardSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton variant="text" className="w-3/4 mb-2" />
            <Skeleton variant="text" className="w-full mb-2" />
            <Skeleton variant="text" className="w-2/3 mb-4" />
            <div className="flex gap-2">
                <Skeleton variant="rectangular" className="h-6 w-16" />
                <Skeleton variant="rectangular" className="h-6 w-16" />
                <Skeleton variant="rectangular" className="h-6 w-16" />
            </div>
        </div>
    );
}

export function BlogPostSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <Skeleton variant="text" className="w-1/4 mb-2 h-3" />
            <Skeleton variant="text" className="w-3/4 mb-3 h-6" />
            <Skeleton variant="text" className="w-full mb-2" />
            <Skeleton variant="text" className="w-full mb-2" />
            <Skeleton variant="text" className="w-2/3" />
        </div>
    );
}

export function GuestbookEntrySkeleton() {
    return (
        <div className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <Skeleton variant="circular" className="h-10 w-10 flex-shrink-0" />
            <div className="flex-1">
                <Skeleton variant="text" className="w-32 mb-2 h-4" />
                <Skeleton variant="text" className="w-full mb-1" />
                <Skeleton variant="text" className="w-3/4" />
            </div>
        </div>
    );
}
