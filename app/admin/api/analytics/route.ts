import { requireValidSession } from '@/lib/auth/guards';
import {
  getAnalyticsSummary,
  getDailyMetrics,
  getTopBrochureDownloads,
} from '@/lib/analytics/service';
import { jsonError, jsonOk } from '@/lib/http';

export async function GET() {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  try {
    const [summary, daily, topBrochures] = await Promise.all([
      getAnalyticsSummary(30),
      getDailyMetrics(14),
      getTopBrochureDownloads(30, 8),
    ]);
    return jsonOk({ summary, daily, topBrochures });
  } catch {
    return jsonError('Failed to load analytics.', 500);
  }
}
