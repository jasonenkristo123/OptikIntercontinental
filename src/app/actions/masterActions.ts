'use server';

import { createClient } from '@/lib/supabase/server';

// Fetch semua master option untuk Form Admin & Filter Frontend
export async function getMasterData() {
  const supabase = await createClient();

  const [categories, materials, authenticity, lensTypes, budgets] = await Promise.all([
    supabase.from('frame_categories').select('*').order('name'),
    supabase.from('frame_materials').select('*').order('name'),
    supabase.from('authenticity_tags').select('*').order('name'),
    supabase.from('lens_types').select('*').order('name'),
    supabase.from('budget_ranges').select('*').order('name'),
  ]);

  return {
    categories: categories.data || [],
    materials: materials.data || [],
    authenticity: authenticity.data || [],
    lensTypes: lensTypes.data || [],
    budgets: budgets.data || [],
  };
}

// Fetch katalog frames lengkap dengan data relasinya (category, material, authenticity badge)
export async function getFramesCatalog() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('frames')
    .select(`
      *,
      category:frame_categories(id, name),
      material:frame_materials(id, name),
      authenticity:authenticity_tags(id, name, has_logo, logo_url)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}