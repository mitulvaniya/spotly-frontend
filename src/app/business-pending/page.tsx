"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, XCircle, Building2, ArrowLeft, LogIn, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useEffect, useState, useCallback } from "react";
import { api, authApi } from "@/lib/api";

type Status = 'loading' | 'pending' | 'approved' | 'rejected' | 'not_found';

export default function BusinessPendingPage() {
    const [status, setStatus] = useState<Status>('loading');
    const [businessName, setBusinessName] = useState('');

    const checkStatus = useCallback(async () => {
        setStatus('loading');
        try {
            const res = await api.get<{ user: any }>('/users/profile');
            if (res.success && res.data?.user) {
                const user = res.data.user;
                const req = user.businessRequest;

                if (!req) {
                    // No request — if they're already business_owner somehow
                    if (user.role === 'business_owner' || user.role === 'admin') {
                        setStatus('approved');
                    } else {
                        setStatus('not_found');
                    }
                } else {
                    setBusinessName(req.businessName || user.name);
                    setStatus(req.status as Status);
                }
            } else {
                setStatus('not_found');
            }
        } catch {
            setStatus('pending'); // fallback
        }
    }, []);

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    // Auto-poll every 30 seconds while pending
    useEffect(() => {
        if (status !== 'pending') return;
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
    }, [status, checkStatus]);

    const handleSignOut = () => {
        authApi.logout();
        window.location.href = '/signin';
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg text-center"
                >
                    <AnimatePresence mode="wait">

                        {/* Loading */}
                        {status === 'loading' && (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                                <p className="text-muted-foreground">Checking your request status...</p>
                            </motion.div>
                        )}

                        {/* Pending */}
                        {status === 'pending' && (
                            <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="relative inline-flex items-center justify-center mb-8">
                                    <div className="w-24 h-24 rounded-full bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center">
                                        <Clock className="w-10 h-10 text-yellow-500 animate-pulse" />
                                    </div>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3, type: "spring" }}
                                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center"
                                    >
                                        <Building2 className="w-4 h-4 text-white" />
                                    </motion.div>
                                </div>

                                <h1 className="text-3xl font-black mb-2">Request Under Review</h1>
                                {businessName && (
                                    <p className="text-primary font-semibold mb-2">{businessName}</p>
                                )}
                                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                    Your business account request has been submitted. Our admin team will review it shortly. This page auto-refreshes every 30 seconds.
                                </p>

                                {/* Steps */}
                                <div className="glass-card rounded-2xl p-5 mb-6 text-left">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        </div>
                                        <p className="text-sm font-medium">Request submitted</p>
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-7 h-7 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                                            <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
                                        </div>
                                        <p className="text-sm font-medium text-yellow-500">Admin is reviewing your request...</p>
                                    </div>
                                    <div className="flex items-center gap-3 opacity-40">
                                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                                            <Building2 className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground">Business account activated</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button variant="outline" className="gap-2" onClick={checkStatus}>
                                        <RefreshCw className="w-4 h-4" /> Check Now
                                    </Button>
                                    <Link href="/">
                                        <Button variant="ghost" className="gap-2 w-full">
                                            <ArrowLeft className="w-4 h-4" /> Back to Home
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        {/* Approved */}
                        {status === 'approved' && (
                            <motion.div key="approved" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                                <div className="relative inline-flex items-center justify-center mb-8">
                                    <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center">
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </div>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3, type: "spring" }}
                                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
                                    >
                                        <Building2 className="w-4 h-4 text-white" />
                                    </motion.div>
                                </div>

                                <h1 className="text-3xl font-black mb-2 text-green-500">You're Approved! 🎉</h1>
                                {businessName && (
                                    <p className="text-primary font-semibold mb-2">{businessName}</p>
                                )}
                                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                    Your business account has been approved. To access your Business Dashboard, please <strong>sign in again</strong> — this refreshes your session with your new business role.
                                </p>

                                <div className="glass-card rounded-2xl p-5 mb-6 text-left border border-green-500/20">
                                    <p className="text-sm font-semibold text-green-500 mb-3">What to do next:</p>
                                    <ol className="space-y-2 text-sm text-muted-foreground">
                                        <li>1. Click <strong className="text-foreground">Sign In Again</strong> below</li>
                                        <li>2. Select the <strong className="text-foreground">Business</strong> tab on the login page</li>
                                        <li>3. Enter your credentials → you'll land on your Business Dashboard</li>
                                    </ol>
                                </div>

                                <Button onClick={handleSignOut} className="gap-2 w-full sm:w-auto" size="lg">
                                    <LogIn className="w-5 h-5" /> Sign In to Your Business Account
                                </Button>
                            </motion.div>
                        )}

                        {/* Rejected */}
                        {status === 'rejected' && (
                            <motion.div key="rejected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="relative inline-flex items-center justify-center mb-8">
                                    <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
                                        <XCircle className="w-10 h-10 text-red-500" />
                                    </div>
                                </div>

                                <h1 className="text-3xl font-black mb-2">Request Not Approved</h1>
                                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                    Unfortunately your business request was not approved at this time. You can contact support or try registering with updated information.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link href="/signup">
                                        <Button className="gap-2 w-full sm:w-auto">
                                            <Building2 className="w-4 h-4" /> Try Again
                                        </Button>
                                    </Link>
                                    <Link href="/">
                                        <Button variant="outline" className="gap-2 w-full sm:w-auto">
                                            <ArrowLeft className="w-4 h-4" /> Back to Home
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}
