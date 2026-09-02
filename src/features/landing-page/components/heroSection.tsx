'use client';

import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      
      {/* Left Content */}
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium">
          ✦ THE DAILY UNIFORM, REFINED
        </p>

        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-charcoal-900 leading-[1.08] tracking-tight">
          See the <br />
          world <br />
          <span className="italic font-light">your way.</span>
        </h1>

        <p className="text-stone-600 max-w-md text-sm sm:text-base leading-relaxed font-light">
          Curated eyewear for considered living. Find your next signature frame, then make it entirely yours.
        </p>

        <div className="pt-2">
          <a
            href="#frames"
            className="inline-flex items-center justify-between gap-8 bg-charcoal-900 text-cream-50 px-8 py-4 rounded-md text-xs font-semibold tracking-wider uppercase hover:bg-stone-800 transition group"
          >
            <span>Explore collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Right Product Spotlight Image */}
      <div className="relative aspect-square w-full rounded-sm overflow-hidden bg-cream-200">
        <img
          src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop"
          alt="Optik Intercontinental Signature Frame"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 text-[11px] font-mono tracking-widest text-stone-700 uppercase bg-cream-100/80 backdrop-blur-sm px-3 py-1 rounded">
          Optik / 2026 — Object no. 01
        </div>
      </div>

    </section>
  );
}