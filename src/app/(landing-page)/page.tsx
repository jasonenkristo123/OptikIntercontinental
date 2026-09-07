import type { Metadata } from "next";
import { getFrames } from "@/app/actions/frameActions";
import HomeContainer from "@/features/landing-page/container/HomeContainer";

export const metadata: Metadata = {
  title: "Beranda — Koleksi Kacamata & Lensa Premium",
  description:
    "Jelajahi koleksi frame dan lensa kacamata terbaru di Optik Intercontinental. Temukan kacamata minus, plus, dan progresif dengan harga terjangkau dan garansi keaslian.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const frames = await getFrames();

  return <HomeContainer frames={frames} />;
}
