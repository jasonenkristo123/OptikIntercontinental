'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { CreateFramePayload, Frame } from '@/shared/types/database';

export async function getFrames(): Promise<Frame[]> {
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
  return (data || []) as Frame[];
}

export async function createFrame(formData: CreateFramePayload): Promise<Frame> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('frames').insert([formData]).select().single();
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin');
  return data as Frame;
}

export async function updateFrame(id: string, updateData: Partial<CreateFramePayload>): Promise<Frame> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('frames')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin');
  return data as Frame;
}

export async function deleteFrame(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from('frames').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin');
  return true;
}