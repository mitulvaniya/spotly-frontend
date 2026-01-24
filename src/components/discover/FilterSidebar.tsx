"use client";

import { motion } from "framer-motion";
import { X, DollarSign, Star, MapPin, Grid3x3 } from "lucide-react";
import { CATEGORIES } from "@/lib/data";

const BUDGET_LEVELS = ["$", "$$", "$$$", "$$$$"];
const RATING_OPTIONS = [
    { label: "4.0+", value: 4.0 },
    { label: "4.5+", value: 4.5 },
    { label: "4.8+", value: 4.8 },
];

interface FilterSidebarProps {
    filters: {
        budget: string[];
        minRating: number;
        maxDistance: number;
        categories: string[];
    };
    onFilterChange: (filters: any) => void;
    onClose?: () => void;
    isMobile?: boolean;
}

export function FilterSidebar({ filters, onFilterChange, onClose, isMobile }: FilterSidebarProps) {
    const toggleBudget = (level: string) => {
        const newBudget = filters.budget.includes(level)
            ? filters.budget.filter(b => b !== level)
            : [...filters.budget, level];
        onFilterChange({ ...filters, budget: newBudget });
    };

    const toggleCategory = (category: string) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
        onFilterChange({ ...filters, categories: newCategories });
    };

    const clearAllFilters = () => {
        onFilterChange({
            budget: [],
            minRating: 0,
            maxDistance: 50,
            categories: [],
        });
    };

    const activeFilterCount = filters.budget.length + filters.categories.length +
        (filters.minRating > 0 ? 1 : 0) + (filters.maxDistance < 50 ? 1 : 0);

    return (
        <motion.div
            initial={isMobile ? { x: -300 } : { opacity: 0 }}
            animate={isMobile ? { x: 0 } : { opacity: 1 }}
            className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border' : 'sticky top-24 h-fit'} p-6 rounded-2xl`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Filters</h2>
                    {activeFilterCount > 0 && (
                        <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </div>
                {isMobile && (
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Clear All */}
            {activeFilterCount > 0 && (
                <button
                    onClick={clearAllFilters}
                    className="w-full mb-6 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                    Clear All Filters
                </button>
            )}

            <div className="space-y-6">
                {/* Budget Filter */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold">Budget</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {BUDGET_LEVELS.map(level => (
                            <button
                                key={level}
                                onClick={() => toggleBudget(level)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filters.budget.includes(level)
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                        : 'bg-muted hover:bg-muted/80 text-foreground'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rating Filter */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold">Minimum Rating</h3>
                    </div>
                    <div className="space-y-2">
                        {RATING_OPTIONS.map(option => (
                            <button
                                key={option.value}
                                onClick={() => onFilterChange({ ...filters, minRating: filters.minRating === option.value ? 0 : option.value })}
                                className={`w-full px-4 py-2 rounded-lg text-sm font-medium text-left transition-all flex items-center gap-2 ${filters.minRating === option.value
                                        ? 'bg-primary text-white'
                                        : 'bg-muted hover:bg-muted/80 text-foreground'
                                    }`}
                            >
                                <Star className="w-4 h-4 fill-current" />
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Distance Slider */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold">Distance</h3>
                    </div>
                    <div className="space-y-3">
                        <input
                            type="range"
                            min="1"
                            max="50"
                            value={filters.maxDistance}
                            onChange={(e) => onFilterChange({ ...filters, maxDistance: parseInt(e.target.value) })}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>1 km</span>
                            <span className="font-semibold text-primary">{filters.maxDistance} km</span>
                            <span>50 km</span>
                        </div>
                    </div>
                </div>

                {/* Category Multi-Select */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Grid3x3 className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold">Categories</h3>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {CATEGORIES.map(cat => (
                            <label
                                key={cat.id}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.categories.includes(cat.name)}
                                    onChange={() => toggleCategory(cat.name)}
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                                />
                                <div className="flex items-center gap-2 flex-1">
                                    <cat.icon className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">{cat.name}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{cat.count}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
