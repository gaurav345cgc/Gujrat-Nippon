import { config } from 'dotenv';
import { resolve } from 'path';
import ws from 'ws';
import { getPublishedPage } from '../lib/cms/public';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

async function main() {
  const about = await getPublishedPage('about');
  console.log(about === null ? 'getPublishedPage(about): null (draft OK)' : 'getPublishedPage(about): HAS DATA');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
