import React from 'react';
import styles from './Contact.module.css';
import ContactForm from '@/components/contact/ContactForm';
import { generateCmsMetadata } from '@/lib/cms/metadata';
import { resolvePublicPage } from '@/lib/cms/gate';
import type { ContactInfoPayload, TextPayload } from '@/lib/cms/types';

export const generateMetadata = () => generateCmsMetadata('contact');

export default async function ContactPage() {
  const page = await resolvePublicPage('contact');
  const pageHeader = page.sections.page_header as TextPayload;
  const contactInfo = page.sections.contact_info as ContactInfoPayload;
  const formIntro = page.sections.form_intro as TextPayload;

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageH1}>{pageHeader.heading ?? 'Contact Us'}</h1>
          <p className={styles.pageIntro}>{pageHeader.body}</p>
        </header>

        <div className={styles.contactLayout}>
          <section className={styles.companyInfo}>
            <h2 className={styles.companyName}>
              {contactInfo.heading ?? 'Gujarat Nippon International Pvt. Ltd.'}
            </h2>

            <address className={styles.infoBlock} style={{ fontStyle: 'normal', whiteSpace: 'pre-line' }}>
              {contactInfo.address}
            </address>

            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Tel:</span> {contactInfo.phone}
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>CIN:</span> U51900MH2004PTC149572
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Email:</span>{' '}
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            </div>

            {contactInfo.workingHours ? (
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Hours:</span> {contactInfo.workingHours}
              </div>
            ) : null}
          </section>

          <div>
            {formIntro.heading || formIntro.body ? (
              <div className={styles.infoBlock} style={{ marginBottom: '1.5rem' }}>
                {formIntro.heading ? <h2 className={styles.companyName}>{formIntro.heading}</h2> : null}
                <p className={styles.pageIntro}>{formIntro.body}</p>
              </div>
            ) : null}
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
