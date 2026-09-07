'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section
      className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      aria-labelledby="hero-heading"
    >
      
      {/* Left Content */}
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium">
          ✦ GAYA HARIAN, DISEMPURNAKAN
        </p>

        <h1 id="hero-heading" className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-charcoal-900 leading-[1.08] tracking-tight">
          Lihat dunia
          <span className="italic font-light"> dengan gayamu.</span>
        </h1>

        <p className="text-stone-600 max-w-md text-sm sm:text-base leading-relaxed font-light">
          Koleksi kacamata pilihan untuk gaya hidup modern. Temukan bingkai andalan Anda berikutnya.
        </p>

        <div className="pt-2">
          <Link
            href="#frames"
            className="inline-flex items-center justify-between gap-8 bg-charcoal-900 text-cream-50 px-8 py-4 rounded-md text-xs font-semibold tracking-wider uppercase hover:bg-stone-800 transition group"
          >
            <span>Jelajahi koleksi</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Right Product Spotlight Image */}
      <div className="relative aspect-square w-full rounded-sm overflow-hidden bg-cream-200">
        <Image
          src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop"
          alt="Bingkai Andalan Optik Intercontinental"
          fill
          priority
          className="object-cover"
        />
        <p className="absolute bottom-6 left-6 text-[11px] font-mono tracking-widest text-stone-700 uppercase bg-cream-100/80 backdrop-blur-sm px-3 py-1 rounded">
          Optik / 2026 — Object no. 01
        </p>
      </div>

    </section>
  );
}