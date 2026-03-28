import React from 'react';
import styles from './Products.module.css';
import { Metadata } from 'next';
import Link from 'next/link';
import { products } from '../../lib/data/products';
import PageHero from '../../components/PageHero';

export const metadata: Metadata = {
    title: 'Products',
    description: 'Explore our high-performance industrial solutions and metal processing equipment.',
};

export default function ProductsPage() {
    return (
        <main className={styles.pageWrapper}>
            <PageHero
                label="Explore Our Solutions"
                titleMain="Our"
                titleAccent="Products"
                description="Explore our high-performance industrial solutions and metal processing equipment. Designed for durability and precision."
                bgImage="/hero_bg2.png"
            />
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Our Products & Solutions</h1>

                <div className={styles.productGrid}>
                    {products.map((product) => (
                        <Link href={product.link} key={product.id} style={{ textDecoration: 'none' }}>
                            <article className={styles.productCard}>
                                <div className={styles.cardTag}>PRODUCT FEATURE</div>
                                <div className={styles.imageContainer}>
                                    <img src={product.image} alt={product.name} className={styles.productImage} />
                                </div>

                                <div className={styles.cardFooter}>
                                    <div>
                                        <h2 className={styles.productName}>{product.name}</h2>
                                        <p className={styles.productDescription}>{product.description}</p>
                                    </div>
                                    <div className={styles.cardArrow}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
