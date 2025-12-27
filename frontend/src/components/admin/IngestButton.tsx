
import { useState } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function IngestButton({ showToast }: { showToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleIngest = async () => {
        setShowConfirm(false);
        setLoading(true);
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            // Fix: Check if apiBase already ends with /api/v1
            const baseUrl = apiBase.endsWith('/api/v1') ? apiBase : `${apiBase}/api/v1`;
            const res = await fetch(`${baseUrl}/admin/ingest`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) throw new Error("Failed to start ingestion");

            showToast("Knowledge Base Update Started! (It runs in the background)", 'success');
        } catch (error) {
            console.error(error);
            showToast("Failed to trigger update.", 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 mb-4">
            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-2xl">
                        <h3 className="text-lg font-bold mb-2 text-slate-900">Update Knowledge Base?</h3>
                        <p className="text-sm text-slate-600 mb-4">
                            This will rebuild the AI's knowledge with your latest Resume, GitHub repos, and database content.
                            Takes ~10-20 seconds and runs in the background.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleIngest}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                            >
                                Start Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-blue-900">Knowledge Base</h3>
                        <p className="text-xs text-blue-700">Sync Resume, GitHub & Database to AI.</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowConfirm(true)}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                >
                    {loading ? 'Starting...' : 'Update Knowledge Base'}
                </button>
            </div>
        </div>
    );
}
