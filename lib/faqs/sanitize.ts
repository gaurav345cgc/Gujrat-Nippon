/** Strip basic HTML/script content from FAQ text fields. */
export function sanitizeFaqText(value: string): string {
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function sanitizeKeywords(raw: string[] | undefined): string[] {
  if (!raw?.length) return [];
  return [
    ...new Set(
      raw
        .map((k) => k.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, ''))
        .filter(Boolean)
    ),
  ].slice(0, 12);
}
