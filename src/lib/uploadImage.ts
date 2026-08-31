import imageCompression from 'browser-image-compression';
import { createClient } from '@/lib/supabase/client';

export async function uploadAndCompressImage(file: File): Promise<string> {
  const supabase = createClient();

  // 1. Opsi kompresi otomatis ke WebP max 800px lebar
  const options = {
    maxSizeMB: 0.3,           // Maksimal ukuran ~300KB
    maxWidthOrHeight: 1000,   // Resolusi cukup tinggi untuk kacamata
    useWebWorker: true,
    fileType: 'image/webp',   // Otomatis convert ke WebP
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const fileName = `frame-${Date.now()}.webp`;

    // 2. Upload langsung ke bucket Supabase Storage
    const { data, error } = await supabase.storage
      .from('optik-images')
      .upload(fileName, compressedFile, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (error) throw error;

    // 3. Ambil URL Publik Gambar
    const { data: publicUrlData } = supabase.storage
      .from('optik-images')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error compressing/uploading image:', error);
    throw error;
  }
}