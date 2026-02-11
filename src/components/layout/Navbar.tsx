"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Tooltip } from "@/components/ui/Tooltip";
import { Logo } from "@/components/ui/Logo";

import { useState, useEffect } from "react";
import { Sparkles, Heart, Menu, X, User, LogOut } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { authApi } from "@/lib/api";

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const currentUser = authApi.getCurrentUser();
        setUser(currentUser);
    }, []);

    const handleLogout = () => {
        authApi.logout();
        setUser(null);
    };

    const navItems = [
        { name: "Discover", href: "/discover" },
        { name: "Trending", href: "/trending" },
        { name: "Categories", href: "/categories" },
        { name: "For Business", href: "/business" },
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
                <Link href="/" className="group flex items-center gap-1 text-foreground">
                    <Logo />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {[{ name: "Discover", href: "/discover" }, { name: "Trending", href: "/trending" }, { name: "Categories", href: "/categories" }, { name: "For Business", href: "/business" }].map((item) => (
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

                    {user ? (
                        <div className="relative">
                            <Tooltip text={user.name || user.email}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="gap-2"
                                >
                                    <User className="w-4 h-4" />
                                    <span className="hidden lg:inline">{user.name || 'Profile'}</span>
                                </Button>
                            </Tooltip>
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                                    <Link href="/profile" onClick={() => setShowUserMenu(false)}>
                                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Profile
                                        </button>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center gap-2 text-red-500"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/signin">
                            <Button variant="primary" size="sm">
                                Sign In
                            </Button>
                        </Link>
                    )}
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
                                {user ? (
                                    <div className="pt-4 border-t border-border space-y-2">
                                        <div className="px-4 py-2 flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    <User className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full justify-start gap-2">
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="pt-4 border-t border-border">
                                        <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="primary" className="w-full">
                                                Sign In
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.header >
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
