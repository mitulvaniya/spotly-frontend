import type { Metadata } from "next";
import React from "react";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "sonner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPOTLY | Discover the Unexpected",
  description: "Experience your city like never before. The premium guide to dining, nightlife, and hidden gems. Find the perfect spot for any vibe.",
  keywords: ["restaurants", "nightlife", "cafes", "local spots", "city guide", "discover", "entertainment"],
  authors: [{ name: "SPOTLY" }],
  creator: "SPOTLY",
  openGraph: {
    title: "SPOTLY | Discover the Unexpected",
    description: "Experience your city like never before. The premium guide to dining, nightlife, and hidden gems.",
    type: "website",
    siteName: "SPOTLY",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPOTLY | Discover the Unexpected",
    description: "Experience your city like never before.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          outfit.variable,
          inter.variable,
          "font-sans antialiased bg-background text-foreground min-h-screen"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <WishlistProvider>
            {children}
            <Toaster position="top-center" richColors />
          </WishlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
