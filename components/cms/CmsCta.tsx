import Link from 'next/link';
import { ArrowRight, Clock3, ShieldCheck, Wrench } from 'lucide-react';
import type { CtaPayload } from '@/lib/cms/types';
import CmsTextBody from '@/components/cms/CmsTextBody';
import styles from './CmsCta.module.css';

type Props = {
  cta: CtaPayload;
  className?: string;
};

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: 'Dependable quality' },
  { icon: Wrench, label: 'Technical expertise' },
  { icon: Clock3, label: 'Timely delivery' },
] as const;

export default function CmsCta({ cta, className }: Props) {
  const isExternal =
    cta.buttonHref.startsWith('http') || cta.buttonHref.startsWith('mailto:');

  const button = (
    <>
      {cta.buttonLabel}
      <ArrowRight size={16} aria-hidden />
    </>
  );

  return (
    <section className={[styles.section, className].filter(Boolean).join(' ')}>
      <div className={styles.container}>
        <div className={styles.panel}>
          <div className={styles.headingArea}>
            <div className={styles.headingLine} aria-hidden />
            <h2 className={styles.heading}>{cta.heading}</h2>
          </div>

          {cta.body ? (
            <div className={styles.body}>
              <CmsTextBody body={cta.body} className={styles.bodyText} />
            </div>
          ) : null}

          <div className={styles.highlights} aria-label="Key strengths">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <span key={label} className={styles.highlight}>
                <Icon size={16} aria-hidden />
                {label}
              </span>
            ))}
          </div>

          <div className={styles.actions}>
            {isExternal ? (
              <a href={cta.buttonHref} className={styles.button}>
                {button}
              </a>
            ) : (
              <Link href={cta.buttonHref} className={styles.button}>
                {button}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
