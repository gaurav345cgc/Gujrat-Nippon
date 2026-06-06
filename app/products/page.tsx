import React from 'react';
import styles from './Products.module.css';
import PageHero from '../../components/PageHero';
import { generateCmsMetadata } from '@/lib/cms/metadata';
import { resolvePublicPage } from '@/lib/cms/gate';
import { mapHeroToPageHero } from '@/lib/cms/map-hero';
import { PRODUCT_GRID_ASSETS, resolveProductGridCards } from '@/lib/cms/product-grid-defaults';
import type { HeroPayload } from '@/lib/cms/types';

export const generateMetadata = () => generateCmsMetadata('products');

export default async function ProductsPage() {
  const page = await resolvePublicPage('products');
  const hero = page.sections.hero as HeroPayload;
  const productCards = resolveProductGridCards(page.sections);

  const heroProps = mapHeroToPageHero(hero, { bgImage: '/hero_bg2.png' });

  return (
    <main className={styles.pageWrapper}>
      <PageHero {...heroProps} />
      <div className={styles.container}>
        <div className={styles.productGrid}>
          {productCards.map((product, index) => {
            const asset = PRODUCT_GRID_ASSETS[index] ?? PRODUCT_GRID_ASSETS[0];
            return (
              <article key={`${product.heading}-${index}`} className={styles.productCard}>
                <div className={styles.cardTag}>PRODUCT FEATURE</div>
                <div className={styles.imageContainer}>
                  <img
                    src={asset.image}
                    alt={`${product.heading} — Gujarat Nippon International industrial supply`}
                    className={styles.productImage}
                  />
                </div>

                <div className={styles.cardBody}>
                  <h2 className={styles.productName}>{product.heading}</h2>
                  <p className={styles.productDescription}>{product.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
