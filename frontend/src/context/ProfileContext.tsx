'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { siteConfig as fallbackConfig } from '@/config/site'
import { getConfig, getSocials, SiteConfig, SocialLink } from '@/lib/api'

interface ProfileContextType {
    config: SiteConfig | null
    socials: SocialLink[]
    loading: boolean
}

const ProfileContext = createContext<ProfileContextType>({
    config: null,
    socials: [],
    loading: true
})

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<SiteConfig | null>(null)
    const [socials, setSocials] = useState<SocialLink[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = React.useCallback(async () => {
        try {
            // Fetch Config
            const configData = await getConfig();
            setConfig(configData);

            // Fetch Socials
            const socialsData = await getSocials();
            setSocials(socialsData);
        } catch (error) {
            console.error("Failed to fetch site config", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial Fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Auto-Refetch on Tab Focus
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log("🔄 Tab active: Refetching data...");
                fetchData();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [fetchData]);

    return (
        <ProfileContext.Provider value={{ config, socials, loading }}>
            {children}
        </ProfileContext.Provider>
    )
}

export const useProfile = () => useContext(ProfileContext)

// Helper to bridge old config structure with new dynamic one (optional but useful)
export const useSiteConfig = () => {
    const { config, socials, loading } = useProfile();

    if (loading || !config) return fallbackConfig;

    return {
        site: {
            title: config.site_title,
            description: config.site_description,
            author: config.site_author,
            url: config.site_url,
            image: config.profile_image
        },
        resume: config.resume_url,
        home: {
            greeting: config.greeting,
            name: config.name,
            title: config.title,
            subtitle: config.subtitle,
            profileImage: config.profile_image,
            socialLinks: socials
        },
        show_work_badge: config.show_work_badge ?? true,  // Add work badge toggle
        about: {
            title: config.about_title,
            description: config.about_description,
            image: config.about_image,
            stats: [
                {
                    label: "Years Experience",
                    number: config.experience_months > 0
                        ? +(config.years_experience + (config.experience_months / 12)).toFixed(1)
                        : config.years_experience
                },
                { label: "Projects Completed", number: config.projects_completed }
            ]
        }
    }
}
