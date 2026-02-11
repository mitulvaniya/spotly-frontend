"use client";

import React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api";

declare global {
    interface Window {
        google?: any;
    }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function SignInPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleGoogleResponse = useCallback(async (response: any) => {
        if (!response.credential) {
            toast.error("Google sign-in failed", { description: "No credential received." });
            return;
        }

        setIsGoogleLoading(true);
        try {
            const result = await authApi.googleLogin(response.credential);
            if (result.success) {
                toast.success("Welcome!", { description: "Signed in with Google successfully." });
                window.location.href = '/';
            } else {
                toast.error("Google sign-in failed", { description: result.message || "Please try again." });
            }
        } catch (error: any) {
            toast.error("An error occurred", { description: error.message || "Please try again." });
        } finally {
            setIsGoogleLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) return;

        // Load Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            window.google?.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse,
            });
        };
        document.body.appendChild(script);

        return () => {
            try { document.body.removeChild(script); } catch (e) { }
        };
    }, [handleGoogleResponse]);

    const handleGoogleClick = () => {
        if (!GOOGLE_CLIENT_ID) {
            toast.info("Google login requires a Client ID. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID.");
            return;
        }
        if (!window.google) {
            toast.error("Google SDK not loaded yet. Please try again in a moment.");
            return;
        }
        // Trigger Google One Tap popup
        window.google.accounts.id.prompt();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.type]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authApi.login(formData.email, formData.password);

            if (response.success) {
                toast.success("Welcome back!", {
                    description: "You have successfully signed in.",
                });
                window.location.href = '/';
            } else {
                toast.error("Sign in failed", {
                    description: response.message || "Please check your credentials.",
                });
            }
        } catch (error: any) {
            console.error("Login error:", error);
            toast.error("An error occurred", {
                description: error.message || "Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                        {/* Decorative blur */}
                        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/20 blur-[100px] rounded-full pointer-events-none" />

                        <div className="relative z-10">
                            <div className="text-center mb-8">
                                <Link href="/" className="inline-block mb-6">
                                    <span className="text-3xl font-bold tracking-tight">
                                        SPOTLY<span className="text-primary">.</span>
                                    </span>
                                </Link>
                                <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
                                <p className="text-muted-foreground">Sign in to access your saved spots</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="hello@example.com"
                                            className="w-full bg-muted/50 border border-border rounded-xl px-12 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full bg-muted/50 border border-border rounded-xl px-12 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button type="button" onClick={() => toast.info("Password reset coming soon!")} className="text-sm text-primary hover:underline">
                                        Forgot password?
                                    </button>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Signing in..." : "Sign In"}
                                </Button>
                            </form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <div>
                                <Button variant="outline" className="w-full gap-2" type="button" onClick={handleGoogleClick} disabled={isGoogleLoading}>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    {isGoogleLoading ? "Signing in..." : "Continue with Google"}
                                </Button>
                            </div>

                            <p className="text-center text-sm text-muted-foreground mt-8">
                                Don't have an account?{" "}
                                <Link href="/signup" className="text-primary hover:underline font-medium">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}
