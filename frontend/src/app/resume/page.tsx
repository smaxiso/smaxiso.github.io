'use client';
import { useSiteConfig } from "@/context/ProfileContext";

export default function ResumePage() {
    const config = useSiteConfig();

    return (
        <div className="w-full h-screen flex flex-col">
            <iframe
                src={config.resume}
                className="w-full h-full border-none"
                title="Resume"
            />
        </div>
    );
}
