"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { BarChart3, Users, Store, Plus, TrendingUp, DollarSign } from "lucide-react";
import Image from "next/image";

import { toast } from "sonner";

export default function BusinessDashboardPage() {
    const stats = [
        { label: "Total Views", value: "12.5k", icon: Users, change: "+12%", color: "text-blue-500" },
        { label: "Profile Clicks", value: "843", icon: BarChart3, change: "+5%", color: "text-purple-500" },
        { label: "Reservations", value: "128", icon: Store, change: "+18%", color: "text-green-500" },
        { label: "Revenue Est.", value: "$12.4k", icon: DollarSign, change: "+8%", color: "text-orange-500" },
    ];

    const handleAddSpot = () => {
        toast.info("Coming Soon", {
            description: "Backend integration required to add new spots."
        });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 pt-32 pb-20">
                <div className="flex justify-between items-center mb-8">
                    <Breadcrumbs
                        items={[{ label: "Business Dashboard" }]}
                    />
                    <Button className="gap-2" onClick={handleAddSpot}>
                        <Plus className="w-4 h-4" /> Add New Spot
                    </Button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-3xl font-bold mb-2">My Business Dashboard</h1>
                    <p className="text-muted-foreground">Manage your listings and view performance analytics.</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 rounded-3xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-background border border-border ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Listings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <h2 className="text-2xl font-bold mb-6">Active Listings</h2>
                        <div className="glass-card rounded-3xl overflow-hidden">
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <span className="font-medium">2 Active Spots</span>
                                <Button variant="ghost" size="sm">View All</Button>
                            </div>
                            <div className="divide-y divide-white/10">
                                {[
                                    { name: "The Cloud Lounge", loc: "Downtown Skyline", views: "8.2k", status: "Active" },
                                    { name: "Sakura Fusion", loc: "Arts District", views: "4.3k", status: "Active" }
                                ].map((spot, i) => (
                                    <div key={i} className="p-6 flex items-center gap-4 hover:bg-white/5 transition-colors">
                                        <div className="w-16 h-16 rounded-xl bg-muted relative overflow-hidden">
                                            <Image
                                                src={i === 0 ? "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop" : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"}
                                                alt={spot.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold">{spot.name}</h3>
                                            <p className="text-sm text-muted-foreground">{spot.loc}</p>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="font-bold">{spot.views}</p>
                                            <p className="text-xs text-muted-foreground">Views</p>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-bold border border-green-500/20">
                                            {spot.status}
                                        </div>
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                        <div className="glass-card p-6 rounded-3xl space-y-6">
                            {[
                                "New review for Cloud Lounge",
                                "Booking verified for Sakura",
                                "Menu update approved"
                            ].map((activity, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 element-glow"></div>
                                    <div>
                                        <p className="text-sm font-medium">{activity}</p>
                                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full">View All Notifications</Button>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
