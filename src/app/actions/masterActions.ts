'use server';

import { createClient } from '@/lib/supabase/server';
import { AuthenticityTag, FrameBrand, LensType, MasterItem } from '@/shared/types/database';
import { revalidatePath } from 'next/cache';

export async function getMasterData() {
  const supabase = await createClient();

  const [categories, materials, authenticity, lensTypes, budgets, frameBrands] = await Promise.all([
    supabase.from('frame_categories').select('*').order('name'),
    supabase.from('frame_materials').select('*').order('name'),
    supabase.from('authenticity_tags').select('*').order('name'),
    supabase.from('lens_types').select('*').order('name'),
    supabase.from('budget_ranges').select('*').order('name'),
    supabase.from('frame_brands').select('*').order('name'),
  ]);

  return {
    categories: (categories.data || []) as MasterItem[],
    materials: (materials.data || []) as MasterItem[],
    authenticity: (authenticity.data || []) as AuthenticityTag[],
    lensTypes: (lensTypes.data || []) as LensType[],
    budgets: (budgets.data || []) as MasterItem[],
    frameBrands: (frameBrands.data || []) as FrameBrand[],
  };
}

export async function createMasterItem(
  table: 'frame_categories' | 'frame_materials' | 'budget_ranges',
  name: string,
  description?: string
): Promise<MasterItem> {
  const supabase = await createClient();
  const payload: { name: string; description?: string } = { name };
  if (description) payload.description = description;

  const { data, error } = await supabase.from(table).insert([payload]).select().single();
  if (error) throw new Error(error.message);

  revalidatePath('/admin');
  return data as MasterItem;
}

export async function createFrameBrand(
  name: string,
  logoUrl?: string
): Promise<FrameBrand> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('frame_brands')
    .insert([{ name, logo_url: logoUrl || null }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  return data as FrameBrand;
}

export async function createAuthenticityTag(
  name: string,
  hasLogo: boolean,
  logoUrl?: string
): Promise<AuthenticityTag> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('authenticity_tags')
    .insert([{ name, has_logo: hasLogo, logo_url: logoUrl || null }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  return data as AuthenticityTag;
}

export async function createLensType(name: string, description?: string): Promise<LensType> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('lens_types')
    .insert([{ name, description }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  return data as LensType;
}

export async function deleteMasterItem(table: string, id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin');
  return true;
}