'use client';

import { useState, useEffect } from 'react';
import type { PrescriptionSelectFieldProps, AxisSelectFieldProps } from '../../type';
import { AXIS_OPTIONS, AXIS_PRESETS } from '../../util/prescription-helpers';

export function PrescriptionSelectField({
  id,
  label,
  value,
  onChange,
  options,
  isManual,
  onToggleMode,
  step = 0.25,
  placeholder = 'Contoh: -16.50',
  helperText,
}: PrescriptionSelectFieldProps) {
  const numericVal = value ?? 0;
  const [localText, setLocalText] = useState<string>(String(numericVal));

  useEffect(() => {
    setLocalText((prev) => {
      if (parseFloat(prev) !== numericVal) {
        return String(numericVal);
      }
      return prev;
    });
  }, [numericVal]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalText(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    const parsed = parseFloat(localText);
    if (isNaN(parsed)) {
      setLocalText('0');
      onChange(0);
    } else {
      const rounded = Math.round(parsed * 100) / 100;
      setLocalText(String(rounded));
      onChange(rounded);
    }
  };

  const isValueInOptions = options.some((opt) => Math.abs(opt.value - numericVal) < 0.001);
  const groups = Array.from(new Set(options.map((o) => o.group || 'Pilihan')));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-stone-600 font-medium text-[11px]">
          {label}
        </label>
        <button
          type="button"
          onClick={onToggleMode}
          className="text-[10px] text-stone-500 hover:text-charcoal-900 transition underline underline-offset-2 flex items-center gap-0.5 cursor-pointer"
          title={isManual ? 'Ganti ke pilihan dropdown' : 'Ganti ke ketik manual'}
        >
          {isManual ? '📋 Dropdown' : '✏️ Ketik'}
        </button>
      </div>

      {isManual ? (
        <div className="relative">
          <input
            id={id}
            type="number"
            step={step}
            value={localText}
            onChange={handleTextChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-full border border-cream-300 rounded px-2.5 py-1.5 bg-cream-50/50 text-charcoal-900 font-mono text-xs focus:ring-1 focus:ring-charcoal-900 focus:border-charcoal-900 outline-none transition"
          />
          {Math.abs(numericVal) > 15 && (
            <span className="absolute right-2 top-1.5 text-[9px] font-sans font-medium text-amber-800 bg-amber-100 px-1 py-0.5 rounded">
              &gt; ±15.00
            </span>
          )}
        </div>
      ) : (
        <select
          id={id}
          value={isValueInOptions ? numericVal : '__CUSTOM__'}
          onChange={(e) => {
            if (e.target.value === '__MANUAL__') {
              onToggleMode();
            } else if (e.target.value === '__CUSTOM__') {
              // keep current value
            } else {
              onChange(Number(e.target.value));
            }
          }}
          className="w-full border border-cream-300 rounded px-2 py-1.5 bg-white text-charcoal-900 font-mono text-xs focus:ring-1 focus:ring-charcoal-900 focus:border-charcoal-900 outline-none transition cursor-pointer"
        >
          {!isValueInOptions && (
            <option value="__CUSTOM__">
              Nilai Khusus ({numericVal > 0 ? `+${numericVal.toFixed(2)}` : numericVal.toFixed(2)})
            </option>
          )}
          {groups.map((group) => (
            <optgroup key={group} label={group}>
              {options
                .filter((o) => (o.group || 'Pilihan') === group)
                .map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
            </optgroup>
          ))}
          <optgroup label="Lainnya">
            <option value="__MANUAL__">✏️ Ketik Manual (&gt; ±15.00)...</option>
          </optgroup>
        </select>
      )}

      {helperText && <p className="text-[10px] text-stone-400">{helperText}</p>}
    </div>
  );
}

export function AxisSelectField({
  id,
  label = 'Axis (°)',
  value,
  onChange,
  isManual,
  onToggleMode,
  cylValue = 0,
}: AxisSelectFieldProps) {
  const numericVal = value ?? 0;
  const [localText, setLocalText] = useState<string>(String(numericVal));

  useEffect(() => {
    setLocalText((prev) => {
      if (prev === '' && numericVal === 0) return prev;
      if (parseInt(prev, 10) !== numericVal) {
        return String(numericVal);
      }
      return prev;
    });
  }, [numericVal]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalText(raw);
    if (raw === '') return;
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(0, Math.min(180, parsed));
      onChange(clamped);
    }
  };

  const handleBlur = () => {
    const parsed = parseInt(localText, 10);
    if (isNaN(parsed)) {
      setLocalText('0');
      onChange(0);
    } else {
      const clamped = Math.max(0, Math.min(180, parsed));
      setLocalText(String(clamped));
      onChange(clamped);
    }
  };

  const isValueInOptions = AXIS_OPTIONS.some((opt) => opt.value === numericVal);
  const groups = Array.from(new Set(AXIS_OPTIONS.map((o) => o.group)));
  const isOutOfRange = localText !== '' && (parseInt(localText, 10) < 0 || parseInt(localText, 10) > 180);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-stone-600 font-medium text-[11px]">
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-[10px] text-stone-500 hover:text-charcoal-900 transition underline underline-offset-2 flex items-center gap-0.5 cursor-pointer"
            title={isManual ? 'Ganti ke pilihan dropdown' : 'Ganti ke ketik manual'}
          >
            {isManual ? '📋 Dropdown' : '✏️ Ketik'}
          </button>
        </div>
      </div>

      {isManual ? (
        <div className="relative">
          <input
            id={id}
            type="number"
            min={0}
            max={180}
            step={1}
            value={localText}
            onChange={handleTextChange}
            onBlur={handleBlur}
            list={`${id}-datalist`}
            placeholder="0 - 180"
            className="w-full border border-cream-300 rounded px-2.5 py-1.5 bg-cream-50/50 text-charcoal-900 font-mono text-xs focus:ring-1 focus:ring-charcoal-900 focus:border-charcoal-900 outline-none transition"
          />
          <datalist id={`${id}-datalist`}>
            {AXIS_PRESETS.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
          {isOutOfRange && (
            <span className="absolute right-2 top-1.5 text-[9px] font-sans font-medium text-rose-700 bg-rose-50 px-1 py-0.5 rounded border border-rose-200">
              0° - 180°
            </span>
          )}
        </div>
      ) : (
        <select
          id={id}
          value={isValueInOptions ? numericVal : '__CUSTOM__'}
          onChange={(e) => {
            if (e.target.value === '__MANUAL__') {
              onToggleMode();
            } else if (e.target.value === '__CUSTOM__') {
              // keep current value
            } else {
              onChange(Number(e.target.value));
            }
          }}
          className="w-full border border-cream-300 rounded px-2 py-1.5 bg-white text-charcoal-900 font-mono text-xs focus:ring-1 focus:ring-charcoal-900 focus:border-charcoal-900 outline-none transition cursor-pointer"
        >
          {!isValueInOptions && (
            <option value="__CUSTOM__">
              Nilai Khusus ({numericVal}°)
            </option>
          )}
          {groups.map((group) => (
            <optgroup key={group} label={group}>
              {AXIS_OPTIONS.filter((o) => o.group === group).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ))}
          <optgroup label="Lainnya">
            <option value="__MANUAL__">✏️ Ketik Manual (0° - 180°)...</option>
          </optgroup>
        </select>
      )}

      {/* Quick Presets Bar */}
      <div className="flex items-center gap-1 pt-0.5 flex-wrap">
        <span className="text-[9px] text-stone-400 font-sans mr-0.5">Pilih cepat:</span>
        {AXIS_PRESETS.map((preset) => {
          const isSelected = numericVal === preset;
          return (
            <button
              key={preset}
              type="button"
              onClick={() => {
                onChange(preset);
                setLocalText(String(preset));
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition cursor-pointer border ${
                isSelected
                  ? 'bg-charcoal-900 text-cream-50 border-charcoal-900 font-semibold shadow-xs'
                  : 'bg-white text-stone-600 border-cream-200 hover:border-cream-300 hover:bg-cream-100'
              }`}
              title={`Aksis ${preset}°`}
            >
              {preset}°
            </button>
          );
        })}
      </div>
    </div>
  );
}
