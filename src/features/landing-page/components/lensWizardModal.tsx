'use client';

import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useLandingController } from '../util/use-controller-landing';
import { StepCustomerProfile } from './wizard/StepCustomerProfile';
import { StepPrescription } from './wizard/StepPrescription';
import { StepBudget } from './wizard/StepBudget';
import { StepLensType } from './wizard/StepLensType';
import { StepBrand } from './wizard/StepBrand';
import { StepColor } from './wizard/StepColor';
import { StepCoating } from './wizard/StepCoating';
import { StepCatalogIndex } from './wizard/StepCatalogIndex';
import { StepSummary } from './wizard/StepSummary';

export default function LensWizardModal() {
  const controller = useLandingController();

  if (!controller.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-cream-100 border border-cream-300 w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header & Progress Bar */}
        <div className="p-6 border-b border-cream-300 bg-cream-50 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
              Langkah {controller.currentStep} dari 9 — Kalkulator Lensa Optik
            </div>
            <h2 className="font-serif text-xl font-bold text-charcoal-900">
              Desain Lensa Milik Anda
            </h2>
          </div>
          <button
            onClick={controller.closeWizard}
            className="p-2 text-stone-400 hover:text-charcoal-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-cream-200 h-1.5">
          <div
            className="bg-charcoal-900 h-1.5 transition-all duration-300"
            style={{ width: `${(controller.currentStep / 9) * 100}%` }}
          />
        </div>

        {/* Modal Step Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6 text-charcoal-900 text-sm">
          {controller.currentStep === 1 && (
            <StepCustomerProfile
              customerProfile={controller.customerProfile}
              setAgeGroup={controller.setAgeGroup}
              setHasBoughtBefore={controller.setHasBoughtBefore}
            />
          )}

          {controller.currentStep === 2 && (
            <StepPrescription
              prescriptionData={controller.prescriptionData}
              setPrescriptionMethod={controller.setPrescriptionMethod}
              updatePrescriptionField={controller.updatePrescriptionField}
              globalInputMode={controller.globalInputMode}
              setGlobalInputMode={controller.setGlobalInputMode}
              isFieldManual={controller.isFieldManual}
              toggleFieldMode={controller.toggleFieldMode}
            />
          )}

          {controller.currentStep === 3 && (
            <StepBudget
              budgets={controller.budgets}
              selectedBudgetId={controller.selectedBudgetId}
              selectBudget={controller.selectBudget}
            />
          )}

          {controller.currentStep === 4 && (
            <StepLensType
              lensTypes={controller.lensTypes}
              selectedLensTypeId={controller.selectedLensTypeId}
              selectLensType={controller.selectLensType}
            />
          )}

          {controller.currentStep === 5 && (
            <StepBrand
              matchingBrands={controller.matchingBrands}
              selectedBrandId={controller.selectedBrandId}
              loading={controller.loading}
              selectBrand={controller.selectBrand}
            />
          )}

          {controller.currentStep === 6 && (
            <StepColor
              colors={controller.brandOptions.colors}
              selectedColorId={controller.selectedColorId}
              selectColor={controller.selectColor}
            />
          )}

          {controller.currentStep === 7 && (
            <StepCoating
              coatings={controller.brandOptions.coatings}
              selectedCoatingId={controller.selectedCoatingId}
              selectCoating={controller.selectCoating}
            />
          )}

          {controller.currentStep === 8 && (
            <StepCatalogIndex
              selectedBrandName={controller.selectedBrandName}
              selectedLensTypeName={controller.selectedLensTypeName}
              groupedIndexes={controller.groupedIndexes}
              selectedIndexId={controller.selectedIndexId}
              prescriptionData={controller.prescriptionData}
              selectIndex={controller.selectIndex}
              selectStandardIndex={controller.selectStandardIndex}
            />
          )}

          {controller.currentStep === 9 && (
            <StepSummary
              selectedFrame={controller.selectedFrame}
              framePrice={controller.framePrice}
              selectedBrandName={controller.selectedBrandName}
              selectedLensTypeName={controller.selectedLensTypeName}
              selectedLevel={controller.selectedLevel}
              selectedIndexValue={controller.selectedIndexValue}
              selectedColorName={controller.selectedColorName}
              selectedCoatingName={controller.selectedCoatingName}
              calculatedLensPrice={controller.calculatedLensPrice}
              grandTotal={controller.grandTotal}
              prescriptionData={controller.prescriptionData}
              prescriptionWarning={controller.prescriptionWarning}
            />
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 border-t border-cream-300 bg-cream-50 flex items-center justify-between gap-4">
          <button
            onClick={controller.handleBack}
            disabled={controller.currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-sm border border-cream-300 text-xs font-semibold text-stone-700 hover:bg-cream-200 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            {!controller.canProceed() && controller.currentStep < 9 && (
              <span className="text-[11px] text-amber-800 font-medium hidden sm:inline-block">
                {controller.getStepValidationMessage()}
              </span>
            )}

            {controller.currentStep < 9 ? (
              <button
                onClick={controller.handleNext}
                disabled={!controller.canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-charcoal-900 hover:bg-stone-800 disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed text-cream-50 text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
              >
                <span>Lanjut</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={controller.handleAddToCart}
                className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
              >
                <Check className="w-4 h-4" /> Tambahkan ke Keranjang
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}