"use client";

import React from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footerWrapper}>
            {/* The background image for the entire footer */}
            <div className={styles.globalBgImage}>
                <img src="/footer.jpg" alt="Footer background" className={styles.dimBg} />
            </div>

            {/* Top Section: Contact Us (Replaces Newsletter) */}
            <div className={styles.newsletterSection}>
                <div className={styles.newsContent}>
                    <div className={styles.newsBreadcrumb}>
                        <span>•</span> Contact us
                    </div>
                    <div className={styles.newsTextGroup}>
                        <h2 className={styles.newsContentTitle}>Contact us.</h2>
                        <p className={styles.newsContentText}>
                            Get in touch with our team for inquiries, support, and to learn more about our engineering solutions.
                        </p>
                        <Link href="/contact" className={styles.contactActionButton}>
                            Get in touch &rarr;
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Main Footer */}
            <div className={styles.mainFooterBox}>
                <div className={styles.mainFooter}>
                    <div className={styles.topBar}>
                        <span className={styles.brandName}>Gujarat Nippon International Pvt Ltd</span>
                        <div className={styles.socialLinks}>
                            <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
                                in
                            </a>
                            <a href="#" className={styles.socialIcon} aria-label="Twitter">
                                tw
                            </a>
                            <a href="#" className={styles.socialIcon} aria-label="Facebook">
                                fb
                            </a>
                        </div>
                    </div>

                    {/* Link Columns */}
                    <div className={styles.container}>

                        {/* About Column */}
                        <div>
                            <h3 className={styles.columnTitle}>About</h3>
                            <p className={styles.text}>
                                Gujarat Nippon International Pvt Ltd is a globally focused engineering solutions and industrial supply company dedicated to providing industries with cutting-edge machinery, technological expertise, and dependable project execution.
                            </p>
                            <p className={styles.text} style={{ fontWeight: 600, color: 'white' }}>
                                Efficiency • Excellence • Executability
                            </p>
                        </div>

                        {/* Quick Links Column */}
                        <div>
                            <h3 className={styles.columnTitle}>Quick Links</h3>
                            <ul className={styles.linkList}>
                                <li className={styles.linkListItem}><Link href="/about" className={styles.footerLink}>About Us</Link></li>
                                <li className={styles.linkListItem}><Link href="/products" className={styles.footerLink}>Products &amp; Services</Link></li>
                                <li className={styles.linkListItem}><Link href="/industries" className={styles.footerLink}>Industries Served</Link></li>
                                <li className={styles.linkListItem}><Link href="/contact" className={styles.footerLink}>Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* Contact Info Column */}
                        <div>
                            <h3 className={styles.columnTitle}>Contact Us</h3>
                            <div className={styles.contactItem}>
                                <svg className={styles.contactIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                <span>123 Industrial Phase II,<br />Global Export Zone,<br />India</span>
                            </div>
                            <div className={styles.contactItem}>
                                <svg className={styles.contactIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                <span>+91 123 456 7890</span>
                            </div>
                            <div className={styles.contactItem}>
                                <svg className={styles.contactIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                <span>info@gujaratnippon.com</span>
                            </div>
                        </div>

                        {/* Quality Compliance Column */}
                        <div>
                            <h3 className={styles.columnTitle}>Quality Compliance</h3>
                            <p className={styles.text}>
                                We adhere to the highest international standards of quality and environmental compliance across all our manufacturing facilities.
                            </p>
                            <img style={{ marginTop: '0.5rem', height: '40px', backgroundColor: 'white', padding: '4px', borderRadius: '4px' }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/ISO_9001-2015.svg/2560px-ISO_9001-2015.svg.png" alt="ISO 9001 Certified" />
                        </div>
                    </div>

                    {/* Bottom Bar: Copyright and Legal */}
                    <div className={styles.bottomBar}>
                        <p className={styles.copyright}>
                            &copy; {currentYear} Gujarat Nippon International Pvt Ltd. All rights reserved.
                        </p>

                        <div className={styles.legalLinks}>
                            <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
                            <span className={styles.legalDivider}>|</span>
                            <Link href="/terms" className={styles.legalLink}>Terms &amp; Conditions</Link>
                            <span className={styles.legalDivider}>|</span>
                            <Link href="/cookies" className={styles.legalLink}>Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
