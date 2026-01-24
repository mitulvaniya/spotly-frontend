import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="text-9xl font-bold text-gradient mb-4">404</div>
                <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
                <p className="text-muted-foreground text-lg mb-8">
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/">
                        <Button size="lg">
                            <Home className="w-5 h-5 mr-2" />
                            Go Home
                        </Button>
                    </Link>
                    <Link href="/discover">
                        <Button variant="outline" size="lg">
                            <Search className="w-5 h-5 mr-2" />
                            Discover Spots
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
