'use client';

import { useState, useEffect } from 'react';
import { createFrame, updateFrame } from '@/app/actions/frameActions';
import { uploadAndCompressImage } from '@/lib/uploadImage';
import { Frame, MasterItem, AuthenticityTag, CreateFramePayload, FrameBrand } from '@/shared/types/database';
import { X, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Frame | null;
  categories: MasterItem[];
  materials: MasterItem[];
  authenticity: AuthenticityTag[];
  brands?: FrameBrand[];
}

export default function FrameFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  categories,
  materials,
  authenticity,
  brands = [],
}: Props) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.image_url || '');

  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    brand_id: initialData?.brand_id ?? '',
    category_id: initialData?.category_id ?? (categories[0]?.id ?? ''),
    material_id: initialData?.material_id ?? (materials[0]?.id ?? ''),
    authenticity_id: initialData?.authenticity_id ?? (authenticity[0]?.id ?? ''),
    price: initialData?.price ?? '',
    stock: initialData?.stock ?? '',
  });

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setPreviewUrl(initialData?.image_url || '');
      setForm({
        name: initialData?.name ?? '',
        brand_id: initialData?.brand_id ?? '',
        category_id: initialData?.category_id ?? (categories[0]?.id ?? ''),
        material_id: initialData?.material_id ?? (materials[0]?.id ?? ''),
        authenticity_id: initialData?.authenticity_id ?? (authenticity[0]?.id ?? ''),
        price: initialData?.price ?? '',
        stock: initialData?.stock ?? '',
      });
    }
  }, [isOpen, initialData, categories, materials, authenticity, brands]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = initialData?.image_url ?? '';

      if (file) {
        imageUrl = await uploadAndCompressImage(file);
      }

      if (!imageUrl) {
        alert('Foto frame wajib di-upload!');
        setLoading(false);
        return;
      }

      const payload: CreateFramePayload = { 
        ...form, 
        price: Number(form.price),
        stock: Number(form.stock),
        image_url: imageUrl,
        brand_id: form.brand_id || null,
        category_id: form.category_id || '',
        material_id: form.material_id || '',
        authenticity_id: form.authenticity_id || '',
      };

      if (initialData?.id) {
        await updateFrame(initialData.id, payload);
      } else {
        await createFrame(payload);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message || 'Gagal menyimpan frame');
      } else {
        alert('Gagal menyimpan frame');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-cream-50 border border-cream-300 w-full max-w-lg rounded-sm p-6 text-charcoal-900 space-y-4">
        <div className="flex justify-between items-center border-b border-cream-300 pb-3">
          <h3 className="font-serif font-normal text-lg">{initialData ? 'Edit Frame' : 'Tambah Frame Baru'}</h3>
          <button onClick={onClose} className="text-stone-500 hover:text-charcoal-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1">Nama Frame</label>
              <input
                type="text"
                required
                placeholder="Misal: Aviator Classic"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1">Merek Frame</label>
              <select
                value={form.brand_id}
                onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
              >
                <option value="">-- Tanpa Merek / Custom --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1">Kategori</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1">Material</label>
              <select
                value={form.material_id}
                onChange={(e) => setForm({ ...form, material_id: e.target.value })}
                className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1">Keaslian</label>
              <select
                value={form.authenticity_id}
                onChange={(e) => setForm({ ...form, authenticity_id: e.target.value })}
                className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900 text-xs"
              >
                {authenticity.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1">Harga (IDR)</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value === '' ? '' : Number(e.target.value) })}
                className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1">Stok</label>
              <input
                type="number"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value === '' ? '' : Number(e.target.value) })}
                className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
              />
            </div>
          </div>

          {/* Upload Foto */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1">Foto Produk (Auto WebP)</label>
            <div className="flex items-center gap-4">
              {previewUrl && (
                <div className="relative w-16 h-16 shrink-0">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover rounded-sm bg-cream-100 border border-cream-300" unoptimized />
                </div>
              )}
              <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-cream-400 hover:border-charcoal-900 rounded-sm py-3 cursor-pointer text-stone-500 hover:text-charcoal-900 text-xs transition">
                <Upload className="w-4 h-4" />
                <span>{file ? file.name : 'Pilih Gambar (JPG/PNG/HEIC)'}</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-cream-300 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-sm bg-cream-200 text-stone-600 text-xs font-semibold">
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-sm bg-charcoal-900 hover:bg-stone-800 text-cream-50 text-xs font-semibold disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Simpan Frame</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}