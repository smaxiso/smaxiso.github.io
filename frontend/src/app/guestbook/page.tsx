"use client";

import { useState, useEffect } from "react";
import { getGuestbookEntries, submitGuestbookEntry } from "@/lib/api";
import { GuestbookEntry } from "@/types";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function GuestbookPage() {
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    const fetchEntries = async () => {
        try {
            const data = await getGuestbookEntries(50);
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
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;

        setSubmitting(true);
        try {
            await submitGuestbookEntry({ name, message });
            toast.success("Thanks for signing! Your message will appear after approval.");
            setName("");
            setMessage("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit entry");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen relative overflow-hidden bg-[#0f0f0f] text-white">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-24 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                        Guestbook
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Leave a mark! Say hello, share feedback, or just sign your name.
                    </p>
                </motion.div>

                {/* Sign Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-16"
                >
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-md"></div>
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Send className="w-5 h-5 text-blue-400" />
                                Sign the Guestbook
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            placeholder="Your Name"
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                                        <input
                                            type="text"
                                            id="message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                            placeholder="Your Message..."
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-colors"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Signing...
                                        </>
                                    ) : (
                                        "Sign Guestbook"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>

                {/* Messages Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {entries.map((entry, index) => (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
                                >
                                    <p className="text-gray-200 mb-4 font-light text-lg">"{entry.message}"</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-semibold text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
                                            {entry.name}
                                        </span>
                                        <span className="text-gray-500">
                                            {format(new Date(entry.created_at), 'MMM d, yyyy')}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {entries.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No messages yet. Be the first to sign!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
