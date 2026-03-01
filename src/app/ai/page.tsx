"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, Send, Loader2, RotateCcw, Utensils, Coffee, PartyPopper, Camera, MapPin, Star, Heart, Users, Wallet, Zap, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Message {
    role: "ai" | "user";
    text: string;
    options?: Option[];
    isPlan?: boolean;
}

interface Option {
    label: string;
    emoji: string;
    value: string;
}

// ──── INTERACTIVE PLAN BUILDER STEPS ────
const PLAN_STEPS = [
    {
        id: "mood",
        aiMessage: "Oh, you're actually going out? 😲 I thought we were rotting in bed today. Fine, let's salvage your social life. What's the vibe?",
        options: [
            { label: "Date Night", emoji: "💘", value: "romantic date" },
            { label: "Party Mode", emoji: "🕺", value: "party night out" },
            { label: "Solo Main Character", emoji: "🧘", value: "solo outing" },
            { label: "Friends Hangout", emoji: "👯", value: "friends group outing" },
        ]
    },
    {
        id: "budget",
        aiMessage: "Noted. Now the painful part... How broke are we? Be honest, I can smell the overdraft. 💸",
        options: [
            { label: "I'm Rich (Lying)", emoji: "💎", value: "luxury no budget limit" },
            { label: "Mid Range (Safe)", emoji: "⚖️", value: "moderate mid-range budget" },
            { label: "Broke but Hungry", emoji: "🥨", value: "budget-friendly cheap" },
            { label: "Free Only Please", emoji: "😭", value: "free activities only" },
        ]
    },
    {
        id: "time",
        aiMessage: "When are we doing this questionable activity? ⏰",
        options: [
            { label: "Morning Vibe", emoji: "☀️", value: "morning 8am to 12pm" },
            { label: "Afternoon Chill", emoji: "🌤️", value: "afternoon 12pm to 5pm" },
            { label: "Evening Plans", emoji: "🌆", value: "evening 5pm to 9pm" },
            { label: "Night Owl", emoji: "🌙", value: "late night after 9pm" },
        ]
    },
    {
        id: "food",
        aiMessage: "Last one. What are we feeding that bottomless pit you call a stomach? 🍽️",
        options: [
            { label: "Gujarati Thali", emoji: "🥘", value: "gujarati traditional food" },
            { label: "Street Food", emoji: "🌮", value: "street food stalls" },
            { label: "Fancy Restaurant", emoji: "🍝", value: "fine dining restaurant" },
            { label: "Coffee & Chill", emoji: "☕", value: "cafe coffee" },
            { label: "Surprise Me", emoji: "🎲", value: "any food surprise me" },
        ]
    },
];

// Strip markdown from AI responses
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

const QUICK_SUGGESTIONS = [
    { icon: Utensils, text: "Plan a date night (hide my red flags)", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
    { icon: Coffee, text: "Cafes where I can pretend to work", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { icon: PartyPopper, text: "Weekend plan that I'll regret Monday", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { icon: Camera, text: "Instagram-worthy spots for clout", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    { icon: MapPin, text: "Street food that's worth the calories", color: "text-green-400 bg-green-500/10 border-green-500/20" },
    { icon: Star, text: "Fancy dinner on a not-so-fancy budget", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
];

export default function AIPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [planStep, setPlanStep] = useState(-1); // -1 = not in plan builder
    const [planChoices, setPlanChoices] = useState<Record<string, string>>({});
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [messages, isLoading]);

    // ──── AI API CALL ────
    const callAI = async (prompt: string, history: Message[] = []) => {
        const response = await fetch("/api/ai/plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, history: history.slice(-10) }),
        });
        const data = await response.json();
        if (data.success && data.data?.response) {
            return cleanResponse(data.data.response);
        }
        throw new Error(data.message || "AI failed");
    };

    // ──── START PLAN BUILDER ────
    const startPlanBuilder = () => {
        const step = PLAN_STEPS[0];
        setMessages([{
            role: "ai",
            text: step.aiMessage,
            options: step.options,
        }]);
        setPlanStep(0);
        setPlanChoices({});
    };

    // ──── HANDLE PLAN OPTION CLICK ────
    const handleOptionClick = async (option: Option) => {
        const currentStep = PLAN_STEPS[planStep];
        const newChoices = { ...planChoices, [currentStep.id]: option.value };
        setPlanChoices(newChoices);

        // Add user's choice as a message
        const userMsg: Message = { role: "user", text: `${option.emoji} ${option.label}` };
        setMessages(prev => [...prev, userMsg]);

        const nextStepIndex = planStep + 1;

        if (nextStepIndex < PLAN_STEPS.length) {
            // Show next step with a small delay for effect
            setIsLoading(true);
            await new Promise(r => setTimeout(r, 600));

            const nextStep = PLAN_STEPS[nextStepIndex];
            setMessages(prev => [...prev, {
                role: "ai",
                text: nextStep.aiMessage,
                options: nextStep.options,
            }]);
            setPlanStep(nextStepIndex);
            setIsLoading(false);
        } else {
            // All choices made → generate plan with Gemini
            setIsLoading(true);
            setMessages(prev => [...prev, {
                role: "ai",
                text: "Alright, let me cook up something based on your questionable taste... 🧑‍🍳",
            }]);

            try {
                const planPrompt = `Create a fun personalized plan for someone in Surat with these preferences:
Mood: ${newChoices.mood}
Budget: ${newChoices.budget}
Time: ${newChoices.time}
Food preference: ${newChoices.food}

Give a 3-4 stop itinerary with specific times and real Surat spots. Each stop on its own line with an emoji, the time, place name, and a funny one-liner about it. End with a sassy closing remark.`;

                const aiResponse = await callAI(planPrompt);
                setMessages(prev => [...prev, {
                    role: "ai",
                    text: aiResponse,
                    isPlan: true,
                }]);
            } catch (err) {
                setMessages(prev => [...prev, {
                    role: "ai",
                    text: "My brain froze while planning your life. Try again? Even AI needs a break from your choices. 😮‍💨",
                }]);
            }
            setPlanStep(-1);
            setIsLoading(false);
        }
    };

    // ──── FREE CHAT ────
    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;
        const userMsg: Message = { role: "user", text: text.trim() };
        const updated = [...messages, userMsg];
        setMessages(updated);
        setInputValue("");
        setIsLoading(true);

        try {
            const aiResponse = await callAI(text.trim(), updated);
            setMessages(prev => [...prev, { role: "ai", text: aiResponse }]);
        } catch {
            setMessages(prev => [...prev, {
                role: "ai",
                text: "My brain short-circuited. Try again in a sec! 🔌"
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
        setPlanStep(-1);
        setPlanChoices({});
    };

    const hasMessages = messages.length > 0;
    const showOptions = planStep >= 0 && !isLoading;
    const currentOptions = showOptions ? messages.filter(m => m.options).pop()?.options : null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col pt-24">
                <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">

                    {/* ──── WELCOME SCREEN ──── */}
                    {!hasMessages && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1 flex flex-col items-center justify-center py-8"
                        >
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
                                className="text-muted-foreground text-center text-lg mb-10 max-w-md"
                            >
                                Your brutally honest city concierge. I'll judge your choices AND find you the perfect spot. 💅
                            </motion.p>

                            {/* Plan Builder CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mb-8"
                            >
                                <button
                                    onClick={startPlanBuilder}
                                    className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-[1.03] active:scale-[0.97]"
                                >
                                    <span className="flex items-center gap-3">
                                        <Zap className="w-5 h-5" />
                                        Build My Plan
                                        <span className="text-sm font-normal opacity-75">(Step by Step)</span>
                                    </span>
                                </button>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-muted-foreground text-sm mb-6"
                            >
                                or ask me anything directly 👇
                            </motion.p>

                            {/* Quick Suggestions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl"
                            >
                                {QUICK_SUGGESTIONS.map((s, i) => (
                                    <motion.button
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 + i * 0.06 }}
                                        onClick={() => sendMessage(s.text)}
                                        className={cn(
                                            "flex items-center gap-3 p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98]",
                                            s.color
                                        )}
                                    >
                                        <s.icon className="w-5 h-5 shrink-0" />
                                        <span className="text-sm font-medium text-foreground">{s.text}</span>
                                    </motion.button>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}

                    {/* ──── MESSAGES ──── */}
                    {hasMessages && (
                        <div ref={scrollRef} className="flex-1 overflow-y-auto py-6 space-y-5 scrollbar-hide">
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
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-1",
                                            msg.role === "ai"
                                                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
                                                : "bg-muted text-muted-foreground"
                                        )}>
                                            {msg.role === "ai" ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                        </div>

                                        <div className="space-y-3 flex-1 min-w-0">
                                            {/* Message bubble */}
                                            <div className={cn(
                                                "p-4 rounded-2xl text-sm md:text-base leading-relaxed",
                                                msg.role === "ai"
                                                    ? "bg-white/5 border border-white/10 rounded-tl-sm"
                                                    : "bg-primary text-primary-foreground rounded-tr-sm",
                                                msg.isPlan && "border-indigo-500/30 bg-indigo-500/5"
                                            )}>
                                                {msg.isPlan && (
                                                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b border-indigo-500/20">
                                                        <Zap className="w-3.5 h-3.5" /> Your Personalized Plan
                                                    </div>
                                                )}
                                                <div className="space-y-2">
                                                    {msg.text.split('\n').filter(l => l.trim()).map((line, i) => (
                                                        <p key={i} className="leading-relaxed">{line}</p>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Options buttons (only show on the LAST message with options, and not loading) */}
                                            {msg.options && idx === messages.length - 1 && !isLoading && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="flex flex-wrap gap-2"
                                                >
                                                    {msg.options.map((opt) => (
                                                        <button
                                                            key={opt.value}
                                                            onClick={() => handleOptionClick(opt)}
                                                            className="px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/25 hover:border-indigo-500/50 text-sm font-medium transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center gap-2"
                                                        >
                                                            <span className="text-base">{opt.emoji}</span> {opt.label}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Typing indicator */}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mr-auto">
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

                    {/* ──── INPUT AREA ──── */}
                    <div className={cn(
                        "sticky bottom-0 pb-6 pt-4 bg-gradient-to-t from-background via-background to-transparent",
                        !hasMessages && "mt-4"
                    )}>
                        {hasMessages && (
                            <div className="flex justify-center gap-3 mb-3">
                                <button
                                    onClick={resetChat}
                                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors px-3 py-1 rounded-full border border-border hover:border-primary/30"
                                >
                                    <RotateCcw className="w-3 h-3" /> New conversation
                                </button>
                                {planStep < 0 && (
                                    <button
                                        onClick={() => { resetChat(); setTimeout(startPlanBuilder, 100); }}
                                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors px-3 py-1 rounded-full border border-indigo-500/20 hover:border-indigo-500/40"
                                    >
                                        <Zap className="w-3 h-3" /> Build a Plan
                                    </button>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="relative">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-indigo-500/50 transition-colors shadow-lg shadow-black/20">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={planStep >= 0 ? "Or type anything..." : "Ask anything about Surat..."}
                                    disabled={isLoading}
                                    className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-foreground placeholder:text-muted-foreground font-medium"
                                />
                                <Button
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className="rounded-xl w-12 h-12 p-0 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-30 shrink-0 shadow-lg shadow-indigo-500/20"
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
