'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  createLensBrand,
  deleteLensBrand,
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
import type { MasterItem, LensType, LensBrand, BrandLensType, BrandLensIndex, BrandLensColor, BrandLensCoating } from '@/shared/types/database';
import { createClient } from '@/lib/supabase/client';

import { AddBrandForm, BrandSelector } from './lensMatrix/BrandSidebar';
import { LensTypeSection, IndexSection, ColorSection, CoatingSection } from './lensMatrix/ConfigSections';

interface Props {
  masterData: {
    budgets: MasterItem[];
    lensTypes: LensType[];
  };
  onRefresh: () => void;
}

type BrandOptions = {
  lensTypes: (BrandLensType & { lens_type: { id: string; name: string } })[];
  indexes: BrandLensIndex[];
  colors: BrandLensColor[];
  coatings: BrandLensCoating[];
};


export default function LensMatrixTab({ masterData }: Props) {
  // ---- Brand state ----
  const [brands, setBrands] = useState<LensBrand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [deletingBrandId, setDeletingBrandId] = useState<string | null>(null);

  // ---- Brand form ----
  const [brandName, setBrandName] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [brandDesc, setBrandDesc] = useState('');
  const [brandLogoUrl, setBrandLogoUrl] = useState('');

  // ---- Brand options ----
  const [brandOptions, setBrandOptions] = useState<BrandOptions>({
    lensTypes: [],
    indexes: [],
    colors: [],
    coatings: [],
  });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ---- Sub-option form state ----
  const [selectedLensType, setSelectedLensType] = useState('');
  const [basePrice, setBasePrice] = useState<number | string>('');

  const [indexLensType, setIndexLensType] = useState('');
  const [indexLevel, setIndexLevel] = useState('Standard');
  const [indexValue, setIndexValue] = useState('1.50');
  const [indexPrice, setIndexPrice] = useState<number | string>('');
  const [indexMinSph, setIndexMinSph] = useState<number | string>(-8.00);
  const [indexMaxSph, setIndexMaxSph] = useState<number | string>(5.50);
  const [indexMaxCyl, setIndexMaxCyl] = useState<number | string>(-4.00);
  const [indexMinAdd, setIndexMinAdd] = useState<number | string>(0.75);
  const [indexMaxAdd, setIndexMaxAdd] = useState<number | string>(3.50);
  const [indexMaxSc, setIndexMaxSc] = useState<number | string>(-8.00);
  const [indexDesc, setIndexDesc] = useState('');
  const [indexColorId, setIndexColorId] = useState('');
  const [indexCoatingId, setIndexCoatingId] = useState('');

  const [colorName, setColorName] = useState('');
  const [colorAdder, setColorAdder] = useState<number | string>('');

  const [coatingName, setCoatingName] = useState('');
  const [coatingAdder, setCoatingAdder] = useState<number | string>('');

  // ---- Data fetching ----

  const fetchBrands = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('lens_brands')
      .select('*, budget_range:budget_ranges(name)')
      .order('name');
    setBrands(data || []);
    if (data && data.length > 0 && !selectedBrandId) {
      setSelectedBrandId(data[0].id);
    }
  };

  const fetchBrandOptions = useCallback(async (brandId: string) => {
    setLoading(true);
    const res = await getBrandMatrixOptions(brandId);
    setBrandOptions(res);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBrands(); }, []);

  useEffect(() => {
    if (selectedBrandId) fetchBrandOptions(selectedBrandId);
  }, [selectedBrandId, fetchBrandOptions]);

  const refreshOptions = useCallback(() => {
    if (selectedBrandId) fetchBrandOptions(selectedBrandId);
  }, [selectedBrandId, fetchBrandOptions]);

  // ---- Brand handlers ----

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !selectedBudget) return;
    await createLensBrand(brandName, selectedBudget, brandDesc, brandLogoUrl || undefined);
    setBrandName('');
    setBrandDesc('');
    setBrandLogoUrl('');
    fetchBrands();
  };

  const handleDeleteBrand = async (id: string) => {
    setDeletingBrandId(id);
    await deleteLensBrand(id);
    setDeletingBrandId(null);
    if (selectedBrandId === id) setSelectedBrandId(null);
    fetchBrands();
  };

  // ---- Add handlers ----

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
      lens_type_id: indexLensType || null,
      lens_level: indexLevel.trim() || 'Standard',
      index_value: indexValue,
      price: Number(indexPrice) || 0,
      price_adder: Number(indexPrice) || 0,
      min_sph: Number(indexMinSph) || -8.0,
      max_sph: Number(indexMaxSph) || 5.5,
      max_cyl: Number(indexMaxCyl) || -4.0,
      min_add: Number(indexMinAdd) || 0.75,
      max_add: Number(indexMaxAdd) || 3.5,
      max_s_c: Number(indexMaxSc) || -8.0,
      description: indexDesc,
      color_id: indexColorId || null,
      coating_id: indexCoatingId || null,
    });
    setIndexValue('1.50');
    setIndexPrice('');
    setIndexDesc('');
    setIndexColorId('');
    setIndexCoatingId('');
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

  // ---- Delete handlers ----

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

  // ---- Update handlers ----

  const handleUpdateLensType = async (id: string, price: number) => {
    await updateBrandLensType(id, price);
    setEditingId(null);
    refreshOptions();
  };

  const handleUpdateIndex = async (
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
  ) => {
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

  // ---- Render ----

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">

      {/* Column 1 – Add brand + brand selector */}
      <div className="space-y-6">
        <AddBrandForm
          budgets={masterData.budgets}
          brandName={brandName}
          selectedBudget={selectedBudget}
          brandDesc={brandDesc}
          brandLogoUrl={brandLogoUrl}
          onBrandNameChange={setBrandName}
          onBudgetChange={setSelectedBudget}
          onDescChange={setBrandDesc}
          onLogoUrlChange={setBrandLogoUrl}
          onSubmit={handleAddBrand}
        />
        <BrandSelector
          brands={brands}
          selectedBrandId={selectedBrandId}
          deletingBrandId={deletingBrandId}
          onSelect={(id) => setSelectedBrandId(id)}
          onDelete={handleDeleteBrand}
        />
      </div>

      {/* Column 2 & 3 – Configuration panel */}
      <div className="lg:col-span-2 space-y-6">
        {!selectedBrandId ? (
          <div className="bg-cream-50 border border-cream-300 p-8 rounded-sm text-center text-stone-400">
            Pilih atau tambah merek lensa di sebelah kiri untuk mengatur opsi harganya.
          </div>
        ) : loading ? (
          <div className="bg-cream-50 border border-cream-300 p-8 rounded-sm text-center text-stone-400 animate-pulse">
            Memuat data...
          </div>
        ) : (
          <>
            <LensTypeSection
              lensTypes={masterData.lensTypes}
              configuredTypes={brandOptions.lensTypes}
              selectedLensType={selectedLensType}
              basePrice={basePrice}
              editingId={editingId}
              deletingId={deletingId}
              onSelectedLensTypeChange={setSelectedLensType}
              onBasePriceChange={setBasePrice}
              onAdd={handleSetLensType}
              onEdit={setEditingId}
              onCancelEdit={() => setEditingId(null)}
              onSave={handleUpdateLensType}
              onDelete={handleDeleteLensType}
            />

            <IndexSection
              indexes={brandOptions.indexes}
              lensTypes={masterData.lensTypes}
              colors={brandOptions.colors}
              coatings={brandOptions.coatings}
              selectedLensType={indexLensType}
              lensLevel={indexLevel}
              indexValue={indexValue}
              indexPrice={indexPrice}
              minSph={indexMinSph}
              maxSph={indexMaxSph}
              maxCyl={indexMaxCyl}
              minAdd={indexMinAdd}
              maxAdd={indexMaxAdd}
              maxSc={indexMaxSc}
              indexDesc={indexDesc}
              indexColorId={indexColorId}
              indexCoatingId={indexCoatingId}
              editingId={editingId}
              deletingId={deletingId}
              onSelectedLensTypeChange={setIndexLensType}
              onLensLevelChange={setIndexLevel}
              onIndexValueChange={setIndexValue}
              onIndexPriceChange={setIndexPrice}
              onMinSphChange={setIndexMinSph}
              onMaxSphChange={setIndexMaxSph}
              onMaxCylChange={setIndexMaxCyl}
              onMinAddChange={setIndexMinAdd}
              onMaxAddChange={setIndexMaxAdd}
              onMaxScChange={setIndexMaxSc}
              onIndexDescChange={setIndexDesc}
              onIndexColorIdChange={setIndexColorId}
              onIndexCoatingIdChange={setIndexCoatingId}
              onAdd={handleAddIndex}
              onEdit={setEditingId}
              onCancelEdit={() => setEditingId(null)}
              onSave={handleUpdateIndex}
              onDelete={handleDeleteIndex}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorSection
                colors={brandOptions.colors}
                colorName={colorName}
                colorAdder={colorAdder}
                editingId={editingId}
                deletingId={deletingId}
                onColorNameChange={setColorName}
                onColorAdderChange={setColorAdder}
                onAdd={handleAddColor}
                onEdit={setEditingId}
                onCancelEdit={() => setEditingId(null)}
                onSave={handleUpdateColor}
                onDelete={handleDeleteColor}
              />

              <CoatingSection
                coatings={brandOptions.coatings}
                coatingName={coatingName}
                coatingAdder={coatingAdder}
                editingId={editingId}
                deletingId={deletingId}
                onCoatingNameChange={setCoatingName}
                onCoatingAdderChange={setCoatingAdder}
                onAdd={handleAddCoating}
                onEdit={setEditingId}
                onCancelEdit={() => setEditingId(null)}
                onSave={handleUpdateCoating}
                onDelete={handleDeleteCoating}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}