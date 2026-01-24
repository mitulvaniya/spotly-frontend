"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Star, Utensils, Music, Coffee, Hotel } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Mock Data for "Wow" Factor
const FEATURED_SPOTS = [
  {
    id: 1,
    name: "The Cloud Lounge",
    category: "Nightlife",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop",
    location: "Downtown Skyline",
  },
  {
    id: 2,
    name: "Sakura Fusion",
    category: "Dining",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
    location: "Arts District",
  },
  {
    id: 3,
    name: "Neon Arcade",
    category: "Entertainment",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?q=80&w=2012&auto=format&fit=crop",
    location: "Retro Row",
  },
];

const CATEGORIES = [
  { name: "Dining", icon: Utensils, color: "bg-orange-500/20 text-orange-400" },
  { name: "Nightlife", icon: Music, color: "bg-purple-500/20 text-purple-400" },
  { name: "Cafes", icon: Coffee, color: "bg-yellow-500/20 text-yellow-400" },
  { name: "Hotels", icon: Hotel, color: "bg-blue-500/20 text-blue-400" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[120px] animate-pulse" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>

        <div className="container relative z-10 px-6 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
              Discover the <br />
              <span className="text-gradient">Unexpected.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Curated guides to the city's best kept secrets. From hidden speakeasies to panoramic rooftops, find your next vibe with SPOTLY.
            </p>

            {/* Quick Search */}
            <div className="max-w-2xl mx-auto mb-8">
              <Link href="/discover">
                <div className="relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-card border border-border rounded-full p-2 flex items-center gap-3 hover:border-primary transition-all">
                    <div className="pl-4 flex items-center gap-2 text-muted-foreground">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-base">Search spots, categories, vibes...</span>
                    </div>
                    <Button size="lg" className="rounded-full shrink-0">
                      Explore
                    </Button>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/discover" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2">
                  Start Exploring <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                For Business Owners
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* Featured Spots Section */}
      <section className="py-24 px-6 md:px-12 bg-muted/30 dark:bg-black/40">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Trending Now</h2>
              <p className="text-muted-foreground">The hottest spots in the city everyone is talking about.</p>
            </div>
            <Button variant="ghost" className="hidden md:inline-flex group">
              View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_SPOTS.map((spot, i) => (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10">
                  <Image
                    src={spot.image}
                    alt={spot.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {spot.rating}
                  </div>

                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-1 rounded-md mb-3 inline-block border border-primary/20">
                      {spot.category}
                    </span>
                    <h3 className="text-2xl font-bold mb-1 text-white group-hover:text-primary transition-colors">{spot.name}</h3>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <MapPin className="w-4 h-4" /> {spot.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" className="w-full">View All</Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-6 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold mb-16 text-center">Find Your Vibe</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center gap-4 aspect-square cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", cat.color)}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold">{cat.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Mock */}
      <footer className="py-12 border-t border-border text-center text-muted-foreground text-sm">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">SPOTLY</h2>
          <p className="mb-8">Made with ❤️ for city explorers.</p>
          <p>&copy; 2026 SPOTLY Inc. Better than the rest.</p>
        </div>
      </footer>
    </main>
  );
}
