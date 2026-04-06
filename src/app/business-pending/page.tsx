"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, CheckCircle, Mail, ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function BusinessPendingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg text-center"
                >
                    {/* Animated icon */}
                    <div className="relative inline-flex items-center justify-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center">
                            <Clock className="w-10 h-10 text-yellow-500 animate-pulse" />
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring" }}
                            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center"
                        >
                            <Building2 className="w-4 h-4 text-white" />
                        </motion.div>
                    </div>

                    <h1 className="text-3xl font-black mb-3">Request Under Review</h1>
                    <p className="text-muted-foreground text-base mb-8 leading-relaxed">
                        Your business account request has been submitted successfully. Our admin team will review it and get back to you shortly.
                    </p>

                    {/* Steps */}
                    <div className="glass-card rounded-2xl p-6 mb-8 text-left space-y-4">
                        {[
                            { icon: CheckCircle, label: "Request submitted", done: true, color: "text-green-500" },
                            { icon: Clock, label: "Admin reviews your request", done: false, color: "text-yellow-500" },
                            { icon: Building2, label: "Business account activated", done: false, color: "text-muted-foreground" },
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-green-500/10' : 'bg-muted'}`}>
                                    <step.icon className={`w-4 h-4 ${step.color}`} />
                                </div>
                                <p className={`text-sm font-medium ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {step.label}
                                </p>
                                {i < 2 && <div className="flex-1 h-px bg-border" />}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/">
                            <Button variant="outline" className="gap-2 w-full sm:w-auto">
                                <ArrowLeft className="w-4 h-4" /> Back to Home
                            </Button>
                        </Link>
                        <Link href="/signin">
                            <Button className="gap-2 w-full sm:w-auto">
                                <Mail className="w-4 h-4" /> Sign In
                            </Button>
                        </Link>
                    </div>

                    <p className="text-xs text-muted-foreground mt-6">
                        Once approved, sign in using the <strong>Business</strong> tab on the sign-in page.
                    </p>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}
