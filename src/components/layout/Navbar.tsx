"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Tooltip } from "@/components/ui/Tooltip";

import { useState } from "react";
import { Sparkles, Heart, Menu, X } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Discover", href: "/discover" },
        { name: "Trending", href: "/trending" },
        { name: "Categories", href: "/categories" },
        { name: "AI Concierge", href: "/ai" },
    ];

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

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Tooltip text="Toggle Theme">
                        <ThemeToggle />
                    </Tooltip>

                    <Link href="/ai">
                        <Tooltip text="Ask AI Host">
                            <Button
                                variant="secondary"
                                size="sm"
                                as="div"
                                className="gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-300 hover:from-indigo-500/20 hover:to-purple-500/20"
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

                    <Link href="/signin">
                        <Button variant="primary" size="sm">
                            Sign In
                        </Button>
                    </Link>
                </div>

                {/* Mobile Actions */}
                <div className="flex md:hidden items-center gap-3">
                    <ThemeToggle />
                    <Link href="/saved">
                        <Button variant="ghost" size="sm" as="div" className="relative text-muted-foreground hover:text-pink-500 px-0 w-9 h-9">
                            <Heart className="w-5 h-5" />
                            <SavedBadge />
                        </Button>
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            style={{ top: '80px' }}
                        />

                        {/* Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-xl md:hidden"
                        >
                            <nav className="container mx-auto px-6 py-6 space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <div className="pt-4 border-t border-border">
                                    <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="primary" className="w-full">
                                            Sign In
                                        </Button>
                                    </Link>
                                </div>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
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
