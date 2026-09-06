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

function checkPrescriptionCompatibility(
  rx: PrescriptionData,
  lens: BrandLensIndex
): { isCompatible: boolean; reason?: string } {
  if (rx.method === 'IN_STORE_EXAM') {
    return { isCompatible: true };
  }

  const minSph = lens.min_sph ?? -8.0;
  const maxSph = lens.max_sph ?? 5.5;
  const maxCyl = lens.max_cyl ?? -4.0;
  const minAdd = lens.min_add ?? 0.75;
  const maxAdd = lens.max_add ?? 3.5;
  const maxSc = lens.max_s_c ?? -8.0;

  const sphR = Number(rx.sphRight) || 0;
  const sphL = Number(rx.sphLeft) || 0;
  const cylR = Number(rx.cylRight) || 0;
  const cylL = Number(rx.cylLeft) || 0;
  const add = Number(rx.addition) || 0;

  // Check SPH range (minus to plus)
  if (sphR < minSph || sphR > maxSph) {
    return { isCompatible: false, reason: `Mata Kanan SPH (${sphR > 0 ? '+' : ''}${sphR}) di luar batas (${minSph} s/d +${maxSph})` };
  }
  if (sphL < minSph || sphL > maxSph) {
    return { isCompatible: false, reason: `Mata Kiri SPH (${sphL > 0 ? '+' : ''}${sphL}) di luar batas (${minSph} s/d +${maxSph})` };
  }

  // Check CYL: cyl is negative, so |cyl| <= |maxCyl|
  if (Math.abs(cylR) > Math.abs(maxCyl)) {
    return { isCompatible: false, reason: `Silinder Kanan (${cylR}) melebihi batas (maks ${maxCyl})` };
  }
  if (Math.abs(cylL) > Math.abs(maxCyl)) {
    return { isCompatible: false, reason: `Silinder Kiri (${cylL}) melebihi batas (maks ${maxCyl})` };
  }

  // Check ADD if present
  if (add > 0) {
    if (add < minAdd || add > maxAdd) {
      return { isCompatible: false, reason: `ADD (+${add}) di luar rentang (+${minAdd} s/d +${maxAdd})` };
    }
  }

  // Check Combined S + C
  const scR = sphR + (cylR < 0 ? cylR : -cylR);
  const scL = sphL + (cylL < 0 ? cylL : -cylL);
  const limitSc = Math.abs(maxSc);

  if (Math.abs(scR) > limitSc) {
    return { isCompatible: false, reason: `Kombinasi S+C Kanan (${scR.toFixed(2)}) melebihi batas (${maxSc})` };
  }
  if (Math.abs(scL) > limitSc) {
    return { isCompatible: false, reason: `Kombinasi S+C Kiri (${scL.toFixed(2)}) melebihi batas (${maxSc})` };
  }

  return { isCompatible: true };
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
    selectedLevel,
    selectedLensPrice,
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

  // Total Price Calculation (Uses package price if catalog item selected, otherwise fallback)
  const framePrice = selectedFrame ? Number(selectedFrame.price) : 0;
  const calculatedLensPrice =
    selectedLensPrice > 0
      ? selectedLensPrice
      : basePrice + selectedIndexPrice + selectedColorPrice + selectedCoatingPrice;
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
        lensLevel: selectedLevel || undefined,
        indexValue: selectedIndexValue || '1.50 Standard',
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

          {/* STEP 8: LENS CATALOG, LEVEL & INDEX PRICING */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
                  Katalog Paket Lensa — {selectedBrandName} ({selectedLensTypeName})
                </div>
                <h3 className="font-serif font-bold text-lg md:text-3xl">Pilihan Level &amp; Indeks</h3>
                <p className="text-xs text-stone-600 mt-1">
                  Pilih tingkat kenyamanan desain lensa dan ketebalan indeks. Sistem otomatis memvalidasi kesesuaian dengan resep mata Anda.
                </p>
              </div>

              {(() => {
                // 1. Filter by lens_type_id
                const typeMatches = brandOptions.indexes.filter(
                  (idx) => !idx.lens_type_id || idx.lens_type_id === selectedLensTypeId
                );

                // 2. Filter by color and coating if specified
                const comboIndexes = typeMatches.filter(
                  (idx) =>
                    (idx.color_id === selectedColorId || idx.color_id === null) &&
                    (idx.coating_id === selectedCoatingId || idx.coating_id === null)
                );

                const candidateIndexes = comboIndexes.length > 0 ? comboIndexes : typeMatches;

                if (candidateIndexes.length === 0) {
                  return (
                    <div className="bg-white p-6 rounded-xl border border-cream-300 text-center space-y-2">
                      <div className="font-bold text-base text-charcoal-900">Indeks Standar 1.50</div>
                      <p className="text-xs text-stone-500">Termasuk dalam paket standar merek ini.</p>
                      <button
                        onClick={() =>
                          updateState({
                            selectedIndexValue: '1.50',
                            selectedLevel: 'Standard',
                            selectedLensPrice: basePrice || 0,
                            selectedIndexPrice: 0,
                          })
                        }
                        className="mt-3 px-4 py-2 bg-charcoal-900 text-cream-50 rounded text-xs font-semibold"
                      >
                        Pilih Indeks Standar
                      </button>
                    </div>
                  );
                }

                // Group candidates by lens_level
                const grouped = candidateIndexes.reduce<Record<string, BrandLensIndex[]>>((acc, item) => {
                  const levelKey = item.lens_level?.trim() || 'Standard';
                  if (!acc[levelKey]) acc[levelKey] = [];
                  acc[levelKey].push(item);
                  return acc;
                }, {});

                return (
                  <div className="space-y-6">
                    {Object.entries(grouped).map(([levelName, items]) => {
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
                                  onClick={() => {
                                    updateState({
                                      selectedIndexId: idx.id,
                                      selectedIndexValue: idx.index_value,
                                      selectedLevel: levelName,
                                      selectedLensPrice: price,
                                      selectedIndexPrice: price,
                                    });
                                  }}
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
                                      <span className="font-bold text-base">
                                        Index {idx.index_value}
                                      </span>
                                      {isSelected && (
                                        <span className="text-[10px] bg-white text-charcoal-900 font-bold px-2 py-0.5 rounded-full">
                                          Dipilih
                                        </span>
                                      )}
                                    </div>

                                    <div className={`text-[11px] mt-1 line-clamp-1 ${
                                      isSelected ? 'text-cream-200' : 'text-stone-500'
                                    }`}>
                                      {idx.color?.color_name || 'Clear'} {idx.coating?.coating_name ? `· ${idx.coating?.coating_name}` : ''}
                                    </div>

                                    {idx.description && (
                                      <div className={`text-[10px] mt-1 italic line-clamp-1 ${
                                        isSelected ? 'text-stone-300' : 'text-stone-400'
                                      }`}>
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
                                      <div className={`text-[10px] font-medium ${isSelected ? 'text-cream-200' : 'text-emerald-700'}`}>
                                        ✓ Gratis Pemeriksaan Toko
                                      </div>
                                    ) : compatibility.isCompatible ? (
                                      <div className={`text-[10px] font-medium flex items-center gap-1 ${
                                        isSelected ? 'text-emerald-300' : 'text-emerald-700'
                                      }`}>
                                        <span>✓ Sesuai Resep Anda</span>
                                      </div>
                                    ) : (
                                      <div className={`text-[10px] font-medium ${
                                        isSelected ? 'text-amber-300' : 'text-amber-700'
                                      }`}>
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
                );
              })()}
            </div>
          )}

          {/* STEP 9: ORDER SUMMARY & CHECKOUT */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg md:text-3xl">Rincian Pesanan</h3>
              <div className="bg-white p-5 rounded-sm border border-cream-300 space-y-3.5 text-xs">
                <div className="font-serif font-bold text-sm text-charcoal-900 border-b border-cream-200 pb-2 flex justify-between items-center">
                  <span>Ringkasan Paket Lengkap</span>
                  <span className="font-mono text-stone-400 text-[10px]">VERIFIED ORDER</span>
                </div>

                {selectedFrame && (
                  <div className="flex justify-between items-center py-1.5 border-b border-cream-100">
                    <div>
                      <div className="font-semibold text-charcoal-900">Bingkai: {selectedFrame.name}</div>
                      <div className="text-[10px] text-stone-500">Koleksi Original Optik Intercontinental</div>
                    </div>
                    <span className="font-mono font-semibold">Rp {framePrice.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="flex justify-between items-start py-1.5 border-b border-cream-100">
                  <div>
                    <div className="font-semibold text-charcoal-900">
                      Paket Lensa: {selectedBrandName || 'Lensa'} ({selectedLensTypeName || 'Custom'})
                    </div>
                    <div className="text-[11px] text-stone-600 mt-1 space-y-0.5">
                      {selectedLevel && (
                        <div>• Level Desain: <strong>{selectedLevel}</strong></div>
                      )}
                      <div>• Indeks Ketebalan: <strong>Index {selectedIndexValue || '1.50'}</strong></div>
                      {selectedColorName && (
                        <div>• Fitur Warna: <strong>{selectedColorName}</strong></div>
                      )}
                      {selectedCoatingName && (
                        <div>• Lapisan Proteksi: <strong>{selectedCoatingName}</strong></div>
                      )}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-charcoal-900 text-sm">
                    Rp {calculatedLensPrice.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Prescription summary row */}
                <div className="bg-cream-50 p-3 rounded text-[11px] space-y-1">
                  <div className="font-semibold text-stone-700">Detail Ukuran Mata:</div>
                  {prescriptionData.method === 'IN_STORE_EXAM' ? (
                    <div className="text-emerald-700 font-medium">✓ Pemeriksaan Gratis di Toko Optik Intercontinental</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[10px]">
                      <div>OD (Kanan): SPH {prescriptionData.sphRight ?? 0} | CYL {prescriptionData.cylRight ?? 0} | AXIS {prescriptionData.axisRight ?? 0}°</div>
                      <div>OS (Kiri): SPH {prescriptionData.sphLeft ?? 0} | CYL {prescriptionData.cylLeft ?? 0} | AXIS {prescriptionData.axisLeft ?? 0}°</div>
                      {prescriptionData.addition ? <div>ADD: +{prescriptionData.addition}</div> : null}
                      {prescriptionData.pd ? <div>PD: {prescriptionData.pd} mm</div> : null}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center font-bold text-base text-charcoal-900 border-t border-cream-200 pt-3">
                  <span>Total Keseluruhan:</span>
                  <span className="font-mono text-lg text-emerald-800">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </span>
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