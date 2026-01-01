"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

import { usePathname } from "next/navigation";

export default function ChatWidget() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    if (pathname?.startsWith('/admin')) return null;

    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hi! I'm Sumit's AI Assistant. Ask me anything about his projects, skills, or experience!" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Auto-focus input when loading finishes or chat opens
    useEffect(() => {
        if (!isLoading && isOpen) {
            // Small timeout to allow DOM interaction after re-enabling
            setTimeout(() => {
                inputRef.current?.focus();
            }, 10);
        }
    }, [isLoading, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsLoading(true);

        try {
            // Fix for Double Path Issue: Check if API_URL already has /api/v1
            const baseUrl = API_URL.endsWith('/api/v1') ? API_URL : `${API_URL}/api/v1`;
            const response = await fetch(`${baseUrl}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    history: messages // Send full history for context
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch");
            if (!response.body) throw new Error("No response body");

            // Stream handling
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiMsg = "";
            let isFirstChunk = true;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Decode with stream: true to handle multibyte characters correctly across chunks
                const text = decoder.decode(value, { stream: true });
                aiMsg += text;

                if (isFirstChunk) {
                    // First chunk received: Add the assistant message now (removes "Typing..." indicator)
                    setMessages(prev => [...prev, { role: "assistant", content: aiMsg }]);
                    isFirstChunk = false;
                } else {
                    // Subsequent chunks: Update the existing message
                    setMessages(prev => {
                        const newMsgs = [...prev];
                        newMsgs[newMsgs.length - 1].content = aiMsg;
                        return newMsgs;
                    });
                }
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error connecting to my brain. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-24 left-4 md:bottom-6 md:left-6 z-[60] flex flex-col items-start gap-4 font-[family-name:var(--font-inter)]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[calc(100vw-32px)] sm:w-[380px] h-[60vh] sm:h-[500px] max-h-[80vh] bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden origin-bottom-left"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-100 text-sm">Ask AI Sumit</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        <span className="text-[10px] text-slate-400 font-medium tracking-wide">ONLINE</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                aria-label="Close chat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === "assistant"
                                        ? "bg-slate-800 border border-white/10"
                                        : "bg-blue-600 shadow-md"
                                        }`}>
                                        {msg.role === "assistant" ? <Sparkles className="w-4 h-4 text-purple-400" /> : <User className="w-4 h-4 text-white" />}
                                    </div>

                                    <div className={`rounded-2xl p-3 text-sm max-w-[80%] leading-relaxed ${msg.role === "assistant"
                                        ? "bg-white/5 border border-white/10 text-slate-200 rounded-tl-none"
                                        : "bg-blue-600 text-white shadow-lg shadow-blue-500/20 rounded-tr-none"
                                        }`}>
                                        {msg.role === "assistant" ? (
                                            <div className="prose prose-invert prose-sm max-w-none">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Custom Loading Indicator - Hides when assistant starts responding */}
                            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex-shrink-0 flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-3 flex gap-1 items-center">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-3 bg-slate-900 border-t border-white/10">
                            <div className="relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about my projects..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 border border-white/20 text-white z-50 group overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 -skew-x-12"></div>
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </motion.button>
        </div>
    );
}
