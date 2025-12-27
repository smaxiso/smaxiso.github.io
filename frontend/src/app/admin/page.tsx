'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectsEditor } from '@/components/admin/ProjectsEditor';
import { ProfileEditor } from '@/components/admin/ProfileEditor';
import { SocialsEditor } from '@/components/admin/SocialsEditor';
import { ResumeEditor } from '@/components/admin/ResumeEditor';
import { SkillsEditor } from '@/components/admin/SkillsEditor';
import { GuestbookEditor } from '@/components/admin/GuestbookEditor';
import { BlogEditor } from '@/components/admin/BlogEditor';
import MediaManager from '@/components/admin/MediaManager';
import { IngestButton } from '@/components/admin/IngestButton';
import { useToast } from '@/context/ToastContext';

import { ExternalLink } from 'lucide-react';

const ALLOWED_EMAILS = ['sumit749284@gmail.com'];

export default function AdminPage() {
    const { user, loading, logout } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('projects');

    useEffect(() => {
        const savedTab = localStorage.getItem('adminActiveTab');
        if (savedTab) setActiveTab(savedTab);
    }, []);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        localStorage.setItem('adminActiveTab', value);
    };

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/admin/login');
            } else if (!ALLOWED_EMAILS.includes(user.email || '')) {
                logout();
                showToast('Access Denied: You are not an authorized admin.', 'error');
                router.push('/admin/login');
            }
        }
    }, [user, loading, router, logout]);

    if (loading) return <div className="p-10">Loading...</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="sticky top-0 bg-white border-b border-slate-200 z-10">
                <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Admin</h1>
                        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium transition-colors mr-2"
                            >
                                <ExternalLink size={14} />
                                <span className="hidden sm:inline">View Site</span>
                            </a>
                            <span className="text-slate-500 truncate max-w-[150px] sm:max-w-none">{user.email}</span>
                            <button onClick={() => logout()} className="text-red-500 hover:text-red-700 font-medium whitespace-nowrap">Logout</button>
                        </div>
                    </div>
                </div>
            </div>

            <IngestButton showToast={showToast} />

            <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
                    <TabsList className="bg-slate-100 p-1 rounded-lg w-full overflow-x-auto flex justify-start">
                        <TabsTrigger value="projects" className="px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap">Projects</TabsTrigger>
                        <TabsTrigger value="profile" className="px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap">Profile</TabsTrigger>
                        <TabsTrigger value="skills" className="px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap">Skills</TabsTrigger>
                        <TabsTrigger value="socials" className="px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap">Socials</TabsTrigger>
                        <TabsTrigger value="resumes" className="px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap">Resumes</TabsTrigger>
                        <TabsTrigger value="guestbook" className="px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap">Guestbook</TabsTrigger>
                        <TabsTrigger value="blog" className="px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap">Blog</TabsTrigger>
                        <TabsTrigger value="media" className="px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm whitespace-nowrap">Media</TabsTrigger>
                    </TabsList>

                    <TabsContent value="projects">
                        <ProjectsEditor />
                    </TabsContent>

                    <TabsContent value="profile">
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h2 className="text-xl font-bold mb-6">Edit Profile Info</h2>
                            <ProfileEditor />
                        </div>
                    </TabsContent>

                    <TabsContent value="skills">
                        <SkillsEditor />
                    </TabsContent>

                    <TabsContent value="socials">
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <SocialsEditor />
                        </div>
                    </TabsContent>

                    <TabsContent value="resumes">
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <ResumeEditor />
                        </div>
                    </TabsContent>

                    <TabsContent value="guestbook">
                        <GuestbookEditor />
                    </TabsContent>

                    <TabsContent value="blog">
                        <BlogEditor />
                    </TabsContent>

                    <TabsContent value="media">
                        <div className="bg-white rounded-xl shadow-sm border text-slate-900 overflow-hidden">
                            {/* MediaManager uses dark mode text colors in some places, need to wrap or check usage. 
                                Actually MediaManager uses text-white/slate-400 which fits dark mode. 
                                But Admin layout is light mode (bg-slate-50).
                                Let's inject a dark bg for MediaManager or adjust styles.
                                MediaManager looks designed for dark background (bg-white/5 etc).
                                Let's wrap it in a dark container for now to match its design or update it.
                                
                                User's Admin dashboard is Light Mode (bg-slate-50, bg-white).
                                MediaManager uses `bg-white/5` which on white background is barely visible gray.
                                It uses `text-slate-400`.
                                
                                Wait, MediaManager.tsx I wrote uses `bg-white/5` which implies dark mode background.
                                But Admin Dashboard is Light Mode.
                                I should update MediaManager.tsx to be compatible with Light Mode or wrap it in a dark section.
                                For quick win, I'll wrap it in a dark container.
                             */}
                            <div className="bg-slate-900 p-3 sm:p-6 text-slate-100">
                                <MediaManager />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
