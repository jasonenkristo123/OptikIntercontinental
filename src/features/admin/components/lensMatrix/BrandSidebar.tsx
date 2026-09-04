'use client';

import { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import type { LensBrand, MasterItem } from '@/shared/types/database';

// ---------------------------------------------------------------------------
// AddBrandForm
// ---------------------------------------------------------------------------

type AddBrandFormProps = {
  budgets: MasterItem[];
  brandName: string;
  selectedBudget: string;
  brandDesc: string;
  brandLogoUrl: string;
  onBrandNameChange: (v: string) => void;
  onBudgetChange: (v: string) => void;
  onDescChange: (v: string) => void;
  onLogoUrlChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function AddBrandForm({
  budgets,
  brandName,
  selectedBudget,
  brandDesc,
  brandLogoUrl,
  onBrandNameChange,
  onBudgetChange,
  onDescChange,
  onLogoUrlChange,
  onSubmit,
}: AddBrandFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-4"
    >
      <h3 className="font-serif font-normal text-charcoal-900 text-base flex items-center gap-2">
        <Plus className="w-4 h-4 text-stone-500" />
        <span>Tambah Merek Lensa</span>
      </h3>

      <div>
        <label className="block text-xs font-semibold text-stone-500 mb-1">Nama Merek</label>
        <input
          type="text"
          required
          placeholder="Essilor, Hoya, Carl Zeiss..."
          value={brandName}
          onChange={(e) => onBrandNameChange(e.target.value)}
          className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-500 mb-1">Kategori Budget</label>
        <select
          required
          value={selectedBudget}
          onChange={(e) => onBudgetChange(e.target.value)}
          className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
        >
          <option value="">-- Pilih Budget --</option>
          {budgets.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-500 mb-1">Deskripsi Opsional</label>
        <textarea
          placeholder="Lensa buatan Prancis dengan garansi coating 2 tahun..."
          value={brandDesc}
          onChange={(e) => onDescChange(e.target.value)}
          className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900 h-20"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-stone-500 mb-1">URL Logo Merek (Opsional)</label>
        <input
          type="text"
          placeholder="https://example.com/logo.png"
          value={brandLogoUrl}
          onChange={(e) => onLogoUrlChange(e.target.value)}
          className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
        />
        {brandLogoUrl && (
          <div className="mt-2 p-2 bg-white border border-cream-200 rounded-sm inline-flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brandLogoUrl} alt="Preview" className="h-8 w-auto object-contain" />
            <span className="text-[10px] text-stone-400">Preview</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-charcoal-900 hover:bg-stone-800 text-cream-50 font-semibold py-2.5 rounded-sm transition"
      >
        Simpan Merek
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// BrandSelectorItem — handles its own confirm-delete state
// ---------------------------------------------------------------------------

type BrandSelectorItemProps = {
  brand: LensBrand;
  isSelected: boolean;
  isDeleting: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
};

function BrandSelectorItem({
  brand,
  isSelected,
  isDeleting,
  onSelect,
  onDelete,
}: BrandSelectorItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // don't trigger onSelect
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await onDelete(brand.id);
    setConfirmDelete(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  return (
    <div
      className={`group w-full text-left p-3 rounded-sm border transition flex justify-between items-center gap-2 cursor-pointer ${
        isSelected
          ? 'bg-stone-200 border-charcoal-900 text-charcoal-900 font-semibold'
          : 'bg-cream-100 border-cream-300 text-stone-500 hover:text-charcoal-900'
      }`}
      onClick={() => onSelect(brand.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(brand.id)}
    >
      {/* Brand info */}
      <div className="flex-1 min-w-0">
        <div className="truncate">{brand.name}</div>
        <div className="text-[11px] text-stone-400 font-normal">{brand.budget_range?.name}</div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {confirmDelete ? (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="px-2 py-0.5 text-[10px] font-semibold bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50"
              aria-label={`Confirm delete ${brand.name}`}
            >
              {isDeleting ? '...' : 'Hapus'}
            </button>
            <button
              onClick={handleCancelDelete}
              className="px-2 py-0.5 text-[10px] font-semibold bg-cream-200 text-stone-500 rounded hover:bg-cream-300 transition"
              aria-label="Cancel"
            >
              Batal
            </button>
          </div>
        ) : (
          <button
            onClick={handleDeleteClick}
            className="p-1 rounded opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 hover:bg-red-50 text-stone-400 hover:text-red-600 transition"
            title="Hapus merek"
            aria-label={`Hapus merek ${brand.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

type BrandSelectorProps = {
  brands: LensBrand[];
  selectedBrandId: string | null;
  deletingBrandId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
};

export function BrandSelector({
  brands,
  selectedBrandId,
  deletingBrandId,
  onSelect,
  onDelete,
}: BrandSelectorProps) {
  return (
    <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-3">
      <h4 className="font-serif font-normal text-stone-600 text-xs uppercase tracking-wider">
        Pilih Merek untuk Dikonfigurasi:
      </h4>
      <div className="space-y-2">
        {brands.map((b) => (
          <BrandSelectorItem
            key={b.id}
            brand={b}
            isSelected={selectedBrandId === b.id}
            isDeleting={deletingBrandId === b.id}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
