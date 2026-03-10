import os

css_content = """
.pageWrapper {
    background-color: #f5f5f5;
    color: var(--foreground);
    width: 100%;
    overflow-x: hidden;
    font-family: inherit;
}

/* ---- SECTION 1: HERO ---- */
.heroSection {
    position: relative;
    width: 100%;
    height: 75vh;
    min-height: 500px;
    background: url('/hero_image.png') no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.heroOverlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
}

.heroContent {
    position: relative;
    z-index: 2;
    text-align: center;
    color: #fff;
    padding: 0 20px;
    max-width: 900px;
}

.heroTitle {
    font-size: 4rem;
    font-weight: 300;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    letter-spacing: -1px;
}

.heroTitleAccent {
    color: #C00000;
    font-weight: 600;
    font-style: italic;
}

.heroSubtitle {
    font-size: 1rem;
    line-height: 1.6;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
}

.heroBtn {
    margin-top: 2rem;
    background-color: #C00000;
    color: #fff;
    border: none;
    padding: 14px 32px;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.heroShapeContainer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    display: flex;
    z-index: 5;
}

.heroShapeRed {
    width: 250px;
    height: 100%;
    background-color: #C00000;
}

.heroShapeWhite {
    flex: 1;
    height: 100%;
    background-color: #1a1f24; /* Match next section background */
    clip-path: polygon(30px 0, 100% 0, 100% 100%, 0 100%);
    margin-left: -30px;
}
@media(min-width: 768px) {
    .heroShapeContainer {
        height: 45px;
    }
    .heroShapeWhite {
        clip-path: polygon(45px 0, 100% 0, 100% 100%, 0 100%);
        margin-left: -45px;
    }
}

/* ---- SECTION 2: DARK ABOUT ---- */
.darkSection {
    background-color: #1a1f24;
    padding: 6rem 2rem;
    color: #fff;
    position: relative;
    overflow: hidden;
}

/* Large watermark */
.watermark {
    position: absolute;
    top: 50%;
    left: -5%;
    transform: translateY(-50%);
    font-size: 40rem;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.02);
    z-index: 0;
    line-height: 1;
    pointer-events: none;
}

.darkContainer {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    border-left: 2px solid #C00000;
    padding-left: 2rem;
}

.sectionTitle {
    font-size: 2.5rem;
    font-weight: 300;
    color: #fff;
    margin-bottom: 3rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.sectionTitleAccent {
    color: #C00000;
    font-weight: 600;
}

.statsRow {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 3rem;
}

.statItem {
    display: flex;
    flex-direction: column;
}

.statLabel {
    color: #C00000;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    letter-spacing: 1px;
}

.statNum {
    font-size: 3.5rem;
    font-weight: 400;
    line-height: 1;
}

.aboutTextContainer {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 4rem;
    flex-wrap: wrap;
}

.aboutText {
    flex: 1;
    min-width: 300px;
    font-size: 1rem;
    line-height: 1.8;
    color: #ccc;
}

.aboutBtn {
    background: transparent;
    color: #fff;
    border: 1px solid #fff;
    padding: 12px 24px;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
}
.aboutBtn:hover {
    background: #fff;
    color: #1a1f24;
}

/* ---- SECTION 3: DARK PROJECTS (PHILOSOPHY) ---- */
.projectsSection {
    background-color: #1D1D1F; /* Slight alt dark */
    padding: 4rem 2rem 8rem;
    position: relative;
}
.projectsContainer {
    max-width: 1200px;
    margin: 0 auto;
}
.projectsTitle {
    font-size: 2.5rem;
    font-weight: 300;
    color: #fff;
    margin-bottom: 3rem;
    border-left: 2px solid #C00000;
    padding-left: 2rem;
}

.projectsLayout {
    display: flex;
    gap: 0;
    position: relative;
    height: 480px;
}

@media(max-width: 900px) {
    .projectsLayout {
        flex-direction: column;
        height: auto;
    }
}

.projectsTabs {
    display: flex;
    width: 240px;
}
@media(max-width: 900px) {
    .projectsTabs {
        width: 100%;
        height: 60px;
    }
}

.tab {
    flex: 1;
    background-color: #C00000;
    border-right: 1px solid rgba(255,255,255,0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-weight: 600;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    cursor: pointer;
    transition: all 0.3s;
    font-size: 0.9rem;
    letter-spacing: 1px;
    text-transform: uppercase;
}
@media(max-width: 900px) {
    .tab {
        writing-mode: horizontal-tb;
        transform: rotate(0);
        border-right: none;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
}

.tab:hover, .tabActive {
    background-color: #ff3333; /* Brighter red on hover/active to simulate lighting */
}
.tabActive {
    background-color: #e60000;
}

.projectsImage {
    flex: 1;
    background: url('/export_image.png') no-repeat center center;
    background-size: cover;
    position: relative;
    min-height: 300px;
}

.projectsFloatingCard {
    position: absolute;
    left: 200px;
    top: 50%;
    transform: translateY(-50%);
    background: #fff;
    padding: 3rem;
    max-width: 450px;
    color: #1a1f24;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

@media(max-width: 900px) {
    .projectsFloatingCard {
        position: relative;
        left: 0;
        top: 0;
        transform: translateY(0);
        max-width: 100%;
        box-shadow: none;
    }
}

.cardSubtitle {
    color: #999;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
}
.cardTitle {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #1a1f24;
}
.cardText {
    color: #666;
    line-height: 1.7;
    margin-bottom: 2rem;
    font-size: 0.95rem;
}

/* ---- SECTION 4: LATEST NEWS (OUR GOALS) ---- */
.newsSection {
    background-color: #e6e6e6; /* light grey from image */
    padding: 6rem 2rem;
}
.newsContainer {
    max-width: 1200px;
    margin: 0 auto;
}
.newsHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    border-left: 2px solid #C00000;
    padding-left: 2rem;
}
.newsTitle {
    font-size: 2.5rem;
    font-weight: 300;
    color: #1a1f24;
}
.newsTitleAccent {
    font-weight: 700;
}

.newsGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.newsCard {
    background: #fff;
    display: flex;
    flex-direction: column;
}
.newsCardImg {
    width: 100%;
    height: 220px;
    object-fit: cover;
}
.newsCardBody {
    padding: 2rem;
    flex: 1;
    display: flex;
    flex-direction: column;
}
.newsCardTitle {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1a1f24;
    margin-bottom: 1rem;
}
.newsCardText {
    color: #666;
    line-height: 1.6;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    flex: 1;
}
.newsCardBtn {
    align-self: flex-start;
    background: transparent;
    color: #1a1f24;
    border: 1px solid #1a1f24;
    padding: 8px 16px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
}
.newsCardBtn:hover {
    background: #1a1f24;
    color: #fff;
}

/* ---- SECTION 5: CUSTOMERS (VISION & MISSION) ---- */
.testimonialsSection {
    background-color: #fff;
    padding: 6rem 2rem;
}
.testimonialsContainer {
    max-width: 1200px;
    margin: 0 auto;
}
.testiHeader {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 3rem;
    border-left: 2px solid #C00000;
    padding-left: 2rem;
}
.testiTitle {
    font-size: 2.5rem;
    font-weight: 300;
    color: #1a1f24;
    line-height: 1.2;
}
.testiTitleAccent {
    color: #C00000;
    font-weight: 600;
}

.testiGrid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
}
@media(max-width: 600px) {
    .testiGrid {
        grid-template-columns: 1fr;
    }
}
.testiCard {
    background: #f8f9fa;
    padding: 3rem;
    display: flex;
    flex-direction: column;
}
.testiText {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #1a1f24;
    font-weight: 500;
    margin-bottom: 2rem;
    flex: 1;
}
.testiAuthor {
    color: #C00000;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1px;
}

/* ---- SECTION 6: DOUBLE IMAGE ---- */
.doubleImageSection {
    display: flex;
    height: 500px;
}
@media(max-width: 768px) {
    .doubleImageSection {
        flex-direction: column;
        height: auto;
    }
}
.doubleImageBlock {
    flex: 1;
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 300px;
}
.doubleImageBlock::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%);
}
.doubleImageContent {
    position: absolute;
    bottom: 3rem;
    left: 3rem;
    right: 3rem;
    z-index: 2;
    color: #fff;
}
.doubleImageTitle {
    font-size: 2.5rem;
    font-weight: 300;
    line-height: 1.2;
}
.doubleImageTitleAccent {
    color: #C00000;
    font-weight: 600;
}

/* ---- SECTION 7: NEWSLETTER ---- */
.newsletterSection {
    background-color: #C00000;
    padding: 5rem 2rem;
    color: #fff;
}
.newsletterContainer {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4rem;
}
@media(max-width: 900px) {
    .newsletterContainer {
        flex-direction: column;
        align-items: stretch;
    }
}
.newsletterLeft {
    flex: 1;
    border-left: 2px solid #fff;
    padding-left: 2rem;
}
.newsletterTitle {
    font-size: 2.5rem;
    font-weight: 300;
    line-height: 1.2;
}
.newsletterTitleAccent {
    font-weight: 700;
}
.newsletterRight {
    flex: 1;
}
.newsletterText {
    margin-bottom: 2rem;
    opacity: 0.9;
    font-size: 0.95rem;
}
.newsletterForm {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.newsletterInput {
    padding: 1rem;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.3);
    color: #fff;
    font-size: 1rem;
    width: 100%;
}
.newsletterInput::placeholder {
    color: rgba(255,255,255,0.7);
}
.newsletterInput:focus {
    outline: none;
    border-color: #fff;
}
.newsletterBtn {
    align-self: flex-start;
    background: #fff;
    color: #C00000;
    border: none;
    padding: 12px 24px;
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
}
.newsletterBtn:hover {
    background: #f0f0f0;
}
"""

with open(r"d:\GitHub\GNIL\gujarat-nippon\app\about\About.module.css", "w", encoding="utf-8") as f:
    f.write(css_content)

tsx_content = """\
"use client";

import React from 'react';
import styles from './About.module.css';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className={styles.pageWrapper}>
            {/* 1. HERO SECTION */}
            <section className={styles.heroSection}>
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        About <span className={styles.heroTitleAccent}>GNIPL.</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        A globally focused engineering solutions and industrial supply company dedicated to providing industries with cutting-edge machinery, technological expertise, and dependable project execution.
                    </p>
                    <button className={styles.heroBtn}>
                        GET QUOTE <ArrowRight size={16} />
                    </button>
                </div>
                <div className={styles.heroShapeContainer}>
                    <div className={styles.heroShapeRed}></div>
                    <div className={styles.heroShapeWhite}></div>
                </div>
            </section>

            {/* 2. ABOUT COMPANY (with stats) */}
            <section className={styles.darkSection}>
                <div className={styles.watermark}>G</div>
                <div className={styles.darkContainer}>
                    <h2 className={styles.sectionTitle}>
                        About <span className={styles.sectionTitleAccent}>Company</span>
                    </h2>
                    
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
                            Gujarat Nippon International Private Limited is a globally focused engineering solutions and industrial supply company dedicated to providing industries with cutting-edge machinery, technological expertise, and dependable project execution. Our mission is to provide efficient, precise, and excellent execution that empowers our business partners to achieve operational excellence and long-term success.
                        </div>
                        <button className={styles.aboutBtn}>
                            LEARN MORE <ArrowRight size={16} style={{marginLeft:'8px'}} />
                        </button>
                    </div>
                </div>
            </section>

            {/* 3. OUR PHILOSOPHY (Current Projects Layout) */}
            <section className={styles.projectsSection}>
                <div className={styles.projectsContainer}>
                    <h2 className={styles.projectsTitle}>
                        Our <span className={styles.sectionTitleAccent}>Philosophy</span>
                    </h2>
                    
                    <div className={styles.projectsLayout}>
                        <div className={styles.projectsTabs}>
                            <div className={styles.tab}>Strong Networks</div>
                            <div className={styles.tab}>Smart Work</div>
                            <div className={styles.tabActive}>Hard Work</div>
                        </div>
                        <div className={styles.projectsImage}>
                            {/* Background image set in CSS */}
                        </div>
                        <div className={styles.projectsFloatingCard}>
                            <div className={styles.cardSubtitle}>Our Team</div>
                            <h3 className={styles.cardTitle}>Our Commitments</h3>
                            <div className={styles.cardText}>
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#C00000', fontWeight: 'bold' }}>•</span> Professional Excellence</li>
                                    <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#C00000', fontWeight: 'bold' }}>•</span> Efficient Execution</li>
                                    <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#C00000', fontWeight: 'bold' }}>•</span> Strategic Problem-Solving</li>
                                    <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#C00000', fontWeight: 'bold' }}>•</span> Client-Centric Service</li>
                                </ul>
                                <p style={{ marginTop: '1rem', fontStyle: 'italic', opacity: 0.8 }}>We combine hard work, smart execution, and strong industry networks to deliver exceptional value.</p>
                            </div>
                            <button className={styles.aboutBtn} style={{ color: '#1a1f24', borderColor: '#1a1f24' }}>
                                LEARN MORE <ArrowRight size={16} style={{marginLeft:'8px'}} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. OUR GOALS (Latest News Layout) */}
            <section className={styles.newsSection}>
                <div className={styles.newsContainer}>
                    <div className={styles.newsHeader}>
                        <h2 className={styles.newsTitle}>
                            Our <span className={styles.newsTitleAccent}>Goals</span>
                        </h2>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', color:'#C00000', cursor:'pointer'}}><ArrowLeft size={20}/></div>
                            <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#C00000', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', cursor:'pointer'}}><ArrowRight size={20}/></div>
                        </div>
                    </div>

                    <div className={styles.newsGrid}>
                        {/* Goal 1 */}
                        <div className={styles.newsCard}>
                            <img src="/industries_served.png" alt="People" className={styles.newsCardImg} />
                            <div className={styles.newsCardBody}>
                                <h3 className={styles.newsCardTitle}>People</h3>
                                <p className={styles.newsCardText}>To create equitable opportunities for growth and success for all our stakeholders — employees, partners, and clients — by fostering innovation, collaboration, and trust.</p>
                                <button className={styles.newsCardBtn}>READ MORE <ArrowRight size={14} style={{marginLeft:'4px'}}/></button>
                            </div>
                        </div>
                        {/* Goal 2 */}
                        <div className={styles.newsCard}>
                            <img src="/hero_image.png" alt="Planet" className={styles.newsCardImg} />
                            <div className={styles.newsCardBody}>
                                <h3 className={styles.newsCardTitle}>Planet</h3>
                                <p className={styles.newsCardText}>To serve industries across the globe with sustainable and responsible engineering solutions that contribute positively to society and the environment.</p>
                                <button className={styles.newsCardBtn}>READ MORE <ArrowRight size={14} style={{marginLeft:'4px'}}/></button>
                            </div>
                        </div>
                        {/* Goal 3 */}
                        <div className={styles.newsCard}>
                            <img src="/export_image.png" alt="Profits" className={styles.newsCardImg} />
                            <div className={styles.newsCardBody}>
                                <h3 className={styles.newsCardTitle}>Profits</h3>
                                <p className={styles.newsCardText}>To deliver measurable value to our business partners by ensuring minimum operating costs, maximum efficiency, and enhanced profitability across every project.</p>
                                <button className={styles.newsCardBtn}>READ MORE <ArrowRight size={14} style={{marginLeft:'4px'}}/></button>
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
                            Vision & <br/><span className={styles.testiTitleAccent}>Mission</span>
                        </h2>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                            <div style={{width:'40px', height:'40px', borderRadius:'50%', border:'1px solid #ccc', display:'flex', alignItems:'center', justifyContent:'center', color:'#ccc', cursor:'pointer'}}><ArrowLeft size={20}/></div>
                            <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#C00000', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', cursor:'pointer'}}><ArrowRight size={20}/></div>
                        </div>
                    </div>

                    <div className={styles.testiGrid}>
                        <div className={styles.testiCard}>
                            <p className={styles.testiText}>
                                "To become a globally recognized one-stop hub for comprehensive engineering solutions and industrial supplies, known for reliability, efficiency, and execution excellence."
                            </p>
                            <span className={styles.testiAuthor}>Our Vision</span>
                            <span style={{color: '#999', fontSize: '0.8rem', marginTop: '4px'}}>GNIPL</span>
                        </div>
                        <div className={styles.testiCard}>
                            <p className={styles.testiText}>
                                "To provide efficient, precise, and excellent execution that empowers our business partners to achieve operational excellence and long-term success."
                            </p>
                            <span className={styles.testiAuthor}>Our Mission</span>
                            <span style={{color: '#999', fontSize: '0.8rem', marginTop: '4px'}}>GNIPL</span>
                        </div>
                    </div>

                    <button className={styles.heroBtn} style={{ marginTop: '3rem' }}>
                        LEARN MORE <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            {/* 6. DOUBLE IMAGE SPLIT */}
            <section className={styles.doubleImageSection}>
                <div className={styles.doubleImageBlock} style={{ backgroundImage: "url('/export_image.png')" }}>
                    <div className={styles.doubleImageContent}>
                        <h2 className={styles.doubleImageTitle}>
                            What efficiency<br/>can make <span className={styles.doubleImageTitleAccent}>changes.</span>
                        </h2>
                    </div>
                </div>
                <div className={styles.doubleImageBlock} style={{ backgroundImage: "url('/industries_served.png')" }}>
                    <div className={styles.doubleImageContent}>
                        <h2 className={styles.doubleImageTitle} style={{ marginBottom: '1.5rem' }}>
                            Start your<br/>engineering journey.<br/><span className={styles.doubleImageTitleAccent}>Today.</span>
                        </h2>
                        <button className={styles.heroBtn}>
                            CONSULT US <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* 7. NEWSLETTER */}
            <section className={styles.newsletterSection}>
                <div className={styles.newsletterContainer}>
                    <div className={styles.newsletterLeft}>
                        <h2 className={styles.newsletterTitle}>
                            Stay up to date on<br/>the latest <span className={styles.newsletterTitleAccent}>GNIPL news</span>
                        </h2>
                    </div>
                    <div className={styles.newsletterRight}>
                        <p className={styles.newsletterText}>Get our latest news, updates and business insights straight to your inbox.</p>
                        <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Email Address" className={styles.newsletterInput} />
                            <button type="submit" className={styles.newsletterBtn}>
                                SUBSCRIBE <ArrowRight size={16} style={{marginLeft:'8px'}}/>
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
"""

with open(r"d:\GitHub\GNIL\gujarat-nippon\app\about\page.tsx", "w", encoding="utf-8") as f:
    f.write(tsx_content)

print("Files updated successfully.")
