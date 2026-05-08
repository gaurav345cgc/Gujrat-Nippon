"use client";

import React from "react";
import styles from "./Hero.module.css";


export default function Hero() {

    return (
        <header className={styles.heroSection}>
            <div className={styles.bgImage} style={{ backgroundImage: "url('/hero.avif')" }} />
            {/* Dark gradient overlay for text readability at the bottom */}
            <div className={styles.bgOverlay} />

            <div className={styles.heroContent}>
                <div className={styles.heroLeft}>
                    <h1 className={styles.heroTitle}>
                        Engineering Precision Systems<br />
                        For Global Industries
                    </h1>
                </div>
            </div>
        </header>
    );
}
