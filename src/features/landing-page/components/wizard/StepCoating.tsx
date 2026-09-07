'use client';

import type { BrandLensCoating } from '@/shared/types/database';

interface StepCoatingProps {
  coatings: BrandLensCoating[];
  selectedCoatingId: string;
  selectCoating: (coating: BrandLensCoating) => void;
}

export function StepCoating({
  coatings,
  selectedCoatingId,
  selectCoating,
}: StepCoatingProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif font-bold text-lg md:text-3xl">Fungsi Lensa</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {coatings.map((ct) => (
          <button
            key={ct.id}
            onClick={() => selectCoating(ct)}
            className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center aspect-square transition ${
              selectedCoatingId === ct.id
                ? 'bg-charcoal-900 text-cream-50 shadow-md border-charcoal-900'
                : 'bg-white border-cream-300 hover:bg-cream-200'
            }`}
          >
            <div className="font-bold text-sm">{ct.coating_name}</div>
            {Number(ct.price_adder) > 0 && (
              <div className="font-mono text-xs mt-2 bg-current/10 px-2 py-1 rounded-full">
                + Rp {Number(ct.price_adder).toLocaleString('id-ID')}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
