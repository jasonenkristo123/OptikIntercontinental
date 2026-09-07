'use client';

import { useState } from 'react';
import { createMasterItem, createAuthenticityTag, createLensType, createFrameBrand, deleteMasterItem } from '@/app/actions/masterActions';
import { MasterItem, AuthenticityTag, LensType, FrameBrand } from '@/shared/types/database';
import { Plus, Trash2, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { uploadAndCompressImage } from '@/lib/uploadImage';

interface Props {
  data: {
    categories: MasterItem[];
    materials: MasterItem[];
    authenticity: AuthenticityTag[];
    lensTypes: LensType[];
    budgets: MasterItem[];
    frameBrands?: FrameBrand[];
  };
  onRefresh: () => void;
}

export default function MasterLookupTab({ data, onRefresh }: Props) {
  const [newCategory, setNewCategory] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newAuthName, setNewAuthName] = useState('');
  const [hasLogo, setHasLogo] = useState(false);
  const [newAuthLogoUrl, setNewAuthLogoUrl] = useState('');
  const [newLensType, setNewLensType] = useState('');

  // Frame Brand State
  const [newBrandName, setNewBrandName] = useState('');
  const [brandLogoFile, setBrandLogoFile] = useState<File | null>(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState('');
  const [brandUploading, setBrandUploading] = useState(false);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    await createMasterItem('frame_categories', newCategory);
    setNewCategory('');
    onRefresh();
  };

  const handleAddMaterial = async () => {
    if (!newMaterial.trim()) return;
    await createMasterItem('frame_materials', newMaterial);
    setNewMaterial('');
    onRefresh();
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) return;
    setBrandUploading(true);
    try {
      let logoUrl = '';
      if (brandLogoFile) {
        logoUrl = await uploadAndCompressImage(brandLogoFile, 'frame-brands');
      }
      await createFrameBrand(newBrandName.trim(), logoUrl || undefined);
      setNewBrandName('');
      setBrandLogoFile(null);
      setBrandLogoPreview('');
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Gagal menambahkan merek frame');
    } finally {
      setBrandUploading(false);
    }
  };

  const handleAddAuth = async () => {
    if (!newAuthName.trim()) return;
    await createAuthenticityTag(newAuthName, hasLogo, hasLogo ? newAuthLogoUrl : undefined);
    setNewAuthName('');
    setHasLogo(false);
    setNewAuthLogoUrl('');
    onRefresh();
  };

  const handleAddLensType = async () => {
    if (!newLensType.trim()) return;
    await createLensType(newLensType);
    setNewLensType('');
    onRefresh();
  };

  const handleDelete = async (table: string, id: string) => {
    if (confirm('Hapus item master ini?')) {
      await deleteMasterItem(table, id);
      onRefresh();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      {/* Kategori Frame */}
      <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-3">
        <h3 className="font-serif font-normal text-charcoal-900 text-base">Kategori Frame</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Kategori baru (misal: Sports)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
          />
          <button onClick={handleAddCategory} className="bg-charcoal-900 px-3 py-2 rounded-sm text-cream-50">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {data.categories.map((c) => (
            <span key={c.id} className="bg-cream-100 border border-cream-300 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
              {c.name}
              <button onClick={() => handleDelete('frame_categories', c.id)} className="text-stone-400 hover:text-rose-700">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Material Frame */}
      <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-3">
        <h3 className="font-serif font-normal text-charcoal-900 text-base">Material Frame</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Material baru (misal: Carbon)"
            value={newMaterial}
            onChange={(e) => setNewMaterial(e.target.value)}
            className="flex-1 bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
          />
          <button onClick={handleAddMaterial} className="bg-charcoal-900 px-3 py-2 rounded-sm text-cream-50">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {data.materials.map((m) => (
            <span key={m.id} className="bg-cream-100 border border-cream-300 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
              {m.name}
              <button onClick={() => handleDelete('frame_materials', m.id)} className="text-stone-400 hover:text-rose-700">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Tag Keaslian */}
      <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-3">
        <h3 className="font-serif font-normal text-charcoal-900 text-base">Tag Keaslian (Authenticity)</h3>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Tag Keaslian baru"
              value={newAuthName}
              onChange={(e) => setNewAuthName(e.target.value)}
              className="flex-1 bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
            />
            <label className="flex items-center gap-1.5 text-xs text-stone-500 whitespace-nowrap">
              <input type="checkbox" checked={hasLogo} onChange={(e) => setHasLogo(e.target.checked)} />
              Logo
            </label>
            <button onClick={handleAddAuth} className="bg-charcoal-900 px-3 py-2 rounded-sm text-cream-50 shrink-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {hasLogo && (
            <input
              type="text"
              placeholder="URL Gambar Logo (https://...)"
              value={newAuthLogoUrl}
              onChange={(e) => setNewAuthLogoUrl(e.target.value)}
              className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900 text-xs"
            />
          )}
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {data.authenticity.map((a) => (
            <span key={a.id} className="bg-cream-100 border border-cream-300 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
              {a.name} {a.has_logo ? '🏷️' : ''}
              <button onClick={() => handleDelete('authenticity_tags', a.id)} className="text-stone-400 hover:text-rose-700">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Master Tipe Lensa */}
      <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-3">
        <h3 className="font-serif font-normal text-charcoal-900 text-base">Master Tipe Lensa</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tipe Lensa baru (misal: Anti-Fatigue)"
            value={newLensType}
            onChange={(e) => setNewLensType(e.target.value)}
            className="flex-1 bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
          />
          <button onClick={handleAddLensType} className="bg-charcoal-900 px-3 py-2 rounded-sm text-cream-50">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {data.lensTypes.map((lt) => (
            <span key={lt.id} className="bg-cream-100 border border-cream-300 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
              {lt.name}
              <button onClick={() => handleDelete('lens_types', lt.id)} className="text-stone-400 hover:text-rose-700">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Merek Frame */}
      <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-3">
        <h3 className="font-serif font-normal text-charcoal-900 text-base flex items-center justify-between">
          <span>Merek Frame</span>
          <span className="text-xs text-stone-400 font-sans">Ray-Ban, Oakley, Gucci...</span>
        </h3>
        
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Nama Merek baru (misal: Ray-Ban)"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900 text-xs"
          />

          <div className="flex items-center gap-2">
            {brandLogoPreview && (
              <div className="relative w-9 h-9 shrink-0 bg-white border border-cream-300 rounded-sm p-0.5">
                <Image
                  src={brandLogoPreview}
                  alt="Logo preview"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-cream-400 hover:border-charcoal-900 rounded-sm py-2 px-3 cursor-pointer text-stone-500 hover:text-charcoal-900 text-xs transition bg-cream-100">
              <Upload className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{brandLogoFile ? brandLogoFile.name : 'Upload Logo (Auto WebP)'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setBrandLogoFile(file);
                    setBrandLogoPreview(URL.createObjectURL(file));
                  }
                }}
                className="hidden"
              />
            </label>
            <button
              onClick={handleAddBrand}
              disabled={brandUploading || !newBrandName.trim()}
              className="bg-charcoal-900 hover:bg-stone-800 disabled:opacity-50 px-3 py-2 rounded-sm text-cream-50 flex items-center gap-1 shrink-0 text-xs font-semibold"
            >
              {brandUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Tambah</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {(data.frameBrands || []).map((b) => (
            <span
              key={b.id}
              className="bg-cream-100 border border-cream-300 px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs"
            >
              {b.logo_url ? (
                <div className="relative w-5 h-4 bg-white/90 rounded px-0.5 shrink-0 border border-cream-200">
                  <Image src={b.logo_url} alt={b.name} fill className="object-contain" unoptimized />
                </div>
              ) : (
                <span className="text-stone-400">🏷️</span>
              )}
              <span className="font-medium text-stone-800">{b.name}</span>
              <button
                onClick={() => handleDelete('frame_brands', b.id)}
                className="text-stone-400 hover:text-rose-700 ml-0.5"
                title={`Hapus ${b.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {(!data.frameBrands || data.frameBrands.length === 0) && (
            <p className="text-xs text-stone-400 italic">Belum ada merek frame ditambahkan.</p>
          )}
        </div>
      </div>
    </div>
  );
}