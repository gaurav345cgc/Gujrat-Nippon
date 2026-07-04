import Link from 'next/link';
import type { CtaPayload } from '@/lib/cms/types';
import CmsTextBody from '@/components/cms/CmsTextBody';

type Props = {
  cta: CtaPayload;
  className?: string;
};

export default function CmsCta({ cta, className }: Props) {
  const isExternal = cta.buttonHref.startsWith('http') || cta.buttonHref.startsWith('mailto:');

  return (
    <section className={className}>
      <h2>{cta.heading}</h2>
      {cta.body ? <CmsTextBody body={cta.body} /> : null}
      {isExternal ? (
        <a href={cta.buttonHref}>{cta.buttonLabel}</a>
      ) : (
        <Link href={cta.buttonHref}>{cta.buttonLabel}</Link>
      )}
    </section>
  );
}
