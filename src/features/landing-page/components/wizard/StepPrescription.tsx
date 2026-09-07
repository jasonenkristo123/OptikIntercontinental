'use client';

import type { PrescriptionData } from '@/shared/types/database';
import type { FieldInputMode } from '../../type';
import { SPH_OPTIONS, CYL_OPTIONS, ADD_OPTIONS } from '../../util/prescription-helpers';
import { PrescriptionSelectField, AxisSelectField } from './PrescriptionFields';

interface StepPrescriptionProps {
  prescriptionData: PrescriptionData;
  setPrescriptionMethod: (method: PrescriptionData['method']) => void;
  updatePrescriptionField: (field: keyof PrescriptionData, value: number | string | undefined) => void;
  globalInputMode: FieldInputMode;
  setGlobalInputMode: (mode: FieldInputMode) => void;
  isFieldManual: (fieldKey: string) => boolean;
  toggleFieldMode: (fieldKey: string) => void;
}

const METHODS: Array<{ id: PrescriptionData['method']; label: string }> = [
  { id: 'EXACT', label: 'Resep Tepat' },
  { id: 'IN_STORE_EXAM', label: 'Pemeriksaan Gratis di Toko' },
];

export function StepPrescription({
  prescriptionData,
  setPrescriptionMethod,
  updatePrescriptionField,
  globalInputMode,
  setGlobalInputMode,
  isFieldManual,
  toggleFieldMode,
}: StepPrescriptionProps) {
  return (
    <div className="space-y-5">
      <h3 className="font-serif font-bold text-lg md:text-3xl">Ukuran Mata</h3>
      <div className="flex gap-2 border-b border-cream-300 pb-3">
        {METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setPrescriptionMethod(m.id)}
            className={`px-3 py-1.5 rounded-sm text-md font-medium transition ${
              prescriptionData.method === m.id
                ? 'bg-charcoal-900 text-cream-50'
                : 'bg-cream-200 text-stone-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {prescriptionData.method === 'EXACT' && (
        <div className="space-y-4 bg-white p-4 rounded-sm border border-cream-300 font-mono text-xs">
          {/* Mode Selector Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-cream-200">
            <div>
              <span className="font-sans font-medium text-stone-700 text-xs">Mode Input Resep</span>
              <p className="font-sans text-[11px] text-stone-400">
                Pilih dari dropdown (±15.00) atau ketik manual
              </p>
            </div>
            <div className="inline-flex rounded border border-cream-300 bg-cream-100 p-0.5 text-[11px] font-sans">
              <button
                type="button"
                onClick={() => setGlobalInputMode('select')}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                  globalInputMode === 'select'
                    ? 'bg-charcoal-900 text-cream-50 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                📋 Dropdown
              </button>
              <button
                type="button"
                onClick={() => setGlobalInputMode('manual')}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                  globalInputMode === 'manual'
                    ? 'bg-charcoal-900 text-cream-50 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                ✏️ Ketik Manual
              </button>
            </div>
          </div>

          {/* Mata Kanan (OD) */}
          <div>
            <p className="text-stone-400 uppercase tracking-widest text-[10px] font-semibold mb-2">
              Mata Kanan (OD)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <PrescriptionSelectField
                id="sphRight"
                label="SPH"
                value={prescriptionData.sphRight}
                onChange={(val) => updatePrescriptionField('sphRight', val)}
                options={SPH_OPTIONS}
                isManual={isFieldManual('sphRight')}
                onToggleMode={() => toggleFieldMode('sphRight')}
                placeholder="-16.00 / +16.00"
              />
              <PrescriptionSelectField
                id="cylRight"
                label="Cylinder"
                value={prescriptionData.cylRight}
                onChange={(val) => updatePrescriptionField('cylRight', val)}
                options={CYL_OPTIONS}
                isManual={isFieldManual('cylRight')}
                onToggleMode={() => toggleFieldMode('cylRight')}
                placeholder="-0.75"
              />
              <AxisSelectField
                id="axisRight"
                label="Axis (°)"
                value={prescriptionData.axisRight}
                onChange={(val) => updatePrescriptionField('axisRight', val)}
                isManual={isFieldManual('axisRight')}
                onToggleMode={() => toggleFieldMode('axisRight')}
                cylValue={prescriptionData.cylRight}
              />
            </div>
          </div>

          <div className="border-t border-cream-200" />

          {/* Mata Kiri (OS) */}
          <div>
            <p className="text-stone-400 uppercase tracking-widest text-[10px] font-semibold mb-2">
              Mata Kiri (OS)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <PrescriptionSelectField
                id="sphLeft"
                label="SPH"
                value={prescriptionData.sphLeft}
                onChange={(val) => updatePrescriptionField('sphLeft', val)}
                options={SPH_OPTIONS}
                isManual={isFieldManual('sphLeft')}
                onToggleMode={() => toggleFieldMode('sphLeft')}
                placeholder="-16.00 / +16.00"
              />
              <PrescriptionSelectField
                id="cylLeft"
                label="Cylinder"
                value={prescriptionData.cylLeft}
                onChange={(val) => updatePrescriptionField('cylLeft', val)}
                options={CYL_OPTIONS}
                isManual={isFieldManual('cylLeft')}
                onToggleMode={() => toggleFieldMode('cylLeft')}
                placeholder="-0.75"
              />
              <AxisSelectField
                id="axisLeft"
                label="Axis (°)"
                value={prescriptionData.axisLeft}
                onChange={(val) => updatePrescriptionField('axisLeft', val)}
                isManual={isFieldManual('axisLeft')}
                onToggleMode={() => toggleFieldMode('axisLeft')}
                cylValue={prescriptionData.cylLeft}
              />
            </div>
          </div>

          <div className="border-t border-cream-200" />

          {/* Pupil Distance & Addition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="pd" className="block text-stone-600 font-medium text-[11px]">
                  Pupil Distance (PD)
                </label>
                <span className="text-[10px] text-stone-400">mm (40 - 80)</span>
              </div>
              <input
                id="pd"
                type="number"
                step="0.5"
                min="40"
                max="80"
                value={prescriptionData.pd ?? ''}
                onChange={(e) =>
                  updatePrescriptionField(
                    'pd',
                    e.target.value === '' ? undefined : Number(e.target.value)
                  )
                }
                placeholder="Contoh: 62"
                className="w-full border border-cream-300 rounded px-2.5 py-1.5 bg-white text-charcoal-900 font-mono text-xs focus:ring-1 focus:ring-charcoal-900 focus:border-charcoal-900 outline-none transition"
              />
            </div>
            <PrescriptionSelectField
              id="addition"
              label="Addition (ADD)"
              value={prescriptionData.addition}
              onChange={(val) => updatePrescriptionField('addition', val)}
              options={ADD_OPTIONS}
              isManual={isFieldManual('addition')}
              onToggleMode={() => toggleFieldMode('addition')}
              placeholder="+1.75"
              helperText="Opsional, untuk lensa baca / progresif"
            />
          </div>

          <div className="flex items-start gap-1.5 text-[11px] text-stone-500 bg-cream-50 p-2.5 rounded border border-cream-200 font-sans">
            <span className="text-amber-700 font-bold">💡</span>
            <span>
              Pilihan dropdown mencakup ukuran SPH/CYL (±15.00) dan Axis (0°–180°). Anda juga dapat
              beralih ke <strong>Ketik Manual</strong> atau menggunakan tombol{' '}
              <strong>Pilih cepat</strong> (0°, 45°, 90°, 135°, 180°) untuk kemudahan input.
            </span>
          </div>
        </div>
      )}

      {prescriptionData.method === 'IN_STORE_EXAM' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm text-xs text-amber-900 space-y-1">
          <div className="font-bold">Termasuk Pemeriksaan Gratis di Toko</div>
          <p>
            Anda dapat mengunjungi toko Optik Intercontinental setelah checkout untuk memeriksakan
            mata Anda oleh ahli kacamata bersertifikat kami secara gratis.
          </p>
        </div>
      )}
    </div>
  );
}
