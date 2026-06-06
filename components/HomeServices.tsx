"use client";

import styles from './HomeServices.module.css';
import Link from 'next/link';
import type { CtaPayload, TextPayload } from '@/lib/cms/types';

const DEFAULT_VIEW_CTA: CtaPayload = {
  heading: 'Services link',
  buttonLabel: 'View our services',
  buttonHref: '/products',
};

type Props = {
  heading?: string;
  body?: string;
  serviceCards: TextPayload[];
  viewCta?: CtaPayload;
};

function ServiceCard({ card }: { card: TextPayload }) {
  return (
    <div
      className={styles.serviceCard}
      style={{
        backgroundColor: '#0077C0',
        color: '#FFFFFF',
      }}
    >
      <h3 className={styles.cardTitle}>{card.heading}</h3>
      <p className={styles.cardDesc}>{card.body}</p>

      <div className={styles.buttons}>
        <div
          className={styles.iconBtn}
          style={{ backgroundColor: '#FFFFFF', color: '#0077C0' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <div className={styles.dlBtn} style={{ backgroundColor: '#FFFFFF', color: '#0077C0' }}>
          Download Brochure
        </div>
      </div>
    </div>
  );
}

export default function HomeServices({
  heading = 'Our Services',
  body = '',
  serviceCards,
  viewCta = DEFAULT_VIEW_CTA,
}: Props) {
  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.breadcrumb}>
            <span>• Our Services</span>
          </div>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>{heading}</h2>
            {body ? <p className={styles.description}>{body}</p> : null}
          </div>
          <div className={styles.actionContainer}>
            <Link href={viewCta.buttonHref} className={styles.learnMoreBtn}>
              {viewCta.buttonLabel} <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </div>

        <div className={styles.cardsGrid}>
          {serviceCards.map((card) => (
            <ServiceCard key={card.heading ?? card.body.slice(0, 24)} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
