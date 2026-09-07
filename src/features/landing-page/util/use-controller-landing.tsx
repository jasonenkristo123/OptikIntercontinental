'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useWizardStore } from '@/shared/store/useWizardStore';
import { useCartStore } from '@/shared/store/useCartStore';
import { getMatchingBrandsForWizard, getBrandMatrixOptions } from '@/app/actions/lensMatrixActions';
import { createClient } from '@/lib/supabase/client';
import type {
  BudgetRange,
  LensType,
  BrandLensIndex,
  BrandLensColor,
  BrandLensCoating,
  PrescriptionData,
} from '@/shared/types/database';
import type {
  WizardBrand,
  BrandMatrixOptions,
  FieldInputMode,
  LensWizardController,
  PrescriptionCompatibilityResult,
} from '../type';
import { checkPrescriptionCompatibility } from './prescription-helpers';

export function useLandingController(): LensWizardController {
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
  const [brandOptions, setBrandOptions] = useState<BrandMatrixOptions>({
    indexes: [],
    colors: [],
    coatings: [],
  });
  const [loading, setLoading] = useState(false);

  // Prescription Input Mode States (select dropdown vs manual typing)
  const [globalInputMode, setGlobalInputModeState] = useState<FieldInputMode>('select');
  const [fieldInputModes, setFieldInputModes] = useState<Record<string, FieldInputMode>>({});

  const isFieldManual = useCallback(
    (fieldKey: string) => {
      return fieldInputModes[fieldKey] !== undefined
        ? fieldInputModes[fieldKey] === 'manual'
        : globalInputMode === 'manual';
    },
    [fieldInputModes, globalInputMode]
  );

  const toggleFieldMode = useCallback(
    (fieldKey: string) => {
      setFieldInputModes((prev) => ({
        ...prev,
        [fieldKey]: isFieldManual(fieldKey) ? 'select' : 'manual',
      }));
    },
    [isFieldManual]
  );

  const setGlobalInputMode = useCallback((mode: FieldInputMode) => {
    setGlobalInputModeState(mode);
    setFieldInputModes({});
  }, []);

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

  // Fetch Matching Brands when entering Step 5
  useEffect(() => {
    if (currentStep === 5 && selectedBudgetId && selectedLensTypeId) {
      setLoading(true);
      getMatchingBrandsForWizard(selectedBudgetId, selectedLensTypeId)
        .then((res) => setMatchingBrands(res))
        .finally(() => setLoading(false));
    }
  }, [currentStep, selectedBudgetId, selectedLensTypeId]);

  // Fetch Options (Color, Coating, Index) when Brand is selected
  useEffect(() => {
    if (selectedBrandId) {
      getBrandMatrixOptions(selectedBrandId).then((res) => setBrandOptions(res));
    }
  }, [selectedBrandId]);

  // Calculations
  const framePrice = selectedFrame ? Number(selectedFrame.price) : 0;
  const calculatedLensPrice =
    selectedLensPrice > 0
      ? selectedLensPrice
      : basePrice + selectedIndexPrice + selectedColorPrice + selectedCoatingPrice;
  const grandTotal = framePrice + calculatedLensPrice;

  // Step 8 candidate indexes grouping
  const groupedIndexes = useMemo(() => {
    const typeMatches = brandOptions.indexes.filter(
      (idx) => !idx.lens_type_id || idx.lens_type_id === selectedLensTypeId
    );

    const comboIndexes = typeMatches.filter(
      (idx) =>
        (idx.color_id === selectedColorId || idx.color_id === null) &&
        (idx.coating_id === selectedCoatingId || idx.coating_id === null)
    );

    const candidateIndexes = comboIndexes.length > 0 ? comboIndexes : typeMatches;

    return candidateIndexes.reduce<Record<string, BrandLensIndex[]>>((acc, item) => {
      const levelKey = item.lens_level?.trim() || 'Standard';
      if (!acc[levelKey]) acc[levelKey] = [];
      acc[levelKey].push(item);
      return acc;
    }, {});
  }, [brandOptions.indexes, selectedLensTypeId, selectedColorId, selectedCoatingId]);

  // Step 9 prescription warning check
  const selectedLensIndexItem = useMemo(() => {
    return brandOptions.indexes.find((i) => i.id === selectedIndexId);
  }, [brandOptions.indexes, selectedIndexId]);

  const prescriptionWarning: PrescriptionCompatibilityResult | undefined = useMemo(() => {
    if (prescriptionData.method === 'IN_STORE_EXAM' || !selectedLensIndexItem) {
      return undefined;
    }
    const compat = checkPrescriptionCompatibility(prescriptionData, selectedLensIndexItem);
    return compat.isCompatible ? undefined : compat;
  }, [prescriptionData, selectedLensIndexItem]);

  // Validation
  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case 1:
        return Boolean(
          customerProfile.ageGroup &&
            customerProfile.hasBoughtBefore !== null &&
            customerProfile.hasBoughtBefore !== undefined
        );
      case 2:
        if (prescriptionData.method === 'IN_STORE_EXAM') return true;
        if (prescriptionData.method === 'EXACT') {
          const pdValid =
            typeof prescriptionData.pd === 'number' &&
            prescriptionData.pd >= 40 &&
            prescriptionData.pd <= 80;
          const sphRValid =
            prescriptionData.sphRight !== undefined && !isNaN(prescriptionData.sphRight);
          const sphLValid =
            prescriptionData.sphLeft !== undefined && !isNaN(prescriptionData.sphLeft);
          return Boolean(pdValid && sphRValid && sphLValid);
        }
        return false;
      case 3:
        return Boolean(selectedBudgetId);
      case 4:
        return Boolean(selectedLensTypeId);
      case 5:
        return Boolean(selectedBrandId && !loading);
      case 6:
        return brandOptions.colors.length === 0 || Boolean(selectedColorId);
      case 7:
        return brandOptions.coatings.length === 0 || Boolean(selectedCoatingId);
      case 8:
        return Boolean(selectedIndexId || selectedIndexValue);
      case 9:
        return true;
      default:
        return true;
    }
  }, [
    currentStep,
    customerProfile,
    prescriptionData,
    selectedBudgetId,
    selectedLensTypeId,
    selectedBrandId,
    loading,
    brandOptions.colors.length,
    selectedColorId,
    brandOptions.coatings.length,
    selectedCoatingId,
    selectedIndexId,
    selectedIndexValue,
  ]);

  const getStepValidationMessage = useCallback((): string => {
    switch (currentStep) {
      case 1:
        return 'Pilih usia & riwayat beli';
      case 2:
        return 'Lengkapi data resep mata (PD 40-80 mm)';
      case 3:
        return 'Pilih kategori anggaran';
      case 4:
        return 'Pilih jenis lensa';
      case 5:
        return loading ? 'Memuat merek lensa...' : 'Pilih merek lensa';
      case 6:
        return 'Pilih warna lensa';
      case 7:
        return 'Pilih fungsi lensa';
      case 8:
        return 'Pilih paket indeks lensa';
      default:
        return '';
    }
  }, [currentStep, loading]);

  const handleNext = useCallback(() => {
    if (!canProceed()) return;
    setStep(Math.min(9, currentStep + 1));
  }, [canProceed, currentStep, setStep]);

  const handleBack = useCallback(() => {
    setStep(Math.max(1, currentStep - 1));
  }, [currentStep, setStep]);

  const handleAddToCart = useCallback(() => {
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
      customerProfile: {
        ageGroup: customerProfile.ageGroup || '18 - 40',
        hasBoughtBefore: customerProfile.hasBoughtBefore ?? true,
      },
      totalPrice: grandTotal,
    });

    resetWizard();
    closeWizard();
  }, [
    addItem,
    selectedFrame,
    framePrice,
    selectedBrandId,
    selectedBrandName,
    selectedLensTypeName,
    selectedLevel,
    selectedIndexValue,
    selectedColorName,
    selectedCoatingName,
    calculatedLensPrice,
    prescriptionData,
    customerProfile,
    grandTotal,
    resetWizard,
    closeWizard,
  ]);

  // Action Handlers
  const setAgeGroup = useCallback(
    (age: string) => {
      updateState({ customerProfile: { ...customerProfile, ageGroup: age } });
    },
    [customerProfile, updateState]
  );

  const setHasBoughtBefore = useCallback(
    (val: boolean) => {
      updateState({ customerProfile: { ...customerProfile, hasBoughtBefore: val } });
    },
    [customerProfile, updateState]
  );

  const setPrescriptionMethod = useCallback(
    (method: PrescriptionData['method']) => {
      updateState({ prescriptionData: { ...prescriptionData, method } });
    },
    [prescriptionData, updateState]
  );

  const updatePrescriptionField = useCallback(
    (field: keyof PrescriptionData, value: number | string | undefined) => {
      updateState({ prescriptionData: { ...prescriptionData, [field]: value } });
    },
    [prescriptionData, updateState]
  );

  const selectBudget = useCallback(
    (budgetId: string) => {
      if (selectedBudgetId !== budgetId) {
        updateState({
          selectedBudgetId: budgetId,
          selectedBrandId: '',
          selectedBrandName: '',
          selectedColorId: '',
          selectedColorName: '',
          selectedColorPrice: 0,
          selectedCoatingId: '',
          selectedCoatingName: '',
          selectedCoatingPrice: 0,
          selectedIndexId: '',
          selectedIndexValue: '',
          selectedIndexPrice: 0,
          selectedLevel: '',
          selectedLensPrice: 0,
        });
      }
    },
    [selectedBudgetId, updateState]
  );

  const selectLensType = useCallback(
    (typeId: string, typeName: string) => {
      if (selectedLensTypeId !== typeId) {
        updateState({
          selectedLensTypeId: typeId,
          selectedLensTypeName: typeName,
          selectedBrandId: '',
          selectedBrandName: '',
          selectedColorId: '',
          selectedColorName: '',
          selectedColorPrice: 0,
          selectedCoatingId: '',
          selectedCoatingName: '',
          selectedCoatingPrice: 0,
          selectedIndexId: '',
          selectedIndexValue: '',
          selectedIndexPrice: 0,
          selectedLevel: '',
          selectedLensPrice: 0,
        });
      }
    },
    [selectedLensTypeId, updateState]
  );

  const selectBrand = useCallback(
    (brand: WizardBrand) => {
      if (selectedBrandId !== brand.id) {
        const typeInfo = brand.brand_lens_types?.[0];
        updateState({
          selectedBrandId: brand.id,
          selectedBrandName: brand.name,
          basePrice: Number(typeInfo?.base_price || 0),
          selectedColorId: '',
          selectedColorName: '',
          selectedColorPrice: 0,
          selectedCoatingId: '',
          selectedCoatingName: '',
          selectedCoatingPrice: 0,
          selectedIndexId: '',
          selectedIndexValue: '',
          selectedIndexPrice: 0,
          selectedLevel: '',
          selectedLensPrice: 0,
        });
      }
    },
    [selectedBrandId, updateState]
  );

  const selectColor = useCallback(
    (color: BrandLensColor) => {
      updateState({
        selectedColorId: color.id,
        selectedColorName: color.color_name,
        selectedColorPrice: Number(color.price_adder),
        selectedIndexId: '',
        selectedIndexValue: '',
        selectedIndexPrice: 0,
        selectedLevel: '',
        selectedLensPrice: 0,
      });
    },
    [updateState]
  );

  const selectCoating = useCallback(
    (coating: BrandLensCoating) => {
      updateState({
        selectedCoatingId: coating.id,
        selectedCoatingName: coating.coating_name,
        selectedCoatingPrice: Number(coating.price_adder),
        selectedIndexId: '',
        selectedIndexValue: '',
        selectedIndexPrice: 0,
        selectedLevel: '',
        selectedLensPrice: 0,
      });
    },
    [updateState]
  );

  const selectIndex = useCallback(
    (index: BrandLensIndex, levelName: string) => {
      const price = Number(index.price ?? index.price_adder ?? 0);
      updateState({
        selectedIndexId: index.id,
        selectedIndexValue: index.index_value,
        selectedLevel: levelName,
        selectedLensPrice: price,
        selectedIndexPrice: price,
      });
    },
    [updateState]
  );

  const selectStandardIndex = useCallback(() => {
    updateState({
      selectedIndexValue: '1.50',
      selectedLevel: 'Standard',
      selectedLensPrice: basePrice || 0,
      selectedIndexPrice: 0,
    });
  }, [basePrice, updateState]);

  return {
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

    budgets,
    lensTypes,
    matchingBrands,
    brandOptions,
    loading,

    globalInputMode,
    isFieldManual,
    toggleFieldMode,
    setGlobalInputMode,

    framePrice,
    calculatedLensPrice,
    grandTotal,
    groupedIndexes,
    selectedLensIndexItem,
    prescriptionWarning,

    canProceed,
    getStepValidationMessage,
    handleNext,
    handleBack,
    handleAddToCart,
    closeWizard,

    setAgeGroup,
    setHasBoughtBefore,
    setPrescriptionMethod,
    updatePrescriptionField,
    selectBudget,
    selectLensType,
    selectBrand,
    selectColor,
    selectCoating,
    selectIndex,
    selectStandardIndex,
  };
}

export default useLandingController;
