"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Brochures.module.css';

const categories = ['All', 'Corporate', 'Technical', 'Certificates', 'Forms'];

type BrochureDoc = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  date: string;
  url: string;
  image: string;
  color: string;
};

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg} />
      <div className={styles.heroOverlay} />

      <div className={styles.heroAccentRing} />
      <div className={styles.heroAccentRing2} />

      <div className={styles.heroContent}>
        <div className={styles.heroLabel}>
          <span className={styles.labelDot} />
          Resources & Downloads
        </div>

        <h1 className={styles.heroTitle}>
          Product Brochures <span className={styles.heroTitleAccent}>{'& Technical Catalogues'}</span>
        </h1>

        <p className={styles.heroSub}>
          Corporate profiles, technical brochures and certificates for plant engineering, spares, capital
          equipment and export programmes — supplied in PDF format for engineering and procurement teams.
        </p>
      </div>

      <div className={styles.heroShapeBar}>
        <div className={styles.heroShapeTeal} />
        <div className={styles.heroShapeWhite} />
      </div>
    </section>
  );
}

function FilterBar({ active, onChange }: { active: string; onChange: (c: string) => void }) {
  return (
    <div className={styles.filterBar}>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`${styles.filterBtn} ${active === cat ? styles.filterBtnActive : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function BrochureGrid({
  filter,
  brochures,
}: {
  filter: string;
  brochures: BrochureDoc[];
}) {
  const filtered =
    filter === 'All' ? brochures : brochures.filter((b) => b.category === filter);

  if (filtered.length === 0) {
    return (
      <p className={styles.heroSub} style={{ textAlign: 'center', marginTop: '2rem' }}>
        No brochures in this category yet.
      </p>
    );
  }

  return (
    <div className={styles.grid}>
      {filtered.map((doc) => (
        <article key={doc.id} id={`brochure-${doc.id}`} className={styles.card}>
          <div className={styles.imageWrapper}>
            <img src={doc.image} alt={doc.title} className={styles.cardImage} />
          </div>

          <div className={styles.cardBody}>
            <h2 className={styles.cardTitle}>{doc.title}</h2>
            <div className={styles.cardDate}>{doc.date}</div>

            <a
              href={doc.url}
              className={styles.learnMore}
              aria-label={`Download PDF: ${doc.title}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download PDF
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

function CtaBanner() {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaInner}>
        <div className={styles.ctaLeft}>
          <p className={styles.ctaOverline}>
            <span className={styles.labelDot} style={{ background: '#fff' }} />
            Need Something Specific?
          </p>
          <h2 className={styles.ctaTitle}>
            Can&apos;t find what<br />
            you&apos;re looking <span className={styles.ctaTitleAccent}>for?</span>
          </h2>
        </div>
        <div className={styles.ctaRight}>
          <p className={styles.ctaText}>
            Our team is ready to provide custom documentation, technical datasheets, or
            any other material you may need for your project.
          </p>
          <Link href="/contact" className={styles.ctaBtn}>
            Enquire about our products
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function BrochuresClient() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [brochures, setBrochures] = useState<BrochureDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/brochures');
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setError(data.error ?? 'Could not load brochures.');
          return;
        }
        if (!cancelled) setBrochures(data.brochures ?? []);
      } catch {
        if (!cancelled) setError('Could not load brochures. Please try again later.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className={styles.page}>
      <HeroSection />

      <section className={styles.librarySection}>
        <div className={styles.libraryContainer}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelDot} style={{ background: 'var(--primary-teal)' }} />
            Document Library
          </div>

          <h2 className={styles.sectionTitle}>
            Browse & Download
            <span className={styles.sectionTitleAccent}> Resources</span>
          </h2>

          <FilterBar active={activeFilter} onChange={setActiveFilter} />

          {loading && (
            <p className={styles.heroSub} style={{ textAlign: 'center', marginTop: '2rem' }}>
              Loading brochures…
            </p>
          )}
          {error && !loading && (
            <p style={{ textAlign: 'center', marginTop: '2rem', color: '#b91c1c' }} role="alert">
              {error}
            </p>
          )}
          {!loading && !error && brochures.length === 0 && (
            <p className={styles.heroSub} style={{ textAlign: 'center', marginTop: '2rem' }}>
              No brochures are published yet. Check back soon.
            </p>
          )}
          {!loading && !error && brochures.length > 0 && (
            <BrochureGrid filter={activeFilter} brochures={brochures} key={activeFilter} />
          )}
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
