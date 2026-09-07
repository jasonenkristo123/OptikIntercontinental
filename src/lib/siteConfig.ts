/**
 * Centralized site configuration and SEO metadata
 */
export const siteConfig = {
  name: "Optik Intercontinental",
  title: "Optik Intercontinental — Toko Kacamata & Lensa Terpercaya",
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
    "optik jakarta",
    "kacamata indonesia",
  ],
  author: "Optik Intercontinental",
  defaultLocale: "id_ID",
};

/**
 * Dynamically resolves the base URL across environments:
 * 1. Explicit NEXT_PUBLIC_SITE_URL in environment
 * 2. Vercel production deployment URL
 * 3. Vercel preview deployment URL
 * 4. Local development fallback (localhost:3000)
 */
export const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};
