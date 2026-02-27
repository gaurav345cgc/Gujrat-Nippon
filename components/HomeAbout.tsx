"use client";

import React, { useEffect, useRef } from 'react';
import styles from './HomeAbout.module.css';
import Link from 'next/link';

export default function HomeAbout() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.visible);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className={styles.container}>
            <div className={styles.leftCol}>
                <div className={`${styles.imageCard} ${styles.cardTop}`}>
                    <img src="/export_image.png" alt="Export" className={styles.bgImage} />
                    <div className={styles.cardOverlay}>
                        <h3 className={styles.cardTitle}>Export</h3>
                        <p className={styles.cardText}>
                            We are leading exporters to Asian, African, GCC and Russian markets to meet overseas customer needs.
                        </p>
                    </div>
                </div>
                <div className={`${styles.imageCard} ${styles.cardBottom}`}>
                    <img src="/distribution_image.png" alt="Local Distribution" className={styles.bgImage} />
                    <div className={styles.cardOverlay}>
                        <h3 className={styles.cardTitle}>Local Distribution &amp; Sales</h3>
                        <p className={styles.cardText}>
                            With our strong global presence we have outlets across key international hubs to serve the needs of our clients.
                        </p>
                    </div>
                </div>
            </div>
            <div className={styles.rightCol}>
                <span className={styles.subheading}>About Us</span>
                <h2 className={styles.heading}>Gujarat Nippon International</h2>
                <div className={styles.textContent}>
                    <p>
                        Gujarat Nippon International Private Limited is a globally focused engineering solutions and industrial supply company dedicated to providing industries with cutting-edge machinery, technological expertise, and dependable project execution.
                    </p>
                    <p>
                        Our mission is to provide efficient, precise, and excellent execution that empowers our business partners to achieve operational excellence and long-term success.
                    </p>
                </div>
                <Link href="/about" className={styles.knowMoreBtn}>
                    Know more <span className={styles.arrowCircle}>→</span>
                </Link>
            </div>
        </section>
    );
}
