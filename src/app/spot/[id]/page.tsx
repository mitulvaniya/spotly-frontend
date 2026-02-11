"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal"; // Ensure this matches your component export
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Clock, Phone, Globe, Share2, Heart, CheckCircle2, Navigation, ExternalLink, Loader2, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { api, reviewApi, authApi } from "@/lib/api";

type Spot = {
    _id: string;
    name: string;
    category: string;
    description: string;
    featuredImage: string;
    images: string[];
    location: {
        city: string;
        address: string;
        coordinates: number[];
    };
    rating: number;
    priceRange: string;
    tags: string[];
    contact: {
        phone: string;
        website: string;
        email: string;
    };
    features: string[];
    businessHours: { day: string; open: string; close: string; isClosed: boolean }[];
};

type Review = {
    _id: string;
    user: {
        _id: string;
        name: string;
        avatar: string;
    };
    rating: number;
    text: string;
    createdAt: string;
};

export default function SpotDetailPage() {
    const params = useParams();
    const router = useRouter();
    const spotId = params.id as string;

    const [spot, setSpot] = useState<Spot | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [similarSpots, setSimilarSpots] = useState<Spot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // Review Form State
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const { savedIds, toggleSave } = useWishlist();
    const isLiked = savedIds.includes(spotId);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch Spot Details
                const spotRes = await api.get<{ spot: Spot }>(`/spots/${spotId}`);
                if (spotRes.success && spotRes.data?.spot) {
                    setSpot(spotRes.data.spot);

                    // Fetch Similar Spots (based on category)
                    const similarRes = await api.get<{ spots: Spot[] }>(`/spots?category=${encodeURIComponent(spotRes.data.spot.category)}&limit=4`);
                    if (similarRes.success && similarRes.data?.spots) {
                        setSimilarSpots(similarRes.data.spots.filter(s => s._id !== spotId).slice(0, 3));
                    }
                }

                // Fetch Reviews
                const reviewsRes = await reviewApi.getSpotReviews(spotId);
                if (reviewsRes.success && reviewsRes.data?.reviews) {
                    setReviews(reviewsRes.data.reviews);
                }

            } catch (error) {
                console.error("Failed to load spot data:", error);
                toast.error("Failed to load spot details");
            } finally {
                setIsLoading(false);
            }
        };

        if (spotId) fetchData();
    }, [spotId]);

    const handleSave = () => {
        toggleSave(spotId);
        // Toast is handled by WishlistContext
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.info("Link copied to clipboard!");
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = authApi.getCurrentUser();
        if (!user) {
            toast.error("Please sign in to write a review");
            router.push(`/signin?redirect=/spot/${spotId}`);
            return;
        }

        setIsSubmittingReview(true);
        try {
            const res = await reviewApi.createReview({
                spot: spotId,
                rating,
                text: reviewText
            });

            if (res.success) {
                toast.success("Review submitted!");
                setIsReviewModalOpen(false);
                setReviewText("");
                setRating(5);
                // Refresh reviews
                const reviewsRes = await reviewApi.getSpotReviews(spotId);
                if (reviewsRes.success && reviewsRes.data?.reviews) {
                    setReviews(reviewsRes.data.reviews);
                }
            } else {
                toast.error(res.message || "Failed to submit review");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!spot) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
                <Navbar />
                <h1 className="text-4xl font-bold">Spot Not Found</h1>
                <Link href="/discover">
                    <Button>Back to Discover</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-20" />
                <Image
                    src={spot.featuredImage || spot.images?.[0] || '/placeholder-spot.jpg'}
                    alt={spot.name}
                    fill
                    className="object-cover"
                    priority
                />

                <div className="absolute bottom-0 left-0 right-0 z-30 container mx-auto px-6 pb-12">
                    <Breadcrumbs
                        items={[
                            { label: "Discover", href: "/discover" },
                            { label: spot.category, href: `/discover?category=${encodeURIComponent(spot.category)}` },
                            { label: spot.name }
                        ]}
                        className="mb-6 text-white/70"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                                {spot.category}
                            </span>
                            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-bold border border-white/10">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                {spot.rating || "New"}
                            </div>
                            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-bold border border-white/10">
                                {spot.priceRange || "$$"}
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
                            {spot.name}
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" /> {spot.location?.city || "City Center"}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Actions Mobile Only */}
                        <div className="flex lg:hidden gap-4 overflow-x-auto pb-4">
                            <Button onClick={handleSave} variant={isLiked ? "primary" : "outline"} className="w-full gap-2 text-lg h-12">
                                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} /> {isLiked ? "Saved" : "Save"}
                            </Button>
                            <Button onClick={handleShare} variant="outline" className="w-full gap-2 text-lg h-12">
                                <Share2 className="w-5 h-5" /> Share
                            </Button>
                        </div>

                        {/* Description */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl font-bold mb-4">About</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                                {spot.description || "No description available."}
                            </p>

                            {spot.features && spot.features.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                    {spot.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm font-medium border border-border rounded-lg p-3">
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.section>

                        {/* Location (Simplified) */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-2xl font-bold mb-4">Location</h2>
                            <div className="bg-muted/30 p-6 rounded-3xl border border-border">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 p-4 rounded-full">
                                        <MapPin className="w-8 h-8 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold">{spot.location?.address}</p>
                                        <p className="text-muted-foreground">{spot.location?.city}</p>
                                    </div>
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(spot.location?.address || "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-auto"
                                    >
                                        <Button variant="outline" className="gap-2">
                                            Get Directions <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </motion.section>


                        {/* Reviews Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-bold">Reviews ({reviews.length})</h2>
                                <Button onClick={() => setIsReviewModalOpen(true)} variant="outline">Write a Review</Button>
                            </div>

                            <div className="space-y-4">
                                {reviews.length > 0 ? (
                                    reviews.map((review, i) => (
                                        <motion.div
                                            key={review._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                            className="bg-white/5 border border-white/10 rounded-2xl p-6"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Avatar fallback */}
                                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                                                    {review.user?.avatar ? (
                                                        <Image src={review.user.avatar} alt={review.user.name} width={48} height={48} className="object-cover w-full h-full" />
                                                    ) : (
                                                        <UserIcon className="w-6 h-6 text-primary" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-semibold">{review.user?.name || "Anonymous"}</h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                {new Date(review.createdAt).toLocaleDateString()}
                                                            </p>
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
                                    ))
                                ) : (
                                    <div className="text-center py-10 bg-muted/20 rounded-2xl">
                                        <p className="text-muted-foreground mb-4">No reviews yet. Be the first to share your experience!</p>
                                        <Button onClick={() => setIsReviewModalOpen(true)}>Write a Review</Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Similar Spots */}
                        {similarSpots.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-6 pt-8 border-t border-border"
                            >
                                <h2 className="text-3xl font-bold">Similar Spots</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {similarSpots.map((similarSpot, i) => (
                                        <Link key={similarSpot._id} href={`/spot/${similarSpot._id}`}>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.1 * i }}
                                            >
                                                <Card className="group cursor-pointer">
                                                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                                                        <Image
                                                            src={similarSpot.featuredImage || '/placeholder-spot.jpg'}
                                                            alt={similarSpot.name}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold border border-white/10">
                                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {similarSpot.rating || "-"}
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{similarSpot.name}</h3>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" /> {similarSpot.location?.city}
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
                    <div className="relative hidden lg:block">
                        <div className="sticky top-24 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-card p-6 rounded-3xl space-y-6 bg-card border border-border/50 shadow-xl"
                            >
                                <div className="flex items-center justify-between pb-6 border-b border-border">
                                    <span className="text-green-400 flex items-center gap-2 font-medium">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                        </span>
                                        Open Now
                                    </span>
                                    <span className="text-muted-foreground text-sm">Check hours</span>
                                </div>

                                <div className="space-y-5">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-foreground font-medium mb-1">Address</p>
                                            <p className="text-muted-foreground text-sm">{spot.location?.address}, {spot.location?.city}</p>
                                        </div>
                                    </div>

                                    {spot.contact?.phone && (
                                        <div className="flex items-start gap-4">
                                            <Phone className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
                                            <div>
                                                <p className="text-foreground font-medium mb-1">Contact</p>
                                                <a href={`tel:${spot.contact.phone}`} className="text-primary text-sm hover:underline">
                                                    {spot.contact.phone}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {spot.contact?.website && (
                                        <div className="flex items-start gap-4">
                                            <Globe className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-foreground font-medium mb-1">Website</p>
                                                <a
                                                    href={spot.contact.website.startsWith('http') ? spot.contact.website : `https://${spot.contact.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary text-sm hover:underline truncate block flex items-center gap-1"
                                                >
                                                    Visit Website
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 space-y-3">
                                    <Button onClick={handleSave} variant={isLiked ? "secondary" : "default"} className="w-full h-12 text-base font-semibold shadow-xl shadow-primary/20 gap-2">
                                        <Heart className={`w-5 h-5 ${isLiked ? "fill-current text-red-500" : ""}`} />
                                        {isLiked ? "Saved to Collection" : "Save Spot"}
                                    </Button>
                                    <Button onClick={handleShare} variant="outline" className="w-full gap-2">
                                        <Share2 className="w-4 h-4" /> Share
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />

            {/* Review Modal */}
            <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Write a Review">
                <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={cn(
                                            "w-8 h-8 transition-colors",
                                            star <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Your Review</label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full min-h-[120px] bg-muted/50 border border-border rounded-xl p-4 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                            placeholder="Share your experience..."
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsReviewModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmittingReview}>
                            {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Submit Review
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
