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


            <div className={styles.container}>

                {/* 1. Introduction (Text Left, Image Right) */}
                <section className={styles.splitSection}>
                    <div ref={addToRefs} className={`${styles.textContent} ${styles.blurInLeft}`} style={{ transitionDelay: '0s' }}>
                        <h2 className={styles.sectionHeading}>About Us</h2>
                        <div className={styles.sectionText}>
                            <p style={{ marginBottom: '1rem' }}>
                                Gujarat Nippon International Private Limited is a globally focused engineering solutions and industrial supply company dedicated to providing industries with cutting-edge machinery, technological expertise, and dependable project execution.
                            </p>
                            <p style={{ marginBottom: '1rem' }}>
                                Our expertise lies in delivering comprehensive engineering solutions that integrate technology alliances, industrial sourcing, and turnkey project capabilities. Our approach is centered on gaining a deep understanding of our clients’ requirements and providing customized solutions that enhance operational performance, productivity, and efficiency.
                            </p>
                            <p>
                                As we expand into new international markets, we aim to establish ourselves as a trusted partner for organizations seeking long-term value creation and reliable engineering support.
                            </p>
                        </div>
                    </div>
                    <div ref={addToRefs} className={`${styles.imageContent} ${styles.blurInRight}`} style={{ transitionDelay: '0.2s' }}>
                        <img
                            src="/hero_image.png"
                            alt="Industrial Facility Overview"
                            className={styles.sectionImage}
                        />
                    </div>
                </section>

                {/* 2. Vision & Mission (Reverse: Image Left, Text Right) */}
                <section className={`${styles.splitSection} ${styles.splitSectionReverse}`}>
                    <div ref={addToRefs} className={`${styles.textContent} ${styles.blurInRight}`} style={{ transitionDelay: '0s' }}>
                        <h2 className={styles.sectionHeading}>Vision & Mission</h2>
                        <div className={styles.sectionText}>
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ color: '#C00000', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Our Vision</h3>
                                <p>To become a globally recognized one-stop hub for comprehensive engineering solutions and industrial supplies, known for reliability, efficiency, and execution excellence.</p>
                            </div>
                            <div>
                                <h3 style={{ color: '#C00000', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Our Mission</h3>
                                <p>To provide efficient, precise, and excellent execution that empowers our business partners to achieve operational excellence and long-term success.</p>
                            </div>
                        </div>
                    </div>
                    <div ref={addToRefs} className={`${styles.imageContent} ${styles.blurInLeft}`} style={{ transitionDelay: '0.2s' }}>
                        <img
                            src="/industries_served.png"
                            alt="Precision Engineering Mission"
                            className={styles.sectionImage}
                        />
                    </div>
                </section>

                {/* 3. Our Goals */}
                <section>
                    <h2 className={styles.sectionTitle}>Our Goals</h2>
                    <div className={styles.goalsGrid}>
                        <article className={styles.goalCard} style={{ animationDelay: '0.1s' }}>
                            <div className={styles.goalIcon}>👥</div>
                            <h3 className={styles.cardTitle}>People</h3>
                            <p className={styles.cardText}>
                                To create equitable opportunities for growth and success for all our stakeholders — employees, partners, and clients — by fostering innovation, collaboration, and trust.
                            </p>
                        </article>

                        <article className={styles.goalCard} style={{ animationDelay: '0.2s' }}>
                            <div className={styles.goalIcon}>🌍</div>
                            <h3 className={styles.cardTitle}>Planet</h3>
                            <p className={styles.cardText}>
                                To serve industries across the globe with sustainable and responsible engineering solutions that contribute positively to society and the environment.
                            </p>
                        </article>

                        <article className={styles.goalCard} style={{ animationDelay: '0.3s' }}>
                            <div className={styles.goalIcon}>📈</div>
                            <h3 className={styles.cardTitle}>Profits</h3>
                            <p className={styles.cardText}>
                                To deliver measurable value to our business partners by ensuring minimum operating costs, maximum efficiency, and enhanced profitability across every project we undertake.
                            </p>
                        </article>
                    </div>
                </section>

                {/* 4. Our Team & Philosophy (Text Left, Image Right) */}
                <section className={styles.splitSection} style={{ marginBottom: '2rem' }}>
                    <div ref={addToRefs} className={`${styles.textContent} ${styles.blurInLeft}`} style={{ transitionDelay: '0s' }}>
                        <h2 className={styles.sectionHeading}>Our Team & Philosophy</h2>
                        <div className={styles.sectionText}>
                            <p style={{ marginBottom: '1.5rem' }}>
                                At Gujarat Nippon International Private Limited (GNIPL), our strength lies in our people. We are a dedicated team of professionals who combine hard work, smart execution, and strong industry networks to deliver exceptional value.
                            </p>

                            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <h4 style={{ color: '#C00000', marginBottom: '1rem', fontSize: '1.2rem' }}>Our Commitments</h4>
                                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#C00000' }}>•</span> Professional Excellence</li>
                                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#C00000' }}>•</span> Efficient Execution</li>
                                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#C00000' }}>•</span> Strategic Problem-Solving</li>
                                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#C00000' }}>•</span> Client-Centric Service</li>
                                    </ul>
                                </div>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <h4 style={{ color: '#C00000', marginBottom: '1rem', fontSize: '1.2rem' }}>Our Philosophy</h4>
                                    <p style={{ marginBottom: '0.5rem' }}>We combine:</p>
                                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>✔ Hard Work</li>
                                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>✔ Smart Work</li>
                                        <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>✔ Strong Networks</li>
                                    </ul>
                                </div>
                            </div>
                            <p style={{ fontStyle: 'italic', opacity: 0.8 }}>
                                We believe that collaboration, trust, and continuous improvement form the foundation of long-term partnerships and successful project delivery.
                            </p>
                        </div>
                    </div>
                    <div ref={addToRefs} className={`${styles.imageContent} ${styles.blurInRight}`} style={{ transitionDelay: '0.2s' }}>
                        <img
                            src="/export_image.png"
                            alt="Professional Excellence"
                            className={styles.sectionImage}
                        />
                    </div>
                </section>



            </div>
        </main>
    );
}
