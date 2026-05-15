"use client";

import React from 'react';
import styles from './HomeAbout.module.css';
import Link from 'next/link';

export default function HomeAbout() {
    return (
        <section className={styles.container}>
            <div className={styles.contentSplit}>
                <div className={styles.leftCol}>
                    <div className={styles.headingArea}>
                        <h2 className={styles.mainHeading}>About Us</h2>
                        <div className={styles.headingLine}></div>
                    </div>
                    
                    <div className={styles.textContent}>
                        <p className={styles.paragraphText}>
                            <strong>Gujarat Nippon International Pvt Ltd</strong> provides engineering solutions and a diversified range of industrial products and services: design, manufacture and supply of plant and machineries for metal processing industries, revamping, retrofitting and modernization of existing lines, industrial spares and components, greases, lubricants and industrial chemicals, and capital equipment sourcing for domestic and export customers.
                        </p>
                        <p className={styles.paragraphText}>
                            We are committed to reliable products and services, timely execution, transparent dealings and long-term business relationships. Our focus remains on technical expertise, quality standards and total customer satisfaction.
                        </p>
                    </div>

                    <Link href="/about" className={styles.aboutBtn}>
                        READ MORE ABOUT THE COMPANY
                    </Link>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.imageContainer}>
                        <img src="/aboutus.avif" alt="About Gujarat Nippon" className={styles.mainImage} />
                    </div>
                </div>
            </div>
        </section>
    );
}
