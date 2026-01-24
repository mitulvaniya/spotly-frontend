"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { MapPin, Star, Flame, Trophy, TrendingUp, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock Trending Data (Sorted by popularity/rating)
const TRENDING_SPOTS = [
    {
        id: 1,
        name: "The Cloud Lounge",
        category: "Nightlife",
        rating: 4.9,
        reviews: 1240,
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070",
        location: "Downtown",
        rank: 1,
        views: "12k this week"
    },
    {
        id: 5,
        name: "Urban Garden",
        category: "Nature",
        rating: 4.9,
        reviews: 850,
        image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2600",
        location: "City Park",
        rank: 2,
        views: "10k this week"
    },
    {
        id: 2,
        name: "Sakura Fusion",
        category: "Dining",
        rating: 4.8,
        reviews: 930,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070",
        location: "Arts District",
        rank: 3,
        views: "9.5k this week"
    },
    {
        id: 3,
        name: "Neon Arcade",
        category: "Entertainment",
        rating: 4.7,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?q=80&w=2012",
        location: "Retro Row",
        rank: 4,
        views: "8k this week"
    }
];

export default function TrendingPage() {
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
                            <Flame className="w-4 h-4" /> Hottest in City
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-black mb-4">Trending Now</h1>
                        <p className="text-muted-foreground text-lg max-w-lg">
                            The most visited, reviewed, and talked-about spots in the city this week.
                        </p>
                    </div>

                    <div className="hidden md:block p-8 rounded-3xl bg-muted/30 border border-border">
                        <div className="flex items-center gap-4 text-left">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">42.5k</p>
                                <p className="text-sm text-muted-foreground">Total Views this Week</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-6">
                    {TRENDING_SPOTS.map((spot, i) => (
                        <Link key={spot.id} href={`/spot/${spot.id}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group"
                            >
                                <Card spotId={spot.id.toString()} className="hover:bg-accent/50 transition-colors border-border overflow-visible">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row gap-6 p-4">
                                            {/* Image */}
                                            <div className="relative w-full md:w-72 h-48 md:h-auto md:min-h-[240px] shrink-0 rounded-2xl overflow-hidden">
                                                <Image
                                                    src={spot.image}
                                                    alt={spot.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-lg z-10">
                                                    #{spot.rank}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 py-2 flex flex-col justify-center">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <span className="text-xs font-medium text-primary mb-2 block">{spot.category}</span>
                                                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{spot.name}</h3>
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-secondary/10 text-secondary px-2 py-1 rounded-lg text-sm font-bold">
                                                        <Trophy className="w-3 h-3" /> Top Rated
                                                    </div>
                                                </div>

                                                <p className="text-muted-foreground flex items-center gap-2 mb-4">
                                                    <MapPin className="w-4 h-4" /> {spot.location}
                                                </p>

                                                <div className="flex items-center gap-6 text-sm">
                                                    <div className="flex items-center gap-1 font-medium">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {spot.rating} <span className="text-muted-foreground font-normal">({spot.reviews})</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <Flame className="w-4 h-4 text-orange-500" /> {spot.views}
                                                    </div>
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

            </div>
            <Footer />
        </div>
    );
}
