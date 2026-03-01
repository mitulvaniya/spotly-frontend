"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Edit3, Trash2, Plus, Loader2, Save, X, Search, Eye, Star, MapPin, Image as ImageIcon, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { api, authApi } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Spot {
    _id: string;
    name: string;
    category: string;
    description: string;
    featuredImage: string;
    images: string[];
    location: {
        city: string;
        address: string;
    };
    contact: {
        phone: string;
        website: string;
        email: string;
    };
    rating: number;
    reviewCount: number;
    priceRange: string;
    tags: string[];
    features: string[];
    views: number;
    isActive: boolean;
    status: string;
}

const CATEGORIES = [
    "Food & Cafes", "Fashion & Clothing", "Local Services", "Health & Wellness",
    "Education & Training", "Real Estate", "Automotive", "Entertainment", "Events & Weddings"
];

const PRICE_RANGES = ["$", "$$", "$$$", "$$$$"];

export default function AdminPage() {
    const router = useRouter();
    const [spots, setSpots] = useState<Spot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingSpot, setEditingSpot] = useState<Spot | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check admin auth
    useEffect(() => {
        const user = authApi.getCurrentUser();
        if (!user || user.role !== "admin") {
            toast.error("Admin access required");
            router.push("/signin");
            return;
        }
        setIsAdmin(true);
        fetchSpots();
    }, [router]);

    const fetchSpots = async () => {
        setIsLoading(true);
        try {
            const res = await api.get<{ spots: Spot[] }>("/spots?limit=100");
            if (res.success && res.data?.spots) {
                setSpots(res.data.spots);
            }
        } catch (err) {
            toast.error("Failed to load spots");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (spot: Spot) => {
        setEditingSpot({ ...spot });
        setImageFile(null);
        setImagePreview(null);
        setIsEditModalOpen(true);
    };

    const handleFileSelect = (file: File) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!editingSpot) return;
        setIsSaving(true);
        try {
            let res;

            if (imageFile) {
                // Use FormData for file upload
                const formData = new FormData();
                formData.append('featuredImage', imageFile);
                formData.append('name', editingSpot.name);
                formData.append('description', editingSpot.description || '');
                formData.append('category', editingSpot.category);
                formData.append('priceRange', editingSpot.priceRange || '$$');
                formData.append('rating', String(editingSpot.rating || 0));
                if (editingSpot.tags?.length) formData.append('tags', JSON.stringify(editingSpot.tags));
                if (editingSpot.features?.length) formData.append('features', JSON.stringify(editingSpot.features));
                if (editingSpot.location) formData.append('location', JSON.stringify(editingSpot.location));
                if (editingSpot.contact) formData.append('contact', JSON.stringify(editingSpot.contact));

                // Direct fetch with FormData (no Content-Type — browser sets multipart boundary)
                const API_URL = 'https://spotly-frontend.onrender.com/api';
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/spots/${editingSpot._id}`, {
                    method: 'PUT',
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                    body: formData,
                });
                const data = await response.json();
                res = { success: response.ok, data: data.data, message: data.message };
            } else {
                // JSON update (no file)
                const updateData = {
                    name: editingSpot.name,
                    description: editingSpot.description,
                    category: editingSpot.category,
                    featuredImage: editingSpot.featuredImage,
                    images: editingSpot.images,
                    priceRange: editingSpot.priceRange,
                    rating: editingSpot.rating,
                    tags: editingSpot.tags,
                    features: editingSpot.features,
                    location: editingSpot.location,
                    contact: editingSpot.contact,
                };
                res = await api.put(`/spots/${editingSpot._id}`, updateData);
            }

            if (res.success) {
                toast.success('Spot updated successfully!');
                setIsEditModalOpen(false);
                setEditingSpot(null);
                setImageFile(null);
                setImagePreview(null);
                fetchSpots();
            } else {
                toast.error(res.message || 'Failed to update');
            }
        } catch (err) {
            toast.error('Failed to update spot');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (spotId: string) => {
        try {
            const res = await api.delete(`/spots/${spotId}`);
            if (res.success) {
                toast.success("Spot deleted");
                setSpots(prev => prev.filter(s => s._id !== spotId));
                setDeleteConfirm(null);
            } else {
                toast.error(res.message || "Failed to delete");
            }
        } catch (err) {
            toast.error("Failed to delete spot");
        }
    };

    const filteredSpots = spots.filter(spot => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return spot.name.toLowerCase().includes(q) ||
            spot.category.toLowerCase().includes(q) ||
            spot.location?.city?.toLowerCase().includes(q);
    });

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-red-500" />
                            </div>
                            <h1 className="text-4xl font-black">Admin Panel</h1>
                        </div>
                        <p className="text-muted-foreground">Manage all {spots.length} spots on SPOTLY</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search spots..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-muted border border-border rounded-xl h-10 pl-10 pr-4 text-sm focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Total Spots", value: spots.length, color: "text-blue-400" },
                        { label: "Food & Cafes", value: spots.filter(s => s.category === "Food & Cafes").length, color: "text-orange-400" },
                        { label: "Entertainment", value: spots.filter(s => s.category === "Entertainment").length, color: "text-purple-400" },
                        { label: "Total Views", value: spots.reduce((sum, s) => sum + (s.views || 0), 0).toLocaleString(), color: "text-green-400" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-muted/30 border border-border rounded-2xl p-4">
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Spots Table */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredSpots.map((spot) => (
                            <motion.div
                                key={spot._id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-colors"
                            >
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                    {/* Image */}
                                    <div className="w-full md:w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={spot.featuredImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400"}
                                            alt={spot.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400"; }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg truncate">{spot.name}</h3>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">{spot.category}</span>
                                            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {spot.rating || "N/A"}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {spot.location?.city || "N/A"}</span>
                                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {spot.views || 0} views</span>
                                            <span>{spot.priceRange || "$$"}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button
                                            variant="outline"
                                            className="gap-2 text-sm h-9"
                                            onClick={() => handleEdit(spot)}
                                        >
                                            <Edit3 className="w-4 h-4" /> Edit
                                        </Button>
                                        {deleteConfirm === spot._id ? (
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="primary"
                                                    className="h-9 text-sm bg-red-600 hover:bg-red-700"
                                                    onClick={() => handleDelete(spot._id)}
                                                >
                                                    Confirm
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    className="h-9 text-sm"
                                                    onClick={() => setDeleteConfirm(null)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                className="gap-2 text-sm h-9 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                onClick={() => setDeleteConfirm(spot._id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {filteredSpots.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                <p className="text-xl font-bold mb-2">No spots found</p>
                                <p>Try a different search query</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setEditingSpot(null); }}
                title={`Edit: ${editingSpot?.name || ""}`}
            >
                {editingSpot && (
                    <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Name</label>
                            <input
                                type="text"
                                value={editingSpot.name}
                                onChange={(e) => setEditingSpot({ ...editingSpot, name: e.target.value })}
                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm"
                            />
                        </div>

                        {/* Category + Price */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    value={editingSpot.category}
                                    onChange={(e) => setEditingSpot({ ...editingSpot, category: e.target.value })}
                                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Price Range</label>
                                <select
                                    value={editingSpot.priceRange}
                                    onChange={(e) => setEditingSpot({ ...editingSpot, priceRange: e.target.value })}
                                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm"
                                >
                                    {PRICE_RANGES.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                value={editingSpot.description}
                                onChange={(e) => setEditingSpot({ ...editingSpot, description: e.target.value })}
                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm min-h-[100px] resize-none"
                            />
                        </div>

                        {/* Featured Image */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Featured Image
                            </label>

                            {/* File Upload Zone */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const file = e.dataTransfer.files[0];
                                    if (file && file.type.startsWith('image/')) handleFileSelect(file);
                                }}
                                className="w-full border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                            >
                                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    {imageFile ? (
                                        <span className="text-primary font-medium">{imageFile.name}</span>
                                    ) : (
                                        <>Click to upload or drag & drop an image</>
                                    )}
                                </p>
                                <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, WebP up to 5MB</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileSelect(file);
                                }}
                            />

                            {/* OR divider */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-border" />
                                <span className="text-xs text-muted-foreground">OR paste URL</span>
                                <div className="flex-1 h-px bg-border" />
                            </div>

                            {/* URL Input */}
                            <input
                                type="text"
                                value={editingSpot.featuredImage}
                                onChange={(e) => { setEditingSpot({ ...editingSpot, featuredImage: e.target.value }); setImageFile(null); setImagePreview(null); }}
                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm"
                                placeholder="https://images.unsplash.com/..."
                            />

                            {/* Preview */}
                            {(imagePreview || editingSpot.featuredImage) && (
                                <div className="mt-2 w-full h-36 rounded-xl overflow-hidden bg-muted relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={imagePreview || editingSpot.featuredImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    {imageFile && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-lg font-medium">
                                            New Upload
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Address</label>
                                <input
                                    type="text"
                                    value={editingSpot.location?.address || ""}
                                    onChange={(e) => setEditingSpot({
                                        ...editingSpot,
                                        location: { ...editingSpot.location, address: e.target.value }
                                    })}
                                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">City</label>
                                <input
                                    type="text"
                                    value={editingSpot.location?.city || ""}
                                    onChange={(e) => setEditingSpot({
                                        ...editingSpot,
                                        location: { ...editingSpot.location, city: e.target.value }
                                    })}
                                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm"
                                />
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Phone</label>
                                <input
                                    type="text"
                                    value={editingSpot.contact?.phone || ""}
                                    onChange={(e) => setEditingSpot({
                                        ...editingSpot,
                                        contact: { ...editingSpot.contact, phone: e.target.value }
                                    })}
                                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Website</label>
                                <input
                                    type="text"
                                    value={editingSpot.contact?.website || ""}
                                    onChange={(e) => setEditingSpot({
                                        ...editingSpot,
                                        contact: { ...editingSpot.contact, website: e.target.value }
                                    })}
                                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm"
                                />
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Rating (0-5)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={editingSpot.rating || 0}
                                onChange={(e) => setEditingSpot({ ...editingSpot, rating: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm"
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={(editingSpot.tags || []).join(", ")}
                                onChange={(e) => setEditingSpot({
                                    ...editingSpot,
                                    tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                                })}
                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm"
                                placeholder="Cafe, Aesthetic, WiFi..."
                            />
                        </div>

                        {/* Features */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Features (comma separated)</label>
                            <input
                                type="text"
                                value={(editingSpot.features || []).join(", ")}
                                onChange={(e) => setEditingSpot({
                                    ...editingSpot,
                                    features: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                                })}
                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm"
                                placeholder="Free WiFi, Parking, AC..."
                            />
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                            <Button variant="ghost" onClick={() => { setIsEditModalOpen(false); setEditingSpot(null); }}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
