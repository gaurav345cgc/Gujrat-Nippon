import React from 'react';
import Link from 'next/link';
import styles from './About.module.css';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { generateCmsMetadata } from '@/lib/cms/metadata';
import { resolvePublicPage } from '@/lib/cms/gate';
import {
  ABOUT_STATS,
  listAboutTextSections,
  parseStatsTextPayload,
} from '@/lib/cms/about-defaults';
import type { CtaPayload, HeroPayload, TextPayload } from '@/lib/cms/types';

export const generateMetadata = () => generateCmsMetadata('about');

const GOAL_IMAGES = ['/people_about.jpg', '/planet_about.jpg', '/profit_about.jpg'] as const;
const GOAL_KEYS = ['goal_people', 'goal_planet', 'goal_profits'] as const;

function splitHeading(heading: string, fallbackAccent: string) {
  const parts = heading.trim().split(/\s+/);
  if (parts.length <= 1) {
    return { first: heading, accent: fallbackAccent };
  }
  return { first: parts[0], accent: parts.slice(1).join(' ') || fallbackAccent };
}

export default async function AboutPage() {
  const page = await resolvePublicPage('about');
  const hero = page.sections.hero as HeroPayload;
  const companyOverview = page.sections.company_overview as TextPayload;
  const companyStats = page.sections.company_stats as TextPayload | undefined;
  const mission = page.sections.mission as TextPayload;
  const vision = page.sections.vision as TextPayload;
  const leadershipIntro = page.sections.leadership_intro as TextPayload;
  const goalsHeading = page.sections.goals_heading as TextPayload | undefined;
  const goalsMoreCta = page.sections.goals_more_cta as CtaPayload;
  const cta = page.sections.cta as CtaPayload;

  const heroAboutPrefix = hero.headline.startsWith('About ') ? 'About ' : '';
  const heroBrand = hero.headline.startsWith('About ') ? hero.headline.slice(6) : hero.headline;
  const overviewParagraphs = companyOverview.body.split(/\n\n+/).filter(Boolean);
  const stats = companyStats ? parseStatsTextPayload(companyStats) : ABOUT_STATS;
  const philosophyTabs = listAboutTextSections(page.sections, 'philosophy_tab', 4).map(
    (tab) => tab.heading ?? tab.body
  );
  const goals = GOAL_KEYS.map((key) => page.sections[key] as TextPayload);
  const goalsTitle = splitHeading(goalsHeading?.heading ?? 'Our Goals', 'Goals');
  const philosophyTitle = splitHeading(leadershipIntro.heading ?? 'Our Philosophy', 'Philosophy');
  const overviewTitle = splitHeading(companyOverview.heading ?? 'About Company', 'Company');

  return (
    <main className={styles.pageWrapper}>
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {heroAboutPrefix ? <span className={styles.heroTitleAbout}>{heroAboutPrefix}</span> : null}
            <span className={styles.heroTitleBrand}>{heroBrand}</span>
          </h1>
          {hero.subheadline ? <p className={styles.heroTitleLine2}>{hero.subheadline}</p> : null}
          {hero.body ? <p className={styles.heroSubtitle}>{hero.body}</p> : null}
        </div>
        <div className={styles.heroShapeContainer}>
          <div className={styles.heroShapeRed}></div>
          <div className={styles.heroShapeWhite}></div>
        </div>
      </section>

      <div className={styles.combinedDarkWrapper}>
        <div className={styles.connectingLine}></div>

        <section className={styles.darkSection}>
          <div className={styles.sharedContainer}>
            <div className={styles.twoColumnRow}>
              <div className={styles.aboutLeftTitleCol}>
                <h2 className={styles.sectionHeading}>
                  {overviewTitle.first}{' '}
                  <span className={styles.headingAccent}>{overviewTitle.accent}</span>
                </h2>
              </div>

              <div className={styles.aboutRightContentCol}>
                <div className={styles.statsRow}>
                  {stats.map((stat) => (
                    <div key={stat.label} className={styles.statItem}>
                      <span className={styles.statLabel}>{stat.label}</span>
                      <span className={styles.statNum}>{stat.value}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.aboutTextContainer}>
                  {overviewParagraphs.map((paragraph, index) => (
                    <div
                      key={index}
                      className={styles.aboutText}
                      style={index > 0 ? { marginTop: '1.25rem' } : undefined}
                    >
                      {paragraph}
                    </div>
                  ))}
                </div>

                <Link href={cta.buttonHref} className={styles.aboutBtnWhite}>
                  {cta.buttonLabel} <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.projectsSection}>
          <div className={styles.sharedContainer}>
            <div className={styles.twoColumnRow} style={{ marginBottom: '4rem' }}>
              <div className={styles.leftTitleCol}>
                <h2 className={styles.sectionHeading}>
                  {philosophyTitle.first}{' '}
                  <span className={styles.headingAccent}>{philosophyTitle.accent}</span>
                </h2>
              </div>
              <div className={styles.rightContentCol}>
                <div className={styles.projectsTopDesc}>{leadershipIntro.body}</div>
              </div>
            </div>

            <div className={styles.projectsLayout}>
              <div className={styles.projectsTabs}>
                {philosophyTabs.map((title, index) => {
                  const tabClass = index === 2 ? styles.tabBoxActive : styles.tabBox;
                  return (
                    <div key={title} className={tabClass}>
                      <div className={styles.tabTextContainer}>
                        <span className={styles.tabTitle}>{title}</span>
                      </div>
                      <span className={styles.tabNumber}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                  );
                })}
              </div>
              <div className={styles.projectsImageWrapper}>
                <div className={styles.projectsImage}></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.newsSection}>
        <div className={styles.newsContainer}>
          <div className={styles.newsHeader}>
            <h2 className={styles.newsTitle}>
              {goalsTitle.first}{' '}
              <span className={styles.newsTitleAccent}>{goalsTitle.accent}</span>
            </h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0077C0', cursor: 'pointer' }}><ArrowLeft size={20} /></div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0077C0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}><ArrowRight size={20} /></div>
            </div>
          </div>

          <div className={styles.newsGrid}>
            {goals.map((goal, index) => (
              <div key={goal.heading ?? index} className={styles.newsCard}>
                <img
                  src={GOAL_IMAGES[index] ?? GOAL_IMAGES[0]}
                  alt={`${goal.heading ?? 'Goal'} — Gujarat Nippon International`}
                  className={styles.newsCardImg}
                />
                <div className={styles.newsCardBody}>
                  <h3 className={styles.newsCardTitle}>{goal.heading}</h3>
                  <p className={styles.newsCardText}>{goal.body}</p>
                  <button type="button" className={styles.newsCardBtn}>
                    READ MORE <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link href={goalsMoreCta.buttonHref} className={styles.heroBtn} style={{ marginTop: '3rem' }}>
            {goalsMoreCta.buttonLabel} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialsContainer}>
          <div className={styles.testiHeader}>
            <h2 className={styles.testiTitle}>
              Vision & <br /><span className={styles.testiTitleAccent}>Mission</span>
            </h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0077C0', cursor: 'pointer' }}><ArrowLeft size={20} /></div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0077C0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}><ArrowRight size={20} /></div>
            </div>
          </div>

          <div className={styles.testiGrid}>
            <div className={styles.testiCard}>
              <p className={styles.testiText}>{vision.body}</p>
              <span className={styles.testiAuthor}>{vision.heading ?? 'Our Vision'}</span>
              <span style={{ color: '#0077C0', fontSize: '0.8rem', marginTop: '4px' }}>Gujarat Nippon International Pvt Ltd</span>
            </div>
            <div className={styles.testiCard}>
              <p className={styles.testiText}>{mission.body}</p>
              <span className={styles.testiAuthor}>{mission.heading ?? 'Our Mission'}</span>
              <span style={{ color: '#0077C0', fontSize: '0.8rem', marginTop: '4px' }}>Gujarat Nippon International Pvt Ltd</span>
            </div>
          </div>

          <Link href={cta.buttonHref} className={styles.heroBtn} style={{ marginTop: '3rem' }}>
            {cta.buttonLabel} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
