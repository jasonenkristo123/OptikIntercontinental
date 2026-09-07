import { create } from 'zustand';
import { Frame } from '@/shared/types/database';

interface WizardState {
  isOpen: boolean;
  currentStep: number;
  selectedFrame: Frame | null;
  
  customerProfile: { ageGroup: string; hasBoughtBefore: boolean | null };
  prescriptionData: { method: 'EXACT' | 'APPROXIMATE' | 'IN_STORE_EXAM'; sphRight: number; sphLeft: number; cylRight: number; cylLeft: number; axisRight: number; axisLeft: number; pd: number; addition: number; approximateRange: string };
  selectedBudgetId: string;
  selectedLensTypeId: string;
  selectedBrandId: string;
  selectedBrandName: string;
  selectedLensTypeName: string;
  selectedIndexId: string;
  selectedIndexValue: string;
  selectedIndexPrice: number;
  selectedColorId: string;
  selectedColorName: string;
  selectedColorPrice: number;
  selectedCoatingId: string;
  selectedCoatingName: string;
  selectedCoatingPrice: number;
  basePrice: number;
  selectedLevel: string;
  selectedLensPrice: number;

  openWizard: (frame?: Frame, initialStep?: number) => void;
  closeWizard: () => void;
  setStep: (step: number) => void;
  updateState: (data: Partial<WizardState>) => void;
  resetWizard: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  isOpen: false,
  currentStep: 1,
  selectedFrame: null,

  customerProfile: { ageGroup: '', hasBoughtBefore: null },
  prescriptionData: { method: 'EXACT', sphRight: 0, sphLeft: 0, cylRight: 0, cylLeft: 0, axisRight: 0, axisLeft: 0, pd: 60, addition: 0, approximateRange: '' },
  selectedBudgetId: '',
  selectedLensTypeId: '',
  selectedBrandId: '',
  selectedBrandName: '',
  selectedLensTypeName: '',
  selectedIndexId: '',
  selectedIndexValue: '',
  selectedIndexPrice: 0,
  selectedColorId: '',
  selectedColorName: '',
  selectedColorPrice: 0,
  selectedCoatingId: '',
  selectedCoatingName: '',
  selectedCoatingPrice: 0,
  basePrice: 0,
  selectedLevel: '',
  selectedLensPrice: 0,

  openWizard: (frame, initialStep = 1) =>
    set({
      isOpen: true,
      selectedFrame: frame || null,
      currentStep: initialStep,
    }),

  closeWizard: () => set({ isOpen: false }),
  setStep: (step) => set({ currentStep: step }),
  updateState: (data) => set((state) => ({ ...state, ...data })),
  resetWizard: () =>
    set({
      currentStep: 1,
      selectedFrame: null,
      customerProfile: { ageGroup: '', hasBoughtBefore: null },
      selectedBudgetId: '',
      selectedLensTypeId: '',
      selectedBrandId: '',
      selectedBrandName: '',
      selectedLensTypeName: '',
      selectedIndexId: '',
      selectedIndexValue: '',
      selectedIndexPrice: 0,
      selectedColorId: '',
      selectedColorName: '',
      selectedColorPrice: 0,
      selectedCoatingId: '',
      selectedCoatingName: '',
      selectedCoatingPrice: 0,
      basePrice: 0,
      selectedLevel: '',
      selectedLensPrice: 0,
    }),
}));