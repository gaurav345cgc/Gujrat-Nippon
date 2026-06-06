import LegalDocument from '@/components/cms/LegalDocument';
import { generateCmsMetadata } from '@/lib/cms/metadata';
import { resolvePublicPage } from '@/lib/cms/gate';
import type { TextPayload } from '@/lib/cms/types';

export const generateMetadata = () => generateCmsMetadata('cookies');

export default async function CookiesPage() {
  const page = await resolvePublicPage('cookies');

  return (
    <LegalDocument
      hero={page.sections.hero as TextPayload}
      intro={page.sections.intro as TextPayload}
      bodies={[page.sections.body_1, page.sections.body_2].filter(Boolean) as TextPayload[]}
    />
  );
}
