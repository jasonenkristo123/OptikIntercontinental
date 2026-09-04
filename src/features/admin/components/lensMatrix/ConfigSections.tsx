'use client';

import { Layers, Sliders, Palette, ShieldCheck } from 'lucide-react';
import type { LensType, BrandLensType, BrandLensIndex, BrandLensColor, BrandLensCoating } from '@/shared/types/database';
import { EditableItemCard } from './EditableItemCard';
import { InlineEditLensType, InlineEditIndex, InlineEditSimple } from './InlineEditForms';

// ---------------------------------------------------------------------------
// Shared section label
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">{children}</p>
  );
}

type LensTypeSectionProps = {
  lensTypes: LensType[];
  configuredTypes: (BrandLensType & { lens_type: { id: string; name: string } })[];
  selectedLensType: string;
  basePrice: number | string;
  editingId: string | null;
  deletingId: string | null;
  onSelectedLensTypeChange: (v: string) => void;
  onBasePriceChange: (v: number | string) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSave: (id: string, basePrice: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function LensTypeSection({
  lensTypes,
  configuredTypes,
  selectedLensType,
  basePrice,
  editingId,
  deletingId,
  onSelectedLensTypeChange,
  onBasePriceChange,
  onAdd,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: LensTypeSectionProps) {
  return (
    <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-4">
      <h3 className="font-serif font-normal text-charcoal-900 text-base flex items-center gap-2">
        <Layers className="w-4 h-4 text-stone-500" />
        <span>1. Tipe Lensa &amp; Harga Dasar</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          value={selectedLensType}
          onChange={(e) => onSelectedLensTypeChange(e.target.value)}
          className="bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
        >
          <option value="">-- Pilih Tipe Lensa --</option>
          {lensTypes.map((lt) => (
            <option key={lt.id} value={lt.id}>
              {lt.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Harga Dasar (Rp)"
          value={basePrice}
          onChange={(e) =>
            onBasePriceChange(e.target.value === '' ? '' : Number(e.target.value))
          }
          className="bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
        />

        <button
          onClick={onAdd}
          className="bg-charcoal-900 hover:bg-stone-800 text-cream-50 font-semibold rounded-sm px-4 py-2 transition"
        >
          Set Tipe &amp; Harga
        </button>
      </div>

      {configuredTypes.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-cream-200">
          <SectionLabel>Tipe Terkonfigurasi:</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {configuredTypes.map((lt) =>
              editingId === lt.id ? (
                <InlineEditLensType
                  key={lt.id}
                  item={lt}
                  onSave={onSave}
                  onCancel={onCancelEdit}
                />
              ) : (
                <EditableItemCard
                  key={lt.id}
                  id={lt.id}
                  label={lt.lens_type?.name || 'Unknown'}
                  sublabel={`Rp ${Number(lt.base_price).toLocaleString('id-ID')}`}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  isDeleting={deletingId}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// IndexSection
// ---------------------------------------------------------------------------

type IndexSectionProps = {
  indexes: BrandLensIndex[];
  colors: BrandLensColor[];
  coatings: BrandLensCoating[];
  indexValue: string;
  indexAdder: number | string;
  indexDesc: string;
  indexColorId: string;
  indexCoatingId: string;
  editingId: string | null;
  deletingId: string | null;
  onIndexValueChange: (v: string) => void;
  onIndexAdderChange: (v: number | string) => void;
  onIndexDescChange: (v: string) => void;
  onIndexColorIdChange: (v: string) => void;
  onIndexCoatingIdChange: (v: string) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSave: (id: string, payload: { index_value?: string; price_adder?: number; description?: string; color_id?: string | null; coating_id?: string | null }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function IndexSection({
  indexes,
  colors,
  coatings,
  indexValue,
  indexAdder,
  indexDesc,
  indexColorId,
  indexCoatingId,
  editingId,
  deletingId,
  onIndexValueChange,
  onIndexAdderChange,
  onIndexDescChange,
  onIndexColorIdChange,
  onIndexCoatingIdChange,
  onAdd,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: IndexSectionProps) {
  return (
    <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-4">
      <h3 className="font-serif font-normal text-charcoal-900 text-base flex items-center gap-2">
        <Sliders className="w-4 h-4 text-stone-500" />
        <span>2. Indeks / Ketebalan Lensa</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Index (1.56/1.61)"
          value={indexValue}
          onChange={(e) => onIndexValueChange(e.target.value)}
          className="bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
        />
        <input
          type="number"
          placeholder="+Harga (Rp)"
          value={indexAdder}
          onChange={(e) =>
            onIndexAdderChange(e.target.value === '' ? '' : Number(e.target.value))
          }
          className="bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
        />
        <input
          type="text"
          placeholder="Deskripsi rekomendasi"
          value={indexDesc}
          onChange={(e) => onIndexDescChange(e.target.value)}
          className="bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
        />
        <div className="bg-amber-50 border border-amber-200 rounded-sm px-3 py-2 text-[10px] text-amber-800 col-span-full">
          Harga indeks ini berlaku untuk kombinasi warna &amp; coating di bawah (opsional). Kosongkan untuk harga default.
        </div>
        <select
          value={indexColorId}
          onChange={(e) => onIndexColorIdChange(e.target.value)}
          className="bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
        >
          <option value="">Semua Warna (Default)</option>
          {colors.map((c) => (
            <option key={c.id} value={c.id}>{c.color_name}</option>
          ))}
        </select>
        <select
          value={indexCoatingId}
          onChange={(e) => onIndexCoatingIdChange(e.target.value)}
          className="bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
        >
          <option value="">Semua Coating (Default)</option>
          {coatings.map((ct) => (
            <option key={ct.id} value={ct.id}>{ct.coating_name}</option>
          ))}
        </select>
        <button
          onClick={onAdd}
          className="bg-charcoal-900 hover:bg-stone-800 text-cream-50 font-semibold rounded-sm px-3 py-2 transition sm:col-span-2"
        >
          + Tambah Harga Index
        </button>
      </div>

      {indexes.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-cream-200">
          <SectionLabel>Index Terkonfigurasi:</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {indexes.map((idx) =>
              editingId === idx.id ? (
                <InlineEditIndex
                  key={idx.id}
                  item={idx}
                  colors={colors}
                  coatings={coatings}
                  onSave={onSave}
                  onCancel={onCancelEdit}
                />
              ) : (
                <EditableItemCard
                  key={idx.id}
                  id={idx.id}
                  label={`Index ${idx.index_value}`}
                  sublabel={`+Rp ${Number(idx.price_adder).toLocaleString('id-ID')}${
                    idx.description ? ` · ${idx.description}` : ''
                  }${idx.color_id || idx.coating_id ? ' 🎨' : ''}`}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  isDeleting={deletingId}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ColorSection
// ---------------------------------------------------------------------------

type ColorSectionProps = {
  colors: BrandLensColor[];
  colorName: string;
  colorAdder: number | string;
  editingId: string | null;
  deletingId: string | null;
  onColorNameChange: (v: string) => void;
  onColorAdderChange: (v: number | string) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSave: (id: string, name: string, adder: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function ColorSection({
  colors,
  colorName,
  colorAdder,
  editingId,
  deletingId,
  onColorNameChange,
  onColorAdderChange,
  onAdd,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: ColorSectionProps) {
  return (
    <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-3">
      <h4 className="font-serif font-normal text-charcoal-900 flex items-center gap-2">
        <Palette className="w-4 h-4 text-stone-500" />
        <span>Opsional Warna</span>
      </h4>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Nama Warna (Clear / Photochromic)"
          value={colorName}
          onChange={(e) => onColorNameChange(e.target.value)}
          className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
        />
        <input
          type="number"
          placeholder="+Harga Warna (Rp)"
          value={colorAdder}
          onChange={(e) =>
            onColorAdderChange(e.target.value === '' ? '' : Number(e.target.value))
          }
          className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
        />
        <button
          onClick={onAdd}
          className="w-full bg-cream-200 hover:bg-cream-300 text-charcoal-900 py-2 rounded-sm transition"
        >
          + Tambah Warna
        </button>
      </div>

      {colors.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-cream-200">
          <SectionLabel>Warna Terkonfigurasi:</SectionLabel>
          <div className="space-y-2">
            {colors.map((c) =>
              editingId === c.id ? (
                <InlineEditSimple
                  key={c.id}
                  name={c.color_name}
                  adder={c.price_adder}
                  nameLabel="Nama Warna"
                  onSave={async (name, adder) => onSave(c.id, name, adder)}
                  onCancel={onCancelEdit}
                />
              ) : (
                <EditableItemCard
                  key={c.id}
                  id={c.id}
                  label={c.color_name}
                  sublabel={`+Rp ${Number(c.price_adder).toLocaleString('id-ID')}`}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  isDeleting={deletingId}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CoatingSection
// ---------------------------------------------------------------------------

type CoatingSectionProps = {
  coatings: BrandLensCoating[];
  coatingName: string;
  coatingAdder: number | string;
  editingId: string | null;
  deletingId: string | null;
  onCoatingNameChange: (v: string) => void;
  onCoatingAdderChange: (v: number | string) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSave: (id: string, name: string, adder: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function CoatingSection({
  coatings,
  coatingName,
  coatingAdder,
  editingId,
  deletingId,
  onCoatingNameChange,
  onCoatingAdderChange,
  onAdd,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: CoatingSectionProps) {
  return (
    <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-3">
      <h4 className="font-serif font-normal text-charcoal-900 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-stone-500" />
        <span>Opsional Coating</span>
      </h4>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Nama Coating (Blue Protect)"
          value={coatingName}
          onChange={(e) => onCoatingNameChange(e.target.value)}
          className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
        />
        <input
          type="number"
          placeholder="+Harga Coating (Rp)"
          value={coatingAdder}
          onChange={(e) =>
            onCoatingAdderChange(e.target.value === '' ? '' : Number(e.target.value))
          }
          className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
        />
        <button
          onClick={onAdd}
          className="w-full bg-cream-200 hover:bg-cream-300 text-charcoal-900 py-2 rounded-sm transition"
        >
          + Tambah Coating
        </button>
      </div>

      {coatings.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-cream-200">
          <SectionLabel>Coating Terkonfigurasi:</SectionLabel>
          <div className="space-y-2">
            {coatings.map((ct) =>
              editingId === ct.id ? (
                <InlineEditSimple
                  key={ct.id}
                  name={ct.coating_name}
                  adder={ct.price_adder}
                  nameLabel="Nama Coating"
                  onSave={async (name, adder) => onSave(ct.id, name, adder)}
                  onCancel={onCancelEdit}
                />
              ) : (
                <EditableItemCard
                  key={ct.id}
                  id={ct.id}
                  label={ct.coating_name}
                  sublabel={`+Rp ${Number(ct.price_adder).toLocaleString('id-ID')}`}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  isDeleting={deletingId}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
