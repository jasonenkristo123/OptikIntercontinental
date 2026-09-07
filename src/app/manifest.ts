import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Optik Intercontinental — Toko Kacamata & Lensa Terpercaya",
    short_name: "Optik Intercontinental",
    description:
      "Koleksi kacamata, lensa, dan frame berkualitas dari brand ternama. Konsultasi gratis dan harga terjangkau.",
    start_url: "/home",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#1C1917",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
