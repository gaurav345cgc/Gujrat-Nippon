"use client";

import React from 'react';
import styles from './HomeAbout.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomeAbout() {
    return (
        <motion.section
            className={styles.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
            }}
        >
            {/* The header area with About Us spans across the top conceptually, but in the design it aligns with the split. */}
            <motion.div
                className={styles.indicatorWrapper}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
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
            </motion.div>

            <div className={styles.contentSplit}>
                <motion.div
                    className={styles.leftCol}
                    variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
                >
                    <div className={styles.heading}>
                        <div className={styles.headingBold} style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>About Us</div>
                        <div className={styles.headingBold} style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Gujarat Nippon International</div>
                        <div className={styles.headingLight} style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                            Gujarat Nippon International Private Limited is a globally focused engineering solutions and industrial supply company dedicated to providing industries with cutting-edge machinery, technological expertise, and dependable project execution.
                        </div>
                        <div className={styles.headingLight} style={{ fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                            Our mission is to provide efficient, precise, and excellent execution that empowers our business partners to achieve operational excellence and long-term success.
                        </div>
                    </div>

                    <Link href="/about" className={styles.aboutBtn}>
                        About us <span className={styles.arrowIcon}>→</span>
                    </Link>
                </motion.div>

                <motion.div
                    className={styles.rightCol}
                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } } }}
                >
                    <div className={styles.imagesContainer}>
                        <div className={styles.exportCard}>
                            <img src="/about_us.png" alt="Export" className={styles.cardBg} />
                            <div className={styles.cardOverlay}></div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>Export</h3>
                                <p className={styles.cardDesc}>
                                    We are leading exporters to Asian, African, and GCC markets to meet overseas customer needs.
                                </p>
                            </div>
                        </div>

                        <div className={styles.distributionCard}>
                            <img src="/distribution_image.png" alt="Local Distribution & Sales" className={styles.cardBg} />
                            <div className={styles.cardOverlay}></div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>Local Distribution &amp; Sales</h3>
                                <p className={styles.cardDesc}>
                                    With our strong global presence we have outlets across key international hubs to serve the needs of our clients.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}
