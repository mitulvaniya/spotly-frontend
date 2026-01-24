"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, TrendingUp, ArrowLeft } from "lucide-react";
import { CATEGORIES, SPOTS } from "@/lib/data";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CategoriesPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Get spots for selected category
    const filteredSpots = selectedCategory
        ? SPOTS.filter(spot => spot.category === selectedCategory)
        : [];

    // Get trending categories (top 3 by count)
    const trendingCategories = [...CATEGORIES]
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-20">
                {!selectedCategory ? (
                    <>
                        {/* Hero Section */}
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-6xl font-black mb-6 tracking-tighter"
                            >
                                Explore by <span className="text-gradient">Category</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-xl text-muted-foreground"
                            >
                                Find exactly what you need. From top-rated restaurants to essential local services.
                            </motion.p>
                        </div>

                        {/* Trending Categories */}
                        <div className="mb-16">
                            <div className="flex items-center gap-2 mb-6">
                                <TrendingUp className="w-6 h-6 text-primary" />
                                <h2 className="text-3xl font-bold">Trending Now</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {trendingCategories.map((cat, i) => (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className="group relative h-[300px] rounded-3xl overflow-hidden cursor-pointer"
                                    >
                                        <Image
                                            src={cat.image}
                                            alt={cat.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                        {/* Content */}
                                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md text-white">
                                                    <cat.icon className="w-5 h-5" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
                                            </div>
                                            <p className="text-white/80 text-sm mb-3">{cat.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-white/60 text-sm font-medium">{cat.count} listings</span>
                                                <ArrowUpRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* All Categories */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6">All Categories</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {CATEGORIES.map((cat, i) => (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        whileHover={{ y: -8 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer bg-muted/20 border border-border hover:border-primary/50 transition-colors"
                                    >
                                        {/* Image Half */}
                                        <div className="relative h-[60%] w-full overflow-hidden">
                                            <Image
                                                src={cat.image}
                                                alt={cat.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium border border-white/10 text-white">
                                                {cat.count} listings
                                            </div>
                                        </div>

                                        {/* Content Half */}
                                        <div className="h-[40%] p-6 flex flex-col justify-between bg-card">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                            <cat.icon className="w-5 h-5" />
                                                        </div>
                                                        <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">{cat.name}</h2>
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground text-sm mb-4">
                                                    {cat.description}
                                                </p>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2">
                                                {cat.subCategories.slice(0, 3).map(sub => (
                                                    <span key={sub} className="text-xs font-medium px-2 py-1 rounded-md bg-muted text-foreground/70 border border-border">
                                                        {sub}
                                                    </span>
                                                ))}
                                                {cat.subCategories.length > 3 && (
                                                    <span className="text-xs font-medium px-2 py-1 rounded-md bg-muted text-foreground/50 border border-border">
                                                        +{cat.subCategories.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Hover Overlay Icon */}
                                        <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Filtered View */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Button
                                variant="secondary"
                                onClick={() => setSelectedCategory(null)}
                                className="mb-8"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to All Categories
                            </Button>

                            <div className="mb-12">
                                <h1 className="text-4xl md:text-5xl font-black mb-4">
                                    <span className="text-gradient">{selectedCategory}</span>
                                </h1>
                                <p className="text-xl text-muted-foreground">
                                    {filteredSpots.length} spots found
                                </p>
                            </div>

                            {filteredSpots.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredSpots.map((spot, i) => (
                                        <motion.div
                                            key={spot.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Card className="group cursor-pointer">
                                                <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                                                    <Image
                                                        src={spot.image}
                                                        alt={spot.name}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="p-6">
                                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                        {spot.name}
                                                    </h3>
                                                    <p className="text-muted-foreground mb-3">{spot.location}</p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex gap-2">
                                                            {spot.tags.map(tag => (
                                                                <span key={tag} className="text-xs px-2 py-1 rounded-md bg-muted border border-border">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-yellow-500">★</span>
                                                            <span className="font-semibold">{spot.rating}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-2xl text-muted-foreground">No spots found in this category yet.</p>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}
