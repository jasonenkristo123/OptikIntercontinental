import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://optikintercontinental.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Optik Intercontinental — Toko Kacamata & Lensa Terpercaya",
    template: "%s | Optik Intercontinental",
  },
  description:
    "Optik Intercontinental menyediakan koleksi kacamata, lensa, dan frame berkualitas dari brand ternama. Konsultasi gratis, harga terjangkau, dan layanan terbaik.",
  keywords: [
    "optik",
    "kacamata",
    "lensa",
    "frame kacamata",
    "optik intercontinental",
    "toko kacamata",
    "kacamata murah",
    "lensa minus",
    "lensa plus",
    "lensa progresif",
    "kacamata branded",
  ],
  authors: [{ name: "Optik Intercontinental" }],
  creator: "Optik Intercontinental",
  publisher: "Optik Intercontinental",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "Optik Intercontinental",
    title: "Optik Intercontinental — Toko Kacamata & Lensa Terpercaya",
    description:
      "Koleksi kacamata, lensa, dan frame berkualitas dari brand ternama. Konsultasi gratis dan harga terjangkau.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Optik Intercontinental — Toko Kacamata & Lensa Terpercaya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Optik Intercontinental — Toko Kacamata & Lensa Terpercaya",
    description:
      "Koleksi kacamata, lensa, dan frame berkualitas dari brand ternama. Konsultasi gratis dan harga terjangkau.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
