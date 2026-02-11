"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    variant?: "default" | "icon";
}

export function Logo({ className, variant = "default" }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-2 font-bold tracking-tight select-none", className)}>
            <div className="relative w-8 h-8 flex items-center justify-center">
                {/* Minimal Luxury Icon: A stylized 'S' formed by two geometric arcs/dots */}
                <svg
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full text-foreground"
                >
                    <path
                        d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 40 0 20 0C6 0 0 0 0 20C0 40 8.9543 40 20 40Z"
                        fill="currentColor"
                        className="text-primary opacity-20 dark:opacity-30"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28C15.5817 28 12 24.4183 12 20ZM20 16C17.7909 16 16 17.7909 16 20C16 22.2091 17.7909 24 20 24C22.2091 24 24 22.2091 24 20C24 17.7909 22.2091 16 20 16Z"
                        fill="currentColor"
                        className="text-primary"
                    />
                    {/* Sparkle subtle accent */}
                    <path
                        d="M32 8L33.5 11L36.5 12.5L33.5 14L32 17L30.5 14L27.5 12.5L30.5 11L32 8Z"
                        fill="currentColor"
                        className="text-amber-400"
                    />
                </svg>
            </div>

            {variant === "default" && (
                <span className="text-xl md:text-2xl font-outfit">
                    SPOTLY
                    <span className="text-primary animate-pulse">.</span>
                </span>
            )}
        </div>
    );
}
