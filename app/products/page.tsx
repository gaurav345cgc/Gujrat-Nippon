import React from 'react';
import styles from './Products.module.css';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Products',
    description: 'Explore our high-performance industrial solutions and metal processing equipment.',
};

// Dummy Data exactly as requested
const dummyProducts = [
    {
        id: 1,
        name: 'Industrial Spares & Consumables',
        description: 'Comprehensive electrical, mechanical, hydraulic, and pneumatic supplies.',
        link: '/products/spares',
        image: '/product_4.png'
    },
    {
        id: 2,
        name: 'Chemicals, Grease & Lubricants',
        description: 'High-quality preventative maintenance supplies for industrial use.',
        link: '/products/chemicals',
        image: '/product_1.png'
    },
    {
        id: 3,
        name: 'Turnkey Plant & Machineries',
        description: 'Design, manufacture and supply of plant machineries for metal processing.',
        link: '/products/turnkey',
        image: '/product_3.png'
    },
    {
        id: 4,
        name: 'Capital Equipment',
        description: 'Representing reputed International Companies (Zhuoshen, Vietsteel, Maker).',
        link: '/products/equipment',
        image: '/product_2.png'
    },
    {
        id: 5,
        name: 'Plastic Moulding Systems',
        description: 'Advanced plastic moulding technologies by Gujarat Nippon Enterprises.',
        link: '/products/moulding',
        image: '/product_3.png'
    },
    {
        id: 6,
        name: 'Logic Plastics Manufacturing',
        description: 'High-volume production lines for various renowned multinational brands.',
        link: '/products/logic-plastics',
        image: '/product_4.png'
    }
];

export default function ProductsPage() {
    return (
        <main className={styles.container}>
            <h1 className={styles.pageTitle}>Our Products & Solutions</h1>

            <div className={styles.productGrid}>
                {dummyProducts.map((product) => (
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
        </main>
    );
}
