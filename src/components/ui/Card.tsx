"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";
import { Tooltip } from "@/components/ui/Tooltip";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
    spotId?: string;
    initial?: any;
    animate?: any;
    transition?: any;
    whileHover?: any;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, hoverEffect = true, spotId, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={hoverEffect ? { y: 0 } : undefined}
                whileHover={hoverEffect ? { y: -5 } : undefined}
                className={cn(
                    "glass-card rounded-3xl bg-black/40 border border-white/10 relative group hover:z-20 transition-all",
                    className
                )}
                {...(props as any)}
            >
                {/* Heart Button */}
                {spotId ? (
                    <div className="absolute top-3 right-3 z-20">
                        <Tooltip text="Save Spot">
                            <HeartButton id={spotId} />
                        </Tooltip>
                    </div>
                ) : null}
                {children}
            </motion.div>
        );
    }
);
Card.displayName = "Card";

function HeartButton({ id }: { id: string }) {
    const { isSaved, toggleSave } = useWishlist();
    const saved = isSaved(id);

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSave(id);
            }}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors"
        >
            <Heart className={cn("w-5 h-5 transition-colors", saved ? "fill-pink-500 text-pink-500" : "text-white")} />
        </button>
    );
}

import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("p-6", className)} {...props}>
            {children}
        </div>
    );
}
