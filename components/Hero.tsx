"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./Hero.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    const bgRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (!bgRef.current) return;

        // Calculate mouse position relative to center
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        // Normalize coordinates from -1 to 1
        const xPos = (clientX / innerWidth - 0.5) * 2;
        const yPos = (clientY / innerHeight - 0.5) * 2;

        // Apply tilt effect (max 10 degrees)
        const rotateX = yPos * -10;
        const rotateY = xPos * 10;

        // Apply shift effect (max 20px)
        const translateX = xPos * -20;
        const translateY = yPos * -20;

        bgRef.current.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    };

    const handleMouseLeave = () => {
        if (!bgRef.current) return;
        // Reset position smoothly
        bgRef.current.style.transform = `translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1)`;
    };

    return (
        <header className={styles.heroSection} /* onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} */>
            {/* 3D background layer */}
            <div className={styles.scene}>
                <div
                    ref={bgRef}
                    className={styles.parallaxBg}
                    style={{
                        backgroundImage: "url('/hero_bg.png')",
                    }}
                />
                {/* Dark overlay for better text readability */}
                <div className={styles.bgOverlay} />

                <div className={styles.contentOverlay}>
                    <div className={styles.heroTextContent}>
                        <h1 className={styles.heroTitle}>
                            <span className={styles.lightText}>Engineering</span><br />
                            <span className={styles.lightText}>Precision Systems</span><br />
                            <span className={styles.lightText}>For Global Industries</span>
                        </h1>
                    </div>
                    <Link href="/products" className={styles.heroArrowContainer} aria-label="View Products">
                        <div className={styles.heroArrowBtn}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Content spacing since navbar is fixed */}
            <div style={{ paddingBottom: '80px' }}></div>
        </header>
    );
}
