/**
 * Creates Supabase Storage buckets required for brochure management.
 *
 * Run: npm run db:setup:storage
 *
 * Alternative: run SQL migrations 003 and 004 in Supabase SQL Editor.
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import ws from 'ws';
import { createClient } from '@supabase/supabase-js';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureBucket(
  id: string,
  options: { public: boolean; fileSizeLimit: number; allowedMimeTypes: string[] }
) {
  const { data: buckets, error: listErr } = await admin.storage.listBuckets();
  if (listErr) throw new Error(`listBuckets: ${listErr.message}`);

  const exists = (buckets ?? []).some((b) => b.id === id || b.name === id);
  if (exists) {
    console.log(`✓ Bucket exists: ${id}`);
    return;
  }

  const { error } = await admin.storage.createBucket(id, {
    public: options.public,
    fileSizeLimit: options.fileSizeLimit,
    allowedMimeTypes: options.allowedMimeTypes,
  });

  if (error) {
    throw new Error(`createBucket(${id}): ${error.message}`);
  }

  console.log(`✓ Created bucket: ${id}`);
}

async function main() {
  console.log('Ensuring storage buckets…\n');

  await ensureBucket('brochures', {
    public: false,
    fileSizeLimit: 50 * 1024 * 1024,
    allowedMimeTypes: ['application/pdf'],
  });

  await ensureBucket('brochure-thumbnails', {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  });

  console.log('\nDone. You can create brochures in /admin/brochures.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
