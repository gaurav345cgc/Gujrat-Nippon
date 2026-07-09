import PageHero from '@/components/PageHero';
import CmsCta from '@/components/cms/CmsCta';
import CmsTextBody from '@/components/cms/CmsTextBody';
import { generateCmsMetadata } from '@/lib/cms/metadata';
import { resolvePublicPage } from '@/lib/cms/gate';
import { mapHeroToPageHero } from '@/lib/cms/map-hero';
import type { CtaPayload, HeroPayload, TextPayload } from '@/lib/cms/types';
import styles from './Careers.module.css';

export const generateMetadata = () => generateCmsMetadata('careers');

export default async function CareersPage() {
  const page = await resolvePublicPage('careers');
  const hero = page.sections.hero as HeroPayload;
  const intro = page.sections.intro as TextPayload;
  const culture = page.sections.culture as TextPayload;
  const cta = page.sections.cta as CtaPayload;

  const heroProps = mapHeroToPageHero(hero, { bgImage: '/industries-hero-bg.jpg' });

  return (
    <main className={styles.pageWrapper}>
      <PageHero {...heroProps} />
      <div className={styles.container}>
        <section className={styles.section}>
          {intro.heading ? <h2 className={styles.sectionTitle}>{intro.heading}</h2> : null}
          <CmsTextBody body={intro.body} className={styles.sectionBody} />
        </section>

        <section className={styles.section}>
          {culture.heading ? <h2 className={styles.sectionTitle}>{culture.heading}</h2> : null}
          <CmsTextBody body={culture.body} className={styles.sectionBody} />
        </section>

      </div>

      <CmsCta cta={cta} />
    </main>
  );
}
