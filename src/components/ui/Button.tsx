"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

// Combine Framer Motion props with our custom props
type CombinedProps = ButtonProps & HTMLMotionProps<"button"> & { as?: "button" | "div" };

export const Button = React.forwardRef<HTMLButtonElement | HTMLDivElement, CombinedProps>(
    ({ className, variant = "primary", size = "md", as = "button", children, ...props }, ref) => {
        const variants = {
            primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/25",
            outline: "border border-white/10 hover:bg-white/5 text-foreground backdrop-blur-sm",
            ghost: "hover:bg-white/5 text-foreground/80 hover:text-foreground",
        };

        const sizes = {
            sm: "h-10 px-5 text-sm",
            md: "h-12 px-7 text-base",
            lg: "h-14 px-10 text-lg",
        };

        const Component = motion[as] as typeof motion.button; // Type casting for motion component

        return (
            <Component
                ref={ref as any}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {children}
            </Component>
        );
    }
);
Button.displayName = "Button";
