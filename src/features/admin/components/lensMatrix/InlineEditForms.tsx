'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { BrandLensType, BrandLensIndex, BrandLensColor, BrandLensCoating } from '@/shared/types/database';

// ---------------------------------------------------------------------------
// InlineEditLensType
// ---------------------------------------------------------------------------

type InlineEditLensTypeProps = {
  item: BrandLensType & { lens_type: { id: string; name: string } };
  onSave: (id: string, basePrice: number) => Promise<void>;
  onCancel: () => void;
};

export function InlineEditLensType({ item, onSave, onCancel }: InlineEditLensTypeProps) {
  const [price, setPrice] = useState(item.base_price);
  const [saving, setSaving] = useState(false);

  return (
    <div className="bg-stone-100 border border-stone-300 rounded-md p-3 text-xs space-y-2">
      <div className="font-medium text-charcoal-900">{item.lens_type?.name}</div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="flex-1 bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900"
          placeholder="Harga Dasar (Rp)"
        />
        <button
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            await onSave(item.id, price);
            setSaving(false);
          }}
          className="p-1.5 rounded bg-charcoal-900 text-cream-50 hover:bg-stone-800 transition disabled:opacity-50"
          aria-label="Save"
        >
          <Check className="w-3 h-3" />
        </button>
        <button
          onClick={onCancel}
          className="p-1.5 rounded bg-cream-200 text-stone-500 hover:bg-cream-300 transition"
          aria-label="Cancel"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// InlineEditIndex
// ---------------------------------------------------------------------------

type InlineEditIndexProps = {
  item: BrandLensIndex;
  lensTypes: { id: string; name: string }[];
  colors: BrandLensColor[];
  coatings: BrandLensCoating[];
  onSave: (
    id: string,
    payload: {
      index_value?: string;
      price?: number;
      price_adder?: number;
      description?: string;
      color_id?: string | null;
      coating_id?: string | null;
      lens_type_id?: string | null;
      lens_level?: string;
      min_sph?: number;
      max_sph?: number;
      max_cyl?: number;
      min_add?: number;
      max_add?: number;
      max_s_c?: number;
    }
  ) => Promise<void>;
  onCancel: () => void;
};

export function InlineEditIndex({ item, lensTypes, colors, coatings, onSave, onCancel }: InlineEditIndexProps) {
  const [lensTypeId, setLensTypeId] = useState(item.lens_type_id || '');
  const [level, setLevel] = useState(item.lens_level || 'Standard');
  const [indexVal, setIndexVal] = useState(item.index_value);
  const [price, setPrice] = useState(item.price ?? item.price_adder ?? 0);
  const [minSph, setMinSph] = useState(item.min_sph ?? -8.0);
  const [maxSph, setMaxSph] = useState(item.max_sph ?? 5.5);
  const [maxCyl, setMaxCyl] = useState(item.max_cyl ?? -4.0);
  const [minAdd, setMinAdd] = useState(item.min_add ?? 0.75);
  const [maxAdd, setMaxAdd] = useState(item.max_add ?? 3.5);
  const [maxSc, setMaxSc] = useState(item.max_s_c ?? -8.0);
  const [desc, setDesc] = useState(item.description || '');
  const [colorId, setColorId] = useState<string>(item.color_id || '');
  const [coatingId, setCoatingId] = useState<string>(item.coating_id || '');
  const [saving, setSaving] = useState(false);

  return (
    <div className="bg-stone-100 border border-stone-300 rounded-md p-3 text-xs space-y-2.5 col-span-full">
      <div className="font-semibold text-charcoal-900 flex items-center justify-between border-b pb-1">
        <span>Edit Katalog Lensa ({item.index_value})</span>
        <span className="text-[10px] text-stone-500 font-mono">ID: {item.id.slice(0, 8)}...</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>
          <label className="text-[10px] text-stone-500 block mb-0.5">Tipe Lensa</label>
          <select
            value={lensTypeId}
            onChange={(e) => setLensTypeId(e.target.value)}
            className="w-full bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900 text-xs"
          >
            <option value="">-- Pilih Tipe --</option>
            {lensTypes.map((lt) => (
              <option key={lt.id} value={lt.id}>{lt.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] text-stone-500 block mb-0.5">Level / Seri</label>
          <input
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900 text-xs"
            placeholder="Misal: Start, Advance, Comfy Pro"
          />
        </div>

        <div>
          <label className="text-[10px] text-stone-500 block mb-0.5">Index</label>
          <input
            value={indexVal}
            onChange={(e) => setIndexVal(e.target.value)}
            className="w-full bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900 text-xs"
            placeholder="1.50, 1.60..."
          />
        </div>

        <div>
          <label className="text-[10px] text-stone-500 block mb-0.5">Harga Paket (Rp)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900 font-bold text-xs"
            placeholder="Harga Paket (Rp)"
          />
        </div>
      </div>

      {/* Grid Batas Resep (Rx Grid) */}
      <div className="bg-cream-50 border border-cream-200 rounded p-2 space-y-1.5">
        <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
          Batas Ukuran Resep (Optical Power Grid)
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <div>
            <label className="text-[9px] text-stone-500 block">Min Sph</label>
            <input
              type="number"
              step="0.25"
              value={minSph}
              onChange={(e) => setMinSph(Number(e.target.value))}
              className="w-full bg-white border border-cream-300 rounded px-1.5 py-1 text-xs"
            />
          </div>
          <div>
            <label className="text-[9px] text-stone-500 block">Max Sph</label>
            <input
              type="number"
              step="0.25"
              value={maxSph}
              onChange={(e) => setMaxSph(Number(e.target.value))}
              className="w-full bg-white border border-cream-300 rounded px-1.5 py-1 text-xs"
            />
          </div>
          <div>
            <label className="text-[9px] text-stone-500 block">Max Cyl</label>
            <input
              type="number"
              step="0.25"
              value={maxCyl}
              onChange={(e) => setMaxCyl(Number(e.target.value))}
              className="w-full bg-white border border-cream-300 rounded px-1.5 py-1 text-xs"
            />
          </div>
          <div>
            <label className="text-[9px] text-stone-500 block">Min Add</label>
            <input
              type="number"
              step="0.25"
              value={minAdd}
              onChange={(e) => setMinAdd(Number(e.target.value))}
              className="w-full bg-white border border-cream-300 rounded px-1.5 py-1 text-xs"
            />
          </div>
          <div>
            <label className="text-[9px] text-stone-500 block">Max Add</label>
            <input
              type="number"
              step="0.25"
              value={maxAdd}
              onChange={(e) => setMaxAdd(Number(e.target.value))}
              className="w-full bg-white border border-cream-300 rounded px-1.5 py-1 text-xs"
            />
          </div>
          <div>
            <label className="text-[9px] text-stone-500 block">Max S+C</label>
            <input
              type="number"
              step="0.25"
              value={maxSc}
              onChange={(e) => setMaxSc(Number(e.target.value))}
              className="w-full bg-white border border-cream-300 rounded px-1.5 py-1 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Warna, Coating & Deskripsi */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select
          value={colorId}
          onChange={(e) => setColorId(e.target.value)}
          className="bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900"
        >
          <option value="">Semua Warna / Clear (Default)</option>
          {colors.map((c) => <option key={c.id} value={c.id}>{c.color_name}</option>)}
        </select>
        <select
          value={coatingId}
          onChange={(e) => setCoatingId(e.target.value)}
          className="bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900"
        >
          <option value="">Semua Coating / Default</option>
          {coatings.map((ct) => <option key={ct.id} value={ct.id}>{ct.coating_name}</option>)}
        </select>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900"
          placeholder="Catatan / Deskripsi (misal: RX3, short corridor)"
        />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            await onSave(item.id, {
              lens_type_id: lensTypeId || null,
              lens_level: level,
              index_value: indexVal,
              price: price,
              price_adder: price,
              min_sph: minSph,
              max_sph: maxSph,
              max_cyl: maxCyl,
              min_add: minAdd,
              max_add: maxAdd,
              max_s_c: maxSc,
              description: desc,
              color_id: colorId || null,
              coating_id: coatingId || null,
            });
            setSaving(false);
          }}
          className="px-3 py-1.5 rounded bg-charcoal-900 text-cream-50 font-semibold hover:bg-stone-800 transition disabled:opacity-50"
        >
          Simpan Perubahan
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded bg-cream-200 text-stone-500 font-semibold hover:bg-cream-300 transition"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// InlineEditSimple  (shared by Color and Coating)
// ---------------------------------------------------------------------------

type InlineEditSimpleProps = {
  name: string;
  adder: number;
  nameLabel: string;
  onSave: (name: string, adder: number) => Promise<void>;
  onCancel: () => void;
};

export function InlineEditSimple({
  name: initName,
  adder: initAdder,
  nameLabel,
  onSave,
  onCancel,
}: InlineEditSimpleProps) {
  const [name, setName] = useState(initName);
  const [adder, setAdder] = useState(initAdder);
  const [saving, setSaving] = useState(false);

  return (
    <div className="bg-stone-100 border border-stone-300 rounded-md p-3 text-xs space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900"
          placeholder={nameLabel}
        />
        <input
          type="number"
          value={adder}
          onChange={(e) => setAdder(Number(e.target.value))}
          className="bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900"
          placeholder="+Harga (Rp)"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            await onSave(name, adder);
            setSaving(false);
          }}
          className="px-3 py-1.5 rounded bg-charcoal-900 text-cream-50 font-semibold hover:bg-stone-800 transition disabled:opacity-50"
        >
          Simpan
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded bg-cream-200 text-stone-500 font-semibold hover:bg-cream-300 transition"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
