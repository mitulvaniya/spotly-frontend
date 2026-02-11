"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { userApi, authApi } from "@/lib/api";
import { toast } from "sonner";

type WishlistContextType = {
    savedIds: string[];
    toggleSave: (id: string) => void;
    isSaved: (id: string) => boolean;
    isLoading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Initial load
    useEffect(() => {
        const checkUserAndLoad = async () => {
            const currentUser = authApi.getCurrentUser();
            setUser(currentUser);

            if (currentUser) {
                try {
                    const response = await userApi.getSavedSpots();
                    if (response.success && response.data?.savedSpots) {
                        // Extract IDs from spot objects
                        const ids = response.data.savedSpots.map((spot: any) => spot._id);
                        setSavedIds(ids);
                    }
                } catch (error) {
                    console.error("Failed to sync wishlist:", error);
                    // Fallback to local? No, backend error should be visible or just empty.
                }
            } else {
                // Load from LocalStorage
                const stored = localStorage.getItem("spotly_wishlist");
                if (stored) {
                    setSavedIds(JSON.parse(stored));
                }
            }
            setIsLoading(false);
        };

        checkUserAndLoad();
    }, []);

    // Sync to LocalStorage (only if not logged in) or just keep duplicate?
    // Let's keep localStorage as a backup or for guest mode persistence.
    useEffect(() => {
        if (!isLoading && !user) {
            localStorage.setItem("spotly_wishlist", JSON.stringify(savedIds));
        }
    }, [savedIds, isLoading, user]);

    const toggleSave = async (id: string) => {
        // Optimistic update
        const isCurrentlySaved = savedIds.includes(id);
        const newSavedIds = isCurrentlySaved
            ? savedIds.filter(itemId => itemId !== id)
            : [...savedIds, id];

        setSavedIds(newSavedIds);

        if (user) {
            // Sync with backend
            try {
                await userApi.toggleSaveSpot(id);
                // Background sync success
            } catch (error) {
                console.error("Failed to toggle save:", error);
                toast.error("Failed to save spot. Please try again.");
                // Revert on error
                setSavedIds(savedIds);
            }
        } else {
            // Local storage handled by useEffect
            if (!isCurrentlySaved) {
                toast.success("Spot saved to your browser wishlist!");
            } else {
                toast.success("Spot removed from wishlist");
            }
        }
    };

    const isSaved = (id: string) => savedIds.includes(id);

    return (
        <WishlistContext.Provider value={{ savedIds, toggleSave, isSaved, isLoading }}>
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
