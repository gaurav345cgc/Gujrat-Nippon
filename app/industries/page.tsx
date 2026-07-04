import React from 'react';
import styles from './Industries.module.css';
import Link from 'next/link';
import PageHero from '../../components/PageHero';
import { generateCmsMetadata } from '@/lib/cms/metadata';
import { resolvePublicPage } from '@/lib/cms/gate';
import { mapHeroToPageHero } from '@/lib/cms/map-hero';
import { INDUSTRY_CARD_ASSETS, resolveIndustryCards } from '@/lib/cms/industry-defaults';
import type { HeroPayload, TextPayload } from '@/lib/cms/types';

export const generateMetadata = () => generateCmsMetadata('industries');

export default async function IndustriesPage() {
  const page = await resolvePublicPage('industries');
  const hero = page.sections.hero as HeroPayload;
  const intro = page.sections.intro as TextPayload;
  const cardsIntro = page.sections.cards_intro as TextPayload | undefined;
  const industryCards = resolveIndustryCards(page.sections);

  const heroProps = mapHeroToPageHero(hero);

  return (
    <main className={styles.pageWrapper}>
      <PageHero {...heroProps} variant="industries" />

      <div className={styles.container}>
        <p className={styles.pageSubtitle}>{intro.body}</p>
        {cardsIntro?.body ? <p className={styles.pageSubtitle}>{cardsIntro.body}</p> : null}

        <div className={styles.grid}>
          {industryCards.map((industry, index) => {
            const asset = INDUSTRY_CARD_ASSETS[index] ?? INDUSTRY_CARD_ASSETS[0];
            const title = industry.heading ?? 'Industry';
            return (
              <article key={`${asset.slug}-${index}`} className={styles.industryCard}>
                <span className={styles.cardTag}>Industry</span>

                <div className={styles.cardImageWrapper}>
                  <img
                    src={asset.image}
                    alt={
                      asset.slug === 'steel-metal-processing'
                        ? 'Steel and metal processing — rolling mills, coil lines and plant supply, Gujarat Nippon International'
                        : `${title} sector — industrial supply and engineering solutions, Gujarat Nippon International`
                    }
                    className={styles.cardImage}
                  />
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{title}</h3>
                  <p className={styles.cardDesc}>{industry.body}</p>
                  <Link href={`/industries/${asset.slug}`} className={styles.learnMore}>
                    {`View ${title} solutions`}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
