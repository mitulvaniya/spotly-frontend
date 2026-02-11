"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, Filter, X, ArrowUpDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { FilterSidebar } from "@/components/discover/FilterSidebar";
import { api } from "@/lib/api";

const SORT_OPTIONS = [
    { label: "Recommended", value: "recommended" },
    { label: "Highest Rated", value: "rating" },
    { label: "Latest", value: "latest" },
    { label: "Budget: Low to High", value: "price" },
];

interface Spot {
    _id: string;
    name: string;
    category: string;
    featuredImage: string;
    priceRange: string;
    rating: number;
    location: {
        city: string;
        address: string;
    };
    tags: string[];
    distance?: number; // Optional, calculated if location available
}

function DiscoverContent() {
    const searchParams = useSearchParams();
    const [spots, setSpots] = useState<Spot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        budget: [] as string[],
        minRating: 0,
        categories: [] as string[],
        maxDistance: 50,
    });
    const [sortBy, setSortBy] = useState("recommended");
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Initialize search from URL
    useEffect(() => {
        const query = searchParams.get("q");
        const category = searchParams.get("category");
        if (query) {
            setSearchQuery(query);
        }
        if (category) {
            setFilters(prev => ({ ...prev, categories: [category] }));
        }
    }, [searchParams]);

    // Fetch spots on mount
    useEffect(() => {
        const fetchSpots = async () => {
            setIsLoading(true);
            try {
                // Fetch all spots for client-side filtering (simpler for now)
                // In a real large-scale app, we would move filtering to backend.
                const response = await api.get<{ spots: Spot[] }>('/spots?limit=100');
                if (response.success && response.data?.spots) {
                    setSpots(response.data.spots);
                }
            } catch (error) {
                console.error("Failed to fetch spots:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSpots();
    }, []);

    // Apply filters
    let filteredSpots = spots.filter(spot => {
        // Budget filter
        if (filters.budget.length > 0 && !filters.budget.includes(spot.priceRange)) return false;

        // Rating filter
        if ((spot.rating || 0) < filters.minRating) return false;

        // Category filter
        if (filters.categories.length > 0 && !filters.categories.includes(spot.category)) return false;

        // Search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesName = spot.name.toLowerCase().includes(query);
            const matchesCity = spot.location?.city?.toLowerCase().includes(query);
            const matchesCategory = spot.category.toLowerCase().includes(query);
            const matchesTags = spot.tags?.some(tag => tag.toLowerCase().includes(query));

            if (!matchesName && !matchesCity && !matchesCategory && !matchesTags) return false;
        }

        return true;
    });

    // Apply sorting
    filteredSpots = [...filteredSpots].sort((a, b) => {
        switch (sortBy) {
            case "rating":
                return (b.rating || 0) - (a.rating || 0);
            case "price":
                return (a.priceRange?.length || 0) - (b.priceRange?.length || 0);
            case "latest":
                // Assuming _id is somewhat time-ordered or we had createdAt
                return b._id.localeCompare(a._id);
            default:
                return 0; // Recommended (default order)
        }
    });

    const activeFilterCount = filters.budget.length + filters.categories.length +
        (filters.minRating > 0 ? 1 : 0);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-6">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore the City</h1>
                        <p className="text-muted-foreground text-lg">
                            {filteredSpots.length} {filteredSpots.length === 1 ? 'spot' : 'spots'} found
                            {searchQuery && <span className="text-foreground"> for "{searchQuery}"</span>}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search spots, locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-full h-12 pl-12 pr-6 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium"
                            />
                        </div>
                        <Button
                            variant="outline"
                            className="h-12 w-12 rounded-full p-0 shrink-0 md:hidden relative"
                            onClick={() => setShowMobileFilters(true)}
                        >
                            <Filter className="w-5 h-5" />
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Sort & Active Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-muted border border-border rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:border-primary cursor-pointer"
                        >
                            {SORT_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Active Filter Chips */}
                    {activeFilterCount > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {filters.budget.map(budget => (
                                <span key={budget} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                                    {budget}
                                    <button onClick={() => setFilters({ ...filters, budget: filters.budget.filter(b => b !== budget) })}>
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                            {filters.minRating > 0 && (
                                <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                                    {filters.minRating}+ ★
                                    <button onClick={() => setFilters({ ...filters, minRating: 0 })}>
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {filters.categories.map(cat => (
                                <span key={cat} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                                    {cat}
                                    <button onClick={() => setFilters({
                                        ...filters,
                                        categories: filters.categories.filter(c => c !== cat)
                                    })}>
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                            {(activeFilterCount > 0) && (
                                <button
                                    onClick={() => {
                                        setFilters({ budget: [], minRating: 0, categories: [] });
                                        setSearchQuery("");
                                    }}
                                    className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Content: Sidebar + Grid */}
                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <div className="hidden md:block w-80 shrink-0">
                        <FilterSidebar filters={filters} onFilterChange={setFilters} />
                    </div>

                    {/* Results Grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : filteredSpots.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredSpots.map((spot, i) => (
                                    <Link key={spot._id} href={`/spot/${spot._id}`}>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Card spotId={spot._id} className="group cursor-pointer">
                                                <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                                                    <Image
                                                        src={spot.featuredImage || '/placeholder-spot.jpg'}
                                                        alt={spot.name}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold border border-white/10">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {spot.rating || "New"}
                                                    </div>
                                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold border border-white/10">
                                                        {spot.priceRange || "$$"}
                                                    </div>
                                                </div>
                                                <CardContent>
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{spot.name}</h3>
                                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                                <MapPin className="w-3 h-3" /> {spot.location?.city}
                                                            </p>
                                                        </div>
                                                        <span className="text-xs font-medium bg-white/5 border border-white/10 px-2 py-1 rounded">
                                                            {spot.category}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2 mt-4 flex-wrap">
                                                        {spot.tags?.slice(0, 3).map(tag => (
                                                            <span key={tag} className="text-[10px] uppercase tracking-wider text-white/50 bg-white/5 px-2 py-1 rounded-sm">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center rounded-3xl border border-white/10">
                                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No spots found</h3>
                                <p className="text-muted-foreground mb-6">
                                    We couldn't find anything matching "{searchQuery}".<br />
                                    Try adjusting your search or filters.
                                </p>
                                <Button onClick={() => {
                                    setFilters({ budget: [], minRating: 0, categories: [] });
                                    setSearchQuery("");
                                }}>
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {showMobileFilters && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileFilters(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        />
                        {/* Drawer */}
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={setFilters}
                            onClose={() => setShowMobileFilters(false)}
                            isMobile={true}
                        />
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}

export default function DiscoverPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DiscoverContent />
        </Suspense>
    );
}
