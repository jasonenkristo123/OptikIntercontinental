'use client';

import { useState } from 'react';
import { Check, Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import type { LensBrand, MasterItem } from '@/shared/types/database';
import { uploadAndCompressImage } from '@/lib/uploadImage';

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
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setFileName(file.name);
    try {
      const url = await uploadAndCompressImage(file, 'lens-brands');
      onLogoUrlChange(url);
    } catch (err) {
      console.error(err);
      alert('Gagal mengunggah logo merek lensa');
    } finally {
      setIsUploading(false);
    }
  };

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
        <label className="block text-xs font-semibold text-stone-500 mb-1">
          Logo Merek (Upload File)
        </label>
        
        <div className="flex items-center gap-3">
          {brandLogoUrl && (
            <div className="relative w-12 h-10 shrink-0 bg-white border border-cream-300 rounded-sm p-1 flex items-center justify-center">
              <Image src={brandLogoUrl} alt="Preview logo merek" fill className="object-contain" unoptimized />
            </div>
          )}

          <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-cream-400 hover:border-charcoal-900 rounded-sm py-2 px-3 cursor-pointer text-stone-500 hover:text-charcoal-900 text-xs transition bg-cream-100">
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-charcoal-900" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span className="truncate">
              {isUploading ? 'Mengompres...' : fileName ? fileName : 'Pilih Logo (JPG/PNG)'}
            </span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {brandLogoUrl && (
          <div className="mt-1 flex justify-end">
            <button
              type="button"
              onClick={() => {
                onLogoUrlChange('');
                setFileName('');
              }}
              className="text-[11px] text-rose-600 hover:underline"
            >
              Hapus Logo
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className="w-full bg-charcoal-900 hover:bg-stone-800 disabled:opacity-50 text-cream-50 font-semibold py-2.5 rounded-sm transition text-xs flex items-center justify-center gap-2"
      >
        <span>Simpan Merek</span>
      </button>
    </form>
  );
}

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
      <div className="flex-1 min-w-0 flex items-center gap-2.5">
        {brand.logo_url && (
          <div className="relative w-8 h-7 shrink-0 bg-white border border-cream-200 rounded p-0.5 flex items-center justify-center">
            <Image src={brand.logo_url} alt={brand.name} fill className="object-contain" unoptimized />
          </div>
        )}
        <div className="min-w-0">
          <div className="truncate">{brand.name}</div>
          <div className="text-[11px] text-stone-400 font-normal">{brand.budget_range?.name}</div>
        </div>
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
