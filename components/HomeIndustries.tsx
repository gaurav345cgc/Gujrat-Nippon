"use client";

import React from 'react';
import styles from './HomeIndustries.module.css';
import Link from 'next/link';

export default function HomeIndustries() {
    return (
        <section className={styles.container}>
            <div className={styles.indicatorWrapper}>
                <div className={styles.indicatorLeft}>
                    <span className={styles.indicatorDot}>•</span>
                    <span className={styles.indicatorText}>Our Industries</span>
                </div>
            </div>

            <div className={styles.contentSplit}>
                <div className={styles.leftCol}>
                    <div className={styles.imageContainer}>
                        <img
                            src="/ourindustries.jpg"
                            alt="Our Industries"
                            className={styles.mainImage}
                        />
                    </div>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.heading}>
                        <div className={styles.headingBold} style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Our Industries</div>
                        <div className={styles.headingLight} style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                            We serve a wide range of global sectors, including heavy-duty metal processing, precision engineering, manufacturing, and more. Our comprehensive approach ensures that we provide tailored, high-quality solutions that drive operational efficiencies, maximize output, and support sustainable long-term growth across diverse industrial environments.
                        </div>
                    </div>

                    <Link href="/industries" className={styles.learnMoreBtn}>
                        Learn more <span className={styles.arrowIcon}>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
