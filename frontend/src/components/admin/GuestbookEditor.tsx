"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAllGuestbookEntries, approveGuestbookEntry, deleteGuestbookEntry } from "@/lib/api";
import { GuestbookEntry } from "@/types";
import { toast } from "react-hot-toast";
import { Loader2, Check, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";

export function GuestbookEditor() {
    const { token } = useAuth();
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const fetchEntries = async () => {
        if (!token) return;
        try {
            const data = await getAllGuestbookEntries(token);
            setEntries(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load guestbook entries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, [token]);

    const handleApprove = async (id: number) => {
        if (!token) return;
        setProcessingId(id);
        try {
            await approveGuestbookEntry(id, token);
            toast.success("Entry approved!");
            fetchEntries(); // Refresh
        } catch (error) {
            console.error(error);
            toast.error("Failed to approve entry");
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!token) return;
        if (!confirm("Are you sure you want to delete this entry?")) return;

        setProcessingId(id);
        try {
            await deleteGuestbookEntry(id, token);
            toast.success("Entry deleted");
            setEntries(entries.filter(e => e.id !== id));
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete entry");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading entries...</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
                <span>Guestbook Management</span>
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {entries.filter(e => e.approved === 0).length} Pending
                </span>
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b text-gray-500 text-sm">
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Message</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-400">
                                    No entries found.
                                </td>
                            </tr>
                        ) : (
                            entries.map((entry) => (
                                <tr key={entry.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        {entry.approved === 1 ? (
                                            <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-medium w-fit">
                                                <Check size={12} /> Approved
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded text-xs font-medium w-fit">
                                                <Clock size={12} /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 font-medium text-gray-800">{entry.name}</td>
                                    <td className="py-3 px-4 text-gray-600 max-w-md truncate" title={entry.message}>
                                        {entry.message}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">
                                        {format(new Date(entry.created_at), 'MMM d, yyyy')}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {entry.approved === 0 && (
                                                <button
                                                    onClick={() => handleApprove(entry.id)}
                                                    disabled={processingId === entry.id}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Approve"
                                                >
                                                    {processingId === entry.id ? <Loader2 className="animate-spin w-4 h-4" /> : <Check className="w-4 h-4" />}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(entry.id)}
                                                disabled={processingId === entry.id}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                {processingId === entry.id ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
