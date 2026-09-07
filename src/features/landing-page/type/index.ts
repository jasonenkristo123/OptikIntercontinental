import type {
  BudgetRange,
  LensType,
  LensBrand,
  BrandLensIndex,
  BrandLensColor,
  BrandLensCoating,
  PrescriptionData,
  Frame,
} from '@/shared/types/database';

export interface WizardCustomerProfile {
  ageGroup: string;
  hasBoughtBefore: boolean | null;
}

export interface WizardBrand {
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

export interface BrandMatrixOptions {
  indexes: BrandLensIndex[];
  colors: BrandLensColor[];
  coatings: BrandLensCoating[];
}

export interface PrescriptionCompatibilityResult {
  isCompatible: boolean;
  reason?: string;
}

export interface PrescriptionOption {
  value: number;
  label: string;
  group?: string;
}

export type FieldInputMode = 'select' | 'manual';

export interface PrescriptionSelectFieldProps {
  id: string;
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
  options: PrescriptionOption[];
  isManual: boolean;
  onToggleMode: () => void;
  step?: number;
  placeholder?: string;
  helperText?: string;
}

export interface AxisSelectFieldProps {
  id: string;
  label?: string;
  value: number | undefined;
  onChange: (value: number) => void;
  isManual: boolean;
  onToggleMode: () => void;
  cylValue?: number;
}

export interface LensWizardController {
  // Wizard Store state
  isOpen: boolean;
  currentStep: number;
  selectedFrame: Frame | null;
  customerProfile: WizardCustomerProfile;
  prescriptionData: PrescriptionData;
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

  // Local/Async States
  budgets: BudgetRange[];
  lensTypes: LensType[];
  matchingBrands: WizardBrand[];
  brandOptions: BrandMatrixOptions;
  loading: boolean;

  // Prescription Input Mode States
  globalInputMode: FieldInputMode;
  isFieldManual: (fieldKey: string) => boolean;
  toggleFieldMode: (fieldKey: string) => void;
  setGlobalInputMode: (mode: FieldInputMode) => void;

  // Pricing & Computations
  framePrice: number;
  calculatedLensPrice: number;
  grandTotal: number;
  groupedIndexes: Record<string, BrandLensIndex[]>;
  selectedLensIndexItem?: BrandLensIndex;
  prescriptionWarning?: PrescriptionCompatibilityResult;

  // Navigation & Validation
  canProceed: () => boolean;
  getStepValidationMessage: () => string;
  handleNext: () => void;
  handleBack: () => void;
  handleAddToCart: () => void;
  closeWizard: () => void;

  // Selection Action Handlers
  setAgeGroup: (age: string) => void;
  setHasBoughtBefore: (val: boolean) => void;
  setPrescriptionMethod: (method: PrescriptionData['method']) => void;
  updatePrescriptionField: (field: keyof PrescriptionData, value: number | string | undefined) => void;
  selectBudget: (budgetId: string) => void;
  selectLensType: (typeId: string, typeName: string) => void;
  selectBrand: (brand: WizardBrand) => void;
  selectColor: (color: BrandLensColor) => void;
  selectCoating: (coating: BrandLensCoating) => void;
  selectIndex: (index: BrandLensIndex, levelName: string) => void;
  selectStandardIndex: () => void;
}
