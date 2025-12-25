'use client'
import { AuthProvider } from '@/context/AuthContext';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-slate-50">
                {children}
            </div>
        </AuthProvider>
    );
}
