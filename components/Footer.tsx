"use client";

import React from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footerWrapper}>
            <div className={styles.container}>
                {/* Column 1: Logo & Name */}
                <div className={styles.brandCol}>
                    <div className={styles.logoGroup}>
                        <div className={styles.logoCircle}>
                            <img src="/logo.svg" alt="Gujarat Nippon" className={styles.logoImg} />
                        </div>
                        <span className={styles.brandName}>
                            Gujarat Nippon<br />
                            International Pvt. Ltd.
                        </span>
                    </div>
                </div>

                {/* Column 2: Sitemap */}
                <div className={styles.linkCol}>
                    <h3 className={styles.columnTitle}>Sitemap</h3>
                    <ul className={styles.linkList}>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/products">Products &amp; Services</Link></li>
                        <li><Link href="/industries">Industries Served</Link></li>
                        <li><Link href="/contact">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Column 3: Contact Info */}
                <div className={styles.linkCol}>
                    <h3 className={styles.columnTitle}>Contact Info</h3>
                    <ul className={styles.contactList}>
                        <li>
                            21, Navyug Industrial Estate, M.I.D.C Cross Road,<br />
                            J.B. Nagar, Andheri (East), Mumbai &ndash; 400069
                        </li>
                        <li>Tel: +91-22-4099 7000</li>
                        <li>CIN: U51900MH2004PTC149572</li>
                        <li>Email: <a href="mailto:info@gujaratnippon.com">info@gujaratnippon.com</a></li>
                    </ul>
                </div>

                {/* Column 4: Social Links */}
                <div className={styles.socialCol}>
                    <h3 className={styles.columnTitle}>Social Links</h3>
                    <div className={styles.socialIcons}>
                        {/* Replace '#' with real social media links */}
                        <a href="#" aria-label="Facebook">FB</a>
                        <a href="#" aria-label="Twitter">TW</a>
                        <a href="#" aria-label="LinkedIn">IN</a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={styles.bottomBar}>
                <p>
                    Designed By Gujarat Nippon | &copy; {currentYear} Gujarat Nippon International Pvt. Ltd. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
