import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
 variable: "--font-inter",
 subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
 variable: "--font-space-grotesk",
 subsets: ["latin"],
});

export const metadata: Metadata = {
 title: "BrandFlow | Multi-Agent AI Marketing Platform",
 description: "An automated marketing team featuring detailed planning, brand identity creation, content generation, and financial risk warnings.",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html
 lang="en"
 className={`${inter.variable} ${spaceGrotesk.variable}`}
 suppressHydrationWarning
 >
 <body className="antialiased font-sans min-h-screen overflow-x-hidden transition-colors duration-300">
 <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
 <LanguageProvider>
 <LayoutWrapper>
 {children}
 </LayoutWrapper>
 </LanguageProvider>
 </ThemeProvider>
 </body>
 </html>
 );
}
