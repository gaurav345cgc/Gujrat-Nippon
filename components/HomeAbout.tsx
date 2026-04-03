"use client";

import React from 'react';
import styles from './HomeAbout.module.css';
import Link from 'next/link';

export default function HomeAbout() {
    return (
        <section className={styles.container}>
            {/* The header area with About Us spans across the top conceptually, but in the design it aligns with the split. */}
            <div className={styles.indicatorWrapper}>
                <div className={styles.indicatorLeft}>
                    <span className={styles.indicatorDot}>•</span>
                    <span className={styles.indicatorText}>About us</span>
                </div>
                <div className={styles.indicatorIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                </div>
            </div>

            <div className={styles.contentSplit}>
                <div className={styles.leftCol}>
                    <div className={styles.heading}>
                        <div className={styles.headingBold} style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>About Us</div>
                        <div className={styles.headingBold} style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Gujarat Nippon International Pvt Ltd</div>
                        <div className={styles.headingLight} style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                            Gujarat Nippon International Pvt Ltd is a globally focused engineering solutions and industrial supply company dedicated to providing industries with cutting-edge machinery, technological expertise, and dependable project execution.
                        </div>
                        <div className={styles.headingLight} style={{ fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                            Our mission is to provide efficient, precise, and excellent execution that empowers our business partners to achieve operational excellence and long-term success.
                        </div>
                    </div>

                    <Link href="/about" className={styles.aboutBtn}>
                        About us <span className={styles.arrowIcon}>→</span>
                    </Link>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.imagesContainer}>
                        <div className={styles.exportCard}>
                            <img src="/export_image.png" alt="Exports" className={styles.cardBg} />
                            <div className={styles.cardOverlay}></div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>Exports</h3>
                                <p className={styles.cardDesc}>
                                    Leading supplier to Asian, African, and GCC markets with strategic engineering exports.
                                </p>
                            </div>
                        </div>

                        <div className={styles.distributionCard}>
                            <img src="/distribution_image.png" alt="Local" className={styles.cardBg} />
                            <div className={styles.cardOverlay}></div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>Local</h3>
                                <p className={styles.cardDesc}>
                                    Delivering high-precision engineering and dependable project execution across local territories.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
