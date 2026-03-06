"use client";

import React, { useState } from 'react';
import styles from './HomeIndustries.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomeIndustries() {
    const [isVisible, setIsVisible] = useState(false);

    const tiles = [
        "Oil & Gas",
        "Industrial",
        "Aviation",
        "Water & Power",
        "Manufacturing",
        "Heavy Industries"
    ];

    return (
        <motion.section
            className={`${styles.industriesSection} ${isVisible ? styles.animate : ''}`}
            onViewportEnter={() => setIsVisible(true)}
            viewport={{ once: true, amount: 0.25 }}
        >
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.breadcrumb}>
                        <span>• Our Industries</span>
                    </div>
                    <div className={styles.titleContainer}>
                        <h2 className={styles.title}>Our Industries</h2>
                        <p className={styles.description}>
                            {"We serve a wide range of industries, including aviation, transportation, manufacturing, and more, providing solutions that drive efficiencies.".split(" ").map((word, index) => (
                                <span
                                    key={index}
                                    className={styles.word}
                                    style={{ transitionDelay: `${index * 0.08 + 0.2}s` }}
                                >
                                    {word}&nbsp;
                                </span>
                            ))}
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
                                style={{ transitionDelay: `${index * 0.2 + 1.2}s` }}
                            >
                                <span className={styles.tileText}>{tile}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
