/** Strip scripts/HTML; preserve intentional newlines in body fields. */
export function sanitizeCmsText(value: string, preserveNewlines = false): string {
  const stripped = value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '');

  if (preserveNewlines) {
    return stripped
      .split('\n')
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  return stripped.replace(/\s+/g, ' ').trim();
}

export function sanitizePhone(value: string): string {
  return value.replace(/[^\d+\-().\s]/g, '').replace(/\s+/g, ' ').trim();
}
