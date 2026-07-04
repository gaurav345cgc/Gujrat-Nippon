import { requireValidSession } from '@/lib/auth/guards';
import { writeAuditLog } from '@/lib/auth/audit';
import { setBrochureThumbnail } from '@/lib/brochures/service';
import { validateThumbnailFile } from '@/lib/brochures/validate';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const { id } = await context.params;
  const ip = getClientIp(request);
  const formData = await request.formData();
  const file = formData.get('thumbnail');
  const thumbnailUrl = String(formData.get('thumbnailUrl') ?? '').trim() || null;

  try {
    if (file instanceof File && file.size > 0) {
      const thumbError = validateThumbnailFile(file);
      if (thumbError) return jsonError(thumbError, 400);

      const buffer = Buffer.from(await file.arrayBuffer());
      const url = await setBrochureThumbnail({
        brochureId: id,
        actorId: session.user.id,
        file: { buffer, mimeType: file.type },
      });

      await writeAuditLog({
        actorId: session.user.id,
        action: 'brochure.thumbnail_updated',
        entityType: 'brochure',
        entityId: id,
        metadata: { source: 'upload' },
        ip,
      });

      return jsonOk({ thumbnailUrl: url });
    }

    const url = await setBrochureThumbnail({
      brochureId: id,
      actorId: session.user.id,
      thumbnailUrl,
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: 'brochure.thumbnail_updated',
      entityType: 'brochure',
      entityId: id,
      metadata: { source: 'url', thumbnailUrl: url },
      ip,
    });

    return jsonOk({ thumbnailUrl: url });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Thumbnail update failed.';
    return jsonError(message, 500);
  }
}
