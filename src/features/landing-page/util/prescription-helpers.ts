import type { BrandLensIndex, PrescriptionData } from '@/shared/types/database';
import type { PrescriptionOption, PrescriptionCompatibilityResult } from '../type';

export function checkPrescriptionCompatibility(
  rx: PrescriptionData,
  lens: BrandLensIndex
): PrescriptionCompatibilityResult {
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
    return {
      isCompatible: false,
      reason: `Mata Kanan SPH (${sphR > 0 ? '+' : ''}${sphR}) di luar batas (${minSph} s/d +${maxSph})`,
    };
  }
  if (sphL < minSph || sphL > maxSph) {
    return {
      isCompatible: false,
      reason: `Mata Kiri SPH (${sphL > 0 ? '+' : ''}${sphL}) di luar batas (${minSph} s/d +${maxSph})`,
    };
  }

  // Check CYL: cyl is negative, so |cyl| <= |maxCyl|
  if (Math.abs(cylR) > Math.abs(maxCyl)) {
    return {
      isCompatible: false,
      reason: `Silinder Kanan (${cylR}) melebihi batas (maks ${maxCyl})`,
    };
  }
  if (Math.abs(cylL) > Math.abs(maxCyl)) {
    return {
      isCompatible: false,
      reason: `Silinder Kiri (${cylL}) melebihi batas (maks ${maxCyl})`,
    };
  }

  // Check ADD if present
  if (add > 0) {
    if (add < minAdd || add > maxAdd) {
      return {
        isCompatible: false,
        reason: `ADD (+${add}) di luar rentang (+${minAdd} s/d +${maxAdd})`,
      };
    }
  }

  // Check Combined S + C
  const scR = sphR + (cylR < 0 ? cylR : -cylR);
  const scL = sphL + (cylL < 0 ? cylL : -cylL);
  const limitSc = Math.abs(maxSc);

  if (Math.abs(scR) > limitSc) {
    return {
      isCompatible: false,
      reason: `Kombinasi S+C Kanan (${scR.toFixed(2)}) melebihi batas (${maxSc})`,
    };
  }
  if (Math.abs(scL) > limitSc) {
    return {
      isCompatible: false,
      reason: `Kombinasi S+C Kiri (${scL.toFixed(2)}) melebihi batas (${maxSc})`,
    };
  }

  return { isCompatible: true };
}

// Generate SPH options: 0.00, -0.25 to -15.00, +0.25 to +15.00
export function generateSphOptions(): PrescriptionOption[] {
  const neutral: PrescriptionOption[] = [{ value: 0, label: '0.00 (Plano / Netral)', group: 'Netral (0.00)' }];

  const minus: PrescriptionOption[] = [];
  for (let i = 0.25; i <= 15.01; i += 0.25) {
    const val = -Math.round(i * 100) / 100;
    minus.push({ value: val, label: `${val.toFixed(2)}`, group: 'Minus (-0.25 s/d -15.00)' });
  }

  const plus: PrescriptionOption[] = [];
  for (let i = 0.25; i <= 15.01; i += 0.25) {
    const val = Math.round(i * 100) / 100;
    plus.push({ value: val, label: `+${val.toFixed(2)}`, group: 'Plus (+0.25 s/d +15.00)' });
  }

  return [...neutral, ...minus, ...plus];
}

// Generate CYL options: 0.00, -0.25 to -10.00, +0.25 to +4.00
export function generateCylOptions(): PrescriptionOption[] {
  const neutral: PrescriptionOption[] = [{ value: 0, label: '0.00 (Tanpa Silinder)', group: 'Netral (0.00)' }];

  const minus: PrescriptionOption[] = [];
  for (let i = 0.25; i <= 10.01; i += 0.25) {
    const val = -Math.round(i * 100) / 100;
    minus.push({ value: val, label: `${val.toFixed(2)}`, group: 'Minus Silinder (-)' });
  }

  const plus: PrescriptionOption[] = [];
  for (let i = 0.25; i <= 4.01; i += 0.25) {
    const val = Math.round(i * 100) / 100;
    plus.push({ value: val, label: `+${val.toFixed(2)}`, group: 'Plus Silinder (+)' });
  }

  return [...neutral, ...minus, ...plus];
}

// Generate ADD options: 0.00, +0.75 to +4.00
export function generateAddOptions(): PrescriptionOption[] {
  const none: PrescriptionOption[] = [{ value: 0, label: '0.00 (Tanpa ADD)', group: 'Netral (0.00)' }];

  const plus: PrescriptionOption[] = [];
  for (let i = 0.75; i <= 4.01; i += 0.25) {
    const val = Math.round(i * 100) / 100;
    plus.push({ value: val, label: `+${val.toFixed(2)}`, group: 'Addition (+)' });
  }

  return [...none, ...plus];
}

// Generate Axis options: 0° to 180° grouped by quadrants/orientation
export function generateAxisOptions(): PrescriptionOption[] {
  const options: PrescriptionOption[] = [
    { value: 0, label: '0° (Tanpa Aksis / Netral)', group: 'Netral (0°)' },
  ];

  for (let i = 1; i <= 45; i++) {
    options.push({
      value: i,
      label: i === 45 ? '45° (Diagonal)' : `${i}°`,
      group: '1° - 45°',
    });
  }

  for (let i = 46; i <= 90; i++) {
    options.push({
      value: i,
      label: i === 90 ? '90° (Vertikal)' : `${i}°`,
      group: '46° - 90°',
    });
  }

  for (let i = 91; i <= 135; i++) {
    options.push({
      value: i,
      label: i === 135 ? '135° (Diagonal)' : `${i}°`,
      group: '91° - 135°',
    });
  }

  for (let i = 136; i <= 180; i++) {
    options.push({
      value: i,
      label: i === 180 ? '180° (Horizontal)' : `${i}°`,
      group: '136° - 180°',
    });
  }

  return options;
}

export const SPH_OPTIONS = generateSphOptions();
export const CYL_OPTIONS = generateCylOptions();
export const ADD_OPTIONS = generateAddOptions();
export const AXIS_OPTIONS = generateAxisOptions();
export const AXIS_PRESETS = [0, 45, 90, 135, 180];

export function formatDiopter(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val) || val === 0) {
    return '0.00';
  }
  return val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
}
