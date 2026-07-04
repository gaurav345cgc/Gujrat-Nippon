"use client";

import React from 'react';
import styles from './PageHero.module.css';

interface PageHeroProps {
    label: string;
    titleMain: string;
    titleAccent: string;
    titleRest?: string;
    description: string;
    bgImage?: string;
    variant?: 'default' | 'industries';
}

export default function PageHero({
    label,
    titleMain,
    titleAccent,
    titleRest,
    description,
    bgImage = '',
    variant = 'default',
}: PageHeroProps) {
    const isIndustries = variant === 'industries';
    const heroClass = isIndustries ? `${styles.hero} ${styles.heroIndustries}` : styles.hero;
    const showBgImage = Boolean(bgImage) && !isIndustries;

    return (
        <section className={heroClass}>
            {showBgImage ? (
                <div className={styles.heroBg} style={{ backgroundImage: `url('${bgImage}')` }} />
            ) : null}
            <div className={styles.heroOverlay} />

            <div className={styles.heroAccentRing} />
            <div className={styles.heroAccentRing2} />

            <div className={styles.heroContent}>
                {label ? (
                    <div className={styles.heroLabel}>
                        <span className={styles.labelDot} />
                        {label}
                    </div>
                ) : null}

                <h1 className={styles.heroTitle}>
                    {titleMain}{' '}
                    {titleAccent ? <span className={styles.heroTitleAccent}>{titleAccent}</span> : null}
                    {titleRest ? (
                        <>
                            <br />
                            {titleRest}
                        </>
                    ) : null}
                </h1>

                {description ? <p className={styles.heroSub}>{description}</p> : null}
            </div>

            <div className={styles.heroShapeBar}>
                <div className={styles.heroShapeTeal} />
                <div className={styles.heroShapeWhite} />
            </div>
        </section>
    );
}
