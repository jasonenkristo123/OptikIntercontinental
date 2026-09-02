'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  createLensBrand, 
  setBrandLensType, 
  addBrandLensIndex, 
  addBrandLensColor, 
  addBrandLensCoating,
  getBrandMatrixOptions,
  deleteBrandLensType,
  deleteBrandLensIndex,
  deleteBrandLensColor,
  deleteBrandLensCoating,
  updateBrandLensType,
  updateBrandLensIndex,
  updateBrandLensColor,
  updateBrandLensCoating,
} from '@/app/actions/lensMatrixActions';
import { MasterItem, LensType, LensBrand, BrandLensType, BrandLensIndex, BrandLensColor, BrandLensCoating } from '@/shared/types/database';
import { Plus, Sliders, Check, Layers, Palette, ShieldCheck, X, Pencil, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// --- Reusable Editable Item Card ---

type EditableItemProps = {
  id: string;
  label: string;
  sublabel?: string;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
  isDeleting: string | null;
};

function EditableItemCard({ id, label, sublabel, onDelete, onEdit, isDeleting }: EditableItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await onDelete(id);
    setConfirmDelete(false);
  };

  return (
    <div className="group relative bg-cream-100 border border-cream-300 rounded-md px-3 py-2 text-xs text-stone-600 flex items-center gap-2 transition-all hover:border-stone-400 hover:shadow-sm">
      <div className="flex-1 min-w-0">
        <span className="font-medium text-charcoal-900">{label}</span>
        {sublabel && <span className="text-stone-400 ml-1">{sublabel}</span>}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(id)}
          className="p-1 rounded hover:bg-cream-200 text-stone-400 hover:text-charcoal-900 transition"
          title="Edit"
        >
          <Pencil className="w-3 h-3" />
        </button>

        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={isDeleting === id}
              className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50"
            >
              {isDeleting === id ? '...' : 'Ya'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-1.5 py-0.5 text-[10px] font-semibold bg-cream-200 text-stone-500 rounded hover:bg-cream-300 transition"
            >
              Batal
            </button>
          </div>
        ) : (
          <button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-red-50 text-stone-400 hover:text-red-600 transition"
            title="Hapus"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

// --- Inline Edit Forms ---

type InlineEditLensTypeProps = {
  item: BrandLensType & { lens_type: { id: string; name: string } };
  onSave: (id: string, basePrice: number) => Promise<void>;
  onCancel: () => void;
};

function InlineEditLensType({ item, onSave, onCancel }: InlineEditLensTypeProps) {
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
        >
          <Check className="w-3 h-3" />
        </button>
        <button onClick={onCancel} className="p-1.5 rounded bg-cream-200 text-stone-500 hover:bg-cream-300 transition">
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

type InlineEditIndexProps = {
  item: BrandLensIndex;
  onSave: (id: string, payload: { index_value?: string; price_adder?: number; description?: string }) => Promise<void>;
  onCancel: () => void;
};

function InlineEditIndex({ item, onSave, onCancel }: InlineEditIndexProps) {
  const [indexVal, setIndexVal] = useState(item.index_value);
  const [adder, setAdder] = useState(item.price_adder);
  const [desc, setDesc] = useState(item.description || '');
  const [saving, setSaving] = useState(false);

  return (
    <div className="bg-stone-100 border border-stone-300 rounded-md p-3 text-xs space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <input value={indexVal} onChange={(e) => setIndexVal(e.target.value)} className="bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900" placeholder="Index" />
        <input type="number" value={adder} onChange={(e) => setAdder(Number(e.target.value))} className="bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900" placeholder="+Harga" />
        <input value={desc} onChange={(e) => setDesc(e.target.value)} className="bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900" placeholder="Deskripsi" />
      </div>
      <div className="flex justify-end gap-2">
        <button
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            await onSave(item.id, { index_value: indexVal, price_adder: adder, description: desc });
            setSaving(false);
          }}
          className="px-3 py-1.5 rounded bg-charcoal-900 text-cream-50 font-semibold hover:bg-stone-800 transition disabled:opacity-50"
        >
          Simpan
        </button>
        <button onClick={onCancel} className="px-3 py-1.5 rounded bg-cream-200 text-stone-500 font-semibold hover:bg-cream-300 transition">Batal</button>
      </div>
    </div>
  );
}

type InlineEditSimpleProps = {
  name: string;
  adder: number;
  nameLabel: string;
  onSave: (name: string, adder: number) => Promise<void>;
  onCancel: () => void;
};

function InlineEditSimple({ name: initName, adder: initAdder, nameLabel, onSave, onCancel }: InlineEditSimpleProps) {
  const [name, setName] = useState(initName);
  const [adder, setAdder] = useState(initAdder);
  const [saving, setSaving] = useState(false);

  return (
    <div className="bg-stone-100 border border-stone-300 rounded-md p-3 text-xs space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} className="bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900" placeholder={nameLabel} />
        <input type="number" value={adder} onChange={(e) => setAdder(Number(e.target.value))} className="bg-cream-50 border border-cream-300 rounded-sm px-2 py-1.5 text-charcoal-900" placeholder="+Harga (Rp)" />
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
        <button onClick={onCancel} className="px-3 py-1.5 rounded bg-cream-200 text-stone-500 font-semibold hover:bg-cream-300 transition">Batal</button>
      </div>
    </div>
  );
}

// --- Main Component ---

interface Props {
  masterData: {
    budgets: MasterItem[];
    lensTypes: LensType[];
  };
  onRefresh: () => void;
}

export default function LensMatrixTab({ masterData, onRefresh }: Props) {
  const [brands, setBrands] = useState<LensBrand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // States Sub-Options per Selected Brand
  const [brandOptions, setBrandOptions] = useState<{
    lensTypes: (BrandLensType & { lens_type: { id: string; name: string } })[];
    indexes: BrandLensIndex[];
    colors: BrandLensColor[];
    coatings: BrandLensCoating[];
  }>({ lensTypes: [], indexes: [], colors: [], coatings: [] });

  // Form States
  const [brandName, setBrandName] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [brandDesc, setBrandDesc] = useState('');

  // Form Sub-Input
  const [selectedLensType, setSelectedLensType] = useState('');
  const [basePrice, setBasePrice] = useState<number | string>('');

  const [indexValue, setIndexValue] = useState('1.56');
  const [indexAdder, setIndexAdder] = useState<number | string>('');
  const [indexDesc, setIndexDesc] = useState('');

  const [colorName, setColorName] = useState('');
  const [colorAdder, setColorAdder] = useState<number | string>('');

  const [coatingName, setCoatingName] = useState('');
  const [coatingAdder, setCoatingAdder] = useState<number | string>('');

  // Fetch Brands
  const fetchBrands = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('lens_brands').select('*, budget_range:budget_ranges(name)').order('name');
    setBrands(data || []);
    if (data && data.length > 0 && !selectedBrandId) {
      setSelectedBrandId(data[0].id);
    }
  };

  const fetchSelectedBrandOptions = useCallback(async (brandId: string) => {
    setLoading(true);
    const res = await getBrandMatrixOptions(brandId);
    setBrandOptions(res);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedBrandId) {
      fetchSelectedBrandOptions(selectedBrandId);
    }
  }, [selectedBrandId, fetchSelectedBrandOptions]);

  // Helper to refresh options after any mutation
  const refreshOptions = () => {
    if (selectedBrandId) fetchSelectedBrandOptions(selectedBrandId);
  };

  // --- Handlers ---
  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !selectedBudget) return;
    await createLensBrand(brandName, selectedBudget, brandDesc);
    setBrandName('');
    setBrandDesc('');
    fetchBrands();
  };

  const handleSetLensType = async () => {
    if (!selectedBrandId || !selectedLensType) return;
    await setBrandLensType(selectedBrandId, selectedLensType, Number(basePrice));
    setSelectedLensType('');
    setBasePrice('');
    refreshOptions();
  };

  const handleAddIndex = async () => {
    if (!selectedBrandId || !indexValue) return;
    await addBrandLensIndex({
      brand_id: selectedBrandId,
      index_value: indexValue,
      price_adder: Number(indexAdder),
      description: indexDesc,
    });
    setIndexValue('1.56');
    setIndexAdder('');
    setIndexDesc('');
    refreshOptions();
  };

  const handleAddColor = async () => {
    if (!selectedBrandId || !colorName) return;
    await addBrandLensColor(selectedBrandId, colorName, Number(colorAdder));
    setColorName('');
    setColorAdder('');
    refreshOptions();
  };

  const handleAddCoating = async () => {
    if (!selectedBrandId || !coatingName) return;
    await addBrandLensCoating(selectedBrandId, coatingName, Number(coatingAdder));
    setCoatingName('');
    setCoatingAdder('');
    refreshOptions();
  };

  // --- Delete Handlers ---
  const handleDeleteLensType = async (id: string) => {
    setDeletingId(id);
    await deleteBrandLensType(id);
    setDeletingId(null);
    refreshOptions();
  };

  const handleDeleteIndex = async (id: string) => {
    setDeletingId(id);
    await deleteBrandLensIndex(id);
    setDeletingId(null);
    refreshOptions();
  };

  const handleDeleteColor = async (id: string) => {
    setDeletingId(id);
    await deleteBrandLensColor(id);
    setDeletingId(null);
    refreshOptions();
  };

  const handleDeleteCoating = async (id: string) => {
    setDeletingId(id);
    await deleteBrandLensCoating(id);
    setDeletingId(null);
    refreshOptions();
  };

  // --- Update Handlers ---
  const handleUpdateLensType = async (id: string, basePrice: number) => {
    await updateBrandLensType(id, basePrice);
    setEditingId(null);
    refreshOptions();
  };

  const handleUpdateIndex = async (id: string, payload: { index_value?: string; price_adder?: number; description?: string }) => {
    await updateBrandLensIndex(id, payload);
    setEditingId(null);
    refreshOptions();
  };

  const handleUpdateColor = async (id: string, name: string, adder: number) => {
    await updateBrandLensColor(id, name, adder);
    setEditingId(null);
    refreshOptions();
  };

  const handleUpdateCoating = async (id: string, name: string, adder: number) => {
    await updateBrandLensCoating(id, name, adder);
    setEditingId(null);
    refreshOptions();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">
      
      {/* Kolom 1: Tambah & Pilih Merek Lensa */}
      <div className="space-y-6">
        <form onSubmit={handleAddBrand} className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-4">
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
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1">Kategori Budget</label>
            <select
              required
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
            >
              <option value="">-- Pilih Budget --</option>
              {masterData.budgets.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-500 mb-1">Deskripsi Opsional</label>
            <textarea
              placeholder="Lensa buatan Prancis dengan garansi coating 2 tahun..."
              value={brandDesc}
              onChange={(e) => setBrandDesc(e.target.value)}
              className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900 h-20"
            />
          </div>

          <button type="submit" className="w-full bg-charcoal-900 hover:bg-stone-800 text-cream-50 font-semibold py-2.5 rounded-sm transition">
            Simpan Merek
          </button>
        </form>

        {/* Daftar Merek Terdaftar */}
        <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-3">
          <h4 className="font-serif font-normal text-stone-600 text-xs uppercase tracking-wider">Pilih Merek untuk Dikonfigurasi:</h4>
          <div className="space-y-2">
            {brands.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBrandId(b.id)}
                className={`w-full text-left p-3 rounded-sm border transition flex justify-between items-center ${
                  selectedBrandId === b.id
                    ? 'bg-stone-200 border-charcoal-900 text-charcoal-900 font-semibold'
                    : 'bg-cream-100 border-cream-300 text-stone-500 hover:text-charcoal-900'
                }`}
              >
                <div>
                  <div>{b.name}</div>
                  <div className="text-[11px] text-stone-400 font-normal">{b.budget_range?.name}</div>
                </div>
                {selectedBrandId === b.id && <Check className="w-4 h-4 text-stone-500" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kolom 2 & 3: Panel Konfigurasi Matrix Merek Terpilih */}
      <div className="lg:col-span-2 space-y-6">
        {!selectedBrandId ? (
          <div className="bg-cream-50 border border-cream-300 p-8 rounded-sm text-center text-stone-400">
            Pilih atau tambah merek lensa di sebelah kiri untuk mengatur opsi harganya.
          </div>
        ) : (
          <>
            {/* 1. Atur Tipe Lensa & Harga Dasar */}
            <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-4">
              <h3 className="font-serif font-normal text-charcoal-900 text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-stone-500" />
                <span>1. Tipe Lensa & Harga Dasar</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={selectedLensType}
                  onChange={(e) => setSelectedLensType(e.target.value)}
                  className="bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
                >
                  <option value="">-- Pilih Tipe Lensa --</option>
                  {masterData.lensTypes.map((lt) => (
                    <option key={lt.id} value={lt.id}>{lt.name}</option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Harga Dasar (Rp)"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
                />

                <button onClick={handleSetLensType} className="bg-charcoal-900 hover:bg-stone-800 text-cream-50 font-semibold rounded-sm px-4 py-2 transition">
                  Set Tipe & Harga
                </button>
              </div>

              {/* Display configured lens types */}
              {brandOptions.lensTypes.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-cream-200">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Tipe Terkonfigurasi:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {brandOptions.lensTypes.map((lt) =>
                      editingId === lt.id ? (
                        <InlineEditLensType
                          key={lt.id}
                          item={lt}
                          onSave={handleUpdateLensType}
                          onCancel={() => setEditingId(null)}
                        />
                      ) : (
                        <EditableItemCard
                          key={lt.id}
                          id={lt.id}
                          label={lt.lens_type?.name || 'Unknown'}
                          sublabel={`Rp ${Number(lt.base_price).toLocaleString('id-ID')}`}
                          onDelete={handleDeleteLensType}
                          onEdit={setEditingId}
                          isDeleting={deletingId}
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Atur Ketebalan / Index Lensa */}
            <div className="bg-cream-50 border border-cream-300 p-5 rounded-sm space-y-4">
              <h3 className="font-serif font-normal text-charcoal-900 text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-stone-500" />
                <span>2. Indeks / Ketebalan Lensa</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Index (1.56/1.61)"
                  value={indexValue}
                  onChange={(e) => setIndexValue(e.target.value)}
                  className="bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
                />
                <input
                  type="number"
                  placeholder="+Harga (Rp)"
                  value={indexAdder}
                  onChange={(e) => setIndexAdder(e.target.value === '' ? '' : Number(e.target.value))}
                  className="bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
                />
                <input
                  type="text"
                  placeholder="Deskripsi rekomendasi"
                  value={indexDesc}
                  onChange={(e) => setIndexDesc(e.target.value)}
                  className="bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
                />
                <button onClick={handleAddIndex} className="bg-charcoal-900 hover:bg-stone-800 text-cream-50 font-semibold rounded-sm px-3 py-2 transition">
                  + Index
                </button>
              </div>

              {/* Display configured indexes */}
              {brandOptions.indexes.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-cream-200">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Index Terkonfigurasi:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {brandOptions.indexes.map((idx) =>
                      editingId === idx.id ? (
                        <InlineEditIndex
                          key={idx.id}
                          item={idx}
                          onSave={handleUpdateIndex}
                          onCancel={() => setEditingId(null)}
                        />
                      ) : (
                        <EditableItemCard
                          key={idx.id}
                          id={idx.id}
                          label={`Index ${idx.index_value}`}
                          sublabel={`+Rp ${Number(idx.price_adder).toLocaleString('id-ID')}${idx.description ? ` · ${idx.description}` : ''}`}
                          onDelete={handleDeleteIndex}
                          onEdit={setEditingId}
                          isDeleting={deletingId}
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Atur Opsi Warna & Coating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Warna */}
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
                    onChange={(e) => setColorName(e.target.value)}
                    className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
                  />
                  <input
                    type="number"
                    placeholder="+Harga Warna (Rp)"
                    value={colorAdder}
                    onChange={(e) => setColorAdder(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
                  />
                  <button onClick={handleAddColor} className="w-full bg-cream-200 hover:bg-cream-300 text-charcoal-900 py-2 rounded-sm transition">
                    + Tambah Warna
                  </button>
                </div>

                {/* Display configured colors */}
                {brandOptions.colors.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-cream-200">
                    <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Warna Terkonfigurasi:</p>
                    <div className="space-y-2">
                      {brandOptions.colors.map((c) =>
                        editingId === c.id ? (
                          <InlineEditSimple
                            key={c.id}
                            name={c.color_name}
                            adder={c.price_adder}
                            nameLabel="Nama Warna"
                            onSave={async (name, adder) => handleUpdateColor(c.id, name, adder)}
                            onCancel={() => setEditingId(null)}
                          />
                        ) : (
                          <EditableItemCard
                            key={c.id}
                            id={c.id}
                            label={c.color_name}
                            sublabel={`+Rp ${Number(c.price_adder).toLocaleString('id-ID')}`}
                            onDelete={handleDeleteColor}
                            onEdit={setEditingId}
                            isDeleting={deletingId}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Coating */}
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
                    onChange={(e) => setCoatingName(e.target.value)}
                    className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
                  />
                  <input
                    type="number"
                    placeholder="+Harga Coating (Rp)"
                    value={coatingAdder}
                    onChange={(e) => setCoatingAdder(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-cream-100 border border-cream-300 rounded-sm px-3 py-2 text-charcoal-900"
                  />
                  <button onClick={handleAddCoating} className="w-full bg-cream-200 hover:bg-cream-300 text-charcoal-900 py-2 rounded-sm transition">
                    + Tambah Coating
                  </button>
                </div>

                {/* Display configured coatings */}
                {brandOptions.coatings.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-cream-200">
                    <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Coating Terkonfigurasi:</p>
                    <div className="space-y-2">
                      {brandOptions.coatings.map((ct) =>
                        editingId === ct.id ? (
                          <InlineEditSimple
                            key={ct.id}
                            name={ct.coating_name}
                            adder={ct.price_adder}
                            nameLabel="Nama Coating"
                            onSave={async (name, adder) => handleUpdateCoating(ct.id, name, adder)}
                            onCancel={() => setEditingId(null)}
                          />
                        ) : (
                          <EditableItemCard
                            key={ct.id}
                            id={ct.id}
                            label={ct.coating_name}
                            sublabel={`+Rp ${Number(ct.price_adder).toLocaleString('id-ID')}`}
                            onDelete={handleDeleteCoating}
                            onEdit={setEditingId}
                            isDeleting={deletingId}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}