"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, TrendingUp, ArrowLeft, Search, X } from "lucide-react";
import { CATEGORIES, SPOTS } from "@/lib/data";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function CategoriesPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

    // Filter categories by search query
    const filteredCategories = useMemo(() => {
        if (!searchQuery) return CATEGORIES;

        const query = searchQuery.toLowerCase();
        return CATEGORIES.filter(cat =>
            cat.name.toLowerCase().includes(query) ||
            cat.description.toLowerCase().includes(query) ||
            cat.subCategories.some(sub => sub.toLowerCase().includes(query))
        );
    }, [searchQuery]);

    // Get spots for selected category and subcategory
    const filteredSpots = useMemo(() => {
        if (!selectedCategory) return [];

        let spots = SPOTS.filter(spot => spot.category === selectedCategory);

        // Filter by subcategory if selected
        if (selectedSubcategory) {
            spots = spots.filter(spot =>
                spot.tags.some(tag => tag.toLowerCase() === selectedSubcategory.toLowerCase())
            );
        }

        return spots;
    }, [selectedCategory, selectedSubcategory]);

    // Get trending categories (top 3 by count)
    const trendingCategories = [...CATEGORIES]
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    // Get subcategories for selected category
    const currentCategory = CATEGORIES.find(cat => cat.name === selectedCategory);
    const subcategories = currentCategory?.subCategories || [];

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    const handleBackToCategories = () => {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-20">
                <Breadcrumbs
                    items={[
                        { label: "Categories", href: "/categories" },
                        ...(selectedCategory ? [{ label: selectedCategory }] : [])
                    ]}
                    className="mb-8"
                />
                {!selectedCategory ? (
                    <>
                        {/* Hero Section */}
                        <div className="text-center max-w-3xl mx-auto mb-12">
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
                                className="text-xl text-muted-foreground mb-8"
                            >
                                Find exactly what you need. From top-rated restaurants to essential local services.
                            </motion.p>

                            {/* Search Bar */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="relative max-w-2xl mx-auto"
                            >
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search categories, subcategories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-muted border border-border rounded-full h-14 pl-12 pr-12 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </motion.div>

                            {/* Search Results Count */}
                            {searchQuery && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-muted-foreground mt-4"
                                >
                                    Found {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
                                </motion.p>
                            )}
                        </div>

                        {/* Trending Categories */}
                        {!searchQuery && (
                            <div className="mb-16">
                                <div className="flex items-center gap-2 mb-6">
                                    <TrendingUp className="w-6 h-6 text-primary" />
                                    <h2 className="text-3xl font-bold">Trending Now</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {trendingCategories.map((cat, i) => (
                                        <motion.div
                                            key={cat.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            onClick={() => setSelectedCategory(cat.name)}
                                            className="relative h-80 rounded-3xl overflow-hidden cursor-pointer group"
                                        >
                                            <Image
                                                src={cat.image}
                                                alt={cat.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <cat.icon className="w-6 h-6 text-primary" />
                                                    <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-1 rounded-full">
                                                        {cat.count} spots
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                                                <p className="text-white/80 text-sm">{cat.description}</p>
                                                <ArrowUpRight className="absolute top-6 right-6 w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Categories */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                {searchQuery ? 'Search Results' : 'All Categories'}
                            </h2>

                            {filteredCategories.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredCategories.map((cat, i) => (
                                        <motion.div
                                            key={cat.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => setSelectedCategory(cat.name)}
                                            className="glass-card rounded-3xl overflow-hidden cursor-pointer group hover:border-primary transition-all"
                                        >
                                            {/* Image Section - 60% */}
                                            <div className="relative h-48">
                                                <Image
                                                    src={cat.image}
                                                    alt={cat.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                                                    {cat.count} spots
                                                </div>
                                                <ArrowUpRight className="absolute top-4 left-4 w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>

                                            {/* Info Section - 40% */}
                                            <div className="p-6">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <cat.icon className="w-5 h-5 text-primary" />
                                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{cat.name}</h3>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>

                                                {/* Subcategories */}
                                                <div className="flex flex-wrap gap-2">
                                                    {cat.subCategories.slice(0, 3).map(sub => (
                                                        <span key={sub} className="text-xs bg-white/5 px-2 py-1 rounded-full text-white/70">
                                                            {sub}
                                                        </span>
                                                    ))}
                                                    {cat.subCategories.length > 3 && (
                                                        <span className="text-xs text-primary">+{cat.subCategories.length - 3} more</span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-2xl font-bold mb-2">No categories found</p>
                                    <p className="text-muted-foreground mb-6">Try a different search term</p>
                                    <Button onClick={handleClearSearch}>Clear Search</Button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Filtered View */}
                        <div className="mb-8">
                            <Button
                                variant="ghost"
                                onClick={handleBackToCategories}
                                className="mb-6"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to All Categories
                            </Button>

                            <h1 className="text-4xl font-bold mb-2">{selectedCategory}</h1>
                            <p className="text-muted-foreground mb-6">
                                {filteredSpots.length} {filteredSpots.length === 1 ? 'spot' : 'spots'} found
                            </p>

                            {/* Subcategory Filter */}
                            {subcategories.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Filter by:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setSelectedSubcategory(null)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedSubcategory
                                                ? 'bg-primary text-white'
                                                : 'bg-muted hover:bg-muted/80'
                                                }`}
                                        >
                                            All
                                        </button>
                                        {subcategories.map(sub => (
                                            <button
                                                key={sub}
                                                onClick={() => setSelectedSubcategory(sub)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSubcategory === sub
                                                    ? 'bg-primary text-white'
                                                    : 'bg-muted hover:bg-muted/80'
                                                    }`}
                                            >
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Spots Grid */}
                        {filteredSpots.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredSpots.map((spot, i) => (
                                    <Link key={spot.id} href={`/spot/${spot.id}`}>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Card spotId={spot.id.toString()} className="group cursor-pointer">
                                                <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                                                    <Image
                                                        src={spot.image}
                                                        alt={spot.name}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold border border-white/10">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {spot.rating}
                                                    </div>
                                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold border border-white/10">
                                                        {spot.price}
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{spot.name}</h3>
                                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                                <MapPin className="w-3 h-3" /> {spot.location} • {spot.distance}km
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 mt-4">
                                                        {spot.tags.map(tag => (
                                                            <span key={tag} className="text-[10px] uppercase tracking-wider text-white/50 bg-white/5 px-2 py-1 rounded-sm">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-2xl font-bold mb-2">No spots found</p>
                                <p className="text-muted-foreground mb-6">
                                    {selectedSubcategory
                                        ? `No spots match the "${selectedSubcategory}" filter`
                                        : 'Try selecting a different category'
                                    }
                                </p>
                                {selectedSubcategory && (
                                    <Button onClick={() => setSelectedSubcategory(null)}>Clear Filter</Button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}
