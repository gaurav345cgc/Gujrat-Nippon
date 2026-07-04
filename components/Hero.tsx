"use client";

import React from "react";
import styles from "./Hero.module.css";

const DEFAULT_HEADLINE = "Engineering Design, Supply & Turnkey Solutions";

type Props = {
    headline?: string;
};

export default function Hero({ headline = DEFAULT_HEADLINE }: Props) {
    return (
        <header className={styles.heroSection}>
            <div className={styles.bgImage} style={{ backgroundImage: "url('/steel_tmt_bars.png')" }} />
            <div className={styles.bgOverlay} />

            <div className={styles.heroContent}>
                <div className={styles.heroLeft}>
                    <h1 className={styles.heroTitle}>{headline}</h1>
                </div>
            </div>
        </header>
    );
}