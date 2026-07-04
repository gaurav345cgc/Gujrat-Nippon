import type { TextPayload } from '@/lib/cms/types';
import CmsTextBody from '@/components/cms/CmsTextBody';
import styles from '@/components/cms/LegalDocument.module.css';

type Props = {
  hero: TextPayload;
  intro: TextPayload;
  bodies: TextPayload[];
};

export default function LegalDocument({ hero, intro, bodies }: Props) {
  const title = hero.heading ?? hero.body.split('\n')[0];

  return (
    <main className={styles.pageWrapper}>
      <article className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          {hero.heading ? <p className={styles.lead}>{hero.body}</p> : null}
        </header>

        <section className={styles.section}>
          {intro.heading ? <h2 className={styles.sectionTitle}>{intro.heading}</h2> : null}
          <CmsTextBody body={intro.body} className={styles.sectionBody} />
        </section>

        {bodies.map((section) => (
          <section key={section.heading ?? section.body.slice(0, 24)} className={styles.section}>
            {section.heading ? <h2 className={styles.sectionTitle}>{section.heading}</h2> : null}
            <CmsTextBody body={section.body} className={styles.sectionBody} />
          </section>
        ))}
      </article>
    </main>
  );
}
