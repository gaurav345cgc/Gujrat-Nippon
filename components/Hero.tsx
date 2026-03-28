"use client";

import React from "react";
import styles from "./Hero.module.css";


export default function Hero() {

    return (
        <header className={styles.heroSection}>
            <div className={styles.bgImage} style={{ backgroundImage: "url('/hero_bg2.png')" }} />
            {/* Dark gradient overlay for text readability at the bottom */}
            <div className={styles.bgOverlay} />

            <div className={styles.heroContent}>
                <div className={styles.heroLeft}>
                    <h1 className={styles.heroTitle}>
                        Engineering<br />
                        Precision Systems<br />
                        For Global Industries
                    </h1>
                </div>

                <div className={styles.heroRight}>
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
                </div>
            </div >
        </header >
    );
}
