/**
 * Imports PDFs from public/brochures/ into Supabase Storage + brochures tables.
 *
 * Prerequisites: run supabase/migrations/003_brochures.sql and db:seed (admin user).
 *
 * Run: npm run db:seed:brochures
 */
import { config } from 'dotenv';
import { existsSync, readFileSync, statSync } from 'fs';
import { resolve } from 'path';
import ws from 'ws';
import { createClient } from '@supabase/supabase-js';
import { createBrochureWithFile } from '../lib/brochures/service';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const actorEmail = (process.env.ADMIN_EMAIL ?? 'admin@example.com').trim().toLowerCase();

if (!url || !serviceKey) {
  throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SEED_ITEMS = [
  {
    slug: 'gujarat-nippon-corporate-profile',
    title: 'GNIPL & Associates Corporate Profile',
    description:
      'Comprehensive overview of Gujarat Nippon International Pvt. Ltd — our group history, diverse business verticals, and global footprint.',
    category: 'Corporate' as const,
    thumbnail: '/brochures_thumbs/corporate.png',
    sortOrder: 0,
    file: 'gujarat-nippon-corporate-profile.pdf',
  },
  {
    slug: 'aluminium-extrusion-catalogue-gujarat-nippon',
    title: 'Aluminium Extrusion Catalogue',
    description:
      'Technical specifications and product range for our high-precision aluminium extrusion profiles and architectural solutions.',
    category: 'Technical' as const,
    thumbnail: '/brochures_thumbs/aluminium_extrusion.png',
    sortOrder: 10,
    file: 'aluminium-extrusion-catalogue-gujarat-nippon.pdf',
  },
  {
    slug: 'cement-solutions-booklet-gujarat-nippon',
    title: 'G Nippon Cement Booklet',
    description:
      'Detailed information on our cement manufacturing processes, quality standards, and product performance metrics.',
    category: 'Technical' as const,
    thumbnail: '/brochures_thumbs/cement.png',
    sortOrder: 20,
    file: 'cement-solutions-booklet-gujarat-nippon.pdf',
  },
  {
    slug: 'mdf-wood-solutions-catalogue-gujarat-nippon',
    title: 'MDF & Wood Solutions Catalogue',
    description:
      'Explore our comprehensive range of high-density MDF boards, decorative laminates, and wood-based interior solutions.',
    category: 'Technical' as const,
    thumbnail: '/brochures_thumbs/mdf.png',
    sortOrder: 30,
    file: 'mdf-wood-solutions-catalogue-gujarat-nippon.pdf',
  },
  {
    slug: 'mining-equipment-catalogue-gujarat-nippon',
    title: 'Mining Equipment & Services',
    description:
      'Technical guide to our mining operations, equipment fleet, and specialized services for the extractive industries.',
    category: 'Technical' as const,
    thumbnail: '/brochures_thumbs/mining.png',
    sortOrder: 40,
    file: 'mining-equipment-catalogue-gujarat-nippon.pdf',
  },
  {
    slug: 'industrial-packing-solutions-gujarat-nippon',
    title: 'Industrial Packing Solutions',
    description:
      'Innovative packaging materials and customized logistics solutions for industrial goods and exports.',
    category: 'Technical' as const,
    thumbnail: '/brochures_thumbs/packing.png',
    sortOrder: 50,
    file: 'industrial-packing-solutions-gujarat-nippon.pdf',
  },
  {
    slug: 'plant-refurbishment-catalogue-gujarat-nippon',
    title: 'Plant Refurbishment Catalogue',
    description:
      'Comprehensive guide to our industrial plant refurbishment, modernization, and technical upgrade services.',
    category: 'Technical' as const,
    thumbnail: '/brochures_thumbs/refurbishment.png',
    sortOrder: 60,
    file: 'plant-refurbishment-catalogue-gujarat-nippon.pdf',
  },
  {
    slug: 'industrial-spares-catalogue-gujarat-nippon',
    title: 'Industrial Spares & Components',
    description:
      'Extensive inventory of high-quality industrial spare parts, precision components, and maintenance kits.',
    category: 'Technical' as const,
    thumbnail: '/brochures_thumbs/spares.png',
    sortOrder: 70,
    file: 'industrial-spares-catalogue-gujarat-nippon.pdf',
  },
];

async function getActorId(): Promise<string> {
  const { data: list } = await admin.auth.admin.listUsers();
  const user = list.users.find((u) => u.email?.toLowerCase() === actorEmail);
  if (!user) {
    throw new Error(`Admin user not found for ${actorEmail}. Run npm run db:seed first.`);
  }
  return user.id;
}

async function main() {
  const actorId = await getActorId();
  const publicDir = resolve(process.cwd(), 'public', 'brochures');
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < SEED_ITEMS.length; i++) {
    const item = SEED_ITEMS[i];
    const { data: existing } = await admin.from('brochures').select('id').eq('slug', item.slug).maybeSingle();
    if (existing) {
      console.log('Skip (exists):', item.slug);
      skipped++;
      continue;
    }

    const filePath = resolve(publicDir, item.file);
    if (!existsSync(filePath)) {
      console.warn('Skip (missing file):', filePath);
      skipped++;
      continue;
    }

    const buffer = readFileSync(filePath);
    const size = statSync(filePath).size;
    if (size > 50 * 1024 * 1024) {
      console.warn('Skip (too large):', item.file);
      skipped++;
      continue;
    }

    const result = await createBrochureWithFile({
      title: item.title,
      description: item.description,
      category: item.category,
      thumbnailUrl: item.thumbnail,
      published: true,
      sortOrder: i,
      slug: item.slug,
      file: {
        buffer,
        mimeType: 'application/pdf',
        originalFilename: item.file,
        size,
      },
      actorId,
    });

    console.log('Created:', item.slug, '→', result.id);
    created++;
  }

  console.log(`Done. Created ${created}, skipped ${skipped}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
