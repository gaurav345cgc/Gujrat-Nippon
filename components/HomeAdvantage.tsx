"use client";

import { useState, useEffect } from 'react';
import styles from './HomeAdvantage.module.css';
import type { HomeCapability } from '@/lib/cms/home-defaults';
import { HOME_CAPABILITIES } from '@/lib/cms/home-defaults';

type Props = {
  sectionHeading?: string;
  capabilities?: HomeCapability[];
};

export default function HomeAdvantage({
  sectionHeading = 'Engineering Capabilities',
  capabilities = HOME_CAPABILITIES,
}: Props) {
  const slides = capabilities.length > 0 ? capabilities : HOME_CAPABILITIES;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const currentCap = slides[currentIndex];

  return (
    <section className={styles.advantageSection}>
      <div className={styles.container}>
        <div className={styles.splitLayout}>
          <div className={styles.leftCol}>
            <div className={styles.imageContainer}>
              <img
                src="/turnkey-plant-engineering-gujarat-nippon.jpg"
                alt="Turnkey plant engineering — Gujarat Nippon International, Mumbai"
                className={styles.mainImage}
              />
            </div>
          </div>

          <div className={styles.rightCol}>
            <h2 className={styles.heading}>{sectionHeading}</h2>
            <div className={styles.advantageContainer}>
              <div className={styles.contentWrapper} key={currentIndex}>
                <p className={styles.advantageText}>
                  <strong className={styles.advantageTitle}>{currentCap.title}:&nbsp;</strong>
                  {currentCap.text}
                </p>

                <div className={styles.ctaContainer}>
                  <span className={styles.ctaWord}>{currentCap.cta}</span>
                  <span className={styles.ctaArrow}>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
