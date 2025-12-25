'use client';

export default function ResumePage() {
    return (
        <div className="w-full h-screen flex flex-col">
            <iframe
                src="/assets/data/Sumit_resume.pdf"
                className="w-full h-full border-none"
                title="Resume"
            />
        </div>
    );
}
