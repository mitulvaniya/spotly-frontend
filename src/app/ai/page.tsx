"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Zap, MapPin, Pizza, Music, Coffee, Camera, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SPOTS } from "@/lib/data";

// --- SCRIPTED PERSONALITY ENGINE ---
type ScriptNode = {
    id: string;
    ai: string[]; // Array for multi-bubble interruptions
    options: { label: string; nextId: string; vibe?: string }[];
};

const SCRIPT: Record<string, ScriptNode> = {
    "INIT": {
        id: "INIT",
        ai: ["Oh, you're actually going out? 😲", "I thought we were rotting in bed today. Fine, let's salvage your social life."],
        options: [
            { label: "Date Night (Stressful) 💘", nextId: "DATE_INTRO" },
            { label: "Party (Regrettable) 🕺", nextId: "PARTY_INTRO" },
            { label: "Solo (Friendless) 🧘", nextId: "SOLO_INTRO" }
        ]
    },
    // --- DATE PATH ---
    "DATE_INTRO": {
        id: "DATE_INTRO",
        ai: ["A date? Really?", "Okay, let's try to hide your red flags for at least two hours. 🚩", "Who is the victim?"],
        options: [
            { label: "First Date (Awkward) 😳", nextId: "DATE_BUDGET", vibe: "safe" },
            { label: "Long-term (Boring) 💍", nextId: "DATE_BUDGET", vibe: "romantic" },
            { label: "My Ex (Toxic) ☠️", nextId: "DATE_BUDGET", vibe: "messy" }
        ]
    },
    "DATE_BUDGET": {
        id: "DATE_BUDGET",
        ai: ["Noted. Now, the painful part.", "How broke are we? Be honest, I can smell the overdraft."],
        options: [
            { label: "I'm Rich (Lying) 💎", nextId: "DATE_VIBE_HIGH", vibe: "fancy" },
            { label: "Mid Range (Safe) ⚖️", nextId: "DATE_VIBE_MID", vibe: "balanced" },
            { label: "Checks Bounced 🥨", nextId: "DATE_VIBE_LOW", vibe: "cheap" }
        ]
    },
    "DATE_VIBE_HIGH": {
        id: "DATE_VIBE_HIGH",
        ai: ["Okay, buying their affection. Classic move. 💸", "Do you want them to look at the VIEW or at YOU?"],
        options: [
            { label: "The View (I'm ugly) 🌆", nextId: "RESULT_DATE_VIEW" },
            { label: "Me (Narcissist) 🍣", nextId: "RESULT_DATE_FOOD" }
        ]
    },
    "DATE_VIBE_MID": {
        id: "DATE_VIBE_MID",
        ai: ["Sensible. Boring, but sensible.", "Vibe check: Do we want to talk or do we want distractions?"],
        options: [
            { label: "Cozy (Talking) 🕯️", nextId: "RESULT_DATE_COZY" },
            { label: "Activity (Distraction) 🎳", nextId: "RESULT_DATE_FUN" }
        ]
    },
    "DATE_VIBE_LOW": {
        id: "DATE_VIBE_LOW",
        ai: ["Broke dates are actually cute. Or sad. Mostly sad.", "Let's minimize the embarrassment."],
        options: [
            { label: "Free Walk 🌳", nextId: "RESULT_DATE_WALK" },
            { label: "Cheap Coffee ☕", nextId: "RESULT_DATE_CAFE" }
        ]
    },
    // --- PARTY PATH ---
    "PARTY_INTRO": {
        id: "PARTY_INTRO",
        ai: ["Regrettable life choices loading... 🔋", "Who are we traumatizing tonight?"],
        options: [
            { label: "The Squad 👯", nextId: "PARTY_ENERGY" },
            { label: "Work People (Fake) 👔", nextId: "PARTY_ENERGY" },
            { label: "Random Strangers 🌪️", nextId: "PARTY_ENERGY" }
        ]
    },
    "PARTY_ENERGY": {
        id: "PARTY_ENERGY",
        ai: ["Gross.", "Hold on. I need to know this.", "Are we drinking 'Classy Cocktails' or are we trying to wake up in a different pincode?"],
        options: [
            { label: "Sipping & Judging 🍸", nextId: "RESULT_PARTY_CHILL" },
            { label: "Total Blackout 🚑", nextId: "RESULT_PARTY_WILD" }
        ]
    },
    // --- SOLO PATH ---
    "SOLO_INTRO": {
        id: "SOLO_INTRO",
        ai: ["Solo? Finally, someone with taste.", "Or no friends. But let's call it 'Main Character Energy'. 🍷", "What's the agenda?"],
        options: [
            { label: "Pretend to Work 📚", nextId: "RESULT_SOLO_WORK" },
            { label: "Retail Therapy 🛍️", nextId: "RESULT_SOLO_TREAT" },
            { label: "Dissociate in Nature 🧭", nextId: "RESULT_SOLO_EXPLORE" }
        ]
    },
};

// --- DATA MOCK ---
const PLANS: Record<string, any[]> = {
    "RESULT_DATE_VIEW": [
        { time: "7:00 PM", place: "The Cloud Lounge", activity: "Stare at the sunset (avoid eye contact)", icon: MapPin },
        { time: "8:30 PM", place: "Skyline Bistro", activity: "Overpriced dinner to prove your worth", icon: Pizza }
    ],
    "RESULT_DATE_FOOD": [
        { time: "7:30 PM", place: "Sakura Fusion", activity: "Sushi (Try not to drop it)", icon: Pizza },
        { time: "9:30 PM", place: "Velvet Bar", activity: "Liquid courage for the goodnight kiss", icon: Music }
    ],
    "RESULT_PARTY_WILD": [
        { time: "9:00 PM", place: "Neon Arcade", activity: "Lose money at games", icon: Zap },
        { time: "11:00 PM", place: "The Velvet Room", activity: "Dance like nobody's watching (they are)", icon: Music },
        { time: "2:00 AM", place: "Midnight Munchies", activity: "Eat regret in burger form", icon: Pizza }
    ],
    "RESULT_SOLO_WORK": [
        { time: "10:00 AM", place: "Brew & Bean", activity: "Buy one coffee, sit for 4 hours", icon: Coffee },
        { time: "1:00 PM", place: "Urban Garden", activity: "Touch grass. Literally.", icon: Camera }
    ]
    // ... Add more mappings as needed (generic fallback for specific IDs not fully mapped)
};

export default function AIPage() {
    // State
    const [messages, setMessages] = useState<{ role: "ai" | "user", text: string, plan?: any[] }[]>([
        { role: "ai", text: SCRIPT["INIT"].ai[0] }, // Initial greeting
        { role: "ai", text: SCRIPT["INIT"].ai[1] }  // Immediate follow-up
    ]);
    const [currentNodeId, setCurrentNodeId] = useState<string>("INIT");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    const handleChoice = async (optionOrText: { label: string; nextId: string; vibe?: string } | string) => {
        let userText = "";
        let nextId = "";

        if (typeof optionOrText === "string") {
            userText = optionOrText;
            nextId = "DYNAMIC"; // Flag for API chat
        } else {
            userText = optionOrText.label; // Show full button text
            nextId = optionOrText.nextId;
        }

        // 1. User "speaks"
        const newMessages = [...messages, { role: "user" as const, text: userText }];
        setMessages(newMessages);
        setIsTyping(true);

        // DELAY
        await new Promise(r => setTimeout(r, 800));

        // 2. AI Responds
        if (nextId.startsWith("RESULT")) {
            // FETCH REAL PLAN
            try {
                // Collect answers for context (simple extraction from history)
                const answers = newMessages.filter(m => m.role === "user").map(m => m.text);

                const response = await fetch("/api/generate-plan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        budget: "Unknown", // Simplified for now
                        vibe: userText,
                        companion: "Unknown",
                        answers,
                        mode: "plan"
                    })
                });

                if (!response.ok) throw new Error("AI Brain Freeze");

                const data = await response.json();

                // Map API response IDs back to full spot objects
                const mappedPlan = data.spots.map((id: number) => {
                    return {
                        time: "TBD",
                        place: `Spot #${id}`,
                        activity: "Vibe Check",
                        icon: MapPin,
                        id: id
                    };
                });

                setMessages(prev => [
                    ...prev,
                    { role: "ai", text: data.narrative || "Here is your plan.", plan: mappedPlan }
                ]);
                setCurrentNodeId("DONE");
            } catch (e) {
                // Fallback to offline script if API fails
                console.error(e);
                const plan = PLANS[nextId] || PLANS["RESULT_DATE_VIEW"];
                setMessages(prev => [
                    ...prev,
                    { role: "ai", text: "My brain is offline (API Error). Here's a canned response. 👇", plan }
                ]);
                setCurrentNodeId("DONE");
            }
            setIsTyping(false);
            return;
        }

        // CASE B: Dynamic Chat (User typed something)
        if (nextId === "DYNAMIC") {
            try {
                const response = await fetch("/api/generate-plan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        vibe: "Chat",
                        answers: [userText],
                        mode: "chat"
                    })
                });
                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.error || `API Error: ${response.status}`);
                }
                const data = await response.json();
                setMessages(prev => [...prev, { role: "ai", text: data.narrative }]);
            } catch (e: any) {
                setMessages(prev => [...prev, { role: "ai", text: `Error: ${e.message || "Brain Freeze"}` }]);
            }
            setIsTyping(false);
            return;
        }

        // CASE C: Scripted Path
        const nextNode = SCRIPT[nextId];
        if (nextNode) {
            let delay = 0;
            nextNode.ai.forEach((text, index) => {
                setTimeout(() => {
                    setMessages(prev => [...prev, { role: "ai", text }]);
                    if (index === nextNode.ai.length - 1) {
                        setCurrentNodeId(nextId);
                        setIsTyping(false);
                    }
                }, delay);
                delay += 1000;
            });
        } else {
            setIsTyping(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 pt-28 pb-6 flex flex-col max-w-4xl h-screen">

                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide pb-32">
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex gap-4 max-w-[90%] md:max-w-[80%]",
                                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                                    msg.role === "ai" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-muted text-muted-foreground"
                                )}>
                                    {msg.role === "ai" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                </div>

                                <div className="space-y-4">
                                    <div className={cn(
                                        "p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed font-medium",
                                        msg.role === "ai"
                                            ? "bg-white/5 border border-white/10 text-foreground rounded-tl-none"
                                            : "bg-primary text-primary-foreground rounded-tr-none"
                                    )}>
                                        {msg.text}
                                    </div>

                                    {msg.plan && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="space-y-3 pt-2"
                                        >
                                            {msg.plan.map((item: any, i: number) => (
                                                <div key={i} className="flex items-center gap-4 p-4 bg-muted/40 rounded-xl border-l-4 border-indigo-500 hover:bg-muted/60 transition-colors">
                                                    <div className="p-3 bg-indigo-500/10 rounded-full text-indigo-400">
                                                        <item.icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{item.time}</p>
                                                        <p className="font-bold text-base">{item.place}</p>
                                                        <p className="text-sm text-muted-foreground">{item.activity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <Button className="w-full mt-4" onClick={() => window.location.reload()}>
                                                Plan Another (If you dare) 🔄
                                            </Button>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 h-14">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-white/10">
                    <div className="container max-w-4xl mx-auto flex gap-2">
                        {currentNodeId !== "DONE" && !isTyping && (
                            <div className="flex-1 overflow-x-auto flex gap-2 no-scrollbar mb-2 absolute -top-16 left-0 right-0 px-4">
                                {SCRIPT[currentNodeId]?.options.map((opt) => (
                                    <button
                                        key={opt.label}
                                        onClick={() => handleChoice(opt)}
                                        className="whitespace-nowrap px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-sm font-medium transition-colors"
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder="Talk back..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                                    e.preventDefault();
                                    handleChoice(e.currentTarget.value);
                                    e.currentTarget.value = "";
                                }
                            }}
                        />
                        <Button className="rounded-xl shrink-0 w-12 h-12 p-0 flex items-center justify-center">
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

            </main>
        </div>
    );
}
