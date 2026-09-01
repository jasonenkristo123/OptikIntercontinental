'use server';

import { createClient } from '@/lib/supabase/server';
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
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('lens_brands')
    .select(`
      id,
      name,
      description,
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
  const supabase = await createClient();

  const [indexes, colors, coatings] = await Promise.all([
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
    indexes: (indexes.data || []) as BrandLensIndex[],
    colors: (colors.data || []) as BrandLensColor[],
    coatings: (coatings.data || []) as BrandLensCoating[],
  };
}

export async function createLensBrand(
  name: string,
  budgetRangeId: string,
  description?: string
): Promise<LensBrand> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('lens_brands')
    .insert([{ name, budget_range_id: budgetRangeId, description }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  return data as LensBrand;
}

export async function setBrandLensType(
  brandId: string,
  lensTypeId: string,
  basePrice: number,
  stock: number = 100
): Promise<BrandLensType> {
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brand_lens_coatings')
    .insert([{ brand_id: brandId, coating_name: coatingName, price_adder: priceAdder }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  return data as BrandLensCoating;
}