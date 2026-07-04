import type { HeroPayload } from '@/lib/cms/types';

export type PageHeroMapped = {
  label: string;
  titleMain: string;
  titleAccent: string;
  titleRest?: string;
  description: string;
  bgImage: string;
};

function splitHeadline(headline: string): { titleMain: string; titleAccent: string } {
  const trimmed = headline.trim();
  const commaIdx = trimmed.indexOf(',');

  if (commaIdx > 0) {
    return {
      titleMain: trimmed.slice(0, commaIdx).trim(),
      titleAccent: trimmed.slice(commaIdx + 1).trim(),
    };
  }

  const spaceIdx = trimmed.indexOf(' ');
  if (spaceIdx > 0) {
    return {
      titleMain: trimmed.slice(0, spaceIdx).trim(),
      titleAccent: trimmed.slice(spaceIdx + 1).trim(),
    };
  }

  return { titleMain: trimmed, titleAccent: '' };
}

/**
 * Maps CMS hero payload to PageHero props.
 * - subheadline → label (e.g. "Industries & services")
 * - headline → titleMain / titleAccent (comma or first-space split)
 * - body → description
 * Background image is template-specific and not CMS-editable in v1.
 */
export function mapHeroToPageHero(
  payload: HeroPayload,
  defaults: { bgImage?: string } = {}
): PageHeroMapped {
  const { titleMain, titleAccent } = splitHeadline(payload.headline);

  return {
    label: payload.subheadline?.trim() ?? '',
    titleMain,
    titleAccent,
    description: payload.body?.trim() ?? '',
    bgImage: defaults.bgImage ?? '',
  };
}
