"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isNavVisible, setIsNavVisible] = useState(true);
    const prevScrollY = useRef(0);
    const pathname = usePathname();
    const navLinksRef = useRef<HTMLDivElement>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

    useEffect(() => {
        // Update sliding indicator position based on active route
        setTimeout(() => {
            if (navLinksRef.current) {
                const activeLink = navLinksRef.current.querySelector('[data-active="true"]') as HTMLElement;
                if (activeLink) {
                    setIndicatorStyle({
                        left: activeLink.offsetLeft,
                        width: activeLink.offsetWidth,
                        opacity: 1
                    });
                } else {
                    setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
                }
            }
        }, 100); // slight delay to allow rendering
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 100 && currentScrollY > prevScrollY.current) {
                setIsNavVisible(false);
            } else {
                setIsNavVisible(true);
            }
            prevScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`${styles.navContainer} ${isNavVisible ? styles.navVisible : styles.navHidden}`}>
            <nav className={styles.topNavbar}>
                <div className={styles.navLeft}>
                    <Link href="/" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                        <strong className={styles.logoText}>Gujarat Nippon Group</strong>
                    </Link>
                </div>

                {/* Hamburger Icon for Mobile */}
                <button
                    className={styles.mobileMenuBtn}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C00000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {isMobileMenuOpen ? (
                            <>
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </>
                        )}
                    </svg>
                </button>
                <div className={styles.navMiddle}>
                    <p className={styles.navDescription}>
                        Gujarat Nippon Group is part of a <span className={styles.redText}>Multi National Group</span> predominantly in metal processing industries.
                    </p>
                </div>
                <div className={`${styles.navRight} ${isMobileMenuOpen ? styles.navRightOpen : ''}`}>
                    <div className={styles.navLinks} ref={navLinksRef}>
                        {/* Dropdown Menu Item */}
                        <div className={styles.dropdownItem} data-active={pathname.startsWith('/about') || pathname.startsWith('/certifications') ? "true" : "false"}>
                            <button className={`${styles.navLink} ${pathname.startsWith('/about') ? styles.active : ''}`} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                                OVERVIEW <span>▼</span>
                            </button>
                            <div className={styles.dropdownMenu}>
                                <Link href="/about" className={styles.dropdownLink}>About Us</Link>
                                <Link href="/about#global-reach" className={styles.dropdownLink}>Global Reach</Link>
                                <Link href="/certifications" className={styles.dropdownLink}>Certifications / Quality / Compliance</Link>
                                <Link href="/downloads" className={styles.dropdownLink}>Brochures & Downloads</Link>
                            </div>
                        </div>

                        <Link href="/products" className={`${styles.navLink} ${pathname.startsWith('/products') ? styles.active : ''}`} data-active={pathname.startsWith('/products') ? "true" : "false"} onClick={() => setIsMobileMenuOpen(false)}>PRODUCTS / SERVICES</Link>
                        <Link href="/industries" className={`${styles.navLink} ${pathname.startsWith('/industries') ? styles.active : ''}`} data-active={pathname.startsWith('/industries') ? "true" : "false"} onClick={() => setIsMobileMenuOpen(false)}>INDUSTRIES SERVED</Link>
                        <Link href="/careers" className={`${styles.navLink} ${pathname.startsWith('/careers') ? styles.active : ''}`} data-active={pathname.startsWith('/careers') ? "true" : "false"} onClick={() => setIsMobileMenuOpen(false)}>CAREERS</Link>

                        {/* Sliding Indicator */}
                        <div className={styles.navIndicator} style={{ left: indicatorStyle.left, width: indicatorStyle.width, opacity: indicatorStyle.opacity }} />
                    </div>

                    {/* The contact link made into a red button like AL SAFAN */}
                    <Link href="/contact" className={styles.contactButtonRed} onClick={() => setIsMobileMenuOpen(false)}>CONTACT US</Link>
                    <button className={styles.vendorBtn} onClick={() => setIsMobileMenuOpen(false)}>BECOME A VENDOR</button>
                </div>
            </nav>
        </div>
    );
}
