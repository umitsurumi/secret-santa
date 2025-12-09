import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-sans",
    subsets: ["latin"],
});

const playfair = Playfair_Display({
    variable: "--font-serif",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Secret Santa - 互换礼物",
    description: "Project Vibe: Secret Santa Web Application",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN">
            <body
                className={`${inter.variable} ${playfair.variable} antialiased bg-slate-900 text-white min-h-screen`}
            >
                {children}
            </body>
        </html>
    );
}
