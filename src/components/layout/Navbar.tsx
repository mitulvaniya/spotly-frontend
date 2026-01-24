"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Tooltip } from "@/components/ui/Tooltip";

import { useState } from "react";
import { Sparkles, Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

export function Navbar() {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
        >
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-1 text-2xl font-bold tracking-tight text-foreground">
                    SPOTLY
                    <span className="text-primary animate-pulse">.</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {["Discover", "Trending", "Categories", "For Business"].map((item) => (
                        <Link
                            key={item}
                            href={`/${item.toLowerCase().replace(" ", "-")}`}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <Tooltip text="Toggle Theme">
                        <ThemeToggle />
                    </Tooltip>

                    <Link href="/ai">
                        <Tooltip text="Ask AI Host">
                            <Button
                                variant="secondary"
                                size="sm"
                                as="div"
                                className="hidden sm:inline-flex gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-300 hover:from-indigo-500/20 hover:to-purple-500/20"
                            >
                                <Sparkles className="w-4 h-4" /> Ask AI
                            </Button>
                        </Tooltip>
                    </Link>

                    <Link href="/saved">
                        <Tooltip text="Your Collection">
                            <Button variant="ghost" size="sm" as="div" className="relative group text-muted-foreground hover:text-pink-500 px-0 w-9 h-9">
                                <Heart className="w-5 h-5" />
                                <SavedBadge />
                            </Button>
                        </Tooltip>
                    </Link>

                    <Button variant="primary" size="sm" className="hidden sm:inline-flex">
                        Sign In
                    </Button>
                </div>
            </div>

        </motion.header>
    );
}

function SavedBadge() {
    const { savedIds } = useWishlist();
    if (savedIds.length === 0) return null;
    return (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full">
            {savedIds.length}
        </span>
    );
}
