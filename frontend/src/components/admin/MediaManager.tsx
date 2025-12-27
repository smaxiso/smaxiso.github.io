"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { auditMedia, deleteMedia, MediaResource } from '@/lib/api';
import { Loader2, Trash2, CheckCircle, AlertCircle, RefreshCw, Database, X, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export default function MediaManager() {
    const [resources, setResources] = useState<MediaResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'orphaned'>('all');

    // Selection State
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Confirmation Modal State
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        type: 'single' | 'bulk';
        targetId?: string; // For single delete
    }>({ isOpen: false, type: 'single' });

    const { user } = useAuth();
    const { showToast } = useToast();

    const fetchMedia = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const token = await user.getIdToken();
            const data = await auditMedia(token);
            setResources(data);
            setSelected(new Set()); // Clear selection on refresh
        } catch (error) {
            console.error(error);
            showToast('Failed to audit media', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, [user]);

    // Selection Handlers
    const toggleSelect = (public_id: string) => {
        const newSelected = new Set(selected);
        if (newSelected.has(public_id)) {
            newSelected.delete(public_id);
        } else {
            newSelected.add(public_id);
        }
        setSelected(newSelected);
    };

    const selectAll = (subset: MediaResource[]) => {
        const newSelected = new Set(selected);
        subset.forEach(r => newSelected.add(r.public_id));
        setSelected(newSelected);
    };

    const clearSelection = () => setSelected(new Set());

    // Action Triggers
    const promptDeleteSingle = (public_id: string) => {
        setConfirmState({ isOpen: true, type: 'single', targetId: public_id });
    };

    const promptDeleteBulk = () => {
        if (selected.size === 0) return;
        setConfirmState({ isOpen: true, type: 'bulk' });
    };

    const closeConfirm = () => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
    };

    // Execution Logic
    const executeDelete = async () => {
        if (!user) return;

        if (confirmState.type === 'single' && confirmState.targetId) {
            // Single Delete
            const public_id = confirmState.targetId;
            setDeletingId(public_id);
            closeConfirm(); // Close modal immediately to show loading on item

            try {
                const token = await user.getIdToken();
                await deleteMedia(public_id, token);
                showToast('Image deleted successfully', 'success');

                // Update State
                setResources(prev => prev.filter(r => r.public_id !== public_id));
                if (selected.has(public_id)) {
                    const newSelected = new Set(selected);
                    newSelected.delete(public_id);
                    setSelected(newSelected);
                }
            } catch (error) {
                console.error(error);
                showToast('Failed to delete image', 'error');
            } finally {
                setDeletingId(null);
            }

        } else if (confirmState.type === 'bulk') {
            // Bulk Delete
            setIsBulkDeleting(true);
            closeConfirm();

            try {
                const token = await user.getIdToken();
                const idsToDelete = Array.from(selected);

                // Process in parallel
                await Promise.all(idsToDelete.map(id => deleteMedia(id, token)));

                showToast(`Successfully deleted ${idsToDelete.length} images`, 'success');

                // Update State
                setResources(prev => prev.filter(r => !selected.has(r.public_id)));
                setSelected(new Set());
            } catch (error) {
                console.error(error);
                showToast('Failed to delete some images', 'error');
                fetchMedia(); // Refresh to be safe
            } finally {
                setIsBulkDeleting(false);
            }
        }
    };


    const filteredResources = resources.filter(r => {
        if (filter === 'all') return true;
        return r.status === filter;
    });

    const stats = {
        total: resources.length,
        active: resources.filter(r => r.status === 'active').length,
        orphaned: resources.filter(r => r.status === 'orphaned').length,
        size: resources.reduce((acc, r) => acc + r.bytes, 0)
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6 pb-20 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Media Manager
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm">Audit and clean up Cloudinary assets</p>
                </div>
                <div className="flex gap-2 self-start sm:self-auto">
                    <button
                        onClick={() => selectAll(resources.filter(r => r.status === 'orphaned'))}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                    >
                        Select All Orphaned
                    </button>
                    <button
                        onClick={fetchMedia}
                        disabled={loading}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 min-[350px]:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider mb-1">Total Images</div>
                    <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="text-green-400 text-[10px] sm:text-xs uppercase tracking-wider mb-1">Active</div>
                    <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.active}</div>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="text-red-400 text-[10px] sm:text-xs uppercase tracking-wider mb-1">Orphaned</div>
                    <div className="text-xl sm:text-2xl font-bold text-red-400">{stats.orphaned}</div>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider mb-1">Total Size</div>
                    <div className="text-xl sm:text-2xl font-bold">{formatBytes(stats.size)}</div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {(['all', 'active', 'orphaned'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${filter === f
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)} <span className="opacity-60 ml-1">({
                            f === 'all' ? stats.total : f === 'active' ? stats.active : stats.orphaned
                        })</span>
                    </button>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                </div>
            ) : (
                <div className="grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredResources.map((resource) => (
                        <div
                            key={resource.public_id}
                            onClick={() => toggleSelect(resource.public_id)}
                            className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer ${selected.has(resource.public_id)
                                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5'
                                    : resource.status === 'orphaned'
                                        ? 'border-red-500/30 bg-red-500/5 hover:border-red-500/50'
                                        : 'border-white/10 bg-white/5 hover:border-green-500/30'
                                }`}
                        >
                            {/* Selection Checkbox */}
                            <div className={`absolute top-2 left-2 z-10 w-5 h-5 rounded border flex items-center justify-center transition-colors ${selected.has(resource.public_id)
                                    ? 'bg-blue-500 border-blue-500 text-white'
                                    : 'bg-black/40 border-white/30 text-transparent hover:border-white/60'
                                }`}>
                                <CheckCircle className="w-3.5 h-3.5" />
                            </div>

                            {/* Image Preview */}
                            <div className="aspect-square relative bg-black/20">
                                <Image
                                    src={resource.secure_url}
                                    alt={resource.public_id}
                                    fill
                                    className="object-cover"
                                />
                                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-md ${resource.status === 'active'
                                    ? 'bg-green-500/80 text-white'
                                    : 'bg-red-500/80 text-white'
                                    }`}>
                                    {resource.status}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-3">
                                <div className="text-xs text-slate-400 truncate mb-1" title={resource.public_id}>
                                    {resource.public_id}
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                                    <span>{formatBytes(resource.bytes)}</span>
                                    <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                                </div>

                                {/* Usage */}
                                {resource.usage.length > 0 && (
                                    <div className="mb-3 flex flex-wrap gap-1">
                                        {resource.usage.map((u, i) => (
                                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                                                {u}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2 mt-2" onClick={e => e.stopPropagation()}>
                                    <a
                                        href={resource.secure_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 py-1.5 text-center text-xs font-medium rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                                    >
                                        View
                                    </a>
                                    {resource.status === 'orphaned' && (
                                        <button
                                            onClick={() => promptDeleteSingle(resource.public_id)}
                                            disabled={deletingId === resource.public_id}
                                            className="flex-1 py-1.5 flex justify-center items-center text-xs font-medium rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                        >
                                            {deletingId === resource.public_id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-3 h-3" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sticky Bulk Action Bar */}
            <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${selected.size > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
                }`}>
                <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2 sm:p-3 rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-6 mx-4">
                    <div className="flex items-center gap-2 pl-2">
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{selected.size}</span>
                        <span className="text-sm font-medium text-slate-200 hidden sm:inline">Selected</span>
                    </div>
                    <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                        <button onClick={clearSelection} className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={promptDeleteBulk}
                            disabled={isBulkDeleting}
                            className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-medium rounded-lg shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
                        >
                            {isBulkDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Delete Selected
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {confirmState.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={closeConfirm}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">Delete Image?</h3>
                            <p className="text-slate-400 text-sm mb-6">
                                {confirmState.type === 'bulk'
                                    ? `Are you sure you want to permanently delete ${selected.size} images? `
                                    : 'Are you sure you want to permanently delete this image? '
                                }
                                This action cannot be undone.
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={closeConfirm}
                                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={executeDelete}
                                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium shadow-lg shadow-red-500/20 transition-colors"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
