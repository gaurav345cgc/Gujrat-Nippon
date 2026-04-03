"use client";

import React from 'react';
import styles from './HomeIndustries.module.css';
import Link from 'next/link';

export default function HomeIndustries() {
    const tiles = [
        "Metal Processing",
        "Industrial Spares",
        "Manufacturing",
        "Heavy Machinery",
        "Chemicals",
        "Construction Materials"
    ];

    return (
        <section className={styles.industriesSection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.breadcrumb}>
                        <span>• Our Industries</span>
                    </div>
                    <div className={styles.titleContainer}>
                        <h2 className={styles.title}>Our Industries</h2>
                        <p className={styles.description}>
                            We serve a wide range of global sectors, including heavy-duty metal processing, precision engineering, manufacturing, and more, providing solutions that drive efficiencies.
                        </p>
                    </div>
                    <div className={styles.actionContainer}>
                        <Link href="/industries" className={styles.learnMoreBtn}>
                            Learn more <span className={styles.arrow}>→</span>
                        </Link>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.imageContainer}>
                        <img
                            src="/ourindustries.jpg"
                            alt="Our Industries"
                            className={styles.mainImage}
                        />
                    </div>
                    <div className={styles.tilesContainer}>
                        {tiles.map((tile, index) => (
                            <div
                                key={index}
                                className={styles.tile}
                            >
                                <span className={styles.tileText}>{tile}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
