'use client';

import { Loader2 } from 'lucide-react';
import type { WizardBrand } from '../../type';

interface StepBrandProps {
  matchingBrands: WizardBrand[];
  selectedBrandId: string;
  loading: boolean;
  selectBrand: (brand: WizardBrand) => void;
}

export function StepBrand({
  matchingBrands,
  selectedBrandId,
  loading,
  selectBrand,
}: StepBrandProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif font-bold text-lg md:text-3xl">Pilih Merek Lensa</h3>
      {loading ? (
        <div className="text-center py-12 text-stone-500 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Mengambil merek yang cocok...
        </div>
      ) : matchingBrands.length === 0 ? (
        <div className="text-center py-8 text-stone-500">
          Tidak ada merek yang cocok dengan kombinasi anggaran dan jenis lensa ini. Silakan coba
          sesuaikan Langkah 3.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {matchingBrands.map((b) => {
            const typeInfo = b.brand_lens_types?.[0];
            const isSelected = selectedBrandId === b.id;

            return (
              <button
                key={b.id}
                onClick={() => selectBrand(b)}
                className={`p-4 rounded-xl border flex flex-col justify-between items-center text-center aspect-square transition ${
                  isSelected
                    ? 'bg-charcoal-900 text-cream-50 border-charcoal-900 shadow-md'
                    : 'bg-white border-cream-300 hover:bg-cream-200'
                }`}
              >
                <div className="flex-1 flex flex-col justify-center items-center w-full gap-2">
                  {b.logo_url ? (
                    <div
                      className={`w-full flex justify-center items-center rounded px-2 py-1 ${
                        isSelected ? 'bg-white/15' : 'bg-cream-100'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={b.logo_url}
                        alt={b.name}
                        className="h-10 w-auto object-contain max-w-full"
                      />
                    </div>
                  ) : (
                    <div className="font-serif font-bold text-base md:text-lg">{b.name}</div>
                  )}
                  <div className="text-[10px] opacity-75 line-clamp-2">{b.description}</div>
                </div>
                <div className="mt-auto font-mono font-bold text-xs md:text-sm border-t border-current/20 pt-2 w-full">
                  Rp {Number(typeInfo?.base_price || 0).toLocaleString('id-ID')}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
