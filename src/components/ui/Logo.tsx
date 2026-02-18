"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    variant?: "default" | "icon";
}

export function Logo({ className, variant = "default" }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-2.5 select-none", className)}>
            <div className="relative w-8 h-8 flex items-center justify-center">
                {/* True Minimal Icon: Sharp geometric prism/S shape - Solid Monochrome */}
                <svg
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    {/* Main geometric shape - Solid Primary Color */}
                    <path
                        d="M20 0L34.1421 14.1421L20 28.2843L5.85786 14.1421L20 0Z"
                        fill="currentColor"
                        className="text-primary"
                    />
                    {/* Bottom Reflection - Solid Foreground (High Contrast) */}
                    <path
                        d="M20 40L5.85786 25.8579L20 11.7157L34.1421 25.8579L20 40Z"
                        fill="currentColor"
                        className="text-foreground"
                    />
                </svg>
            </div>

            {variant === "default" && (
                <div className="flex flex-col justify-center">
                    <span className="text-xl leading-none font-bold font-outfit tracking-widest uppercase">
                        Spotly
                    </span>
                </div>
            )}
        </div>
    );
}
