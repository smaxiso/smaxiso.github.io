'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const { user, signInWithGoogle, logout, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            const ALLOWED_EMAILS = ['sumit749284@gmail.com'];
            if (ALLOWED_EMAILS.includes(user.email || '')) {
                router.push('/admin');
            } else {
                logout();
                alert('Access Denied: You are not an authorized admin.');
            }
        }
    }, [user, loading, router, logout]);

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-8 p-10 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Login</h2>
                    <p className="mt-2 text-sm text-gray-600">Sign in to manage your portfolio</p>
                </div>
                <div className="mt-8 space-y-6">
                    <button
                        onClick={() => signInWithGoogle()}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Sign in with Google
                    </button>
                    <div className="text-center">
                        <a href="/" className="text-sm text-blue-600 hover:text-blue-500">Back to Portfolio</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
