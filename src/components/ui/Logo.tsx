"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    variant?: "default" | "icon";
}

export function Logo({ className, variant = "default" }: LogoProps) {
    return (
        <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Modern Tech Icon: Solid geometric shape with subtle gradient depth */}
            <svg
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <defs>
                    <linearGradient id="tech-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="glow-gradient" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Main geometric shape */}
                <path
                    d="M20 0L34.1421 14.1421L20 28.2843L5.85786 14.1421L20 0Z"
                    fill="url(#tech-gradient)"
                    className="text-primary"
                />

                {/* Subtle Top Highlight for depth */}
                <path
                    d="M20 0L34.1421 14.1421L20 28.2843L5.85786 14.1421L20 0Z"
                    fill="url(#glow-gradient)"
                    className="mix-blend-overlay"
                />

                {/* Bottom Element */}
                <path
                    d="M20 40L5.85786 25.8579L20 11.7157L34.1421 25.8579L20 40Z"
                    fill="currentColor"
                    className="text-foreground opacity-80"
                />
            </svg>
        </div>

            {
        variant === "default" && (
            <div className="flex flex-col justify-center">
                <span className="text-xl leading-none font-bold font-outfit tracking-widest uppercase">
                    Spotly
                </span>
            </div>
        )
    }
        </div >
    );
}
