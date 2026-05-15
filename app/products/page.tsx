import React from 'react';
import styles from './Products.module.css';
import { Metadata } from 'next';
import { products } from '../../lib/data/products';
import PageHero from '../../components/PageHero';

export const metadata: Metadata = {
    title: { absolute: 'Industrial Machinery & Equipment — Gujarat Nippon International' },
    description:
        'Gujarat Nippon International offers turnkey plant machineries, industrial spares, chemicals, capital equipment and plastic moulding systems for industrial processing requirements.',
};

export default function ProductsPage() {
    return (
        <main className={styles.pageWrapper}>
            <PageHero
                label="Explore Our Solutions"
                titleMain="Industrial Machinery,"
                titleAccent="Spares & Equipment Supply"
                description="Turnkey plant engineering, industrial spares, greases and lubricants, capital equipment and plastic moulding systems supplied with documented specifications and export-ready dispatch where required."
                bgImage="/hero_bg2.png"
            />
            <div className={styles.container}>
                <div className={styles.productGrid}>
                    {products.map((product) => (
                        <article key={product.id} className={styles.productCard}>
                            <div className={styles.cardTag}>PRODUCT FEATURE</div>
                            <div className={styles.imageContainer}>
                                <img
                                    src={product.image}
                                    alt={`${product.name} — Gujarat Nippon International industrial supply`}
                                    className={styles.productImage}
                                />
                            </div>

                            <div className={styles.cardBody}>
                                <h2 className={styles.productName}>{product.name}</h2>
                                <p className={styles.productDescription}>{product.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}
