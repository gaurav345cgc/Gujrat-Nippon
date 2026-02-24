"use client";

import React, { useEffect, useRef } from 'react';
import styles from './About.module.css';

export default function AboutPage() {
    const elementsRef = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.visible);
                        // Optional: observer.unobserve(entry.target) if you only want it to animate once
                    } else {
                        // Removing the class will make it animate out when scrolled past
                        entry.target.classList.remove(styles.visible);
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
                rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits bottom
            }
        );

        elementsRef.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !elementsRef.current.includes(el)) {
            elementsRef.current.push(el);
        }
    };

    return (
        <main className={styles.pageWrapper}>
            {/* Full Screen Hero Image */}
            <div className={styles.heroFullScreen}>
                <img src="/about_us.png" alt="About Us Full Screen" className={styles.heroImage} />
                <div className={styles.heroOverlay}>
                    <h1 className={styles.heroTitle}>About Us</h1>
                </div>
            </div>

            <div className={styles.container}>

                {/* 1. Company Overview (Text Left, Image Right) */}
                <section className={styles.splitSection}>
                    <div ref={addToRefs} className={`${styles.textContent} ${styles.blurInLeft}`} style={{ transitionDelay: '0s' }}>
                        <h2 className={styles.sectionHeading}>Precision in every process</h2>
                        <p className={styles.sectionText}>
                            <strong>Company Overview:</strong> Gujarat Nippon Group is part of a Multi National Group predominantly in metal processing industries. We have established ourselves as pioneers delivering robust engineering solutions and global supply chains for over three decades.
                        </p>
                    </div>
                    <div ref={addToRefs} className={`${styles.imageContent} ${styles.blurInRight}`} style={{ transitionDelay: '0.2s' }}>
                        <img
                            src="https://images.unsplash.com/photo-1565514020179-026a92b84bb6?auto=format&fit=crop&q=80&w=800"
                            alt="Industrial Facility Overview"
                            className={styles.sectionImage}
                        />
                    </div>                </section>

                {/* 2. Mission (Reverse: Image Left, Text Right) */}
                <section className={`${styles.splitSection} ${styles.splitSectionReverse}`}>
                    <div ref={addToRefs} className={`${styles.textContent} ${styles.blurInRight}`} style={{ transitionDelay: '0s' }}>
                        <h2 className={styles.sectionHeading}>Our Mission</h2>
                        <p className={styles.sectionText}>
                            Our mission is to empower the metal processing and manufacturing sectors by delivering reliable, high-performance industrial solutions. We continually innovate targeting efficiency, safety, and scale, ensuring our partners always stay ahead of the curve.
                        </p>
                    </div>
                    <div ref={addToRefs} className={`${styles.imageContent} ${styles.blurInLeft}`} style={{ transitionDelay: '0.2s' }}>
                        <img
                            src="https://images.unsplash.com/photo-1504917595217-d4bf14d2ce8a?auto=format&fit=crop&q=80&w=800"
                            alt="Precision Engineering Mission"
                            className={styles.sectionImage}
                        />
                    </div>                </section>

                {/* 3. Vision (Text Left, Image Right) */}
                <section className={styles.splitSection}>
                    <div ref={addToRefs} className={`${styles.textContent} ${styles.blurInLeft}`} style={{ transitionDelay: '0s' }}>
                        <h2 className={styles.sectionHeading}>Our Vision</h2>
                        <p className={styles.sectionText}>
                            <strong>GNIPL Vision:</strong> 'To be One Point Engineering Solution Provider and Supply company'. We envision a future where Gujarat Nippon stands synonymous with operational excellence and sustainable industrial supply chains worldwide.
                        </p>
                    </div>
                    <div ref={addToRefs} className={`${styles.imageContent} ${styles.blurInRight}`} style={{ transitionDelay: '0.2s' }}>
                        <img
                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                            alt="Innovative Vision Robotics"
                            className={styles.sectionImage}
                        />
                    </div>                </section>

                {/* 4. Leadership (Reverse: Image Left, Text Right) */}
                <section className={`${styles.splitSection} ${styles.splitSectionReverse}`}>
                    <div ref={addToRefs} className={`${styles.textContent} ${styles.blurInRight}`} style={{ transitionDelay: '0s' }}>
                        <h2 className={styles.sectionHeading}>Leadership</h2>
                        <p className={styles.sectionText}>
                            Spearheaded by a team of visionary engineers and corporate strategists, our executive leadership combines decades of global expertise. Their dedication to integrity, innovation, and client success remains the driving force behind the Gujarat Nippon Group's international expansion.
                        </p>
                    </div>
                    <div ref={addToRefs} className={`${styles.imageContent} ${styles.blurInLeft}`} style={{ transitionDelay: '0.2s' }}>
                        <img
                            src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?auto=format&fit=crop&q=80&w=800"
                            alt="Executive Leadership Team"
                            className={styles.sectionImage}
                        />
                    </div>                </section>

                {/* Divisions Grid Section */}
                <section>
                    <h2 className={styles.sectionTitle}>Our Divisions</h2>
                    <div className={styles.divisionsGrid}>
                        <article className={styles.divisionCard} style={{ animationDelay: '1.7s' }}>
                            <h3 className={styles.cardTitle}>GNIPL</h3>
                            <p className={styles.cardText}>
                                Sourcing and supply of Industrial Spares and Consumables (Electrical, Mechanical, Hydraulic, Pneumatic, Chemicals, Grease and Lubricants). GNIPL being an engineering company undertakes design, manufacture and supply of plant & machineries for metal processing industries on turnkey basis... GNIPL represents reputed International Companies for supply of capital equipment (Zhuoshen, Vietsteel, Maker).
                            </p>
                        </article>

                        <article className={styles.divisionCard} style={{ animationDelay: '1.8s' }}>
                            <h3 className={styles.cardTitle}>Gujarat Nippon Enterprises Pvt Ltd</h3>
                            <p className={styles.cardText}>
                                Is into plastic moulding.
                            </p>
                        </article>

                        <article className={styles.divisionCard} style={{ animationDelay: '1.9s' }}>
                            <h3 className={styles.cardTitle}>Logic Plastics Pvt Ltd</h3>
                            <p className={styles.cardText}>
                                Manufactures & supplies Tooth Brushes for various renowned multinational brands.
                            </p>
                        </article>
                    </div>
                </section>



            </div>
        </main>
    );
}
