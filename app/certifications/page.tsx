import PageHero from '@/components/PageHero';
import CmsCta from '@/components/cms/CmsCta';
import CmsTextBody from '@/components/cms/CmsTextBody';
import { generateCmsMetadata } from '@/lib/cms/metadata';
import { resolvePublicPage } from '@/lib/cms/gate';
import { mapHeroToPageHero } from '@/lib/cms/map-hero';
import type { CtaPayload, HeroPayload, TextPayload } from '@/lib/cms/types';
import styles from './Certifications.module.css';

export const generateMetadata = () => generateCmsMetadata('certifications');

export default async function CertificationsPage() {
  const page = await resolvePublicPage('certifications');
  const hero = page.sections.hero as HeroPayload;
  const intro = page.sections.intro as TextPayload;
  const compliance = page.sections.compliance_body as TextPayload;
  const cta = page.sections.cta as CtaPayload | undefined;

  const heroProps = mapHeroToPageHero(hero, { bgImage: '/hero_bg2.png' });
  const certItems = compliance.body.split(/\n\n+/).filter(Boolean);

  return (
    <main className={styles.pageWrapper}>
      <PageHero {...heroProps} />
      <div className={styles.container}>
        <section className={styles.section}>
          {intro.heading ? <h2 className={styles.sectionTitle}>{intro.heading}</h2> : null}
          <CmsTextBody body={intro.body} className={styles.sectionBody} />
        </section>

        <section className={styles.section}>
          {compliance.heading ? <h2 className={styles.sectionTitle}>{compliance.heading}</h2> : null}
          {certItems.map((item) => {
            const [title, ...rest] = item.split(' — ');
            const description = rest.join(' — ');
            return (
              <div key={item} className={styles.certBlock}>
                <h3 className={styles.sectionTitle} style={{ fontSize: '1.25rem' }}>
                  {title}
                </h3>
                {description ? <p className={styles.sectionBody}>{description}</p> : null}
              </div>
            );
          })}
        </section>

        {cta ? <CmsCta cta={cta} className={styles.ctaSection} /> : null}
      </div>
    </main>
  );
}
