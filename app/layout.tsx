import type { Metadata } from "next";
import { DM_Sans, Outfit, Oswald } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const dmSans = DM_Sans({ subsets: ["latin"], variable: '--font-dm-sans' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const oswald = Oswald({ subsets: ["latin"], variable: '--font-oswald' });

export const metadata: Metadata = {
    metadataBase: new URL('https://www.ourcashmir.com'),
    title: {
        default: "OurCashmir - Marketing Platform",
        template: "%s | OurCashmir"
    },
    description: "Kashmir's premier marketing agency for brand growth. We connect brands with top influencers and audiences in the region.",
    keywords: ["marketing", "kashmir", "influencer marketing", "brand growth", "digital marketing", "social media", "ourcashmir"],
    authors: [{ name: "OurCashmir" }],
    creator: "OurCashmir",
    publisher: "OurCashmir",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: "OurCashmir - Marketing Platform",
        description: "Kashmir's premier marketing agency for brand growth.",
        url: 'https://www.ourcashmir.com',
        siteName: 'OurCashmir',
        images: [
            {
                url: '/images/og-image.png', // Ensure this image exists or create a placeholder
                width: 1200,
                height: 630,
                alt: 'OurCashmir Marketing Platform',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "OurCashmir - Marketing Platform",
        description: "Kashmir's premier marketing agency for brand growth.",
        images: ['/images/og-image.png'],
        creator: '@ourcashmir',
    },
    icons: {
        icon: [
            { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon/favicon.ico" },
        ],
        apple: "/favicon/apple-touch-icon.png",
    },
    manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${dmSans.className} ${outfit.variable} ${oswald.variable} bg-brand-bg text-brand-white antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
