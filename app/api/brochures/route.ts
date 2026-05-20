import { listBrochuresPublic } from '@/lib/brochures/service';
import { jsonError, jsonOk } from '@/lib/http';

export async function GET() {
  try {
    const brochures = await listBrochuresPublic();
    return jsonOk({ brochures });
  } catch {
    return jsonError('Failed to load brochures.', 500);
  }
}
