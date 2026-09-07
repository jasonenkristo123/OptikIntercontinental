'use client';

import type { LensType } from '@/shared/types/database';

interface StepLensTypeProps {
  lensTypes: LensType[];
  selectedLensTypeId: string;
  selectLensType: (typeId: string, typeName: string) => void;
}

export function StepLensType({
  lensTypes,
  selectedLensTypeId,
  selectLensType,
}: StepLensTypeProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif font-bold text-lg md:text-3xl">Jenis Lensa</h3>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
        {lensTypes.map((lt) => (
          <button
            key={lt.id}
            onClick={() => selectLensType(lt.id, lt.name)}
            className={`p-4 rounded-xl border text-center transition flex flex-col justify-center items-center aspect-square ${
              selectedLensTypeId === lt.id
                ? 'bg-charcoal-900 text-cream-50 border-charcoal-900 shadow-md'
                : 'bg-white border-cream-300 hover:bg-cream-200'
            }`}
          >
            <div className="font-bold">{lt.name}</div>
            <div className="text-xs opacity-75 mt-2 line-clamp-3">{lt.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
