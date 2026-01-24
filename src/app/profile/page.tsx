"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { User, Settings, Heart, LogOut, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { SPOTS } from "@/lib/data";
import Link from "next/link";

export default function ProfilePage() {
    const { savedIds } = useWishlist();
    const savedSpots = SPOTS.filter(spot => savedIds.includes(spot.id.toString()));

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 pt-32 pb-20">
                <Breadcrumbs
                    items={[{ label: "Profile" }]}
                    className="mb-8"
                />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="glass-card p-6 rounded-3xl sticky top-32">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 mb-4">
                                    <div className="w-full h-full rounded-full bg-background overflow-hidden relative">
                                        <Image
                                            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1287&auto=format&fit=crop"
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold">Alex Johnson</h2>
                                <p className="text-muted-foreground text-sm">City Explorer</p>
                            </div>

                            <nav className="space-y-2">
                                <Button variant="ghost" className="w-full justify-start gap-3 bg-muted/50">
                                    <User className="w-4 h-4" /> Personal Info
                                </Button>
                                <Button variant="ghost" className="w-full justify-start gap-3">
                                    <Settings className="w-4 h-4" /> Account Settings
                                </Button>
                                <Link href="/saved">
                                    <Button variant="ghost" className="w-full justify-start gap-3">
                                        <Heart className="w-4 h-4 text-pink-500" /> Saved Spots
                                    </Button>
                                </Link>
                                <div className="h-px bg-border my-2" />
                                <Link href="/">
                                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-500 hover:bg-red-500/10">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </Button>
                                </Link>
                            </nav>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h1 className="text-3xl font-bold mb-6">Personal Information</h1>
                            <div className="glass-card p-8 rounded-3xl space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Alex Johnson"
                                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue="alex.J@example.com"
                                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone Number</label>
                                        <input
                                            type="tel"
                                            defaultValue="+1 (555) 123-4567"
                                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Location</label>
                                        <input
                                            type="text"
                                            defaultValue="New York, NY"
                                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button>Save Changes</Button>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                            <div className="glass-card p-6 rounded-3xl">
                                {savedSpots.length > 0 ? (
                                    <div className="space-y-4">
                                        {savedSpots.slice(0, 3).map(spot => (
                                            <div key={spot.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden relative shrink-0">
                                                    <Image src={spot.image} alt={spot.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold group-hover:text-primary transition-colors">{spot.name}</h3>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {spot.location}
                                                    </p>
                                                </div>
                                                <div className="text-xs font-bold bg-background px-2 py-1 rounded-md border border-border">
                                                    Saved
                                                </div>
                                            </div>
                                        ))}
                                        <Link href="/saved" className="block text-center text-sm text-primary hover:underline pt-2">
                                            View all activity
                                        </Link>
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">No recent activity</p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
