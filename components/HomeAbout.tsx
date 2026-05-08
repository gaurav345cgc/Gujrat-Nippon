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
                            <strong>Gujarat Nippon International Pvt Ltd</strong> is a globally focused engineering solutions and industrial supply company dedicated to providing industries with cutting-edge machinery, technological expertise, and dependable project execution.
                        </p>
                        <p className={styles.paragraphText}>
                            Our mission is to provide efficient, precise, and excellent execution that empowers our business partners to achieve operational excellence and long-term success.
                        </p>
                    </div>

                    <Link href="/about" className={styles.aboutBtn}>
                        KNOW MORE ABOUT OUR COMPANY
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
