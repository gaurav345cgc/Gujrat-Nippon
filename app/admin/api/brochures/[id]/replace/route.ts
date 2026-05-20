import { requireValidSession } from '@/lib/auth/guards';
import { writeAuditLog } from '@/lib/auth/audit';
import { replaceBrochureFile } from '@/lib/brochures/service';
import { validateBrochureFile } from '@/lib/brochures/validate';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const { id } = await context.params;
  const ip = getClientIp(request);
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) return jsonError('PDF file is required.', 400);
  const fileError = validateBrochureFile(file);
  if (fileError) return jsonError(fileError, 400);

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await replaceBrochureFile({
      brochureId: id,
      file: {
        buffer,
        mimeType: file.type,
        originalFilename: file.name,
        size: file.size,
      },
      actorId: session.user.id,
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: 'brochure.replaced',
      entityType: 'brochure',
      entityId: id,
      metadata: { slug: result.brochure.slug, versionNo: result.version.version_no },
      ip,
    });

    return jsonOk({ ok: true, version: result.version });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Replace failed.';
    return jsonError(message, 500);
  }
}
