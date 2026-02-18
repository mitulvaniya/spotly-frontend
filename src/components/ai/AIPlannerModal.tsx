"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Sparkles, Send, Bot, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface AIPlannerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AIPlannerModal({ isOpen, onClose }: AIPlannerModalProps) {
    const [input, setInput] = useState("");
    const [step, setStep] = useState<"idle" | "loading" | "result">("idle");
    const [itinerary, setItinerary] = useState<any[]>([]);

    const handleGeneratePlan = async () => {
        if (!input.trim()) return;
        setStep("loading");
        setItinerary([]);

        try {
            const res = await fetch("/api/ai/plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: input }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to generate plan");
            }

            setItinerary(data.data);
            setStep("result");
        } catch (error) {
            console.error(error);
            // Reset to idle or show error state
            setStep("idle");
            alert("Sorry, I couldn't generate a plan right now. Please try again.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="SPOTLY Concierge">

            {step === "idle" && (
                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-2xl">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">How can I help you today?</h4>
                            <p className="text-sm text-muted-foreground">
                                I can plan a date, find hidden cafes, or suggest an itinerary based on your mood.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Try asking...</p>
                        {["Plan a romantic dinner in Vesu", "Coffee spots with good WiFi", "Hidden gems for photography"].map(prompt => (
                            <button
                                key={prompt}
                                onClick={() => setInput(prompt)}
                                className="w-full text-left p-3 text-sm rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/10"
                            >
                                ✨ {prompt}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Tell me what you're looking for..."
                            className="w-full bg-background border border-input rounded-2xl py-4 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            onKeyDown={(e) => e.key === "Enter" && handleGeneratePlan()}
                        />
                        <Button
                            size="sm"
                            onClick={handleGeneratePlan}
                            className="absolute right-2 top-2 h-10 w-10 p-0 rounded-xl"
                            disabled={!input.trim()}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            {step === "loading" && (
                <div className="py-12 flex flex-col items-center text-center space-y-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500"
                    />
                    <p className="text-lg font-medium animate-pulse">Curating the perfect plan...</p>
                    <p className="text-sm text-muted-foreground">Consulting the digital spirits...</p>
                </div>
            )}

            {step === "result" && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                        <Sparkles className="w-5 h-5" /> Here is your plan:
                    </div>

                    <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-8">
                        {itinerary.map((item, index) => (
                            <div key={index} className="relative">
                                <span className="absolute -left-[31px] w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-background" />
                                <h5 className="font-bold">{item.time} • {item.title}</h5>
                                <p className="text-sm text-muted-foreground">
                                    <span className="text-foreground font-medium block mb-1">{item.location}</span>
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <Button className="flex-1 gap-2" variant="outline" onClick={() => { setStep("idle"); setInput(""); }}>
                            Ask Again
                        </Button>
                        <Button className="flex-1 gap-2" onClick={onClose}>
                            <MapPin className="w-4 h-4" /> Done
                        </Button>
                    </div>
                </div>
            )}

        </Modal>
    );
}
