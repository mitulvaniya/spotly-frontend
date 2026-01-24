import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-muted/50",
                className
            )}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="glass-card rounded-3xl overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                </div>
            </div>
        </div>
    );
}

export function SpotDetailSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="relative h-[60vh] w-full">
                <Skeleton className="w-full h-full" />
            </div>
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-24 w-full" />
                        <div className="grid grid-cols-3 gap-3">
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                            <Skeleton className="h-12" />
                        </div>
                    </div>
                    <div>
                        <Skeleton className="h-96 w-full rounded-3xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
