'use client';

import type { BrandLensColor } from '@/shared/types/database';

interface StepColorProps {
  colors: BrandLensColor[];
  selectedColorId: string;
  selectColor: (color: BrandLensColor) => void;
}

export function StepColor({
  colors,
  selectedColorId,
  selectColor,
}: StepColorProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif font-bold text-lg md:text-3xl">Warna Lensa</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {colors.map((c) => (
          <button
            key={c.id}
            onClick={() => selectColor(c)}
            className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center aspect-square transition ${
              selectedColorId === c.id
                ? 'bg-charcoal-900 text-cream-50 shadow-md border-charcoal-900'
                : 'bg-white border-cream-300 hover:bg-cream-200'
            }`}
          >
            <div className="font-bold">{c.color_name}</div>
            {Number(c.price_adder) > 0 && (
              <div className="font-mono text-xs mt-2 bg-current/10 px-2 py-1 rounded-full">
                + Rp {Number(c.price_adder).toLocaleString('id-ID')}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
