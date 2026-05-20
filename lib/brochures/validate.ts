import {
  ALLOWED_BROCHURE_MIME,
  ALLOWED_THUMBNAIL_MIME,
  MAX_BROCHURE_BYTES,
  MAX_THUMBNAIL_BYTES,
} from '@/lib/brochures/constants';

const THUMBNAIL_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

export function validateBrochureFile(file: File): string | null {
  if (!ALLOWED_BROCHURE_MIME.includes(file.type as (typeof ALLOWED_BROCHURE_MIME)[number])) {
    return 'Only PDF files are allowed.';
  }
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return 'File must have a .pdf extension.';
  }
  if (file.size > MAX_BROCHURE_BYTES) {
    return 'File exceeds the 50 MB limit.';
  }
  if (file.size === 0) {
    return 'File is empty.';
  }
  return null;
}

export function validateThumbnailFile(file: File): string | null {
  if (!ALLOWED_THUMBNAIL_MIME.includes(file.type as (typeof ALLOWED_THUMBNAIL_MIME)[number])) {
    return 'Thumbnail must be JPEG, PNG, WebP, or GIF.';
  }
  const lower = file.name.toLowerCase();
  if (!THUMBNAIL_EXT.some((ext) => lower.endsWith(ext))) {
    return 'Thumbnail must be an image file (.jpg, .png, .webp, or .gif).';
  }
  if (file.size > MAX_THUMBNAIL_BYTES) {
    return 'Thumbnail exceeds the 5 MB limit.';
  }
  if (file.size === 0) {
    return 'Thumbnail file is empty.';
  }
  return null;
}
