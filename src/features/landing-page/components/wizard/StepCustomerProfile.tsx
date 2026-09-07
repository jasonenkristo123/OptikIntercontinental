'use client';

import type { WizardCustomerProfile } from '../../type';

interface StepCustomerProfileProps {
  customerProfile: WizardCustomerProfile;
  setAgeGroup: (age: string) => void;
  setHasBoughtBefore: (val: boolean) => void;
}

const AGE_GROUPS = ['0 - 18', '18 - 40', '40 - 100'];
const BOUGHT_BEFORE_OPTIONS = [
  { label: 'Ya', val: true },
  { label: 'Tidak', val: false },
];

export function StepCustomerProfile({
  customerProfile,
  setAgeGroup,
  setHasBoughtBefore,
}: StepCustomerProfileProps) {
  return (
    <div className="space-y-5">
      <h3 className="font-serif font-bold text-lg md:text-3xl">Deskripsi Pembeli</h3>
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-2">
          Pilih Kelompok Usia:
        </label>
        <div className="grid grid-cols-3 gap-3">
          {AGE_GROUPS.map((age) => (
            <button
              key={age}
              onClick={() => setAgeGroup(age)}
              className={`py-3 rounded-sm border text-xs font-medium transition ${
                customerProfile.ageGroup === age
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
        <label className="block text-xs font-semibold text-stone-600 mb-2">
          Apakah Anda pernah membeli kacamata?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {BOUGHT_BEFORE_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setHasBoughtBefore(opt.val)}
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
  );
}
