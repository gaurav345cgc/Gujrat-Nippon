"use client";

import React from "react";
import styles from "./Hero.module.css";
import { motion } from "framer-motion";

export default function Hero() {

    return (
        <header className={styles.heroSection}>
            <div className={styles.bgImage} style={{ backgroundImage: "url('/hero_bg2.png')" }} />
            {/* Dark gradient overlay for text readability at the bottom */}
            <div className={styles.bgOverlay} />

            <div className={styles.heroContent}>
                <motion.div
                    className={styles.heroLeft}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
                >
                    <h1 className={styles.heroTitle}>
                        Engineering<br />
                        Precision Systems<br />
                        For Global Industries
                    </h1>
                </motion.div>

                <motion.div
                    className={styles.heroRight}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.8, 0.25, 1] }}
                >
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}>47+</div>
                            <div className={styles.statText}>years of experience</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}>100%</div>
                            <div className={styles.statText}>Clients Satisfaction</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}>138</div>
                            <div className={styles.statText}>Completed project</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}
