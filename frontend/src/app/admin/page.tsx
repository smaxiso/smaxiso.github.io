'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectsEditor } from '@/components/admin/ProjectsEditor';
import { ProfileEditor } from '@/components/admin/ProfileEditor';
import { SocialsEditor } from '@/components/admin/SocialsEditor';
import { ResumeEditor } from '@/components/admin/ResumeEditor';

export default function AdminPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/admin/login');
        }
    }, [user, loading, router]);

    if (loading) return <div className="p-10">Loading...</div>;
    if (!user) return null;

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex gap-4 items-center">
                    <span className="text-sm text-slate-500">Welcome, {user.email}</span>
                    <button onClick={() => logout()} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
                </div>
            </div>

            <Tabs defaultValue="projects" className="space-y-6">
                <TabsList className="bg-slate-100 p-1 rounded-lg">
                    <TabsTrigger value="projects" className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Projects</TabsTrigger>
                    <TabsTrigger value="profile" className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Profile</TabsTrigger>
                    <TabsTrigger value="socials" className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Social Links</TabsTrigger>
                    <TabsTrigger value="resumes" className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Resumes</TabsTrigger>
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
            </Tabs>
        </div>
    );
}
