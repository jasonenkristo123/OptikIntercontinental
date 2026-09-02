'use client';

import { useState, useEffect } from 'react';
import { useWizardStore } from '@/shared/store/useWizardStore';
import { useCartStore } from '@/shared/store/useCartStore';
import { getMatchingBrandsForWizard, getBrandMatrixOptions } from '@/app/actions/lensMatrixActions';
import { createClient } from '@/lib/supabase/client';
import { X, ArrowLeft, ArrowRight, Check, Sparkles, Loader2 } from 'lucide-react';

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
  const [budgets, setBudgets] = useState<any[]>([]);
  const [lensTypes, setLensTypes] = useState<any[]>([]);
  const [matchingBrands, setMatchingBrands] = useState<any[]>([]);
  const [brandOptions, setBrandOptions] = useState<{ indexes: any[]; colors: any[]; coatings: any[] }>({
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

  const handleNext = () => setStep(Math.min(8, currentStep + 1));
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
              Step {currentStep} of 8 — Optical Lens Wizard
            </div>
            <h2 className="font-serif text-xl font-bold text-charcoal-900">
              {selectedFrame ? `Customize Lens for ${selectedFrame.name}` : 'Standalone Lens Configuration'}
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
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>

        {/* Modal Step Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6 text-charcoal-900 text-sm">
          
          {/* STEP 1: CUSTOMER PROFILE */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h3 className="font-serif font-bold text-lg">Step 1: Customer Profile</h3>
              
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">Select Age Group:</label>
                <div className="grid grid-cols-3 gap-3">
                  {['< 18', '18-40', '> 40'].map((age) => (
                    <button
                      key={age}
                      onClick={() => updateState({ customerProfile: { ...customerProfile, ageGroup: age } })}
                      className={`py-3 rounded-sm border text-xs font-medium transition ${
                        customerProfile.ageGroup === age
                          ? 'bg-charcoal-900 text-cream-50 border-charcoal-900'
                          : 'bg-white border-cream-300 text-stone-700 hover:bg-cream-200'
                      }`}
                    >
                      {age} years old
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">Have you bought prescription glasses before?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Yes, experienced user', val: true },
                    { label: 'No, first time buyer', val: false },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => updateState({ customerProfile: { ...customerProfile, hasBoughtBefore: opt.val } })}
                      className={`py-3 rounded-sm border text-xs font-medium transition ${
                        customerProfile.hasBoughtBefore === opt.val
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
              <h3 className="font-serif font-bold text-lg">Step 2: Prescription Input</h3>
              
              <div className="flex gap-2 border-b border-cream-300 pb-3">
                {[
                  { id: 'EXACT', label: 'Exact Prescription' },
                  { id: 'APPROXIMATE', label: 'Approximate Range' },
                  { id: 'IN_STORE_EXAM', label: 'Free In-Store Exam' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => updateState({ prescriptionData: { ...prescriptionData, method: m.id as any } })}
                    className={`px-3 py-1.5 rounded-sm text-xs font-medium transition ${
                      prescriptionData.method === m.id ? 'bg-charcoal-900 text-cream-50' : 'bg-cream-200 text-stone-700'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {prescriptionData.method === 'EXACT' && (
                <div className="space-y-3 bg-white p-4 rounded-sm border border-cream-300">
                  <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                    <div>
                      <label className="block text-stone-500 mb-1">SPH Right (OD)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={prescriptionData.sphRight}
                        onChange={(e) => updateState({ prescriptionData: { ...prescriptionData, sphRight: Number(e.target.value) } })}
                        className="w-full border border-cream-300 rounded px-2 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-500 mb-1">SPH Left (OS)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={prescriptionData.sphLeft}
                        onChange={(e) => updateState({ prescriptionData: { ...prescriptionData, sphLeft: Number(e.target.value) } })}
                        className="w-full border border-cream-300 rounded px-2 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-500 mb-1">PD (Pupil Distance)</label>
                      <input
                        type="number"
                        value={prescriptionData.pd}
                        onChange={(e) => updateState({ prescriptionData: { ...prescriptionData, pd: Number(e.target.value) } })}
                        className="w-full border border-cream-300 rounded px-2 py-1.5"
                      />
                    </div>
                  </div>
                </div>
              )}

              {prescriptionData.method === 'APPROXIMATE' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-600">Select Rough Power Estimation:</label>
                  {['Low (-0.25 to -2.00)', 'Moderate (-2.25 to -4.00)', 'High (-4.25+)', 'Unsure / Need CS Help'].map((r) => (
                    <button
                      key={r}
                      onClick={() => updateState({ prescriptionData: { ...prescriptionData, approximateRange: r } })}
                      className={`w-full text-left p-3 rounded-sm border text-xs ${
                        prescriptionData.approximateRange === r ? 'bg-charcoal-900 text-cream-50 border-charcoal-900' : 'bg-white border-cream-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}

              {prescriptionData.method === 'IN_STORE_EXAM' && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm text-xs text-amber-900 space-y-1">
                  <div className="font-bold">Free In-Store Examination Included</div>
                  <p>You can visit Optik Intercontinental store after checkout to get your eyes examined by our certified optician for free.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: BUDGET RANGE */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg">Step 3: Target Budget Range</h3>
              <div className="space-y-2">
                {budgets.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => updateState({ selectedBudgetId: b.id })}
                    className={`w-full text-left p-4 rounded-sm border transition ${
                      selectedBudgetId === b.id ? 'bg-charcoal-900 text-cream-50 border-charcoal-900' : 'bg-white border-cream-300 hover:bg-cream-200'
                    }`}
                  >
                    <div className="font-bold text-sm">{b.name}</div>
                    <div className="text-xs opacity-80 mt-0.5">{b.description || 'Standard optical performance range.'}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: LENS TYPE */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg">Step 4: Select Lens Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lensTypes.map((lt) => (
                  <button
                    key={lt.id}
                    onClick={() => updateState({ selectedLensTypeId: lt.id, selectedLensTypeName: lt.name })}
                    className={`p-4 rounded-sm border text-left transition ${
                      selectedLensTypeId === lt.id ? 'bg-charcoal-900 text-cream-50 border-charcoal-900' : 'bg-white border-cream-300 hover:bg-cream-200'
                    }`}
                  >
                    <div className="font-bold">{lt.name}</div>
                    <div className="text-xs opacity-75 mt-1">{lt.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: DYNAMIC BRAND SELECTION */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg">Step 5: Available Lens Brands</h3>
              {loading ? (
                <div className="text-center py-12 text-stone-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Fetching matching brands...
                </div>
              ) : matchingBrands.length === 0 ? (
                <div className="text-center py-8 text-stone-500">
                  No brands match this specific budget and lens type combination. Please try adjusting Step 3.
                </div>
              ) : (
                <div className="space-y-3">
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
                        className={`w-full text-left p-4 rounded-sm border flex justify-between items-center transition ${
                          selectedBrandId === b.id ? 'bg-charcoal-900 text-cream-50 border-charcoal-900' : 'bg-white border-cream-300'
                        }`}
                      >
                        <div>
                          <div className="font-serif font-bold text-base">{b.name}</div>
                          <div className="text-xs opacity-75">{b.description}</div>
                        </div>
                        <div className="text-right font-mono font-bold">
                          Base: Rp {Number(typeInfo?.base_price || 0).toLocaleString('id-ID')}
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
              <h3 className="font-serif font-bold text-lg">Step 6: Lens Color & Sun Protection</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateState({ selectedColorId: '', selectedColorName: 'Clear (Bening)', selectedColorPrice: 0 })}
                  className={`w-full text-left p-4 rounded-sm border flex justify-between ${
                    !selectedColorId ? 'bg-charcoal-900 text-cream-50' : 'bg-white border-cream-300'
                  }`}
                >
                  <div>Clear (Bening Standard)</div>
                  <div>+ Rp 0</div>
                </button>

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
                    className={`w-full text-left p-4 rounded-sm border flex justify-between ${
                      selectedColorId === c.id ? 'bg-charcoal-900 text-cream-50' : 'bg-white border-cream-300'
                    }`}
                  >
                    <div>{c.color_name}</div>
                    <div className="font-mono">+ Rp {Number(c.price_adder).toLocaleString('id-ID')}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: COATING & FEATURES */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg">Step 7: Protective Coating</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateState({ selectedCoatingId: '', selectedCoatingName: 'Standard Anti-Radiation', selectedCoatingPrice: 0 })}
                  className={`w-full text-left p-4 rounded-sm border flex justify-between ${
                    !selectedCoatingId ? 'bg-charcoal-900 text-cream-50' : 'bg-white border-cream-300'
                  }`}
                >
                  <div>Standard Anti-Radiation Coating</div>
                  <div>+ Rp 0</div>
                </button>

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
                    className={`w-full text-left p-4 rounded-sm border flex justify-between ${
                      selectedCoatingId === ct.id ? 'bg-charcoal-900 text-cream-50' : 'bg-white border-cream-300'
                    }`}
                  >
                    <div>{ct.coating_name}</div>
                    <div className="font-mono">+ Rp {Number(ct.price_adder).toLocaleString('id-ID')}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: LENS THICKNESS INDEX & PRICING BREAKDOWN */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-lg">Step 8: Lens Thickness Index & Pricing</h3>
              
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-600">Choose Thickness Index:</label>
                {brandOptions.indexes.length === 0 ? (
                  <div className="text-xs text-stone-500 bg-white p-3 rounded border">Standard Index 1.56 (Included)</div>
                ) : (
                  brandOptions.indexes.map((idx) => (
                    <button
                      key={idx.id}
                      onClick={() =>
                        updateState({
                          selectedIndexId: idx.id,
                          selectedIndexValue: idx.index_value,
                          selectedIndexPrice: Number(idx.price_adder),
                        })
                      }
                      className={`w-full text-left p-4 rounded-sm border flex justify-between items-center ${
                        selectedIndexId === idx.id ? 'bg-charcoal-900 text-cream-50' : 'bg-white border-cream-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold">Index {idx.index_value}</div>
                        <div className="text-xs opacity-75">{idx.description || 'Optimal optical clarity'}</div>
                      </div>
                      <div className="font-mono">+ Rp {Number(idx.price_adder).toLocaleString('id-ID')}</div>
                    </button>
                  ))
                )}
              </div>

              {/* Final Summary Card */}
              <div className="bg-white p-4 rounded-sm border border-cream-300 space-y-2 text-xs">
                <div className="font-serif font-bold text-sm text-charcoal-900 border-b border-cream-200 pb-2">Order Price Summary</div>
                {selectedFrame && <div className="flex justify-between"><span>Frame: {selectedFrame.name}</span><span>Rp {framePrice.toLocaleString('id-ID')}</span></div>}
                <div className="flex justify-between"><span>Base Lens ({selectedBrandName || 'Standard'}):</span><span>Rp {basePrice.toLocaleString('id-ID')}</span></div>
                {selectedIndexPrice > 0 && <div className="flex justify-between"><span>Index Adder ({selectedIndexValue}):</span><span>+ Rp {selectedIndexPrice.toLocaleString('id-ID')}</span></div>}
                {selectedColorPrice > 0 && <div className="flex justify-between"><span>Color ({selectedColorName}):</span><span>+ Rp {selectedColorPrice.toLocaleString('id-ID')}</span></div>}
                {selectedCoatingPrice > 0 && <div className="flex justify-between"><span>Coating ({selectedCoatingName}):</span><span>+ Rp {selectedCoatingPrice.toLocaleString('id-ID')}</span></div>}
                <div className="flex justify-between font-bold text-sm text-charcoal-900 border-t border-cream-200 pt-2">
                  <span>Grand Total:</span>
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
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < 8 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-charcoal-900 hover:bg-stone-800 text-cream-50 text-xs font-semibold uppercase tracking-wider"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider"
            >
              <Check className="w-4 h-4" /> Add to Cart & Hold Stock
            </button>
          )}
        </div>

      </div>
    </div>
  );
}