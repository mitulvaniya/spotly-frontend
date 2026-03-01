"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send, Sparkles, MapPin, Clock, Star, Loader2, RotateCcw, Coffee, Utensils, PartyPopper, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Message {
    role: "ai" | "user";
    text: string;
}

const SUGGESTIONS = [
    { icon: Utensils, text: "Plan a date night (hide my red flags)", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
    { icon: Coffee, text: "Cafes where I can pretend to work", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { icon: PartyPopper, text: "Weekend plan that I'll regret Monday", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { icon: Camera, text: "Instagram-worthy spots for clout", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    { icon: MapPin, text: "Street food that's worth the calories", color: "text-green-400 bg-green-500/10 border-green-500/20" },
    { icon: Star, text: "Fancy dinner on a not-so-fancy budget", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
];

// Strip markdown symbols from AI responses for clean display
function cleanResponse(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/^[-]\s+/gm, '• ')
        .replace(/\$\$\$\$/g, 'bougie expensive')
        .replace(/\$\$\$/g, 'pricey')
        .replace(/\$\$/g, 'mid-range')
        .trim();
}

export default function AIPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [messages, isLoading]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = { role: "user", text: text.trim() };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/ai/plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: text.trim(),
                    history: updatedMessages.slice(-10), // Last 10 messages for context
                }),
            });

            const data = await response.json();

            if (data.success && data.data?.response) {
                setMessages(prev => [...prev, { role: "ai", text: cleanResponse(data.data.response) }]);
            } else {
                setMessages(prev => [...prev, {
                    role: "ai",
                    text: `Sorry, I couldn't process that. ${data.message || "Please try again!"} 😔`
                }]);
            }
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                role: "ai",
                text: "Oops! Something went wrong connecting to my brain. Please check your internet and try again! 🔌"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    const resetChat = () => {
        setMessages([]);
        setInputValue("");
    };

    const hasMessages = messages.length > 0;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 flex flex-col pt-24">
                {/* Chat Container */}
                <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">

                    {/* Empty State — Welcome Screen */}
                    {!hasMessages && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1 flex flex-col items-center justify-center py-12"
                        >
                            {/* AI Avatar */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="relative mb-8"
                            >
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                                    <Sparkles className="w-12 h-12 text-white" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-background" />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl md:text-5xl font-bold text-center mb-4"
                            >
                                SPOTLY <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-muted-foreground text-center text-lg mb-12 max-w-md"
                            >
                                Your brutally honest city concierge. I'll judge your choices AND find you the perfect spot. You're welcome. 💅
                            </motion.p>

                            {/* Suggestion Cards */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl"
                            >
                                {SUGGESTIONS.map((suggestion, i) => (
                                    <motion.button
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + i * 0.07 }}
                                        onClick={() => sendMessage(suggestion.text)}
                                        className={cn(
                                            "flex items-center gap-3 p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98]",
                                            suggestion.color
                                        )}
                                    >
                                        <suggestion.icon className="w-5 h-5 shrink-0" />
                                        <span className="text-sm font-medium text-foreground">{suggestion.text}</span>
                                    </motion.button>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Messages */}
                    {hasMessages && (
                        <div ref={scrollRef} className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-hide">
                            <AnimatePresence>
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={cn(
                                            "flex gap-3 max-w-[90%]",
                                            msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                        )}
                                    >
                                        {/* Avatar */}
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                                            msg.role === "ai"
                                                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
                                                : "bg-muted text-muted-foreground"
                                        )}>
                                            {msg.role === "ai" ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                        </div>

                                        {/* Message Bubble */}
                                        <div className={cn(
                                            "p-4 rounded-2xl text-sm md:text-base leading-relaxed",
                                            msg.role === "ai"
                                                ? "bg-white/5 border border-white/10 rounded-tl-sm"
                                                : "bg-primary text-primary-foreground rounded-tr-sm"
                                        )}>
                                            {msg.role === "ai" ? (
                                                <div className="space-y-3">
                                                    {msg.text.split('\n').filter(line => line.trim()).map((line, i) => (
                                                        <p key={i} className="leading-relaxed">{line}</p>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p>{msg.text}</p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Typing Indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 mr-auto"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className={cn(
                        "sticky bottom-0 pb-6 pt-4 bg-gradient-to-t from-background via-background to-transparent",
                        !hasMessages && "mt-8"
                    )}>
                        {/* Reset button */}
                        {hasMessages && (
                            <div className="flex justify-center mb-3">
                                <button
                                    onClick={resetChat}
                                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors px-3 py-1 rounded-full border border-border hover:border-primary/30"
                                >
                                    <RotateCcw className="w-3 h-3" /> New conversation
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="relative">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-indigo-500/50 transition-colors shadow-lg shadow-black/20">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={hasMessages ? "Ask anything about Surat..." : "What are you looking for today?"}
                                    disabled={isLoading}
                                    className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-foreground placeholder:text-muted-foreground font-medium"
                                />
                                <Button
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className="rounded-xl w-12 h-12 p-0 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-30 disabled:cursor-not-allowed shrink-0 shadow-lg shadow-indigo-500/20"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </Button>
                            </div>
                        </form>

                        <p className="text-center text-xs text-muted-foreground/50 mt-3">
                            Powered by Google Gemini · SPOTLY AI may make mistakes
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
