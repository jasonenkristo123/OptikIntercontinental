'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/shared/store/useCartStore';
import { Search, ShoppingBag, Clock } from 'lucide-react';

export default function Header() {
  const { items, remainingSeconds, updateTimer, openCart } = useCartStore();

  useEffect(() => {
    const interval = setInterval(() => updateTimer(), 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-cream-100/90 backdrop-blur-md border-b border-cream-300/60 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="font-serif tracking-widest text-lg font-bold text-charcoal-900 uppercase">
          OPTIK <span className="font-sans text-xs font-light tracking-widest border-l border-stone-400 pl-2 ml-1 text-stone-600">INTERCONTINENTAL</span>
        </a>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-wider uppercase font-medium text-stone-700">
          <a href="#frames" className="hover:text-charcoal-900 transition">Frames</a>
          <a href="#lenses" className="hover:text-charcoal-900 transition">Lenses Only</a>
          <a href="#about" className="hover:text-charcoal-900 transition">Our Story</a>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-6">
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search collection"
              className="bg-cream-200/50 border border-cream-300 rounded-full text-xs pl-9 pr-4 py-2 text-charcoal-900 placeholder-stone-400 focus:outline-none focus:border-charcoal-900 transition"
            />
          </div>

          {/* Cart Button + Live Timer Badge */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 bg-charcoal-900 text-cream-50 px-4 py-2.5 rounded-full text-xs font-medium hover:bg-stone-800 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag ({items.length})</span>

            {items.length > 0 && (
              <div className="flex items-center gap-1 border-l border-stone-700 pl-2 text-[11px] text-amber-300 font-mono">
                <Clock className="w-3 h-3 animate-pulse" />
                <span>{formatTimer(remainingSeconds)}</span>
              </div>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}