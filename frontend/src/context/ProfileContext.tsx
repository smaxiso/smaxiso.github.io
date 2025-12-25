'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { siteConfig as fallbackConfig } from '@/config/site'

// Define types matching Backend Pydantic models
export interface SocialLink {
    id: number
    platform: string
    url: string
    icon: string
    is_active: boolean
}

export interface SiteConfig {
    id: number
    site_title: string
    site_description: string
    site_author: string
    site_url: string
    greeting: string
    name: string
    title: string
    subtitle: string
    profile_image: string
    about_title: string
    about_description: string
    about_image: string
    resume_url: string
    years_experience: number
    projects_completed: number
    contact_email: string
    footer_text: string
}

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

    useEffect(() => {
        async function fetchData() {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

                // Fetch Config
                const configRes = await fetch(`${API_URL}/config`);
                if (configRes.ok) {
                    const configData = await configRes.json();
                    setConfig(configData);
                }

                // Fetch Socials
                const socialsRes = await fetch(`${API_URL}/socials`);
                if (socialsRes.ok) {
                    const socialsData = await socialsRes.json();
                    setSocials(socialsData);
                }
            } catch (error) {
                console.error("Failed to fetch site config", error);
                // We could set fallback here if we want strict behavior
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

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
        home: {
            greeting: config.greeting,
            name: config.name,
            title: config.title,
            subtitle: config.subtitle,
            profileImage: config.profile_image,
            socialLinks: socials
        },
        about: {
            title: config.about_title,
            description: config.about_description,
            image: config.about_image,
            stats: [
                { label: "Years Experience", number: config.years_experience },
                { label: "Projects Completed", number: config.projects_completed }
            ]
        }
    }
}
