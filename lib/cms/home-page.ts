import type { TextPayload } from '@/lib/cms/types';
import {
  HOME_CAPABILITIES,
  HOME_PRODUCT_TEASERS,
  HOME_SERVICE_CARDS,
  listHomeTextSections,
  parseCapabilityTextPayload,
  productTeaserToTextPayload,
  serviceCardToTextPayload,
  type HomeCapability,
} from '@/lib/cms/home-defaults';

export function resolveHomeServiceCards(sections: Record<string, unknown>): TextPayload[] {
  const fromCms = listHomeTextSections(sections, 'service_card', 4);
  if (fromCms.length >= 4) return fromCms.slice(0, 4);
  return [
    ...fromCms,
    ...HOME_SERVICE_CARDS.slice(fromCms.length).map(serviceCardToTextPayload),
  ];
}

export function resolveHomeCapabilities(sections: Record<string, unknown>): HomeCapability[] {
  const fromCms = listHomeTextSections(sections, 'capability', 8).map(parseCapabilityTextPayload);
  if (fromCms.length >= 8) return fromCms.slice(0, 8);
  return [...fromCms, ...HOME_CAPABILITIES.slice(fromCms.length)];
}

export function resolveHomeProductTeasers(sections: Record<string, unknown>): TextPayload[] {
  const fromCms = listHomeTextSections(sections, 'product_teaser', 12);
  if (fromCms.length >= 12) return fromCms.slice(0, 12);
  return [
    ...fromCms,
    ...HOME_PRODUCT_TEASERS.slice(fromCms.length).map(productTeaserToTextPayload),
  ];
}
