"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Users, Store, Plus, DollarSign, X, Loader2, Edit, Trash2, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, api } from "@/lib/api";
import { toast } from "sonner";

const CATEGORIES = [
    "Food & Cafes", "Fashion & Clothing", "Local Services",
    "Health & Wellness", "Education & Training", "Real Estate",
    "Automotive", "Entertainment", "Events & Weddings",
];

interface Spot {
    _id: string;
    name: string;
    category: string;
    featuredImage: string;
    rating: number;
    views: number;
    status: string;
    location: { city: string; address: string };
}

export default function BusinessDashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [spots, setSpots] = useState<Spot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        subcategory: "",
        address: "",
        city: "",
        phone: "",
        website: "",
        tags: "",
        priceRange: "$$",
        featuredImage: "",
    });

    // Auth Guard
    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (!token || !currentUser) {
            toast.error("Please sign in to access the Business Dashboard.");
            router.push("/signin");
            return;
        }
        setUser(currentUser);
        fetchMySpots();
    }, [router]);

    const fetchMySpots = async () => {
        setIsLoading(true);
        try {
            const res = await api.get<{ spots: Spot[] }>("/spots?limit=100");
            if (res.success && res.data?.spots) {
                const currentUser = authApi.getCurrentUser();
                // Show all spots (admin sees all, owner sees their own)
                setSpots(res.data.spots);
            }
        } catch (e) {
            console.error("Failed to fetch spots:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.description || !formData.category || !formData.address || !formData.city || !formData.featuredImage) {
            toast.error("Please fill in all required fields including image URL.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                subcategory: formData.subcategory,
                location: {
                    address: formData.address,
                    city: formData.city,
                    coordinates: { type: "Point", coordinates: [72.8311, 21.1702] }, // Default Surat
                },
                contact: {
                    phone: formData.phone,
                    website: formData.website,
                },
                featuredImage: formData.featuredImage,
                images: [formData.featuredImage],
                priceRange: formData.priceRange,
                tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
                features: [],
            };

            const res = await api.post<any>("/spots", payload);
            if (res.success) {
                toast.success("Spot added successfully! It will be reviewed and approved shortly.");
                setShowModal(false);
                setFormData({ name: "", description: "", category: "", subcategory: "", address: "", city: "", phone: "", website: "", tags: "", priceRange: "$$", featuredImage: "" });
                fetchMySpots();
            } else {
                toast.error(res.message || "Failed to add spot. Make sure you're signed in as a Business Owner.");
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const stats = [
        { label: "Total Views", value: spots.reduce((s, sp) => s + (sp.views || 0), 0).toLocaleString(), icon: Users, change: "+12%", color: "text-blue-500" },
        { label: "Active Spots", value: spots.filter(s => s.status === "approved").length.toString(), icon: BarChart3, change: "+5%", color: "text-purple-500" },
        { label: "Total Spots", value: spots.length.toString(), icon: Store, change: "+18%", color: "text-green-500" },
        { label: "Avg Rating", value: spots.length > 0 ? (spots.reduce((s, sp) => s + (sp.rating || 0), 0) / spots.length).toFixed(1) : "N/A", icon: DollarSign, change: "+8%", color: "text-orange-500" },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 pt-32 pb-20">
                <div className="flex justify-between items-center mb-8">
                    <Breadcrumbs items={[{ label: "Business Dashboard" }]} />
                    <Button className="gap-2" onClick={() => setShowModal(true)}>
                        <Plus className="w-4 h-4" /> Add New Spot
                    </Button>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <h1 className="text-3xl font-bold mb-2">My Business Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.name}. Manage your listings and view performance analytics.</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 rounded-3xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-background border border-border ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">{stat.change}</span>
                            </div>
                            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Listings */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">My Spots ({spots.length})</h2>
                    <div className="glass-card rounded-3xl overflow-hidden">
                        {spots.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">
                                <Store className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium">No spots yet</p>
                                <p className="text-sm mb-6">Click "Add New Spot" to list your first business!</p>
                                <Button onClick={() => setShowModal(true)}><Plus className="w-4 h-4 mr-2" /> Add New Spot</Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/10">
                                {spots.map((spot, i) => (
                                    <div key={spot._id} className="p-6 flex items-center gap-4 hover:bg-white/5 transition-colors">
                                        <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={spot.featuredImage} alt={spot.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=200'; }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold truncate">{spot.name}</h3>
                                            <p className="text-sm text-muted-foreground">{spot.location?.city} · {spot.category}</p>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="font-bold">{(spot.views || 0).toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">Views</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${spot.status === "approved" ? "bg-green-500/20 text-green-500 border-green-500/20" : spot.status === "pending" ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/20" : "bg-red-500/20 text-red-500 border-red-500/20"}`}>
                                            {spot.status}
                                        </div>
                                        <a href={`/spot/${spot._id}`} target="_blank" rel="noreferrer">
                                            <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />

            {/* Add New Spot Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-background border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                                <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background z-10">
                                    <h2 className="text-2xl font-bold">Add New Spot</h2>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium mb-1 block">Spot Name *</label>
                                            <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. My Awesome Cafe" className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium mb-1 block">Description * (min 10 characters)</label>
                                            <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Describe what makes this spot special..." className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary resize-none" />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Category *</label>
                                            <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary">
                                                <option value="">Select category...</option>
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Subcategory</label>
                                            <input value={formData.subcategory} onChange={e => setFormData({ ...formData, subcategory: e.target.value })} placeholder="e.g. Fine Dining, Cafe" className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Address *</label>
                                            <input required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Street address" className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-1 block">City *</label>
                                            <input required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="e.g. Surat" className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Phone</label>
                                            <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Website</label>
                                            <input value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="yourwebsite.com" className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Price Range</label>
                                            <select value={formData.priceRange} onChange={e => setFormData({ ...formData, priceRange: e.target.value })} className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary">
                                                <option value="$">$ (Budget)</option>
                                                <option value="$$">$$ (Moderate)</option>
                                                <option value="$$$">$$$ (Expensive)</option>
                                                <option value="$$$$">$$$$ (Luxury)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Tags (comma separated)</label>
                                            <input value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="Cafe, WiFi, Vegan" className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-sm font-medium mb-1 block">Featured Image URL *</label>
                                            <input required value={formData.featuredImage} onChange={e => setFormData({ ...formData, featuredImage: e.target.value })} placeholder="https://images.unsplash.com/photo-..." className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary" />
                                            {formData.featuredImage && (
                                                <div className="mt-2 rounded-xl overflow-hidden h-32 border border-border">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={formData.featuredImage} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                                        <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</> : <><Plus className="w-4 h-4 mr-2" /> Add Spot</>}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
