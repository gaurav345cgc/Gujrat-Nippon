"use client";

import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            if (currentScrollPos > 100 && currentScrollPos > prevScrollPos) {
                setIsNavVisible(false); // scrolling down
            } else {
                setIsNavVisible(true); // scrolling up
            }
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScrollPos]);

    return (
        <div className={`${styles.navContainer} ${isNavVisible ? styles.navVisible : styles.navHidden}`}>
            <nav className={styles.topNavbar}>
                {/* Logo Section */}
                <div className={styles.navLeft}>
                    <Link href="/" className={styles.logoLink} onClick={() => setIsMobileMenuOpen(false)}>
                        <img src="/evostel-logo.png" alt="Gujarat Nippon International Pvt Ltd" className={styles.logoImage} />
                        {/* Fallback if no image: GNIL text with leaf icon */}
                        <div className={styles.logoFallback}>
                            Gujarat Nippon International Pvt Ltd
                        </div>
                    </Link>
                </div>

                {/* Center Links Pill */}
                <div className={`${styles.navCenter} ${isMobileMenuOpen ? styles.navCenterOpen : ''}`}>
                    <div className={styles.linksPill}>
                        <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                            Home
                        </Link>
                        <Link href="/about" className={`${styles.navLink} ${pathname.startsWith('/about') ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                            About us
                        </Link>
                        <Link href="/industries" className={`${styles.navLink} ${pathname.startsWith('/industries') ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                            Industries & Services
                        </Link>
                        <Link href="/products" className={`${styles.navLink} ${pathname.startsWith('/products') ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                            Our Products
                        </Link>
                        <Link href="/brochures" className={`${styles.navLink} ${pathname.startsWith('/brochures') ? styles.active : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                            Brochures
                        </Link>

                    </div>
                </div>

                {/* Right Action Group */}
                <div className={styles.navRight}>
                    <Link href="/contact" className={styles.contactPill}>
                        <span className={styles.contactDot}></span> Contact us
                    </Link>
                    <button className={styles.menuPill} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {isMobileMenuOpen ? (
                                <>
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </>
                            ) : (
                                <>
                                    <line x1="4" y1="8" x2="20" y2="8"></line>
                                    <line x1="4" y1="16" x2="20" y2="16"></line>
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </nav>
        </div>
    );
}
