"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { MapPin, Star, Clock, Phone, Globe, Share2, Heart, CheckCircle2, ChevronLeft, ChevronRight, Navigation, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SPOTS } from "@/lib/data";

// Mock reviews data
const MOCK_REVIEWS = [
    {
        id: 1,
        author: "Sarah M.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        rating: 5,
        date: "2 days ago",
        text: "Absolutely stunning views! The cocktails are expertly crafted and the atmosphere is perfect for a special night out. Highly recommend the sunset hour.",
    },
    {
        id: 2,
        author: "James K.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        rating: 4,
        date: "1 week ago",
        text: "Great ambiance and service. The rooftop setting is unbeatable. Only downside is it can get quite crowded on weekends.",
    },
    {
        id: 3,
        author: "Emily R.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        rating: 5,
        date: "2 weeks ago",
        text: "Best spot in the city for a date night. The DJ sets the perfect mood and the staff are incredibly attentive. Will definitely be back!",
    },
];

export default function SpotDetailPage() {
    const params = useParams();
    const spotId = parseInt(params.id as string);

    // Get current spot
    const spot = useMemo(() => SPOTS.find(s => s.id === spotId), [spotId]);

    // Get similar spots (same category, exclude current)
    const similarSpots = useMemo(() => {
        if (!spot) return [];
        return SPOTS.filter(s => s.category === spot.category && s.id !== spot.id).slice(0, 3);
    }, [spot]);

    const [isLiked, setIsLiked] = useState(false);

    if (!spot) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Navbar />
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Spot Not Found</h1>
                    <p className="text-muted-foreground mb-6">The spot you're looking for doesn't exist.</p>
                    <Link href="/discover">
                        <Button>Back to Discover</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Mock additional data
    const spotData = {
        ...spot,
        tagline: "Experience the best of the city",
        description: `Discover ${spot.name}, a premier ${spot.category.toLowerCase()} destination in ${spot.location}. With a ${spot.rating} star rating and located just ${spot.distance}km away, this is the perfect spot for your next outing. Enjoy top-notch service, great atmosphere, and unforgettable experiences.`,
        status: "Open Now",
        hours: "9:00 AM - 11:00 PM",
        phone: "+1 (555) 012-3456",
        website: `${spot.name.toLowerCase().replace(/\s+/g, '')}.com`,
        features: spot.tags.concat(["WiFi", "Parking"]),
        images: [spot.image, spot.image, spot.image], // In real app, multiple images
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: spot.name,
                text: spotData.tagline,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Header */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <Image
                    src={spotData.images[0]}
                    alt={spot.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 container mx-auto px-6 pb-12 pt-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row items-end justify-between gap-6"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4 flex-wrap">
                                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{spot.category}</span>
                                <span className="flex items-center gap-1 text-yellow-500 font-medium text-sm">
                                    <Star className="w-4 h-4 fill-yellow-500" /> {spot.rating}
                                </span>
                                <span className="text-white/60 text-sm">• {spot.price}</span>
                                <span className="text-white/60 text-sm">• {spot.distance}km away</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
                                {spot.name}
                            </h1>
                            <p className="text-lg md:text-xl text-white/80 max-w-2xl flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                {spot.location}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full h-12 px-6 gap-2 bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10"
                                onClick={() => setIsLiked(!isLiked)}
                            >
                                <Heart className={cn("w-5 h-5", isLiked && "fill-red-500 text-red-500")} />
                                <span>Save</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full h-12 px-6 gap-2 bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10"
                                onClick={handleShare}
                            >
                                <Share2 className="w-5 h-5" />
                                <span>Share</span>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* About Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold">About</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {spotData.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {spotData.features.map(feature => (
                                    <div key={feature} className="flex items-center gap-2 text-sm text-white/80 bg-white/5 p-3 rounded-xl border border-white/5">
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                        <span className="truncate">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Reviews Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-bold">Reviews</h2>
                                <Button variant="outline">Write a Review</Button>
                            </div>

                            <div className="space-y-4">
                                {MOCK_REVIEWS.map((review, i) => (
                                    <motion.div
                                        key={review.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-6"
                                    >
                                        <div className="flex items-start gap-4">
                                            <Image
                                                src={review.avatar}
                                                alt={review.author}
                                                width={48}
                                                height={48}
                                                className="rounded-full"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-semibold">{review.author}</h4>
                                                        <p className="text-xs text-muted-foreground">{review.date}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: review.rating }).map((_, i) => (
                                                            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground leading-relaxed">{review.text}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Similar Spots */}
                        {similarSpots.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-6"
                            >
                                <h2 className="text-3xl font-bold">Similar Spots</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {similarSpots.map((similarSpot, i) => (
                                        <Link key={similarSpot.id} href={`/spot/${similarSpot.id}`}>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.1 * i }}
                                            >
                                                <Card className="group cursor-pointer">
                                                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                                                        <Image
                                                            src={similarSpot.image}
                                                            alt={similarSpot.name}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold border border-white/10">
                                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {similarSpot.rating}
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{similarSpot.name}</h3>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" /> {similarSpot.location}
                                                        </p>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="relative">
                        <div className="sticky top-24 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-6 rounded-3xl space-y-6 bg-card border border-border"
                            >
                                <div className="flex items-center justify-between pb-6 border-b border-border">
                                    <span className="text-green-400 flex items-center gap-2 font-medium">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                        </span>
                                        {spotData.status}
                                    </span>
                                    <span className="text-muted-foreground text-sm">Until 11 PM</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-white font-medium mb-1">Address</p>
                                            <p className="text-muted-foreground text-sm">{spot.location}</p>
                                            <a
                                                href={`https://maps.google.com/?q=${encodeURIComponent(spot.location)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary text-xs mt-1 flex items-center gap-1 hover:underline"
                                            >
                                                <Navigation className="w-3 h-3" />
                                                Get Directions
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Clock className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
                                        <div>
                                            <p className="text-white font-medium mb-1">Hours</p>
                                            <p className="text-muted-foreground text-sm">{spotData.hours}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Phone className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
                                        <div>
                                            <p className="text-white font-medium mb-1">Contact</p>
                                            <a href={`tel:${spotData.phone}`} className="text-primary text-sm hover:underline">
                                                {spotData.phone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Globe className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-white font-medium mb-1">Website</p>
                                            <a
                                                href={`https://${spotData.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary text-sm hover:underline truncate block flex items-center gap-1"
                                            >
                                                {spotData.website}
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(spot.location)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="w-full h-12 text-base font-semibold shadow-xl shadow-primary/20">
                                            <Navigation className="w-5 h-5 mr-2" />
                                            Get Directions
                                        </Button>
                                    </a>
                                    <a href={`tel:${spotData.phone}`}>
                                        <Button variant="outline" className="w-full">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Call Now
                                        </Button>
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}
