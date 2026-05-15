import { Metadata } from 'next';
import React from 'react';
import styles from './About.module.css';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: { absolute: 'Industrial Engineering Company Mumbai — Gujarat Nippon' },
    description:
        'Established in 2004, Gujarat Nippon International is a Mumbai-based engineering and industrial supply company with 18+ years of execution across 510+ projects worldwide.',
};

export default function AboutPage() {
    return (
        <main className={styles.pageWrapper}>
            {/* 1. HERO SECTION */}
            <section className={styles.heroSection}>
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        <span className={styles.heroTitleAbout}>About </span>
                        <span className={styles.heroTitleBrand}>Gujarat Nippon</span>
                    </h1>
                    <p className={styles.heroTitleLine2}>International Pvt Ltd.</p>
                    <p className={styles.heroSubtitle}>
                        A globally focused engineering solutions and industrial supply company dedicated to providing
                        industries with cutting-edge machinery, technological expertise, and dependable project
                        execution.
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
                                        Established in 2004, Gujarat Nippon International Pvt Ltd is an industrial engineering company Mumbai-based metal processors and export buyers approach for coordinated supply. We undertake design, manufacture and supply of plant and machineries for metal processing industries on a turnkey basis where the contract requires it, and we carry out revamping, retrofitting and modernization of existing lines and equipment in accordance with drawings and quality standards agreed with the customer.
                                    </div>
                                    <div className={styles.aboutText} style={{ marginTop: '1.25rem' }}>
                                        Our scope includes hot and cold rolling mill lines, tube mill lines, slitting and cut-to-length lines, strip galvanising and colour coating lines, deep drawing presses, heat treatment furnaces and related equipment. We maintain strategic alliances with manufacturers for industrial spares, greases, lubricants, industrial chemicals and capital equipment, with emphasis on reliable products and services, timely execution, transparent dealings, competitive pricing where the enquiry permits, total customer satisfaction and after sales support under one roof for domestic and international markets.
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
                                    We undertake each assignment in a well-defined and planned manner, with technical expertise, dependable quality and integrity in export-import transactions. Long-term business relationships and customer requirements remain central to how we coordinate engineering solutions, documentation and dispatch.
                                </div>
                            </div>
                        </div>

                        <div className={styles.projectsLayout}>
                            <div className={styles.projectsTabs}>
                                <div className={styles.tabBox}>
                                    <div className={styles.tabTextContainer}>
                                        <span className={styles.tabTitle}>Manufacturer alliances</span>
                                    </div>
                                    <span className={styles.tabNumber}>01</span>
                                </div>
                                <div className={styles.tabBox}>
                                    <div className={styles.tabTextContainer}>
                                        <span className={styles.tabTitle}>Timely execution</span>
                                    </div>
                                    <span className={styles.tabNumber}>02</span>
                                </div>
                                <div className={styles.tabBoxActive}>
                                    <div className={styles.tabTextContainer}>
                                        <span className={styles.tabTitle}>Quality standards</span>
                                    </div>
                                    <span className={styles.tabNumber}>03</span>
                                </div>
                                <div className={styles.tabBox}>
                                    <div className={styles.tabTextContainer}>
                                        <span className={styles.tabTitle}>After sales support</span>
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
                            <img src="/people_about.jpg" alt="Gujarat Nippon International team — industrial engineering company Mumbai" className={styles.newsCardImg} />
                            <div className={styles.newsCardBody}>
                                <h3 className={styles.newsCardTitle}>People</h3>
                                <p className={styles.newsCardText}>We maintain fair and honest dealings with employees, associates and customers, with emphasis on clear communication, technical training where required, and disciplined execution so that plant and machinery enquiries, spares orders and export shipments are handled in a professional manner.</p>
                                <button className={styles.newsCardBtn}>READ MORE <ArrowRight size={14} style={{ marginLeft: '4px' }} /></button>
                            </div>
                        </div>
                        {/* Goal 2 */}
                        <div className={styles.newsCard}>
                            <img src="/planet_about.jpg" alt="Industrial operations and responsible supply — Gujarat Nippon International" className={styles.newsCardImg} />
                            <div className={styles.newsCardBody}>
                                <h3 className={styles.newsCardTitle}>Planet</h3>
                                <p className={styles.newsCardText}>We cater to customers across India, Africa, the GCC and other regions with packing, documentation and supply practices aligned to applicable regulations and site requirements, and we support project and repeat orders without overstating capability beyond the agreed bill of supply.</p>
                                <button className={styles.newsCardBtn}>READ MORE <ArrowRight size={14} style={{ marginLeft: '4px' }} /></button>
                            </div>
                        </div>
                        {/* Goal 3 */}
                        <div className={styles.newsCard}>
                            <img src="/profit_about.jpg" alt="Commercial discipline and customer value — Gujarat Nippon International" className={styles.newsCardImg} />
                            <div className={styles.newsCardBody}>
                                <h3 className={styles.newsCardTitle}>Profits</h3>
                                <p className={styles.newsCardText}>We offer competitive pricing where the enquiry permits, customized solutions as per customer specifications, and dependable quality so that buyers achieve predictable lifecycle value from plant machinery, spares and capital equipment sourced through our office.</p>
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
                                To be recognized as a trusted engineering and industrial supply company for metal processing and allied sectors, known for reliable products and services, technical expertise and total customer satisfaction in domestic and international markets.
                            </p>
                            <span className={styles.testiAuthor}>Our Vision</span>
                            <span style={{ color: '#0077C0', fontSize: '0.8rem', marginTop: '4px' }}>Gujarat Nippon International Pvt Ltd</span>
                        </div>
                        <div className={styles.testiCard}>
                            <p className={styles.testiText}>
                                To provide engineering solutions and diversified industrial products in a well-defined and planned manner: design, manufacture and supply of plant and machineries, revamping and modernization, industrial spares, greases, lubricants and capital equipment, with commitment to quality standards, transparent dealings and after sales support aligned to customer requirements.
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
