"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type WishlistContextType = {
    savedIds: string[];
    toggleSave: (id: string) => void;
    isSaved: (id: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("spotly_wishlist");
        if (stored) {
            setSavedIds(JSON.parse(stored));
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage whenever state changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("spotly_wishlist", JSON.stringify(savedIds));
        }
    }, [savedIds, isLoaded]);

    const toggleSave = (id: string) => {
        setSavedIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const isSaved = (id: string) => savedIds.includes(id);

    return (
        <WishlistContext.Provider value={{ savedIds, toggleSave, isSaved }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
