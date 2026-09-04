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
  colors: BrandLensColor[];
  coatings: BrandLensCoating[];
  onSave: (
    id: string,
    payload: { index_value?: string; price_adder?: number; description?: string; color_id?: string | null; coating_id?: string | null }
  ) => Promise<void>;
  onCancel: () => void;
};

export function InlineEditIndex({ item, colors, coatings, onSave, onCancel }: InlineEditIndexProps) {
  const [indexVal, setIndexVal] = useState(item.index_value);
  const [adder, setAdder] = useState(item.price_adder);
  const [desc, setDesc] = useState(item.description || '');
  const [colorId, setColorId] = useState<string>(item.color_id || '');
  const [coatingId, setCoatingId] = useState<string>(item.coating_id || '');
  const [saving, setSaving] = useState(false);

  return (
    <div className="bg-stone-100 border border-stone-300 rounded-md p-3 text-xs space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <input
          value={indexVal}
          onChange={(e) => setIndexVal(e.target.value)}
          className="bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900"
          placeholder="Index"
        />
        <input
          type="number"
          value={adder}
          onChange={(e) => setAdder(Number(e.target.value))}
          className="bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900"
          placeholder="+Harga"
        />
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900"
          placeholder="Deskripsi"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select
          value={colorId}
          onChange={(e) => setColorId(e.target.value)}
          className="bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900"
        >
          <option value="">Semua Warna (Default)</option>
          {colors.map((c) => <option key={c.id} value={c.id}>{c.color_name}</option>)}
        </select>
        <select
          value={coatingId}
          onChange={(e) => setCoatingId(e.target.value)}
          className="bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900"
        >
          <option value="">Semua Coating (Default)</option>
          {coatings.map((ct) => <option key={ct.id} value={ct.id}>{ct.coating_name}</option>)}
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <button
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            await onSave(item.id, {
              index_value: indexVal,
              price_adder: adder,
              description: desc,
              color_id: colorId || null,
              coating_id: coatingId || null,
            });
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
