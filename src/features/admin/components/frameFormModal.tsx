'use client';

import { useState } from 'react';
import { createFrame, updateFrame } from '@/app/actions/frameActions';
import { uploadAndCompressImage } from '@/lib/uploadImage';
import { Frame, MasterItem, AuthenticityTag } from '@/shared/types/database';
import { X, Upload, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Frame | null;
  categories: MasterItem[];
  materials: MasterItem[];
  authenticity: AuthenticityTag[];
}

export default function FrameFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  categories,
  materials,
  authenticity,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.image_url || '');

  const [form, setForm] = useState({
    name: initialData?.name || '',
    category_id: initialData?.category_id || categories[0]?.id || '',
    material_id: initialData?.material_id || materials[0]?.id || '',
    authenticity_id: initialData?.authenticity_id || authenticity[0]?.id || '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
  });

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
      let imageUrl = initialData?.image_url || '';

      if (file) {
        imageUrl = await uploadAndCompressImage(file);
      }

      if (!imageUrl) {
        alert('Foto frame wajib di-upload!');
        setLoading(false);
        return;
      }

      const payload: any = { ...form, image_url: imageUrl };
      if (!payload.category_id) payload.category_id = null;
      if (!payload.material_id) payload.material_id = null;
      if (!payload.authenticity_id) payload.authenticity_id = null;

      if (initialData?.id) {
        await updateFrame(initialData.id, payload);
      } else {
        await createFrame(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan frame');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 text-white space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-lg">{initialData ? 'Edit Frame' : 'Tambah Frame Baru'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Frame</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Kategori</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Material</label>
              <select
                value={form.material_id}
                onChange={(e) => setForm({ ...form, material_id: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Keaslian</label>
              <select
                value={form.authenticity_id}
                onChange={(e) => setForm({ ...form, authenticity_id: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
              >
                {authenticity.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Harga (IDR)</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Stok</label>
              <input
                type="number"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Upload Foto */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Foto Produk (Auto WebP)</label>
            <div className="flex items-center gap-4">
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-xl bg-slate-950 border border-slate-800" />
              )}
              <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-slate-700 hover:border-blue-500 rounded-xl py-3 cursor-pointer text-slate-400 hover:text-white text-xs transition">
                <Upload className="w-4 h-4" />
                <span>{file ? file.name : 'Pilih Gambar (JPG/PNG/HEIC)'}</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-50"
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