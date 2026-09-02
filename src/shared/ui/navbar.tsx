'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/shared/store/useCartStore';
import { ShoppingBag, Clock } from 'lucide-react';

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
    <nav className="sticky top-0 z-40 bg-cream-100/90 backdrop-blur-md border-b border-cream-300/60 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link href="/" className="font-serif tracking-widest text-lg font-bold text-charcoal-900 uppercase">
          OPTIK <span className="font-sans text-xs font-light tracking-widest border-l border-stone-400 pl-2 ml-1 text-stone-600">INTERCONTINENTAL</span>
        </Link>

        <div className="flex items-center gap-6">

          <button
            onClick={openCart}
            className="relative cursor-pointer flex items-center gap-2 bg-charcoal-900 text-cream-50 px-4 py-2.5 rounded-full text-xs font-medium hover:bg-stone-800 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>({items.length})</span>

            {items.length > 0 && (
              <div className="flex items-center gap-1 border-l border-stone-700 pl-2 text-[11px] text-amber-300 font-mono">
                <Clock className="w-3 h-3 animate-pulse" />
                <span>{formatTimer(remainingSeconds)}</span>
              </div>
            )}
          </button>
        </div>

      </div>
    </nav>
  );
}