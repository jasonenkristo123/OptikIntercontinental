'use client';

import type { Frame, PrescriptionData } from '@/shared/types/database';
import type { PrescriptionCompatibilityResult } from '../../type';
import { formatDiopter } from '../../util/prescription-helpers';

interface StepSummaryProps {
  selectedFrame: Frame | null;
  framePrice: number;
  selectedBrandName: string;
  selectedLensTypeName: string;
  selectedLevel: string;
  selectedIndexValue: string;
  selectedColorName: string;
  selectedCoatingName: string;
  calculatedLensPrice: number;
  grandTotal: number;
  prescriptionData: PrescriptionData;
  prescriptionWarning?: PrescriptionCompatibilityResult;
}

export function StepSummary({
  selectedFrame,
  framePrice,
  selectedBrandName,
  selectedLensTypeName,
  selectedLevel,
  selectedIndexValue,
  selectedColorName,
  selectedCoatingName,
  calculatedLensPrice,
  grandTotal,
  prescriptionData,
  prescriptionWarning,
}: StepSummaryProps) {
  return (
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
              <div className="text-[10px] text-stone-500">
                Koleksi Original Optik Intercontinental
              </div>
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
                <div>
                  • Level Desain: <strong>{selectedLevel}</strong>
                </div>
              )}
              <div>
                • Indeks Ketebalan: <strong>Index {selectedIndexValue || '1.50'}</strong>
              </div>
              {selectedColorName && (
                <div>
                  • Fitur Warna: <strong>{selectedColorName}</strong>
                </div>
              )}
              {selectedCoatingName && (
                <div>
                  • Lapisan Proteksi: <strong>{selectedCoatingName}</strong>
                </div>
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
            <div className="text-emerald-700 font-medium">
              ✓ Pemeriksaan Gratis di Toko Optik Intercontinental
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[10px]">
              <div>
                OD (Kanan): SPH {formatDiopter(prescriptionData.sphRight)} | CYL{' '}
                {formatDiopter(prescriptionData.cylRight)} | AXIS {prescriptionData.axisRight ?? 0}°
              </div>
              <div>
                OS (Kiri): SPH {formatDiopter(prescriptionData.sphLeft)} | CYL{' '}
                {formatDiopter(prescriptionData.cylLeft)} | AXIS {prescriptionData.axisLeft ?? 0}°
              </div>
              {prescriptionData.addition ? (
                <div>ADD: {formatDiopter(prescriptionData.addition)}</div>
              ) : null}
              {prescriptionData.pd ? <div>PD: {prescriptionData.pd} mm</div> : null}
            </div>
          )}
        </div>

        {/* Warning Banner */}
        {prescriptionWarning && (
          <div className="flex gap-3 bg-amber-50 border border-amber-300 rounded p-3 text-[11px]">
            <span className="text-amber-500 text-base leading-none shrink-0 mt-0.5">⚠️</span>
            <div className="space-y-1">
              <p className="font-semibold text-amber-800">
                Peringatan: Lensa Dipilih Tidak Sesuai Resep Anda
              </p>
              <p className="text-amber-700 leading-relaxed">
                {prescriptionWarning.reason || 'Indeks lensa yang dipilih melebihi batas resep mata Anda.'}
              </p>
              <p className="text-amber-600 font-medium">
                Tim optisi kami akan menghubungi Anda untuk konfirmasi sebelum proses pengerjaan
                dimulai.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center font-bold text-base text-charcoal-900 border-t border-cream-200 pt-3">
          <span>Total Keseluruhan:</span>
          <span className="font-mono text-lg text-emerald-800">
            Rp {grandTotal.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
}
