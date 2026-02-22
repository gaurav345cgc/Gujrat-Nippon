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
                <span className={styles.subheading}>Since 2004</span>
                <h2 className={styles.heading}>Gujarat Nippon Group</h2>
                <div className={styles.textContent}>
                    <p>
                        We are a premier Multinational Conglomerate specializing in Metal Processing, Engineering Solutions, and high-precision Manufacturing. Since our inception, we have established ourselves as a &quot;One Point Engineering Solution Provider,&quot; designing, manufacturing, and exporting world-class industrial systems and consumables to a diverse global clientele.
                    </p>
                    <p>
                        Our reputation as a versatile industry leader is built on a foundation of turnkey excellence—ranging from the modernization of complex rolling mills to the high-volume production of consumer goods. With a footprint spanning across Africa, Asia, Europe, and North America, Gujarat Nippon Group remains committed to delivering innovative, reliable, and integrated solutions that power industries worldwide.
                    </p>
                </div>
                <Link href="/about" className={styles.knowMoreBtn}>
                    Know more <span className={styles.arrowCircle}>→</span>
                </Link>
            </div>
        </section>
    );
}
