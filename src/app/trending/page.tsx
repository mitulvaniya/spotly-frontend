"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { MapPin, Star, Flame, Trophy, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface TrendingSpot {
    _id: string;
    name: string;
    category: string;
    rating: number;
    reviewCount: number;
    featuredImage: string;
    location: {
        city: string;
        address: string;
    };
    views: number;
    priceRange: string;
    tags: string[];
}

export default function TrendingPage() {
    const [spots, setSpots] = useState<TrendingSpot[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSpots = async () => {
            try {
                const response = await api.get<{ spots: TrendingSpot[] }>('/spots?limit=20');
                if (response.success && response.data?.spots) {
                    // Sort by views (highest first), then by rating
                    const sorted = response.data.spots.sort((a, b) => {
                        const viewsA = a.views || 0;
                        const viewsB = b.views || 0;
                        if (viewsB !== viewsA) return viewsB - viewsA;
                        return (b.rating || 0) - (a.rating || 0);
                    });
                    setSpots(sorted);
                }
            } catch (error) {
                console.error("Failed to fetch trending spots:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSpots();
    }, []);

    const totalViews = spots.reduce((sum, s) => sum + (s.views || 0), 0);
    const formattedViews = totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews.toString();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                    <div className="text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm font-bold mb-4 border border-orange-500/20"
                        >
                            <Flame className="w-4 h-4" /> Hottest in Surat
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-black mb-4">Trending Now</h1>
                        <p className="text-muted-foreground text-lg max-w-lg">
                            The most visited, reviewed, and talked-about spots in Surat this week.
                        </p>
                    </div>

                    <div className="hidden md:block p-8 rounded-3xl bg-muted/30 border border-border">
                        <div className="flex items-center gap-4 text-left">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{formattedViews}</p>
                                <p className="text-sm text-muted-foreground">Total Views this Week</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : spots.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-2xl font-bold mb-2">No trending spots yet</p>
                        <p className="text-muted-foreground mb-6">Check back soon!</p>
                        <Link href="/discover">
                            <Button>Explore All Spots</Button>
                        </Link>
                    </div>
                ) : (
                    /* List */
                    <div className="space-y-6">
                        {spots.map((spot, i) => (
                            <Link key={spot._id} href={`/spot/${spot._id}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group"
                                >
                                    <Card spotId={spot._id} className="hover:bg-accent/50 transition-colors border-border overflow-visible mb-6">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row gap-6 p-4">
                                                {/* Image */}
                                                <div className="relative w-full md:w-72 h-48 md:h-auto md:min-h-[240px] shrink-0 rounded-2xl overflow-hidden">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={spot.featuredImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800'}
                                                        alt={spot.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800'; }}
                                                    />
                                                    <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-lg z-10">
                                                        #{i + 1}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 py-2 flex flex-col justify-center">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <span className="text-xs font-medium text-primary mb-2 block">{spot.category}</span>
                                                            <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{spot.name}</h3>
                                                        </div>
                                                        {i < 3 && (
                                                            <div className="flex items-center gap-1 bg-secondary/10 text-secondary px-2 py-1 rounded-lg text-sm font-bold">
                                                                <Trophy className="w-3 h-3" /> {i === 0 ? '#1 Most Popular' : 'Top Rated'}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="text-muted-foreground flex items-center gap-2 mb-4">
                                                        <MapPin className="w-4 h-4" /> {spot.location?.address || spot.location?.city || "Surat"}
                                                    </p>

                                                    <div className="flex items-center gap-6 text-sm">
                                                        <div className="flex items-center gap-1 font-medium">
                                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {spot.rating || "New"} <span className="text-muted-foreground font-normal">({spot.reviewCount || 0} reviews)</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-muted-foreground">
                                                            <Flame className="w-4 h-4 text-orange-500" /> {spot.views ? `${(spot.views / 1000).toFixed(1)}k views` : "New"}
                                                        </div>
                                                        <span className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded font-medium">
                                                            {spot.priceRange || "$$"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action */}
                                                <div className="flex items-center justify-center pr-4 md:border-l border-border md:pl-4">
                                                    <Button variant="ghost" className="rounded-full w-12 h-12 md:w-auto md:h-auto md:aspect-square p-0">
                                                        <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}

            </div>
            <Footer />
        </div>
    );
}
