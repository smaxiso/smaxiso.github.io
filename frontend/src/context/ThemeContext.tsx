"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Only run on client side
        if (typeof window === "undefined") return;

        // Check localStorage first
        const stored = localStorage.getItem("theme") as Theme | null;
        console.log("[ThemeProvider] Initial check - Stored:", stored);

        if (stored) {
            setThemeState(stored);
            if (stored === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            console.log("[ThemeProvider] Applied stored theme:", stored);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const systemTheme = prefersDark ? "dark" : "light";
            setThemeState(systemTheme);
            if (systemTheme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            console.log("[ThemeProvider] Applied system theme:", systemTheme);
        }
    }, []);

    const setTheme = (newTheme: Theme) => {
        if (typeof window === "undefined") return;

        console.log("[ThemeProvider] Setting theme to:", newTheme);
        setThemeState(newTheme);
        localStorage.setItem("theme", newTheme);

        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        console.log("[ThemeProvider] Class list after update:", document.documentElement.classList.toString());
    };

    const toggleTheme = () => {
        const nextTheme = theme === "light" ? "dark" : "light";
        console.log("[ThemeProvider] Toggling from", theme, "to", nextTheme);
        setTheme(nextTheme);
    };

    // Always provide the context, even during SSR
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
