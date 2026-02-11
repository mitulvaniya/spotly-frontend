"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { User, Settings, Heart, LogOut, MapPin, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { userApi, authApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    avatar?: string;
    role: string;
}

interface SavedSpot {
    _id: string;
    name: string;
    featuredImage: string;
    location: {
        address: string;
        city: string;
    };
    category: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [savedSpots, setSavedSpots] = useState<SavedSpot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        bio: "",
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Check if logged in first
                const currentUser = authApi.getCurrentUser();
                if (!currentUser) {
                    router.push('/signin');
                    return;
                }

                setIsLoading(true);

                // Fetch profile and saved spots in parallel
                const [profileRes, savedRes] = await Promise.all([
                    userApi.getProfile(),
                    userApi.getSavedSpots()
                ]);

                if (profileRes.success && profileRes.data?.user) {
                    const userData = profileRes.data.user;
                    setUser(userData);
                    setFormData({
                        name: userData.name || "",
                        phone: userData.phone || "",
                        bio: userData.bio || "",
                    });
                }

                if (savedRes.success && savedRes.data?.savedSpots) {
                    setSavedSpots(savedRes.data.savedSpots);
                }

            } catch (error) {
                console.error("Failed to load profile:", error);
                toast.error("Failed to load profile data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await userApi.updateProfile(formData);

            if (response.success && response.data?.user) {
                setUser(response.data.user);
                toast.success("Profile updated successfully!");
            } else {
                toast.error(response.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An error occurred while saving");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        authApi.logout();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!user) return null; // Or generic error state

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 pt-32 pb-20">
                <div className="mb-8 flex items-center justify-between">
                    <Breadcrumbs
                        items={[{ label: "Profile" }]}
                        className="mb-0"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="glass-card p-6 rounded-3xl sticky top-32">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 mb-4">
                                    <div className="w-full h-full rounded-full bg-background overflow-hidden relative">
                                        <Image
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold">{user.name}</h2>
                                <p className="text-muted-foreground text-sm">{user.email}</p>
                            </div>

                            <nav className="space-y-2">
                                <Button variant="ghost" className="w-full justify-start gap-3 bg-muted/50">
                                    <User className="w-4 h-4" /> Personal Info
                                </Button>
                                <Button variant="ghost" className="w-full justify-start gap-3 opacity-50 cursor-not-allowed" title="Coming Soon">
                                    <Settings className="w-4 h-4" /> Account Settings
                                </Button>
                                <Link href="/saved">
                                    <Button variant="ghost" className="w-full justify-start gap-3">
                                        <Heart className="w-4 h-4 text-pink-500" /> Saved Spots
                                    </Button>
                                </Link>
                                <div className="h-px bg-border my-2" />
                                <button onClick={handleLogout} className="w-full">
                                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-500 hover:bg-red-500/10">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </Button>
                                </button>
                            </nav>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h1 className="text-3xl font-bold mb-6">Personal Information</h1>
                            <div className="glass-card p-8 rounded-3xl space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 opacity-50 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Bio</label>
                                        <input
                                            type="text"
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            placeholder="Tell us about yourself"
                                            className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Recent Activity (Saved Spots)</h2>
                            <div className="glass-card p-6 rounded-3xl">
                                {savedSpots.length > 0 ? (
                                    <div className="space-y-4">
                                        {savedSpots.slice(0, 3).map(spot => (
                                            <Link key={spot._id} href={`/spot/${spot._id}`}>
                                                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group mb-4">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden relative shrink-0">
                                                        <Image
                                                            src={spot.featuredImage || '/placeholder-spot.jpg'}
                                                            alt={spot.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold group-hover:text-primary transition-colors">{spot.name}</h3>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" /> {spot.location?.city || "Unknown Location"}
                                                        </p>
                                                    </div>
                                                    <div className="text-xs font-bold bg-background px-2 py-1 rounded-md border border-border">
                                                        Saved
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                        <Link href="/saved" className="block text-center text-sm text-primary hover:underline pt-2">
                                            View all saved spots
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Heart className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                                        <p className="text-muted-foreground">No saved spots yet</p>
                                        <Link href="/discover">
                                            <Button variant="outline" className="mt-4">
                                                Discover Spots
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
