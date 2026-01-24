import type { Metadata } from "next";

export function generateMetadata(title: string, description: string, path: string = ""): Metadata {
    const siteName = "SPOTLY";
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://spotly.com";
    const fullUrl = `${siteUrl}${path}`;

    return {
        title: fullTitle,
        description,
        openGraph: {
            title: fullTitle,
            description,
            url: fullUrl,
            siteName,
            type: "website",
            images: [
                {
                    url: `${siteUrl}/og-image.jpg`,
                    width: 1200,
                    height: 630,
                    alt: siteName,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: [`${siteUrl}/og-image.jpg`],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}
