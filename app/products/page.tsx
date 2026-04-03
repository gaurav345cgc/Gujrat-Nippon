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

                                <div className={styles.cardBody}>
                                    <h2 className={styles.productName}>{product.name}</h2>
                                    <p className={styles.productDescription}>{product.description}</p>
                                    <div className={styles.learnMore}>Learn More</div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
