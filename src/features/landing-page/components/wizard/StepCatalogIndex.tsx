'use client';

import type { BrandLensIndex, PrescriptionData } from '@/shared/types/database';
import { checkPrescriptionCompatibility } from '../../util/prescription-helpers';

interface StepCatalogIndexProps {
  selectedBrandName: string;
  selectedLensTypeName: string;
  groupedIndexes: Record<string, BrandLensIndex[]>;
  selectedIndexId: string;
  prescriptionData: PrescriptionData;
  selectIndex: (index: BrandLensIndex, levelName: string) => void;
  selectStandardIndex: () => void;
}

export function StepCatalogIndex({
  selectedBrandName,
  selectedLensTypeName,
  groupedIndexes,
  selectedIndexId,
  prescriptionData,
  selectIndex,
  selectStandardIndex,
}: StepCatalogIndexProps) {
  const levelEntries = Object.entries(groupedIndexes);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
          Katalog Paket Lensa — {selectedBrandName} ({selectedLensTypeName})
        </div>
        <h3 className="font-serif font-bold text-lg md:text-3xl">Pilihan Level &amp; Indeks</h3>
      </div>

      {levelEntries.length === 0 ? (
        <div className="bg-white p-6 rounded-xl border border-cream-300 text-center space-y-2">
          <div className="font-bold text-base text-charcoal-900">Indeks Standar 1.50</div>
          <p className="text-xs text-stone-500">Termasuk dalam paket standar merek ini.</p>
          <button
            onClick={selectStandardIndex}
            className="mt-3 px-4 py-2 bg-charcoal-900 text-cream-50 rounded text-xs font-semibold"
          >
            Pilih Indeks Standar
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {levelEntries.map(([levelName, items]) => {
            const isHighTier = /comfy|pro|vip|premium|5/i.test(levelName);
            const isMidTier = /advance|plus|comfort|4/i.test(levelName);
            const stars = isHighTier ? '★★★★★' : isMidTier ? '★★★★☆' : '★★★☆☆';

            return (
              <div
                key={levelName}
                className="bg-white border border-cream-300 rounded-xl p-4 md:p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-cream-200 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-base text-charcoal-900">
                        {levelName}
                      </h4>
                      <span className="text-amber-500 text-xs tracking-wider font-mono">
                        {stars}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {isHighTier
                        ? 'Akurasi power maksimal & distorsi terendah untuk penglihatan dinamis tingkat tinggi'
                        : isMidTier
                        ? 'Kenyamanan optimal untuk aktivitas dinamis dan membaca sehari-hari'
                        : 'Adaptasi mudah dan fokus cepat untuk pengguna aktif'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {items.map((idx) => {
                    const isSelected = selectedIndexId === idx.id;
                    const compatibility = checkPrescriptionCompatibility(prescriptionData, idx);
                    const price = Number(idx.price ?? idx.price_adder ?? 0);

                    return (
                      <button
                        key={idx.id}
                        type="button"
                        onClick={() => selectIndex(idx, levelName)}
                        className={`p-3.5 rounded-lg border text-left flex flex-col justify-between transition relative ${
                          isSelected
                            ? 'bg-charcoal-900 text-cream-50 border-charcoal-900 shadow-md ring-2 ring-charcoal-900'
                            : compatibility.isCompatible
                            ? 'bg-cream-50 border-cream-300 hover:bg-cream-100 text-charcoal-900'
                            : 'bg-stone-100/80 border-stone-200 text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-base">Index {idx.index_value}</span>
                            {isSelected && (
                              <span className="text-[10px] bg-white text-charcoal-900 font-bold px-2 py-0.5 rounded-full">
                                Dipilih
                              </span>
                            )}
                          </div>

                          <div
                            className={`text-[11px] mt-1 line-clamp-1 ${
                              isSelected ? 'text-cream-200' : 'text-stone-500'
                            }`}
                          >
                            {idx.color?.color_name || 'Clear'}{' '}
                            {idx.coating?.coating_name ? `· ${idx.coating?.coating_name}` : ''}
                          </div>

                          {idx.description && (
                            <div
                              className={`text-[10px] mt-1 italic line-clamp-1 ${
                                isSelected ? 'text-stone-300' : 'text-stone-400'
                              }`}
                            >
                              {idx.description}
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-current/15 space-y-1.5">
                          <div className="font-mono font-bold text-sm">
                            Rp {price.toLocaleString('id-ID')}
                          </div>

                          {/* Status validasi resep */}
                          {prescriptionData.method === 'IN_STORE_EXAM' ? (
                            <div
                              className={`text-[10px] font-medium ${
                                isSelected ? 'text-cream-200' : 'text-emerald-700'
                              }`}
                            >
                              ✓ Gratis Pemeriksaan Toko
                            </div>
                          ) : compatibility.isCompatible ? (
                            <div
                              className={`text-[10px] font-medium flex items-center gap-1 ${
                                isSelected ? 'text-emerald-300' : 'text-emerald-700'
                              }`}
                            >
                              <span>✓ Sesuai Resep Anda</span>
                            </div>
                          ) : (
                            <div
                              className={`text-[10px] font-medium ${
                                isSelected ? 'text-amber-300' : 'text-amber-700'
                              }`}
                            >
                              ⚠️ {compatibility.reason || 'Melebihi Batas Resep'}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
