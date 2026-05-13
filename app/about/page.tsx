import { Metadata } from 'next';
import React from 'react';
import styles from './About.module.css';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About',
    description:
        "18+ years, 510+ projects, 210+ export-import deals — Gujarat Nippon is Mumbai's trusted one-stop engineering solutions partner for global industrial buyers.",
};

export default function AboutPage() {
    return (
        <main className={styles.pageWrapper}>
            {/* 1. HERO SECTION */}
            <section className={styles.heroSection}>
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        About <span className={styles.heroTitleAccent}>Gujarat Nippon</span> <span className={styles.heroTitleSuffix}>International Pvt Ltd.</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        A globally focused engineering solutions and industrial supply company dedicated to providing industries with cutting-edge machinery, technological expertise, and dependable project execution.
                    </p>
                </div>
                <div className={styles.heroShapeContainer}>
                    <div className={styles.heroShapeRed}></div>
                    <div className={styles.heroShapeWhite}></div>
                </div>
            </section>

            {/* 2 & 3. COMBINED DARK SECTIONS (About & Philosophy) */}
            <div className={styles.combinedDarkWrapper}>
                <div className={styles.connectingLine}></div>

                {/* 2. ABOUT COMPANY (with stats) */}
                <section className={styles.darkSection}>
                    <div className={styles.watermark}>S</div>
                    <div className={styles.sharedContainer}>
                        <div className={styles.twoColumnRow}>
                            <div className={styles.aboutLeftTitleCol}>
                                <h2 className={styles.sectionHeading}>
                                    About <span className={styles.headingAccent}>Company</span>
                                </h2>
                            </div>

                            <div className={styles.aboutRightContentCol}>
                                <div className={styles.statsRow}>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Export/Import</span>
                                        <span className={styles.statNum}>210+</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Industry Projects</span>
                                        <span className={styles.statNum}>510+</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Years Experience</span>
                                        <span className={styles.statNum}>18+</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>More Efficiency</span>
                                        <span className={styles.statNum}>15%</span>
                                    </div>
                                </div>

                                <div className={styles.aboutTextContainer}>
                                    <div className={styles.aboutText}>
                                        Gujarat Nippon International Pvt Ltd is a globally focused engineering solutions and industrial supply company dedicated to providing industries with cutting-edge machinery, technological expertise, and dependable project execution. Our mission is to provide efficient, precise, and excellent execution that empowers our business partners to achieve operational excellence and long-term success.
                                    </div>
                                </div>

                                <button className={styles.aboutBtnWhite}>
                                    LEARN MORE <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. OUR PHILOSOPHY (Current Projects Layout) */}
                <section className={styles.projectsSection}>
                    <div className={styles.sharedContainer}>
                        <div className={styles.twoColumnRow} style={{ marginBottom: '4rem' }}>
                            <div className={styles.leftTitleCol}>
                                <h2 className={styles.sectionHeading}>
                                    Our <span className={styles.headingAccent}>Philosophy</span>
                                </h2>
                            </div>
                            <div className={styles.rightContentCol}>
                                <div className={styles.projectsTopDesc}>
                                    We combine hard work, smart execution, and strong industry networks to deliver exceptional value. Our commitments are a testament to our dedication to our business partners.
                                </div>
                            </div>
                        </div>

                        <div className={styles.projectsLayout}>
                            <div className={styles.projectsTabs}>
                                <div className={styles.tabBox}>
                                    <div className={styles.tabTextContainer}>
                                        <span className={styles.tabTitle}>Strong Networks</span>
                                    </div>
                                    <span className={styles.tabNumber}>01</span>
                                </div>
                                <div className={styles.tabBox}>
                                    <div className={styles.tabTextContainer}>
                                        <span className={styles.tabTitle}>Smart Work</span>
                                    </div>
                                    <span className={styles.tabNumber}>02</span>
                                </div>
                                <div className={styles.tabBoxActive}>
                                    <div className={styles.tabTextContainer}>
                                        <span className={styles.tabTitle}>Hard Work</span>
                                    </div>
                                    <span className={styles.tabNumber}>03</span>
                                </div>
                                <div className={styles.tabBox}>
                                    <div className={styles.tabTextContainer}>
                                        <span className={styles.tabTitle}>Our Commitments</span>
                                    </div>
                                    <span className={styles.tabNumber}>04</span>
                                </div>
                            </div>
                            <div className={styles.projectsImageWrapper}>
                                <div className={styles.projectsImage}></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* 4. OUR GOALS (Latest News Layout) */}
            <section className={styles.newsSection}>
                <div className={styles.newsContainer}>
                    <div className={styles.newsHeader}>
                        <h2 className={styles.newsTitle}>
                            Our <span className={styles.newsTitleAccent}>Goals</span>
                        </h2>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0077C0', cursor: 'pointer' }}><ArrowLeft size={20} /></div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0077C0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}><ArrowRight size={20} /></div>
                        </div>
                    </div>

                    <div className={styles.newsGrid}>
                        {/* Goal 1 */}
                        <div className={styles.newsCard}>
                            <img src="/people_about.jpg" alt="People" className={styles.newsCardImg} />
                            <div className={styles.newsCardBody}>
                                <h3 className={styles.newsCardTitle}>People</h3>
                                <p className={styles.newsCardText}>To create equitable opportunities for growth and success for all our stakeholders — employees, partners, and customers — by fostering innovation, collaboration, and trust.</p>
                                <button className={styles.newsCardBtn}>READ MORE <ArrowRight size={14} style={{ marginLeft: '4px' }} /></button>
                            </div>
                        </div>
                        {/* Goal 2 */}
                        <div className={styles.newsCard}>
                            <img src="/planet_about.jpg" alt="Planet" className={styles.newsCardImg} />
                            <div className={styles.newsCardBody}>
                                <h3 className={styles.newsCardTitle}>Planet</h3>
                                <p className={styles.newsCardText}>To serve industries across the globe with sustainable and responsible engineering solutions that contribute positively to society and the environment.</p>
                                <button className={styles.newsCardBtn}>READ MORE <ArrowRight size={14} style={{ marginLeft: '4px' }} /></button>
                            </div>
                        </div>
                        {/* Goal 3 */}
                        <div className={styles.newsCard}>
                            <img src="/profit_about.jpg" alt="Profits" className={styles.newsCardImg} />
                            <div className={styles.newsCardBody}>
                                <h3 className={styles.newsCardTitle}>Profits</h3>
                                <p className={styles.newsCardText}>To deliver measurable value to our business partners by ensuring minimum operating costs, maximum efficiency, and enhanced profitability across every project.</p>
                                <button className={styles.newsCardBtn}>READ MORE <ArrowRight size={14} style={{ marginLeft: '4px' }} /></button>
                            </div>
                        </div>
                    </div>

                    <button className={styles.heroBtn} style={{ marginTop: '3rem' }}>
                        MORE GOALS <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            {/* 5. VISION & MISSION (Testimonials Layout) */}
            <section className={styles.testimonialsSection}>
                <div className={styles.testimonialsContainer}>
                    <div className={styles.testiHeader}>
                        <h2 className={styles.testiTitle}>
                            Vision & <br /><span className={styles.testiTitleAccent}>Mission</span>
                        </h2>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0077C0', cursor: 'pointer' }}><ArrowLeft size={20} /></div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0077C0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}><ArrowRight size={20} /></div>
                        </div>
                    </div>

                    <div className={styles.testiGrid}>
                        <div className={styles.testiCard}>
                            <p className={styles.testiText}>
                                "To become a globally recognized one-stop hub for comprehensive engineering solutions and industrial supplies, known for reliability, efficiency, and execution excellence."
                            </p>
                            <span className={styles.testiAuthor}>Our Vision</span>
                            <span style={{ color: '#0077C0', fontSize: '0.8rem', marginTop: '4px' }}>Gujarat Nippon International Pvt Ltd</span>
                        </div>
                        <div className={styles.testiCard}>
                            <p className={styles.testiText}>
                                "To provide efficient, precise, and excellent execution that empowers our business partners to achieve operational excellence and long-term success."
                            </p>
                            <span className={styles.testiAuthor}>Our Mission</span>
                            <span style={{ color: '#0077C0', fontSize: '0.8rem', marginTop: '4px' }}>Gujarat Nippon International Pvt Ltd</span>
                        </div>
                    </div>

                    <button className={styles.heroBtn} style={{ marginTop: '3rem' }}>
                        LEARN MORE <ArrowRight size={16} />
                    </button>
                </div>
            </section>

        </main>
    );
}
