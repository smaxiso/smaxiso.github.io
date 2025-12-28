"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { ProfileProvider } from "@/context/ProfileContext";
import Navbar from "@/components/Navbar";
import ScrollButtons from "@/components/ScrollButtons";
import ChatWidget from "@/components/ChatWidget";

export default function ClientProviders({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <ToastProvider>
                <ProfileProvider>
                    <Navbar />
                    <ScrollButtons />
                    <ChatWidget />
                    {children}
                </ProfileProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}
