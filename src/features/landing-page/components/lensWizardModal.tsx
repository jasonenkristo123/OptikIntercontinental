'use client';

import { useState, useEffect } from 'react';
import { useWizardStore } from '@/shared/store/useWizardStore';
import { useCartStore } from '@/shared/store/useCartStore';
import { getMatchingBrandsForWizard, getBrandMatrixOptions } from '@/app/actions/lensMatrixActions';
import { createClient } from '@/lib/supabase/client';
import { X, ArrowLeft, ArrowRight, Check, Sparkles, Loader2 } from 'lucide-react';
import type { BudgetRange, LensType, LensBrand, BrandLensIndex, BrandLensColor, BrandLensCoating, PrescriptionData } from '@/shared/types/database';

interface WizardBrand {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  brand_lens_types?: Array<{
    id: string;
    lens_type_id: string;
    base_price: number;
    stock: number;
    is_available: boolean;
  }>;
}

export default function LensWizardModal() {
  const {
    isOpen,
    currentStep,
    selectedFrame,
    customerProfile,
    prescriptionData,
    selectedBudgetId,
    selectedLensTypeId,
    selectedBrandId,
    selectedBrandName,
    selectedLensTypeName,
    selectedIndexId,
    selectedIndexValue,
    selectedIndexPrice,
    selectedColorId,
    selectedColorName,
    selectedColorPrice,
    selectedCoatingId,
    selectedCoatingName,
    selectedCoatingPrice,
    basePrice,
    closeWizard,
    setStep,
    updateState,
    resetWizard,
  } = useWizardStore();

  const { addItem } = useCartStore();

  // Async Fetch States
  const [budgets, setBudgets] = useState<BudgetRange[]>([]);
  const [lensTypes, setLensTypes] = useState<LensType[]>([]);
  const [matchingBrands, setMatchingBrands] = useState<WizardBrand[]>([]);
  const [brandOptions, setBrandOptions] = useState<{ indexes: BrandLensIndex[]; colors: BrandLensColor[]; coatings: BrandLensCoating[] }>({
    indexes: [],
    colors: [],
    coatings: [],
  });
  const [loading, setLoading] = useState(false);

  // Load Master Budgets & Lens Types on Mount
  useEffect(() => {
    const fetchMaster = async () => {
      const supabase = createClient();
      const [bRes, ltRes] = await Promise.all([
        supabase.from('budget_ranges').select('*').order('name'),
        supabase.from('lens_types').select('*').order('name'),
      ]);
      setBudgets(bRes.data || []);
      setLensTypes(ltRes.data || []);
    };
    fetchMaster();
  }, []);

  // Fetch Matching Brands saat memasuki Step 5
  useEffect(() => {
    if (currentStep === 5 && selectedBudgetId && selectedLensTypeId) {
      setLoading(true);
      getMatchingBrandsForWizard(selectedBudgetId, selectedLensTypeId)
        .then((res) => setMatchingBrands(res))
        .finally(() => setLoading(false));
    }
  }, [currentStep, selectedBudgetId, selectedLensTypeId]);

  // Fetch Options (Color, Coating, Index) saat Merek Dipilih di Step 5/6
  useEffect(() => {
    if (selectedBrandId) {
      getBrandMatrixOptions(selectedBrandId).then((res) => setBrandOptions(res));
    }
  }, [selectedBrandId]);

  if (!isOpen) return null;

  // Total Price Calculation
  const framePrice = selectedFrame ? Number(selectedFrame.price) : 0;
  const calculatedLensPrice = basePrice + selectedIndexPrice + selectedColorPrice + selectedCoatingPrice;
  const grandTotal = framePrice + calculatedLensPrice;

  const handleNext = () => setStep(Math.min(9, currentStep + 1));
  const handleBack = () => setStep(Math.max(1, currentStep - 1));

  const handleAddToCart = () => {
    addItem({
      id: `custom-order-${Date.now()}`,
      frameId: selectedFrame?.id,
      frameName: selectedFrame?.name || 'Custom Lens Order (No Frame)',
      framePrice: framePrice,
      frameImage: selectedFrame?.image_url,
      lensDetails: {
        brandId: selectedBrandId,
        brandName: selectedBrandName,
        lensTypeName: selectedLensTypeName,
        indexValue: selectedIndexValue || '1.56 Standard',
        colorName: selectedColorName || 'Clear',
        coatingName: selectedCoatingName || 'Standard Anti-Radiation',
        calculatedPrice: calculatedLensPrice,
      },
      prescriptionData,
      customerProfile,
      totalPrice: grandTotal,
    });

    resetWizard();
    closeWizard();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-cream-100 border border-cream-300 w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Modal Header & Progress Bar */}
        <div className="p-6 border-b border-cream-300 bg-cream-50 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
              Langkah {currentStep} dari 9 — Kalkulator Lensa Optik
            </div>
            <h2 className="font-serif text-xl font-bold text-charcoal-900">
              Desain Lensa Milik Anda
            </h2>
          </div>
          <button onClick={closeWizard} className="p-2 text-stone-400 hover:text-charcoal-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-cream-200 h-1.5">
          <div
            className="bg-charcoal-900 h-1.5 transition-all duration-300"
            style={{ width: `${(currentStep / 9) * 100}%` }}
          />
        </div>

        {/* Modal Step Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6 text-charcoal-900 text-sm">

          {/* STEP 1: CUSTOMER PROFILE */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h3 className="font-serif font-bold text-lg md:text-3xl">Deskripsi Pembeli</h3>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">Pilih Kelompok Usia:</label>
                <div className="grid grid-cols-3 gap-3">
                  {['0 - 18', '18 - 40', '40 - 100'].map((age) => (
                    <button
                      key={age}
                      onClick={() => updateState({ customerProfile: { ...customerProfile, ageGroup: age } })}
                      className={`py-3 rounded-sm border text-xs font-medium transition ${customerProfile.ageGroup === age
                        ? 'bg-charcoal-900 text-cream-50 border-charcoal-900'
                        : 'bg-white border-cream-300 text-stone-700 hover:bg-cream-200'
                        }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">Apakah Anda pernah membeli kacamata?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Ya', val: true },
                    { label: 'Tidak', val: false },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => updateState({ customerProfile: { ...customerProfile, hasBoughtBefore: opt.val } })}
                      className={`py-3 rounded-sm border text-xs font-medium transition ${customerProfile.hasBoughtBefore === opt.val
                        ? 'bg-charcoal-900 text-cream-50 border-charcoal-900'
                        : 'bg-white border-cream-300 text-stone-700 hover:bg-cream-200'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PRESCRIPTION & EYE MEASUREMENT */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h3 className="font-serif font-bold text-lg md:text-3xl">Ukuran Mata</h3>
              <div className="flex gap-2 border-b border-cream-300 pb-3">
                {[
                  { id: 'EXACT', label: 'Resep Tepat' },
                  { id: 'IN_STORE_EXAM', label: 'Pemeriksaan Gratis di Toko' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => updateState({ prescriptionData: { ...prescriptionData, method: m.id as PrescriptionData['method'] } })}
                    className={`px-3 py-1.5 rounded-sm text-md font-medium transition ${prescriptionData.method === m.id ? 'bg-charcoal-900 text-cream-50' : 'bg-cream-200 text-stone-700'
                      }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {prescriptionData.method === 'EXACT' && (
                <div className="space-y-4 bg-white p-4 rounded-sm border border-cream-300 font-mono text-xs">
                  <div>
                    <p className="text-stone-400 uppercase tracking-widest text-[10px] font-semibold mb-2">Mata Kanan (OD)</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-stone-500 mb-1">SPH</label>
                        <input
                          type="number"
                          step="0.25"
                          value={prescriptionData.sphRight}
                          onChange={(e) => updateState({ prescriptionData: { ...prescriptionData, sphRight: Number(e.target.value) } })}
                          className="w-full border border-cream-300 rounded px-2 py-1.5"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 mb-1">Cylinder</label>
                        <input
                          type="number"
                          step="0.25"
                          value={prescriptionData.cylRight}
                          onChange={(e) => updateState({ prescriptionData: { ...prescriptionData, cylRight: Number(e.target.value) } })}
                          className="w-full border border-cream-300 rounded px-2 py-1.5"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 mb-1">Axis</label>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          max="180"
                          value={prescriptionData.axisRight}
                          onChange={(e) => updateState({ prescriptionData: { ...prescriptionData, axisRight: Number(e.target.value) } })}
                          className="w-full border border-cream-300 rounded px-2 py-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-cream-200" />

                  {/* Mata Kiri */}
                  <div>
                    <p className="text-stone-400 uppercase tracking-widest text-[10px] font-semibold mb-2">Mata Kiri (OS)</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-stone-500 mb-1">SPH</label>
                        <input
                          type="number"
                          step="0.25"
                          value={prescriptionData.sphLeft}
                          onChange={(e) => updateState({ prescriptionData: { ...prescriptionData, sphLeft: Number(e.target.value) } })}
                          className="w-full border border-cream-300 rounded px-2 py-1.5"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 mb-1">Cylinder</label>
                        <input
                          type="number"
                          step="0.25"
                          value={prescriptionData.cylLeft}
                          onChange={(e) => updateState({ prescriptionData: { ...prescriptionData, cylLeft: Number(e.target.value) } })}
                          className="w-full border border-cream-300 rounded px-2 py-1.5"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-500 mb-1">Axis</label>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          max="180"
                          value={prescriptionData.axisLeft}
                          onChange={(e) => updateState({ prescriptionData: { ...prescriptionData, axisLeft: Number(e.target.value) } })}
                          className="w-full border border-cream-300 rounded px-2 py-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-cream-200" />

                  {/* Pupil Distance & Addition */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-500 mb-1">Pupil Distance (PD)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={prescriptionData.pd}
                        onChange={(e) => updateState({ prescriptionData: { ...prescriptionData, pd: Number(e.target.value) } })}
                        className="w-full border border-cream-300 rounded px-2 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-500 mb-1">Addition (ADD)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={prescriptionData.addition}
                        onChange={(e) => updateState({ prescriptionData: { ...prescriptionData, addition: Number(e.target.value) } })}
                        className="w-full border border-cream-300 rounded px-2 py-1.5"
                      />
                    </div>
                  </div>

                </div>
              )}

              {prescriptionData.method === 'IN_STORE_EXAM' && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm text-xs text-amber-900 space-y-1">
                  <div className="font-bold">Termasuk Pemeriksaan Gratis di Toko</div>
                  <p>Anda dapat mengunjungi toko Optik Intercontinental setelah checkout untuk memeriksakan mata Anda oleh ahli kacamata bersertifikat kami secara gratis.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: BUDGET RANGE */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg md:text-3xl">Price List</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {budgets.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => updateState({ selectedBudgetId: b.id })}
                    className={`p-4 rounded-xl border transition flex flex-col justify-center items-center text-center aspect-square ${selectedBudgetId === b.id ? 'bg-charcoal-900 text-cream-50 border-charcoal-900 shadow-md' : 'bg-white border-cream-300 hover:bg-cream-200'
                      }`}
                  >
                    <div className="font-bold text-sm md:text-base">{b.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: LENS TYPE */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg md:text-3xl">Jenis Lensa</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {lensTypes.map((lt) => (
                  <button
                    key={lt.id}
                    onClick={() => updateState({ selectedLensTypeId: lt.id, selectedLensTypeName: lt.name })}
                    className={`p-4 rounded-xl border text-center transition flex flex-col justify-center items-center aspect-square ${selectedLensTypeId === lt.id ? 'bg-charcoal-900 text-cream-50 border-charcoal-900 shadow-md' : 'bg-white border-cream-300 hover:bg-cream-200'
                      }`}
                  >
                    <div className="font-bold">{lt.name}</div>
                    <div className="text-xs opacity-75 mt-2 line-clamp-3">{lt.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: DYNAMIC BRAND SELECTION */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg md:text-3xl">Pilih Merek Lensa</h3>
              {loading ? (
                <div className="text-center py-12 text-stone-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Mengambil merek yang cocok...
                </div>
              ) : matchingBrands.length === 0 ? (
                <div className="text-center py-8 text-stone-500">
                  Tidak ada merek yang cocok dengan kombinasi anggaran dan jenis lensa ini. Silakan coba sesuaikan Langkah 3.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {matchingBrands.map((b) => {
                    const typeInfo = b.brand_lens_types?.[0];
                    return (
                      <button
                        key={b.id}
                        onClick={() =>
                          updateState({
                            selectedBrandId: b.id,
                            selectedBrandName: b.name,
                            basePrice: Number(typeInfo?.base_price || 0),
                          })
                        }
                        className={`p-4 rounded-xl border flex flex-col justify-between items-center text-center aspect-square transition ${selectedBrandId === b.id ? 'bg-charcoal-900 text-cream-50 border-charcoal-900 shadow-md' : 'bg-white border-cream-300 hover:bg-cream-200'
                          }`}
                      >
                        <div className="flex-1 flex flex-col justify-center items-center w-full gap-2">
                          {b.logo_url ? (
                            <div className={`w-full flex justify-center items-center rounded px-2 py-1 ${
                              selectedBrandId === b.id ? 'bg-white/15' : 'bg-cream-100'
                            }`}>
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
          )}

          {/* STEP 6: COLOR / SUN PROTECTION */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg md:text-3xl">Warna Lensa</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {brandOptions.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() =>
                      updateState({
                        selectedColorId: c.id,
                        selectedColorName: c.color_name,
                        selectedColorPrice: Number(c.price_adder),
                      })
                    }
                    className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center aspect-square transition ${selectedColorId === c.id ? 'bg-charcoal-900 text-cream-50 shadow-md border-charcoal-900' : 'bg-white border-cream-300 hover:bg-cream-200'
                      }`}
                  >
                    <div className="font-bold">{c.color_name}</div>
                    {Number(c.price_adder) > 0 && (
                      <div className="font-mono text-xs mt-2 bg-current/10 px-2 py-1 rounded-full">+ Rp {Number(c.price_adder).toLocaleString('id-ID')}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: COATING & FEATURES */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg md:text-3xl">Fungsi Lensa</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {brandOptions.coatings.map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() =>
                      updateState({
                        selectedCoatingId: ct.id,
                        selectedCoatingName: ct.coating_name,
                        selectedCoatingPrice: Number(ct.price_adder),
                      })
                    }
                    className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center aspect-square transition ${selectedCoatingId === ct.id ? 'bg-charcoal-900 text-cream-50 shadow-md border-charcoal-900' : 'bg-white border-cream-300 hover:bg-cream-200'
                      }`}
                  >
                    <div className="font-bold text-sm">{ct.coating_name}</div>
                    {Number(ct.price_adder) > 0 && (
                      <div className="font-mono text-xs mt-2 bg-current/10 px-2 py-1 rounded-full">+ Rp {Number(ct.price_adder).toLocaleString('id-ID')}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: LENS THICKNESS INDEX & PRICING BREAKDOWN */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-lg md:text-3xl">Pilihan Indeks</h3>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-600">Pilih Indeks Ketebalan:</label>
                {(() => {
                  // Filter indexes: prefer rows matching color+coating; fallback to default (null) rows
                  const specificIndexes = brandOptions.indexes.filter(
                    (idx) =>
                      (idx.color_id === selectedColorId || idx.color_id === null) &&
                      (idx.coating_id === selectedCoatingId || idx.coating_id === null)
                  );
                  // If there are specific overrides, show only those; else show null-null defaults
                  const comboIndexes = specificIndexes.filter(
                    (idx) => idx.color_id === selectedColorId && idx.coating_id === selectedCoatingId
                  );
                  const displayIndexes = comboIndexes.length > 0
                    ? comboIndexes
                    : specificIndexes.filter((idx) => idx.color_id === null && idx.coating_id === null);

                  return (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {displayIndexes.length === 0 ? (
                        <div className="col-span-full text-sm text-stone-500 bg-white p-4 rounded-xl border text-center">Indeks Standar 1.56 (Termasuk)</div>
                      ) : (
                        displayIndexes.map((idx) => (
                          <button
                            key={idx.id}
                            onClick={() =>
                              updateState({
                                selectedIndexId: idx.id,
                                selectedIndexValue: idx.index_value,
                                selectedIndexPrice: Number(idx.price_adder),
                              })
                            }
                            className={`p-4 rounded-xl border flex flex-col justify-between items-center text-center aspect-square transition ${selectedIndexId === idx.id ? 'bg-charcoal-900 text-cream-50 shadow-md border-charcoal-900' : 'bg-white border-cream-300 hover:bg-cream-200'
                              }`}
                          >
                            <div className="flex-1 flex flex-col justify-center items-center w-full">
                              <div className="font-bold text-lg">Index {idx.index_value}</div>
                              <div className="text-[10px] opacity-75 mt-1 line-clamp-2">{idx.description || 'Kejernihan optik optimal'}</div>
                            </div>
                            <div className="mt-auto font-mono text-xs bg-current/10 px-2 py-1 rounded-full w-full">
                              + Rp {Number(idx.price_adder).toLocaleString('id-ID')}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {currentStep === 9 && (
            <div>
              {/* Final Summary Card */}
              <h3 className="font-serif font-bold text-lg md:text-3xl mb-4">Rincian Pesanan</h3>
              <div className="bg-white p-4 rounded-sm border border-cream-300 space-y-2 text-xs">
                <div className="font-serif font-bold text-sm text-charcoal-900 border-b border-cream-200 pb-2">Ringkasan Harga Pesanan</div>
                {selectedFrame && <div className="flex justify-between"><span>Bingkai: {selectedFrame.name}</span><span>Rp {framePrice.toLocaleString('id-ID')}</span></div>}
                <div className="flex justify-between"><span>Lensa Dasar ({selectedBrandName || 'Standar'}):</span><span>Rp {basePrice.toLocaleString('id-ID')}</span></div>
                {selectedIndexPrice > 0 && <div className="flex justify-between"><span>Tambahan Indeks ({selectedIndexValue}):</span><span>+ Rp {selectedIndexPrice.toLocaleString('id-ID')}</span></div>}
                {selectedColorPrice > 0 && <div className="flex justify-between"><span>Warna ({selectedColorName}):</span><span>+ Rp {selectedColorPrice.toLocaleString('id-ID')}</span></div>}
                {selectedCoatingPrice > 0 && <div className="flex justify-between"><span>Pelapis ({selectedCoatingName}):</span><span>+ Rp {selectedCoatingPrice.toLocaleString('id-ID')}</span></div>}
                <div className="flex justify-between font-bold text-sm text-charcoal-900 border-t border-cream-200 pt-2">
                  <span>Total Keseluruhan:</span>
                  <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 border-t border-cream-300 bg-cream-50 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-sm border border-cream-300 text-xs font-semibold text-stone-700 hover:bg-cream-200 disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {currentStep < 9 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-charcoal-900 hover:bg-stone-800 text-cream-50 text-xs font-semibold uppercase tracking-wider"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider"
            >
              <Check className="w-4 h-4" /> Tambahkan ke Keranjang 
            </button>
          )}
        </div>

      </div>
    </div>
  );
}