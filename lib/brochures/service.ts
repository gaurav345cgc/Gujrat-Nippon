import { invalidateBrochuresModule } from '@/lib/admin/cache/invalidate';
import { recordBrochureDownloadEvent } from '@/lib/analytics/service';
import { createAdminClient } from '@/lib/supabase/admin';
import { slugifyTitle, uniqueBrochureSlug } from '@/lib/brochures/slug';
import {
  buildStorageKey,
  downloadBrochurePdf,
  removeBrochureThumbnailByUrl,
  sha256Buffer,
  uploadBrochurePdf,
  uploadBrochureThumbnail,
} from '@/lib/brochures/storage';
import { BROCHURE_BUCKET, BROCHURE_CATEGORIES, type BrochureCategory } from '@/lib/brochures/constants';

export type BrochureListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url: string | null;
  published: boolean;
  sort_order: number;
  download_count: number;
  updated_at: string;
  file_size_bytes: number | null;
  original_filename: string | null;
  version_no: number | null;
};

async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const admin = createAdminClient();
  let q = admin.from('brochures').select('id').eq('slug', slug);
  if (excludeId) q = q.neq('id', excludeId);
  const { data } = await q.maybeSingle();
  return !!data;
}

export async function listBrochuresAdmin(): Promise<BrochureListItem[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('brochures')
    .select(
      `
      id, slug, title, description, category, thumbnail_url,
      published, sort_order, download_count, updated_at, current_version_id
    `
    )
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true });

  if (error) throw error;

  const items = data ?? [];
  const versionIds = items.map((b) => b.current_version_id).filter(Boolean) as string[];

  let versions: Record<string, { file_size_bytes: number; original_filename: string; version_no: number }> = {};
  if (versionIds.length) {
    const { data: vrows } = await admin
      .from('brochure_versions')
      .select('id, file_size_bytes, original_filename, version_no')
      .in('id', versionIds);
    versions = Object.fromEntries((vrows ?? []).map((v) => [v.id, v]));
  }

  return items.map((b) => {
    const v = b.current_version_id ? versions[b.current_version_id] : null;
    return {
      id: b.id,
      slug: b.slug,
      title: b.title,
      description: b.description,
      category: b.category,
      thumbnail_url: b.thumbnail_url,
      published: b.published,
      sort_order: b.sort_order,
      download_count: b.download_count,
      updated_at: b.updated_at,
      file_size_bytes: v?.file_size_bytes ?? null,
      original_filename: v?.original_filename ?? null,
      version_no: v?.version_no ?? null,
    };
  });
}

export async function listBrochuresPublic() {
  const admin = createAdminClient();
  const { data: brochures, error } = await admin
    .from('brochures')
    .select(
      `
      id, slug, title, description, category, thumbnail_url,
      sort_order, download_count, updated_at, current_version_id
    `
    )
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true });

  if (error) throw error;

  const rows = brochures ?? [];
  const versionIds = rows.map((b) => b.current_version_id).filter(Boolean) as string[];
  let versions: Record<string, { file_size_bytes: number; version_no: number }> = {};
  if (versionIds.length) {
    const { data: vrows } = await admin
      .from('brochure_versions')
      .select('id, file_size_bytes, version_no')
      .in('id', versionIds);
    versions = Object.fromEntries((vrows ?? []).map((v) => [v.id, v]));
  }

  return rows.map((b) => {
    const v = b.current_version_id ? versions[b.current_version_id] : null;
    return {
      id: b.slug,
      slug: b.slug,
      title: b.title,
      description: b.description,
      category: b.category,
      type: 'PDF',
      size: v ? formatBytes(v.file_size_bytes) : '—',
      date: formatMonthYear(b.updated_at),
      url: `/download/${b.slug}`,
      image: b.thumbnail_url ?? '/brochures_thumbs/corporate.png',
      color: '#0077C0',
    };
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

export async function getNextBrochureSortOrder(): Promise<number> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('brochures')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.sort_order ?? -1) + 1;
}

export async function reorderBrochures(orderedIds: string[], actorId?: string) {
  const admin = createAdminClient();
  const now = new Date().toISOString();
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await admin
      .from('brochures')
      .update({
        sort_order: i,
        updated_at: now,
        ...(actorId ? { updated_by: actorId } : {}),
      })
      .eq('id', orderedIds[i]);
    if (error) throw error;
  }
  invalidateBrochuresModule();
}

export async function moveBrochure(params: {
  brochureId: string;
  direction: 'up' | 'down';
  actorId: string;
}) {
  const admin = createAdminClient();
  const { data: rows, error } = await admin
    .from('brochures')
    .select('id')
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true });

  if (error) throw error;

  const orderedIds = (rows ?? []).map((r) => r.id);
  const index = orderedIds.indexOf(params.brochureId);
  if (index < 0) throw new Error('Brochure not found');

  const targetIndex = params.direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= orderedIds.length) return;

  [orderedIds[index], orderedIds[targetIndex]] = [orderedIds[targetIndex], orderedIds[index]];
  await reorderBrochures(orderedIds, params.actorId);
}

export async function createBrochureWithFile(params: {
  title: string;
  description: string;
  category: BrochureCategory;
  thumbnailUrl?: string | null;
  published?: boolean;
  sortOrder?: number;
  slug?: string;
  file: { buffer: Buffer; mimeType: string; originalFilename: string; size: number };
  actorId: string;
}) {
  const admin = createAdminClient();
  const baseSlug = params.slug ? slugifyTitle(params.slug) : slugifyTitle(params.title);
  const slug = await uniqueBrochureSlug(baseSlug, (s) => slugExists(s));
  const sortOrder = params.sortOrder ?? (await getNextBrochureSortOrder());

  const { data: brochure, error: bErr } = await admin
    .from('brochures')
    .insert({
      slug,
      title: params.title.trim(),
      description: params.description.trim(),
      category: params.category,
      thumbnail_url: params.thumbnailUrl ?? null,
      published: params.published ?? false,
      sort_order: sortOrder,
      created_by: params.actorId,
      updated_by: params.actorId,
    })
    .select('id, slug')
    .single();

  if (bErr || !brochure) throw bErr ?? new Error('Failed to create brochure');

  const version = await addVersion({
    brochureId: brochure.id,
    file: params.file,
    actorId: params.actorId,
    versionNo: 1,
  });

  await admin
    .from('brochures')
    .update({
      current_version_id: version.id,
      updated_by: params.actorId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', brochure.id);

  invalidateBrochuresModule();
  return { ...brochure, versionId: version.id };
}

async function addVersion(params: {
  brochureId: string;
  file: { buffer: Buffer; mimeType: string; originalFilename: string; size: number };
  actorId: string;
  versionNo: number;
}) {
  const admin = createAdminClient();
  const storageKey = buildStorageKey(params.brochureId, params.versionNo);
  const checksum = sha256Buffer(params.file.buffer);

  await uploadBrochurePdf({
    storageKey,
    buffer: params.file.buffer,
    mimeType: params.file.mimeType,
  });

  const { data: version, error } = await admin
    .from('brochure_versions')
    .insert({
      brochure_id: params.brochureId,
      storage_key: storageKey,
      original_filename: params.file.originalFilename,
      mime_type: params.file.mimeType,
      file_size_bytes: params.file.size,
      checksum_sha256: checksum,
      version_no: params.versionNo,
      created_by: params.actorId,
    })
    .select('id, version_no, storage_key')
    .single();

  if (error || !version) throw error ?? new Error('Failed to save version');
  return version;
}

export async function replaceBrochureFile(params: {
  brochureId: string;
  file: { buffer: Buffer; mimeType: string; originalFilename: string; size: number };
  actorId: string;
}) {
  const admin = createAdminClient();
  const { data: brochure, error: bErr } = await admin
    .from('brochures')
    .select('id, slug, current_version_id')
    .eq('id', params.brochureId)
    .single();

  if (bErr || !brochure) throw bErr ?? new Error('Brochure not found');

  const { data: latest } = await admin
    .from('brochure_versions')
    .select('version_no')
    .eq('brochure_id', params.brochureId)
    .order('version_no', { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (latest?.version_no ?? 0) + 1;
  const version = await addVersion({
    brochureId: params.brochureId,
    file: params.file,
    actorId: params.actorId,
    versionNo: nextVersion,
  });

  await admin
    .from('brochures')
    .update({
      current_version_id: version.id,
      updated_by: params.actorId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.brochureId);

  invalidateBrochuresModule();
  return { brochure, version };
}

export async function getBrochureForDownload(slug: string) {
  const admin = createAdminClient();
  const { data: brochure, error } = await admin
    .from('brochures')
    .select('id, slug, title, published, download_count, current_version_id')
    .eq('slug', slug)
    .single();

  if (error || !brochure || !brochure.published || !brochure.current_version_id) {
    return null;
  }

  const { data: version } = await admin
    .from('brochure_versions')
    .select('storage_key, original_filename, mime_type')
    .eq('id', brochure.current_version_id)
    .single();

  if (!version) return null;

  const buffer = await downloadBrochurePdf(version.storage_key);
  return { brochure, version, buffer };
}

export async function incrementDownloadCount(brochureId: string) {
  const admin = createAdminClient();
  const [{ error: incrementError }, eventResult] = await Promise.all([
    admin.rpc('increment_brochure_download_count', { p_brochure_id: brochureId }),
    recordBrochureDownloadEvent(brochureId)
      .then(() => ({ error: null }))
      .catch((error) => ({ error })),
  ]);

  if (incrementError) throw incrementError;
  if (eventResult.error) {
    console.error('Brochure download event failed', brochureId, eventResult.error);
  }
  invalidateBrochuresModule();
}

export async function listBrochureVersions(brochureId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('brochure_versions')
    .select('id, version_no, original_filename, file_size_bytes, created_at, storage_key')
    .eq('brochure_id', brochureId)
    .order('version_no', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function setBrochureThumbnail(params: {
  brochureId: string;
  actorId: string;
  thumbnailUrl?: string | null;
  file?: { buffer: Buffer; mimeType: string };
}) {
  const admin = createAdminClient();
  const { data: existing, error: findErr } = await admin
    .from('brochures')
    .select('id, thumbnail_url')
    .eq('id', params.brochureId)
    .single();

  if (findErr || !existing) throw new Error('Brochure not found');

  let newUrl: string | null = null;

  if (params.file) {
    await removeBrochureThumbnailByUrl(existing.thumbnail_url);
    newUrl = await uploadBrochureThumbnail({
      brochureId: params.brochureId,
      buffer: params.file.buffer,
      mimeType: params.file.mimeType,
    });
  } else if (params.thumbnailUrl !== undefined) {
    const trimmed = params.thumbnailUrl?.trim() || null;
    if (trimmed !== existing.thumbnail_url) {
      await removeBrochureThumbnailByUrl(existing.thumbnail_url);
    }
    newUrl = trimmed;
  } else {
    return existing.thumbnail_url;
  }

  const { error } = await admin
    .from('brochures')
    .update({
      thumbnail_url: newUrl,
      updated_by: params.actorId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.brochureId);

  if (error) throw error;
  invalidateBrochuresModule();
  return newUrl;
}

export async function deleteBrochure(brochureId: string) {
  const admin = createAdminClient();

  const { data: brochure, error: bErr } = await admin
    .from('brochures')
    .select('id, slug, title, thumbnail_url')
    .eq('id', brochureId)
    .single();

  if (bErr || !brochure) throw new Error('Brochure not found');

  const { data: versions, error: vErr } = await admin
    .from('brochure_versions')
    .select('storage_key')
    .eq('brochure_id', brochureId);

  if (vErr) throw vErr;

  await removeBrochureThumbnailByUrl(brochure.thumbnail_url);

  const storageKeys = (versions ?? []).map((v) => v.storage_key).filter(Boolean);
  if (storageKeys.length) {
    const { error: storageErr } = await admin.storage.from(BROCHURE_BUCKET).remove(storageKeys);
    if (storageErr) throw new Error(storageErr.message);
  }

  const { error: delErr } = await admin.from('brochures').delete().eq('id', brochureId);
  if (delErr) throw delErr;

  invalidateBrochuresModule();
  return brochure;
}

export async function restoreBrochureVersion(params: {
  brochureId: string;
  versionId: string;
  actorId: string;
}) {
  const admin = createAdminClient();
  const { data: version, error } = await admin
    .from('brochure_versions')
    .select('id, brochure_id')
    .eq('id', params.versionId)
    .eq('brochure_id', params.brochureId)
    .single();
  if (error || !version) throw new Error('Version not found');

  await admin
    .from('brochures')
    .update({
      current_version_id: version.id,
      updated_by: params.actorId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.brochureId);
  invalidateBrochuresModule();
}

export { slugExists, slugifyTitle, uniqueBrochureSlug, BROCHURE_CATEGORIES };
