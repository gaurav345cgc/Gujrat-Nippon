export const BROCHURE_BUCKET = 'brochures';
export const THUMBNAIL_BUCKET = 'brochure-thumbnails';
export const MAX_BROCHURE_BYTES = 50 * 1024 * 1024; // 50 MB
export const MAX_THUMBNAIL_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_BROCHURE_MIME = ['application/pdf'] as const;
export const ALLOWED_THUMBNAIL_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
export const BROCHURE_CATEGORIES = ['Corporate', 'Technical', 'Certificates', 'Forms'] as const;

export type BrochureCategory = (typeof BROCHURE_CATEGORIES)[number];
