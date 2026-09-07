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
  lensTypes: { id: string; name: string }[];
  colors: BrandLensColor[];
  coatings: BrandLensCoating[];
  selectedLensType: string;
  lensLevel: string;
  indexValue: string;
  indexPrice: number | string;
  minSph: number | string;
  maxSph: number | string;
  maxCyl: number | string;
  minAdd: number | string;
  maxAdd: number | string;
  maxSc: number | string;
  indexDesc: string;
  indexColorId: string;
  indexCoatingId: string;
  editingId: string | null;
  deletingId: string | null;
  onSelectedLensTypeChange: (v: string) => void;
  onLensLevelChange: (v: string) => void;
  onIndexValueChange: (v: string) => void;
  onIndexPriceChange: (v: number | string) => void;
  onMinSphChange: (v: number | string) => void;
  onMaxSphChange: (v: number | string) => void;
  onMaxCylChange: (v: number | string) => void;
  onMinAddChange: (v: number | string) => void;
  onMaxAddChange: (v: number | string) => void;
  onMaxScChange: (v: number | string) => void;
  onIndexDescChange: (v: string) => void;
  onIndexColorIdChange: (v: string) => void;
  onIndexCoatingIdChange: (v: string) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
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
  onDelete: (id: string) => Promise<void>;
};

export function IndexSection({
  indexes,
  lensTypes,
  colors,
  coatings,
  selectedLensType,
  lensLevel,
  indexValue,
  indexPrice,
  minSph,
  maxSph,
  maxCyl,
  minAdd,
  maxAdd,
  maxSc,
  indexDesc,
  indexColorId,
  indexCoatingId,
  editingId,
  deletingId,
  onSelectedLensTypeChange,
  onLensLevelChange,
  onIndexValueChange,
  onIndexPriceChange,
  onMinSphChange,
  onMaxSphChange,
  onMaxCylChange,
  onMinAddChange,
  onMaxAddChange,
  onMaxScChange,
  onIndexDescChange,
  onIndexColorIdChange,
  onIndexCoatingIdChange,
  onAdd,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: IndexSectionProps) {
  // Group indexes by level for clean presentation
  const groupedIndexes = indexes.reduce<Record<string, BrandLensIndex[]>>((acc, item) => {
    const levelKey = item.lens_level?.trim() || 'Standard';
    if (!acc[levelKey]) acc[levelKey] = [];
    acc[levelKey].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-5">
      <div>
        <h3 className="font-serif font-normal text-charcoal-900 text-base flex items-center gap-2">
          <Sliders className="w-4 h-4 text-stone-500" />
          <span>2. Katalog &amp; Harga Paket Lensa (Index, Level &amp; Resep)</span>
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Input harga paket penuh per baris katalog berdasarkan Tipe, Level (misal: Start, Advance, Comfy Pro), Indeks Ketebalan, dan Batas Ukuran Resep.
        </p>
      </div>

      {/* Form Input Baris Katalog Baru */}
      <div className="bg-white border border-cream-300 p-4 rounded-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <div>
            <label className="text-[10px] font-semibold text-stone-500 block mb-1">Tipe Lensa</label>
            <select
              value={selectedLensType}
              onChange={(e) => onSelectedLensTypeChange(e.target.value)}
              className="w-full bg-cream-50 border border-cream-300 rounded-sm px-2.5 py-2 text-charcoal-900"
            >
              <option value="">-- Pilih Tipe Lensa --</option>
              {lensTypes.map((lt) => (
                <option key={lt.id} value={lt.id}>
                  {lt.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-stone-500 block mb-1">Level / Seri Desain</label>
            <input
              type="text"
              placeholder="Contoh: Comfy Pro / Advance / Start"
              value={lensLevel}
              onChange={(e) => onLensLevelChange(e.target.value)}
              className="w-full bg-cream-50 border border-cream-300 rounded-sm px-2.5 py-2 text-charcoal-900"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-stone-500 block mb-1">Indeks Ketebalan</label>
            <input
              type="text"
              placeholder="1.50, 1.55, 1.60, 1.67, 1.74"
              value={indexValue}
              onChange={(e) => onIndexValueChange(e.target.value)}
              className="w-full bg-cream-50 border border-cream-300 rounded-sm px-2.5 py-2 text-charcoal-900"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-stone-500 block mb-1">Harga Paket Total (Rp)</label>
            <input
              type="number"
              placeholder="Contoh: 1800000"
              value={indexPrice}
              onChange={(e) =>
                onIndexPriceChange(e.target.value === '' ? '' : Number(e.target.value))
              }
              className="w-full bg-cream-50 border border-cream-300 rounded-sm px-2.5 py-2 text-charcoal-900 font-bold text-amber-900"
            />
          </div>
        </div>

        {/* Batas Resep (Optical Power Limits) */}
        <div className="bg-cream-100/70 border border-cream-200 rounded p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-stone-600 uppercase tracking-wider">
              Batas Resep Yang Didukung (Optical Limits)
            </span>
            <span className="text-[9px] text-stone-400">Digunakan untuk validasi resep mata pelanggan di Wizard</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <div>
              <label className="text-[9px] text-stone-500 block">Min Sph (Minus)</label>
              <input
                type="number"
                step="0.25"
                placeholder="-8.00"
                value={minSph}
                onChange={(e) => onMinSphChange(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-white border border-cream-300 rounded px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="text-[9px] text-stone-500 block">Max Sph (Plus)</label>
              <input
                type="number"
                step="0.25"
                placeholder="+5.50"
                value={maxSph}
                onChange={(e) => onMaxSphChange(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-white border border-cream-300 rounded px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="text-[9px] text-stone-500 block">Max Cyl</label>
              <input
                type="number"
                step="0.25"
                placeholder="-4.00"
                value={maxCyl}
                onChange={(e) => onMaxCylChange(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-white border border-cream-300 rounded px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="text-[9px] text-stone-500 block">Min Add</label>
              <input
                type="number"
                step="0.25"
                placeholder="+0.75"
                value={minAdd}
                onChange={(e) => onMinAddChange(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-white border border-cream-300 rounded px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="text-[9px] text-stone-500 block">Max Add</label>
              <input
                type="number"
                step="0.25"
                placeholder="+3.50"
                value={maxAdd}
                onChange={(e) => onMaxAddChange(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-white border border-cream-300 rounded px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="text-[9px] text-stone-500 block">Max S+C</label>
              <input
                type="number"
                step="0.25"
                placeholder="-8.00"
                value={maxSc}
                onChange={(e) => onMaxScChange(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-white border border-cream-300 rounded px-2 py-1 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Warna, Coating & Deskripsi */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="text-[10px] font-semibold text-stone-500 block mb-1">Pilihan Warna (Opsional)</label>
            <select
              value={indexColorId}
              onChange={(e) => onIndexColorIdChange(e.target.value)}
              className="w-full bg-cream-50 border border-cream-300 rounded-sm px-2.5 py-2 text-charcoal-900"
            >
              <option value="">Semua Warna / Clear (Default)</option>
              {colors.map((c) => (
                <option key={c.id} value={c.id}>{c.color_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-stone-500 block mb-1">Pilihan Coating (Opsional)</label>
            <select
              value={indexCoatingId}
              onChange={(e) => onIndexCoatingIdChange(e.target.value)}
              className="w-full bg-cream-50 border border-cream-300 rounded-sm px-2.5 py-2 text-charcoal-900"
            >
              <option value="">Semua Coating / Default</option>
              {coatings.map((ct) => (
                <option key={ct.id} value={ct.id}>{ct.coating_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-stone-500 block mb-1">Catatan / Deskripsi Tambahan</label>
            <input
              type="text"
              placeholder="Misal: RX3, tersedia koridor short & regular"
              value={indexDesc}
              onChange={(e) => onIndexDescChange(e.target.value)}
              className="w-full bg-cream-50 border border-cream-300 rounded-sm px-2.5 py-2 text-charcoal-900"
            />
          </div>
        </div>

        <button
          onClick={onAdd}
          className="w-full bg-charcoal-900 hover:bg-stone-800 text-cream-50 font-semibold rounded-sm py-2.5 transition text-xs tracking-wider uppercase"
        >
          + Tambahkan Baris Katalog
        </button>
      </div>

      {/* Katalog Terkonfigurasi dikelompokkan per Level */}
      {indexes.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-cream-200">
          <div className="flex items-center justify-between">
            <SectionLabel>Daftar Katalog Lensa Terkonfigurasi ({indexes.length} item):</SectionLabel>
          </div>

          {Object.entries(groupedIndexes).map(([levelTitle, items]) => (
            <div key={levelTitle} className="bg-white border border-cream-200 rounded-sm p-3.5 space-y-2.5">
              <div className="flex items-center justify-between border-b border-cream-200 pb-1.5">
                <span className="font-serif font-bold text-charcoal-900 text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
                  Level / Seri: {levelTitle}
                </span>
                <span className="text-[11px] font-mono text-stone-500">{items.length} pilihan indeks</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {items.map((idx) =>
                  editingId === idx.id ? (
                    <InlineEditIndex
                      key={idx.id}
                      item={idx}
                      lensTypes={lensTypes}
                      colors={colors}
                      coatings={coatings}
                      onSave={onSave}
                      onCancel={onCancelEdit}
                    />
                  ) : (
                    <div
                      key={idx.id}
                      className="bg-cream-50 hover:bg-cream-100 border border-cream-200 rounded-sm p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-charcoal-900 text-sm">
                            Index {idx.index_value}
                          </span>
                          <span className="text-xs bg-charcoal-900/10 text-charcoal-900 font-semibold px-2 py-0.5 rounded">
                            {idx.lens_type?.name || 'Semua Tipe'}
                          </span>
                          {(idx.color?.color_name || idx.coating?.coating_name) && (
                            <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium">
                              {idx.color?.color_name || 'Clear'} {idx.coating?.coating_name ? `· ${idx.coating?.coating_name}` : ''}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-stone-500 flex items-center gap-2 flex-wrap">
                          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-cream-300">
                            SPH: {idx.min_sph ?? -8.0} s/d +{idx.max_sph ?? 5.5}
                          </span>
                          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-cream-300">
                            CYL: {idx.max_cyl ?? -4.0}
                          </span>
                          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-cream-300">
                            ADD: +{idx.min_add ?? 0.75} s/d +{idx.max_add ?? 3.5}
                          </span>
                          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-cream-300">
                            S+C: {idx.max_s_c ?? -8.0}
                          </span>
                        </div>

                        {idx.description && (
                          <div className="text-[10px] text-stone-400 italic">
                            Catatan: {idx.description}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 sm:border-l sm:border-cream-200 sm:pl-3 justify-between sm:justify-end">
                        <div className="text-right">
                          <div className="text-[9px] uppercase tracking-wider text-stone-400 font-semibold">Harga Paket</div>
                          <div className="font-serif font-bold text-sm text-charcoal-900">
                            Rp {Number(idx.price ?? idx.price_adder ?? 0).toLocaleString('id-ID')}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEdit(idx.id)}
                            className="text-stone-500 hover:text-charcoal-900 p-1.5 rounded hover:bg-cream-200 transition text-xs font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            disabled={deletingId === idx.id}
                            onClick={() => onDelete(idx.id)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition text-xs disabled:opacity-50"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
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
