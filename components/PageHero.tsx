"use client";

import React from 'react';
import styles from './PageHero.module.css';

interface PageHeroProps {
    label: string;
    titleMain: string;
    titleAccent: string;
    titleRest?: string;
    description: string;
    bgImage: string;
}

export default function PageHero({
    label,
    titleMain,
    titleAccent,
    titleRest,
    description,
    bgImage
}: PageHeroProps) {
    return (
        <section className={styles.hero}>
            <div className={styles.heroBg} style={{ backgroundImage: `url('${bgImage}')` }} />
            <div className={styles.heroOverlay} />

            {/* Geometric accents */}
            <div className={styles.heroAccentRing} />
            <div className={styles.heroAccentRing2} />

            <div className={styles.heroContent}>
                {/* Label */}
                <div className={styles.heroLabel}>
                    <span className={styles.labelDot} />
                    {label}
                </div>

                {/* Heading */}
                <h1 className={styles.heroTitle}>
                    {titleMain} <span className={styles.heroTitleAccent}>{titleAccent}</span>
                    {titleRest && <><br />{titleRest}</>}
                </h1>

                {/* Sub */}
                <p className={styles.heroSub}>
                    {description}
                </p>
            </div>

            {/* Bottom shape */}
            <div className={styles.heroShapeBar}>
                <div className={styles.heroShapeTeal} />
                <div className={styles.heroShapeWhite} />
            </div>
        </section>
    );
}
