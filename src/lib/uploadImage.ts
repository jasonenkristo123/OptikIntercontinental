import imageCompression from 'browser-image-compression';
import { createClient } from '@/lib/supabase/client';

export type UploadFolder = 'frames' | 'frame-brands' | 'lens-brands';

export async function uploadAndCompressImage(
  file: File,
  folder: UploadFolder = 'frames'
): Promise<string> {
  const supabase = createClient();

  // Konfigurasi kompresi: logo brand lebih kompak, frame photo lebih detail
  const isLogo = folder === 'frame-brands' || folder === 'lens-brands';

  const options = {
    maxSizeMB: isLogo ? 0.15 : 0.3,
    maxWidthOrHeight: isLogo ? 600 : 1000,
    useWebWorker: true,
    fileType: 'image/webp', // Otomatis convert ke WebP (mendukung transparansi)
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const prefix = isLogo ? 'logo' : 'frame';
    const filePath = `${folder}/${prefix}-${Date.now()}.webp`;

    // Upload langsung ke folder di bucket 'optik-images'
    const { error } = await supabase.storage
      .from('optik-images')
      .upload(filePath, compressedFile, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (error) throw error;

    // Ambil URL Publik Gambar
    const { data: publicUrlData } = supabase.storage
      .from('optik-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error(`Error compressing/uploading image to ${folder}:`, error);
    throw error;
  }
}