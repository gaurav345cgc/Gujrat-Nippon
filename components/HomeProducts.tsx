"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from './HomeProducts.module.css';
import Link from 'next/link';
import { products as PRODUCTS } from '../lib/data/products';

export default function HomeProducts() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [visibleItems, setVisibleItems] = useState(3);

    // Responsive setup to know how many items are visible
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setVisibleItems(1);
            } else if (window.innerWidth <= 1024) {
                setVisibleItems(2);
            } else {
                setVisibleItems(3);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, PRODUCTS.length - visibleItems);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    // Auto-scroll every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, 3000);

        return () => clearInterval(interval);
    }, [maxIndex]);

    return (
        <section className={styles.section}>
            <div className={styles.container}>

                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Our Products</h2>
                    <div className={styles.controls}>
                        <button className={styles.navBtn} onClick={prevSlide} disabled={currentIndex === 0} aria-label="Previous Products">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        </button>
                        <button className={styles.navBtn} onClick={nextSlide} disabled={currentIndex === maxIndex} aria-label="Next Products">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                    </div>
                </div>

                {/* Carousel Slider */}
                <div className={styles.carouselWrapper}>
                    <div
                        className={styles.carousel}
                        ref={carouselRef}
                        // Move 20% right effectively? Since gap is 2rem and flex-basis handles size, 
                        // we can translate by a calculated percentage. 
                        // If there are 5 items, each represents 20%. Moving index by 1 shifts view.
                        style={{ transform: `translateX(calc(-${currentIndex * (100 / visibleItems)}% - ${currentIndex * (2 / visibleItems)}rem))` }}
                    >
                        {PRODUCTS.map((prod) => (
                            <Link href={prod.link} key={prod.id} style={{ textDecoration: 'none' }} className={styles.card}>
                                <div className={styles.cardTag}>PRODUCT FEATURE</div>
                                <div className={styles.cardImageWrapper}>
                                    <img src={prod.image} alt={prod.name} className={styles.cardImage} />
                                </div>
                                <div className={styles.cardFooter}>
                                    <div>
                                        <h3 className={styles.cardTitle}>{prod.name}</h3>
                                        <p className={styles.cardDesc}>{prod.description}</p>
                                    </div>
                                    <div className={styles.cardArrow}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Row */}
                <div className={styles.bottomRow}>
                    <div className={styles.indicators}>
                        {[...Array(maxIndex + 1)].map((_, idx) => (
                            <span
                                key={idx}
                                className={`${styles.dot} ${currentIndex === idx ? styles.dotActive : ''}`}
                                onClick={() => setCurrentIndex(idx)}
                                style={{ cursor: 'pointer' }}
                            />
                        ))}
                    </div>
                    <Link href="/products" className={styles.viewAllBtn}>
                        <span>View All</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </Link>
                </div>

            </div>
        </section>
    );
}
