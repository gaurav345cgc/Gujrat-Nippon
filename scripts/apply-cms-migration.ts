/**
 * Verifies CMS tables exist. Optionally applies migration 008 when SUPABASE_DB_URL is set.
 *
 * Run: npm run db:migrate:cms
 *
 * Manual apply (no DB URL): paste supabase/migrations/008_cms_pages.sql in Supabase SQL Editor.
 */
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import ws from 'ws';
import pg from 'pg';
import { createAdminClient } from '../lib/supabase/admin';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const CMS_TABLES = {
  pages: 'id',
  page_sections: 'id',
  seo_metadata: 'id',
  page_revisions: 'id',
  publish_logs: 'id',
  site_settings: 'key',
} as const;

async function tablesExist(): Promise<{ ok: boolean; results: Record<string, string> }> {
  const admin = createAdminClient();
  const results: Record<string, string> = {};
  let ok = true;

  for (const [table, column] of Object.entries(CMS_TABLES)) {
    const { error } = await admin.from(table).select(column).limit(1);
    if (error) {
      ok = false;
      results[table] = `MISSING (${error.message})`;
    } else {
      results[table] = 'OK';
    }
  }

  return { ok, results };
}

async function applySqlFile(dbUrl: string): Promise<void> {
  const sql = readFileSync(resolve(process.cwd(), 'supabase/migrations/008_cms_pages.sql'), 'utf8');
  const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql);
    console.log('Executed supabase/migrations/008_cms_pages.sql');
  } finally {
    await client.end();
  }
}

async function main() {
  const initial = await tablesExist();
  if (initial.ok) {
    for (const [table, status] of Object.entries(initial.results)) {
      console.log(`${table}: ${status}`);
    }
    console.log('\nCMS migration 008 is applied.');
    return;
  }

  const dbUrl = process.env.SUPABASE_DB_URL?.trim();
  if (dbUrl) {
    console.log('CMS tables missing — applying migration via SUPABASE_DB_URL...');
    await applySqlFile(dbUrl);
    const after = await tablesExist();
    if (after.ok) {
      console.log('CMS migration 008 applied successfully.');
      return;
    }
    console.error('Migration ran but tables still missing. Check SQL errors and PostgREST schema cache.');
    process.exit(1);
  }

  const migrationPath = resolve(process.cwd(), 'supabase/migrations/008_cms_pages.sql');
  console.log('CMS tables missing.\n');
  for (const [table, status] of Object.entries(initial.results)) {
    console.log(`${table}: ${status}`);
  }
  console.log('\nApply migration:');
  console.log('  Option A — Supabase Dashboard → SQL Editor → paste:');
  console.log(`    ${migrationPath}`);
  console.log('  Option B — set SUPABASE_DB_URL in .env (Database → Connection string) and re-run:');
  console.log('    npm run db:migrate:cms');
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
