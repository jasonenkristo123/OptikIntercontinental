'use client';

import { useState, useEffect } from 'react';
import { 
  createLensBrand, 
  setBrandLensType, 
  addBrandLensIndex, 
  addBrandLensColor, 
  addBrandLensCoating,
  getBrandMatrixOptions
} from '@/app/actions/lensMatrixActions';
import { MasterItem, LensType, LensBrand, BrandLensIndex, BrandLensColor, BrandLensCoating } from '@/shared/types/database';
import { Plus, Sliders, Check, Layers, Palette, ShieldCheck, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  masterData: {
    budgets: MasterItem[];
    lensTypes: LensType[];
  };
  onRefresh: () => void;
}

export default function LensMatrixTab({ masterData, onRefresh }: Props) {
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // States Sub-Options per Selected Brand
  const [brandOptions, setBrandOptions] = useState<{
    indexes: BrandLensIndex[];
    colors: BrandLensColor[];
    coatings: BrandLensCoating[];
  }>({ indexes: [], colors: [], coatings: [] });

  // Form States
  const [brandName, setBrandName] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [brandDesc, setBrandDesc] = useState('');

  // Form Sub-Input
  const [selectedLensType, setSelectedLensType] = useState('');
  const [basePrice, setBasePrice] = useState(0);

  const [indexValue, setIndexValue] = useState('1.56');
  const [indexAdder, setIndexAdder] = useState(0);
  const [indexDesc, setIndexDesc] = useState('');

  const [colorName, setColorName] = useState('');
  const [colorAdder, setColorAdder] = useState(0);

  const [coatingName, setCoatingName] = useState('');
  const [coatingAdder, setCoatingAdder] = useState(0);

  // Fetch Brands
  const fetchBrands = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('lens_brands').select('*, budget_range:budget_ranges(name)').order('name');
    setBrands(data || []);
    if (data && data.length > 0 && !selectedBrandId) {
      setSelectedBrandId(data[0].id);
    }
  };

  const fetchSelectedBrandOptions = async (brandId: string) => {
    setLoading(true);
    const res = await getBrandMatrixOptions(brandId);
    setBrandOptions(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedBrandId) {
      fetchSelectedBrandOptions(selectedBrandId);
    }
  }, [selectedBrandId]);

  // Handlers
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
    await setBrandLensType(selectedBrandId, selectedLensType, basePrice);
    alert('Tipe Lensa & Harga Dasar berhasil dikonfigurasi!');
  };

  const handleAddIndex = async () => {
    if (!selectedBrandId || !indexValue) return;
    await addBrandLensIndex({
      brand_id: selectedBrandId,
      index_value: indexValue,
      price_adder: indexAdder,
      description: indexDesc,
    });
    fetchSelectedBrandOptions(selectedBrandId);
  };

  const handleAddColor = async () => {
    if (!selectedBrandId || !colorName) return;
    await addBrandLensColor(selectedBrandId, colorName, colorAdder);
    setColorName('');
    setColorAdder(0);
    fetchSelectedBrandOptions(selectedBrandId);
  };

  const handleAddCoating = async () => {
    if (!selectedBrandId || !coatingName) return;
    await addBrandLensCoating(selectedBrandId, coatingName, coatingAdder);
    setCoatingName('');
    setCoatingAdder(0);
    fetchSelectedBrandOptions(selectedBrandId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">
      
      {/* Kolom 1: Tambah & Pilih Merek Lensa */}
      <div className="space-y-6">
        <form onSubmit={handleAddBrand} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-500" />
            <span>Tambah Merek Lensa</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Nama Merek</label>
            <input
              type="text"
              required
              placeholder="Essilor, Hoya, Carl Zeiss..."
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Kategori Budget</label>
            <select
              required
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            >
              <option value="">-- Pilih Budget --</option>
              {masterData.budgets.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Deskripsi Opsional</label>
            <textarea
              placeholder="Lensa buatan Prancis dengan garansi coating 2 tahun..."
              value={brandDesc}
              onChange={(e) => setBrandDesc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white h-20"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition">
            Simpan Merek
          </button>
        </form>

        {/* Daftar Merek Terdaftar */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider">Pilih Merek untuk Dikonfigurasi:</h4>
          <div className="space-y-2">
            {brands.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBrandId(b.id)}
                className={`w-full text-left p-3 rounded-xl border transition flex justify-between items-center ${
                  selectedBrandId === b.id
                    ? 'bg-blue-600/10 border-blue-500 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div>
                  <div>{b.name}</div>
                  <div className="text-[11px] text-slate-500 font-normal">{b.budget_range?.name}</div>
                </div>
                {selectedBrandId === b.id && <Check className="w-4 h-4 text-blue-500" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kolom 2 & 3: Panel Konfigurasi Matrix Merek Terpilih */}
      <div className="lg:col-span-2 space-y-6">
        {!selectedBrandId ? (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-500">
            Pilih atau tambah merek lensa di sebelah kiri untuk mengatur opsi harganya.
          </div>
        ) : (
          <>
            {/* 1. Atur Tipe Lensa & Harga Dasar */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                <span>1. Tipe Lensa & Harga Dasar</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={selectedLensType}
                  onChange={(e) => setSelectedLensType(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
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
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />

                <button onClick={handleSetLensType} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl px-4 py-2">
                  Set Tipe & Harga
                </button>
              </div>
            </div>

            {/* 2. Atur Ketebalan / Index Lensa */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-500" />
                <span>2. Indeks / Ketebalan Lensa</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Index (1.56/1.61)"
                  value={indexValue}
                  onChange={(e) => setIndexValue(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="+Harga (Rp)"
                  value={indexAdder}
                  onChange={(e) => setIndexAdder(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Deskripsi rekomendasi"
                  value={indexDesc}
                  onChange={(e) => setIndexDesc(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
                <button onClick={handleAddIndex} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-3 py-2">
                  + Index
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {brandOptions.indexes.map((idx) => (
                  <span key={idx.id} className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
                    Index {idx.index_value} (+Rp {Number(idx.price_adder).toLocaleString('id-ID')})
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Atur Opsi Warna & Coating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Warna */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-500" />
                  <span>Opsional Warna</span>
                </h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nama Warna (Clear / Photochromic)"
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="number"
                    placeholder="+Harga Warna (Rp)"
                    value={colorAdder}
                    onChange={(e) => setColorAdder(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                  <button onClick={handleAddColor} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl">
                    + Tambah Warna
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {brandOptions.colors.map((c) => (
                    <span key={c.id} className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg text-xs text-slate-300">
                      {c.color_name} (+Rp {Number(c.price_adder).toLocaleString('id-ID')})
                    </span>
                  ))}
                </div>
              </div>

              {/* Coating */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>Opsional Coating</span>
                </h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nama Coating (Blue Protect)"
                    value={coatingName}
                    onChange={(e) => setCoatingName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="number"
                    placeholder="+Harga Coating (Rp)"
                    value={coatingAdder}
                    onChange={(e) => setCoatingAdder(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                  <button onClick={handleAddCoating} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl">
                    + Tambah Coating
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {brandOptions.coatings.map((ct) => (
                    <span key={ct.id} className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg text-xs text-slate-300">
                      {ct.coating_name} (+Rp {Number(ct.price_adder).toLocaleString('id-ID')})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}