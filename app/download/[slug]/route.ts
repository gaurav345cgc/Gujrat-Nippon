import { getBrochureForDownload, incrementDownloadCount } from '@/lib/brochures/service';

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const result = await getBrochureForDownload(slug);
    if (!result) {
      return new Response('Not found', { status: 404 });
    }

    await incrementDownloadCount(result.brochure.id);

    const filename = result.version.original_filename || `${slug}.pdf`;
    return new Response(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        'Content-Type': result.version.mime_type || 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename.replace(/"/g, '')}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch {
    return new Response('Download failed', { status: 500 });
  }
}
