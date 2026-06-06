import { config } from 'dotenv';
import { resolve } from 'path';
import ws from 'ws';
import { createAdminClient } from '../lib/supabase/admin';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

async function main() {
  const admin = createAdminClient();
  const result = await admin.from('pages').select('slug').limit(1);
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
