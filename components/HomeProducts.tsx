"use client";

import { useRef, useState, useEffect } from 'react';
import styles from './HomeProducts.module.css';
import HomeAdvantage from './HomeAdvantage';
import HomeServices from './HomeServices';
import type { CtaPayload, TextPayload } from '@/lib/cms/types';
import type { HomeCapability } from '@/lib/cms/home-defaults';
import { HOME_PRODUCT_ASSETS } from '@/lib/cms/home-defaults';

function getHomepageProductAlt(img: string, title: string) {
  if (img === '/product_1.png' && title.toLowerCase().includes('plant')) {
    return 'Cold rolling mill — turnkey plant machinery supplied by Gujarat Nippon International';
  }
  if (img === '/product_2.png' && title.toLowerCase().includes('capital')) {
    return 'Capital equipment — EOT crane supplied by Gujarat Nippon International, Mumbai';
  }
  if (img === '/product_3.png' && title.toLowerCase().includes('moulding')) {
    return 'Plastic moulding system — injection moulding machinery supplied by Gujarat Nippon';
  }
  return `${title} supplied by Gujarat Nippon International`;
}

type Props = {
  sectionHeading?: string;
  sectionSubheading?: string;
  servicesIntro?: TextPayload;
  servicesViewCta?: CtaPayload;
  serviceCards: TextPayload[];
  advantageHeading?: string;
  capabilities: HomeCapability[];
  productTeasers: TextPayload[];
};

export default function HomeProducts({
  sectionHeading = 'Products & Supply',
  sectionSubheading,
  servicesIntro,
  servicesViewCta,
  serviceCards,
  advantageHeading,
  capabilities,
  productTeasers,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;
      if (maxScrollLeft > 0) {
        setScrollProgress((scrollLeft / maxScrollLeft) * 100);
      }
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;

        if (scrollLeft >= maxScrollLeft - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollLeftFn = () => {
    scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const scrollRightFn = () => {
    scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' });
  };

  const products = productTeasers.map((teaser, index) => {
    const asset = HOME_PRODUCT_ASSETS[index] ?? HOME_PRODUCT_ASSETS[0];
    return {
      type: asset.type,
      img: asset.img,
      title: teaser.heading ?? 'Product',
      desc: teaser.body,
    };
  });

  return (
    <div className={styles.wrapper}>
      <HomeAdvantage sectionHeading={advantageHeading} capabilities={capabilities} />
      <HomeServices
        heading={servicesIntro?.heading}
        body={servicesIntro?.body}
        serviceCards={serviceCards}
        viewCta={servicesViewCta}
      />

      <section className={styles.newsSection}>
        <div className={styles.newsHeader}>
          <div className={styles.productLeftHeader}>
            <h2 className={styles.newsTitle}>{sectionHeading}</h2>
            {sectionSubheading ? (
              <p className={styles.productSectionSubheading}>{sectionSubheading}</p>
            ) : null}
          </div>
        </div>

        <div className={styles.productScrollWrapper} ref={scrollRef}>
          {products.map((product) => (
            <div key={`${product.title}-${product.img}`} className={styles.productCard}>
              <div className={styles.productImageContainer}>
                <img
                  src={product.img}
                  alt={getHomepageProductAlt(product.img, product.title)}
                  className={styles.productImage}
                />
                <div className={styles.productOverlay}></div>
              </div>
              <div className={styles.cardForeground}>
                <div className={styles.cardType}>{product.type}</div>
                <div className={styles.productCardContent}>
                  <h3 className={styles.productCardTitle}>{product.title}</h3>
                  <div className={styles.productCardDescWrapper}>
                    <p className={styles.productCardDesc}>{product.desc}</p>
                    <span className={styles.productCardArrow}>→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.scrollControls}>
          <div className={styles.progressBarWrapper}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${scrollProgress}%` }}></div>
            </div>
          </div>
          <div className={styles.bottomArrows}>
            <button type="button" className={styles.arrowBtn} onClick={scrollLeftFn}>←</button>
            <button type="button" className={styles.arrowBtn} onClick={scrollRightFn}>→</button>
          </div>
        </div>
      </section>
    </div>
  );
}
