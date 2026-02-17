import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
    themeColor: "#ec4899",
};

export const metadata: Metadata = {
    title: "SoulMatch | Find Your Perfect Connection",
    description: "The next-generation AI matchmaking platform for authentic connections, mini-games, and real-time social experiences.",
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
