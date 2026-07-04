import { requireValidSession } from '@/lib/auth/guards';
import { writeAuditLog } from '@/lib/auth/audit';
import { BROCHURE_CATEGORIES } from '@/lib/brochures/constants';
import { validateBrochureFile, validateThumbnailFile } from '@/lib/brochures/validate';
import { createBrochureWithFile, listBrochuresAdmin, setBrochureThumbnail } from '@/lib/brochures/service';
import { getClientIp, jsonError, jsonOk } from '@/lib/http';

export async function GET() {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  try {
    const brochures = await listBrochuresAdmin();
    return jsonOk({ brochures });
  } catch {
    return jsonError('Failed to load brochures.', 500);
  }
}

export async function POST(request: Request) {
  const session = await requireValidSession();
  if (!session) return jsonError('Unauthorized', 401);

  const ip = getClientIp(request);
  const formData = await request.formData();

  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const category = String(formData.get('category') ?? 'Technical');
  const thumbnailUrl = String(formData.get('thumbnailUrl') ?? '').trim() || null;
  const thumbnailFile = formData.get('thumbnail');
  const published = formData.get('published') === 'true';
  const file = formData.get('file');

  if (!title) return jsonError('Title is required.', 400);
  if (!(BROCHURE_CATEGORIES as readonly string[]).includes(category)) {
    return jsonError('Invalid category.', 400);
  }
  if (!(file instanceof File)) return jsonError('PDF file is required.', 400);

  const fileError = validateBrochureFile(file);
  if (fileError) return jsonError(fileError, 400);

  if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
    const thumbError = validateThumbnailFile(thumbnailFile);
    if (thumbError) return jsonError(thumbError, 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const useUrlOnly = !(thumbnailFile instanceof File && thumbnailFile.size > 0);
    const result = await createBrochureWithFile({
      title,
      description,
      category: category as (typeof BROCHURE_CATEGORIES)[number],
      thumbnailUrl: useUrlOnly ? thumbnailUrl : null,
      published,
      file: {
        buffer,
        mimeType: file.type,
        originalFilename: file.name,
        size: file.size,
      },
      actorId: session.user.id,
    });

    if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
      const thumbBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
      await setBrochureThumbnail({
        brochureId: result.id,
        actorId: session.user.id,
        file: { buffer: thumbBuffer, mimeType: thumbnailFile.type },
      });
    }

    await writeAuditLog({
      actorId: session.user.id,
      action: 'brochure.created',
      entityType: 'brochure',
      entityId: result.id,
      metadata: { slug: result.slug, title },
      ip,
    });

    return jsonOk({ brochure: result }, 201);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Upload failed.';
    return jsonError(message, 500);
  }
}
