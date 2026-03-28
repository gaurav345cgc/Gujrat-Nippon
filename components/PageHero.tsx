"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    return (
        <section className={styles.hero} ref={ref}>
            <motion.div className={styles.heroBg} style={{ y, backgroundImage: `url('${bgImage}')` }} />
            <div className={styles.heroOverlay} />

            {/* Geometric accents */}
            <motion.div
                className={styles.heroAccentRing}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.15 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
            />
            <motion.div
                className={styles.heroAccentRing2}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.08 }}
                transition={{ duration: 1.8, ease: 'easeOut', delay: 0.2 }}
            />

            <motion.div className={styles.heroContent} style={{ opacity }}>
                {/* Label */}
                <motion.div
                    className={styles.heroLabel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <span className={styles.labelDot} />
                    {label}
                </motion.div>

                {/* Heading */}
                <motion.h1
                    className={styles.heroTitle}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.25, 0.8, 0.25, 1], delay: 0.2 }}
                >
                    {titleMain} <span className={styles.heroTitleAccent}>{titleAccent}</span>
                    {titleRest && <><br />{titleRest}</>}
                </motion.h1>

                {/* Sub */}
                <motion.p
                    className={styles.heroSub}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {description}
                </motion.p>
            </motion.div>

            {/* Bottom shape */}
            <div className={styles.heroShapeBar}>
                <div className={styles.heroShapeTeal} />
                <div className={styles.heroShapeWhite} />
            </div>
        </section>
    );
}
