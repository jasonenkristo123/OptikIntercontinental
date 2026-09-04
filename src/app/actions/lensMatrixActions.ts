'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  BrandLensCoating,
  BrandLensColor,
  BrandLensIndex,
  BrandLensType,
  CreateLensIndexPayload,
  LensBrand,
} from '@/shared/types/database';

export async function getMatchingBrandsForWizard(budgetRangeId: string, lensTypeId: string) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from('lens_brands')
    .select(`
      id,
      name,
      description,
      logo_url,
      brand_lens_types!inner (
        id,
        lens_type_id,
        base_price,
        stock,
        is_available
      )
    `)
    .eq('budget_range_id', budgetRangeId)
    .eq('brand_lens_types.lens_type_id', lensTypeId)
    .eq('brand_lens_types.is_available', true)
    .eq('is_active', true);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getBrandMatrixOptions(brandId: string) {
  const supabase = await createAdminClient();

  const [lensTypes, indexes, colors, coatings] = await Promise.all([
    supabase
      .from('brand_lens_types')
      .select('*, lens_type:lens_types(id, name)')
      .eq('brand_id', brandId)
      .eq('is_available', true),
    supabase
      .from('brand_lens_indexes')
      .select('*')
      .eq('brand_id', brandId)
      .eq('is_available', true)
      .order('index_value'),
    supabase
      .from('brand_lens_colors')
      .select('*')
      .eq('brand_id', brandId)
      .eq('is_available', true),
    supabase
      .from('brand_lens_coatings')
      .select('*')
      .eq('brand_id', brandId)
      .eq('is_available', true),
  ]);

  return {
    lensTypes: (lensTypes.data || []) as (BrandLensType & { lens_type: { id: string; name: string } })[],
    indexes: (indexes.data || []) as BrandLensIndex[],
    colors: (colors.data || []) as BrandLensColor[],
    coatings: (coatings.data || []) as BrandLensCoating[],
  };
}

export async function createLensBrand(
  name: string,
  budgetRangeId: string,
  description?: string,
  logoUrl?: string
): Promise<LensBrand> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('lens_brands')
    .insert([{ name, budget_range_id: budgetRangeId, description, logo_url: logoUrl || null }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  return data as LensBrand;
}

export async function deleteLensBrand(id: string): Promise<void> {
  const supabase = await createAdminClient();
  const { error } = await supabase.from('lens_brands').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
}

export async function setBrandLensType(
  brandId: string,
  lensTypeId: string,
  basePrice: number,
  stock: number = 100
): Promise<BrandLensType> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('brand_lens_types')
    .upsert(
      {
        brand_id: brandId,
        lens_type_id: lensTypeId,
        base_price: basePrice,
        stock: stock,
        is_available: true,
      },
      { onConflict: 'brand_id,lens_type_id' }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  return data as BrandLensType;
}

export async function addBrandLensIndex(payload: CreateLensIndexPayload): Promise<BrandLensIndex> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('brand_lens_indexes')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  return data as BrandLensIndex;
}

export async function addBrandLensColor(
  brandId: string,
  colorName: string,
  priceAdder: number
): Promise<BrandLensColor> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('brand_lens_colors')
    .insert([{ brand_id: brandId, color_name: colorName, price_adder: priceAdder }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  return data as BrandLensColor;
}

export async function addBrandLensCoating(
  brandId: string,
  coatingName: string,
  priceAdder: number
): Promise<BrandLensCoating> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('brand_lens_coatings')
    .insert([{ brand_id: brandId, coating_name: coatingName, price_adder: priceAdder }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  return data as BrandLensCoating;
}

// --- DELETE actions ---


export async function deleteBrandLensType(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('brand_lens_types')
    .update({ is_available: false })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
}

export async function deleteBrandLensIndex(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('brand_lens_indexes')
    .update({ is_available: false })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
}

export async function deleteBrandLensColor(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('brand_lens_colors')
    .update({ is_available: false })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
}

export async function deleteBrandLensCoating(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('brand_lens_coatings')
    .update({ is_available: false })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
}

// --- UPDATE actions ---

export async function updateBrandLensType(id: string, basePrice: number) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('brand_lens_types')
    .update({ base_price: basePrice })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
}

export async function updateBrandLensIndex(
  id: string,
  payload: { price_adder?: number; description?: string; index_value?: string; color_id?: string | null; coating_id?: string | null }
) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('brand_lens_indexes')
    .update(payload)
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
}

export async function updateBrandLensColor(
  id: string,
  colorName: string,
  priceAdder: number
) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('brand_lens_colors')
    .update({ color_name: colorName, price_adder: priceAdder })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
}

export async function updateBrandLensCoating(
  id: string,
  coatingName: string,
  priceAdder: number
) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('brand_lens_coatings')
    .update({ coating_name: coatingName, price_adder: priceAdder })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
}