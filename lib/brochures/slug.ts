export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export async function uniqueBrochureSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = base || 'brochure';
  let n = 0;
  while (await exists(slug)) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}
