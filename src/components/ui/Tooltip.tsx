"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
    text: string;
    children: React.ReactNode;
    className?: string;
    position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ text, children, className, position = "bottom" }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: "-top-10 left-1/2 -translate-x-1/2",
        bottom: "-bottom-10 left-1/2 -translate-x-1/2",
        left: "top-1/2 -translate-y-1/2 -left-20", // Adjust depending on width
        right: "top-1/2 -translate-y-1/2 -right-20",
    };

    return (
        <div
            className="relative flex items-center justify-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: position === "top" ? 5 : position === "bottom" ? -5 : 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            "absolute z-[100] px-3 py-1.5 text-xs font-medium text-white bg-black/80 backdrop-blur-md rounded-lg border border-white/10 whitespace-nowrap pointer-events-none shadow-lg",
                            positionClasses[position],
                            className
                        )}
                    >
                        {text}
                        {/* Little Triangle Arrow */}
                        <div className={cn(
                            "absolute w-2 h-2 bg-black/80 rotate-45 border-r border-b border-white/10 transform",
                            position === "top" ? "bottom-[-4px] left-1/2 -translate-x-1/2 border-t-0 border-l-0" :
                                position === "bottom" ? "top-[-4px] left-1/2 -translate-x-1/2 border-r-0 border-b-0" : ""
                            // Simplified arrow logic for vertical primarily
                        )} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
