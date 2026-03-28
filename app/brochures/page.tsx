"use client";

import React, { useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import styles from './Brochures.module.css';

/* ─── DATA ─────────────────────────────────────────────────── */
const categories = ['All', 'Corporate', 'Technical', 'Certificates', 'Forms'];

const brochures = [
    {
        id: 'corp-profile',
        title: 'GNIPL & Associates Corporate Profile',
        description: 'Comprehensive overview of Gujarat Nippon International Pvt. Ltd — our group history, diverse business verticals, and global footprint.',
        category: 'Corporate',
        type: 'PDF',
        size: '33.4 MB',
        date: 'March 2026',
        pages: 42,
        color: '#003153',
        url: '/brochures/GNIPL & Associates.pdf',
        image: '/brochures_thumbs/corporate.png',
    },
    {
        id: 'alum-extrusion',
        title: 'Aluminium Extrusion Catalogue',
        description: 'Technical specifications and product range for our high-precision aluminium extrusion profiles and architectural solutions.',
        category: 'Technical',
        type: 'PDF',
        size: '6.1 MB',
        date: 'Feb 2026',
        pages: 28,
        color: '#003153',
        url: '/brochures/Aluminium Extrusion Catalogue.pdf',
        image: '/brochures_thumbs/aluminium_extrusion.png',
    },
    {
        id: 'cement-booklet',
        title: 'G Nippon Cement Booklet',
        description: 'Detailed information on our cement manufacturing processes, quality standards, and product performance metrics.',
        category: 'Technical',
        type: 'PDF',
        size: '2.1 MB',
        date: 'Jan 2026',
        pages: 18,
        color: '#003153',
        url: '/brochures/Booklet G Nippon cement.pdf',
        image: '/brochures_thumbs/cement.png',
    },
    {
        id: 'mdf-catalog',
        title: 'MDF & Wood Solutions Catalogue',
        description: 'Explore our comprehensive range of high-density MDF boards, decorative laminates, and wood-based interior solutions.',
        category: 'Technical',
        type: 'PDF',
        size: '12.6 MB',
        date: 'Dec 2025',
        pages: 36,
        color: '#003153',
        url: '/brochures/MDF Catalogue.pdf',
        image: '/brochures_thumbs/mdf.png',
    },
    {
        id: 'mining-catalog',
        title: 'Mining Equipment & Services',
        description: 'Technical guide to our mining operations, equipment fleet, and specialized services for the extractive industries.',
        category: 'Technical',
        type: 'PDF',
        size: '24.4 MB',
        date: 'Nov 2025',
        pages: 52,
        color: '#003153',
        url: '/brochures/Mining Catalogue for Emailing.pdf',
        image: '/brochures_thumbs/mining.png',
    },
    {
        id: 'packing-solutions',
        title: 'Industrial Packing Solutions',
        description: 'Innovative packaging materials and customized logistics solutions for industrial goods and exports.',
        category: 'Technical',
        type: 'PDF',
        size: '1.5 MB',
        date: 'Oct 2025',
        pages: 12,
        color: '#003153',
        url: '/brochures/Packing Solutions.pdf',
        image: '/brochures_thumbs/packing.png',
    },
    {
        id: 'refurb-catalogue',
        title: 'Plant Refurbishment Catalogue',
        description: 'Comprehensive guide to our industrial plant refurbishment, modernization, and technical upgrade services.',
        category: 'Technical',
        type: 'PDF',
        size: '6.7 MB',
        date: 'Sept 2025',
        pages: 24,
        color: '#003153',
        url: '/brochures/Refurbishment catalogue.pdf',
        image: '/brochures_thumbs/refurbishment.png',
    },
    {
        id: 'spares-catalog',
        title: 'Industrial Spares & Components',
        description: 'Extensive inventory of high-quality industrial spare parts, precision components, and maintenance kits.',
        category: 'Technical',
        type: 'PDF',
        size: '0.5 MB',
        date: 'Aug 2025',
        pages: 64,
        color: '#003153',
        url: '/brochures/spares.pdf',
        image: '/brochures_thumbs/spares.png',
    },
];

/* ─── ANIMATION VARIANTS ────────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.8, 0.25, 1],
            delay: i * 0.08
        },
    }),
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

/* ─── SUB-COMPONENTS ────────────────────────────────────────── */
function HeroSection() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    return (
        <section className={styles.hero} ref={ref}>
            <motion.div className={styles.heroBg} style={{ y }} />
            <div className={styles.heroOverlay} />

            {/* Geometric accents */}
            <motion.div
                className={styles.heroAccentRing}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.15 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
            />
            <motion.div
                className={styles.heroAccentRing2}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.08 }}
                transition={{ duration: 1.8, ease: 'easeOut', delay: 0.2 }}
            />

            <motion.div className={styles.heroContent} style={{ opacity }}>
                {/* Label */}
                <motion.div
                    className={styles.heroLabel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <span className={styles.labelDot} />
                    Resources & Downloads
                </motion.div>

                {/* Heading */}
                <motion.h1
                    className={styles.heroTitle}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.25, 0.8, 0.25, 1], delay: 0.2 }}
                >
                    Our <span className={styles.heroTitleAccent}>Brochures</span>
                    <br />& Documents
                </motion.h1>

                {/* Sub */}
                <motion.p
                    className={styles.heroSub}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Access our comprehensive library of corporate documentation, technical
                    brochures, and official quality certifications — all in one place.
                </motion.p>


            </motion.div>

            {/* Bottom shape */}
            <div className={styles.heroShapeBar}>
                <div className={styles.heroShapeTeal} />
                <div className={styles.heroShapeWhite} />
            </div>
        </section>
    );
}

function FilterBar({ active, onChange }: { active: string; onChange: (c: string) => void }) {
    return (
        <motion.div
            className={styles.filterBar}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            {categories.map((cat) => (
                <button
                    key={cat}
                    className={`${styles.filterBtn} ${active === cat ? styles.filterBtnActive : ''}`}
                    onClick={() => onChange(cat)}
                >
                    {cat}
                </button>
            ))}
        </motion.div>
    );
}

function BrochureGrid({ filter }: { filter: string }) {
    const filtered = filter === 'All' ? brochures : brochures.filter((b) => b.category === filter);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-5%' });

    return (
        <motion.div
            className={styles.grid}
            ref={ref}
            variants={stagger}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
        >
            {filtered.map((doc, i) => (
                <motion.article
                    key={doc.id}
                    id={`brochure-${doc.id}`}
                    className={styles.card}
                    variants={fadeUp as any}
                    custom={i}
                >
                    {/* Image Container with Clip Path */}
                    <div className={styles.imageWrapper}>
                        <img
                            src={doc.image}
                            alt={doc.title}
                            className={styles.cardImage}
                        />
                    </div>

                    {/* Body */}
                    <div className={styles.cardBody}>
                        <h2 className={styles.cardTitle}>{doc.title}</h2>
                        <div className={styles.cardDate}>{doc.date}</div>

                        <a
                            href={doc.url}
                            className={styles.learnMore}
                            aria-label={`Learn more about ${doc.title}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Learn More
                        </a>
                    </div>
                </motion.article>
            ))}
        </motion.div>
    );
}

function CtaBanner() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-10%' });

    return (
        <motion.section
            className={styles.cta}
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
        >
            <div className={styles.ctaInner}>
                <div className={styles.ctaLeft}>
                    <p className={styles.ctaOverline}>
                        <span className={styles.labelDot} style={{ background: '#fff' }} />
                        Need Something Specific?
                    </p>
                    <h2 className={styles.ctaTitle}>
                        Can&apos;t find what<br />
                        you&apos;re looking <span className={styles.ctaTitleAccent}>for?</span>
                    </h2>
                </div>
                <div className={styles.ctaRight}>
                    <p className={styles.ctaText}>
                        Our team is ready to provide custom documentation, technical datasheets, or
                        any other material you may need for your project.
                    </p>
                    <a href="/contact" className={styles.ctaBtn}>
                        Contact Us
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </a>
                </div>
            </div>
        </motion.section>
    );
}

/* ─── PAGE ──────────────────────────────────────────────────── */
export default function BrochuresPage() {
    const [activeFilter, setActiveFilter] = useState('All');

    return (
        <main className={styles.page}>
            <HeroSection />

            <section className={styles.librarySection}>
                <div className={styles.libraryContainer}>
                    {/* Section label */}
                    <motion.div
                        className={styles.sectionLabel}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className={styles.labelDot} style={{ background: 'var(--primary-teal)' }} />
                        Document Library
                    </motion.div>

                    <motion.h2
                        className={styles.sectionTitle}
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Browse & Download
                        <span className={styles.sectionTitleAccent}> Resources</span>
                    </motion.h2>

                    <FilterBar active={activeFilter} onChange={setActiveFilter} />
                    <BrochureGrid filter={activeFilter} key={activeFilter} />
                </div>
            </section>

            <CtaBanner />
        </main>
    );
}
