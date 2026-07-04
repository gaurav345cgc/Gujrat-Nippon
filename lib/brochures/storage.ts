import { createHash, randomUUID } from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { BROCHURE_BUCKET, THUMBNAIL_BUCKET } from '@/lib/brochures/constants';

const THUMBNAIL_MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export function buildThumbnailStorageKey(brochureId: string, mimeType: string): string {
  const ext = THUMBNAIL_MIME_EXT[mimeType] ?? 'jpg';
  return `${brochureId}/${randomUUID()}.${ext}`;
}

export function getThumbnailStorageKeyFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = `/object/public/${THUMBNAIL_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length).split('?')[0] ?? '');
}

export async function uploadBrochureThumbnail(params: {
  brochureId: string;
  buffer: Buffer;
  mimeType: string;
}): Promise<string> {
  const admin = createAdminClient();
  const storageKey = buildThumbnailStorageKey(params.brochureId, params.mimeType);
  const { error } = await admin.storage.from(THUMBNAIL_BUCKET).upload(storageKey, params.buffer, {
    contentType: params.mimeType,
    upsert: false,
  });
  if (error) throw storageError(THUMBNAIL_BUCKET, error.message);

  const { data } = admin.storage.from(THUMBNAIL_BUCKET).getPublicUrl(storageKey);
  return data.publicUrl;
}

export async function removeBrochureThumbnailByUrl(url: string | null | undefined): Promise<void> {
  const storageKey = getThumbnailStorageKeyFromUrl(url);
  if (!storageKey) return;
  const admin = createAdminClient();
  await admin.storage.from(THUMBNAIL_BUCKET).remove([storageKey]);
}

export function buildStorageKey(brochureId: string, versionNo: number): string {
  return `${brochureId}/v${versionNo}-${randomUUID()}.pdf`;
}

export function sha256Buffer(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

export async function uploadBrochurePdf(params: {
  storageKey: string;
  buffer: Buffer;
  mimeType: string;
}): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.storage.from(BROCHURE_BUCKET).upload(params.storageKey, params.buffer, {
    contentType: params.mimeType,
    upsert: false,
  });
  if (error) {
    throw storageError(BROCHURE_BUCKET, error.message);
  }
}

function storageError(bucket: string, message: string): Error {
  if (message.toLowerCase().includes('bucket not found')) {
    return new Error(
      `Storage bucket "${bucket}" is missing. Run: npm run db:setup:storage (or apply supabase/migrations/003 and 004 in Supabase SQL Editor).`
    );
  }
  return new Error(message);
}

export async function downloadBrochurePdf(storageKey: string): Promise<Buffer> {
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(BROCHURE_BUCKET).download(storageKey);
  if (error || !data) {
    throw new Error(error?.message ?? 'File not found in storage.');
  }
  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function removeBrochurePdf(storageKey: string): Promise<void> {
  const admin = createAdminClient();
  await admin.storage.from(BROCHURE_BUCKET).remove([storageKey]);
}
