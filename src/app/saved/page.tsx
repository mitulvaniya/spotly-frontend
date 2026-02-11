"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { useWishlist } from "@/context/WishlistContext";
import { SPOTS } from "@/lib/data";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HeartOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SavedPage() {
    const { savedIds } = useWishlist();
    // Ensure both IDs are compared as strings to avoid type mismatch
    const savedSpots = SPOTS.filter(spot => savedIds.includes(spot.id.toString()));

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 pt-24 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold font-outfit text-foreground mb-2">Your Collection 💖</h1>
                    <p className="text-muted-foreground">Manage your favorite spots for future reference.</p>
                </motion.div>

                {savedSpots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                            <HeartOff className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">No Saved Spots Yet</h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">Start exploring to find the hidden gems of Surat and add them to your collection.</p>
                        <Link href="/discover">
                            <Button variant="primary" size="md">Start Exploring</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedSpots.map((spot, index) => (
                            <Link href={`/spot/${spot.id}`} key={spot.id}>
                                <Card
                                    spotId={spot.id.toString()}
                                    className="h-full hover:border-primary/50 transition-colors"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
                                        <Image
                                            src={spot.image}
                                            alt={spot.name}
                                            fill
                                            className="object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-medium text-white">
                                            {spot.category}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold font-outfit text-foreground">{spot.name}</h3>
                                            {/* Fallback for price since it's missing in basic Type */}
                                            <span className="text-sm font-medium text-primary">₹₹₹</span>
                                        </div>
                                        {/* Fallback for description */}
                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                            Experience the best vibes in Surat. A top-rated destination for {spot.category} lovers.
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>⭐ {spot.rating}</span>
                                            <span>•</span>
                                            <span>{spot.location}</span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
