import React from 'react';
import styles from './Contact.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with Gujarat Nippon International Pvt Ltd for industrial spares, plant machineries, and global engineering solutions.',
};

export default function ContactPage() {
    return (
        <main className={styles.pageWrapper}>


            <div className={styles.container}>

                <div className={styles.contactLayout}>
                    {/* Left Column: Company Information */}
                    <section className={styles.companyInfo}>
                        <h2 className={styles.companyName}>Gujarat Nippon International Pvt. Ltd.</h2>

                        <address className={styles.infoBlock} style={{ fontStyle: 'normal' }}>
                            21, Navyug Industrial Estate, M.I.D.C Cross Road,<br />
                            J.B. Nagar, Andheri (East), Mumbai – 400069
                        </address>

                        <div className={styles.infoBlock}>
                            <span className={styles.infoLabel}>Tel:</span> +91-22-4099 7000
                        </div>

                        <div className={styles.infoBlock}>
                            <span className={styles.infoLabel}>CIN:</span> U51900MH2004PTC149572
                        </div>

                        <div className={styles.infoBlock}>
                            <span className={styles.infoLabel}>Email:</span> <a href="mailto:info@gujaratnippon.com">info@gujaratnippon.com</a>
                        </div>


                    </section>

                    {/* Right Column: Contact Form */}
                    <section className={styles.formContainer}>
                        <form action="#" method="POST">
                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.label}>Full Name</label>
                                <input type="text" id="name" name="name" className={styles.input} required placeholder="Your Name" />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>Email Address</label>
                                <input type="email" id="email" name="email" className={styles.input} required placeholder="you@company.com" />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="phone" className={styles.label}>Phone Number</label>
                                <input type="tel" id="phone" name="phone" className={styles.input} placeholder="+1 (555) 000-0000" />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="message" className={styles.label}>Message</label>
                                <textarea id="message" name="message" className={styles.textarea} required placeholder="How can we help you?"></textarea>
                            </div>

                            <button type="submit" className={styles.submitBtn}>Send Message</button>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}
