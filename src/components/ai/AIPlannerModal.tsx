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

    const handleSimulateAI = () => {
        if (!input.trim()) return;
        setStep("loading");

        // Fake AI Delay
        setTimeout(() => {
            setStep("result");
        }, 2000);
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
                            <h4 className="font-semibold mb-1">How can I allow you today?</h4>
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
                            onKeyDown={(e) => e.key === "Enter" && handleSimulateAI()}
                        />
                        <Button
                            size="sm"
                            onClick={handleSimulateAI}
                            className="absolute right-2 top-2 h-10 w-10 p-0 rounded-xl"
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
                </div>
            )}

            {step === "result" && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                        <Sparkles className="w-5 h-5" /> Here is your plan:
                    </div>

                    <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-8">
                        <div className="relative">
                            <span className="absolute -left-[31px] w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-background" />
                            <h5 className="font-bold">7:00 PM • Sunset Coffee</h5>
                            <p className="text-sm text-muted-foreground">Start at <span className="text-foreground font-medium">Brew & Bean</span>. Ask for the rooftop seat.</p>
                        </div>
                        <div className="relative">
                            <span className="absolute -left-[31px] w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-background" />
                            <h5 className="font-bold">8:30 PM • Dinner</h5>
                            <p className="text-sm text-muted-foreground">Table reserved at <span className="text-foreground font-medium">Sakura Fusion</span>. Try the Dragon Roll.</p>
                        </div>
                        <div className="relative">
                            <span className="absolute -left-[31px] w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-background" />
                            <h5 className="font-bold">10:00 PM • Late Night Vibe</h5>
                            <p className="text-sm text-muted-foreground">End the night at <span className="text-foreground font-medium">The Cloud Lounge</span> for jazz music.</p>
                        </div>
                    </div>

                    <Button className="w-full gap-2" onClick={onClose}>
                        <MapPin className="w-4 h-4" /> View Map Route
                    </Button>

                    <button
                        onClick={() => { setStep("idle"); setInput(""); }}
                        className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-2"
                    >
                        Ask something else
                    </button>
                </div>
            )}

        </Modal>
    );
}
