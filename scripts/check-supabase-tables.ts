import { config } from 'dotenv';
import { resolve } from 'path';
import ws from 'ws';
import { createAdminClient } from '../lib/supabase/admin';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

let admin;
try {
  admin = createAdminClient();
} catch {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const tables = ['profiles', 'brochures', 'faqs', 'inquiries', 'page_views'] as const;

async function main() {
  let ok = true;
  for (const table of tables) {
    const { error } = await admin.from(table).select('id', { head: true, count: 'exact' });
    if (error) {
      console.log(`${table}: MISSING — ${error.message}`);
      ok = false;
    } else {
      console.log(`${table}: OK`);
    }
  }
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
