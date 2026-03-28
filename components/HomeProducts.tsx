"use client";

import React, { useRef, useState, useEffect } from 'react';
import styles from './HomeProducts.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import HomeIndustries from './HomeIndustries';
import HomeAdvantage from './HomeAdvantage';
import HomeServices from './HomeServices';

const products = [
    { type: "PRODUCT", img: "/product_1.png", title: "Turnkey Plant & Machineries", desc: "Complete plant machinery design and supply", action: "Explore" },
    { type: "PRODUCT", img: "/product_2.png", title: "Capital Equipment", desc: "Industrial machinery from trusted global manufacturers", action: "View" },
    { type: "PRODUCT", img: "/product_3.png", title: "Plastic Moulding Systems", desc: "High-precision systems for plastic manufacturing", action: "Explore" },
    { type: "PRODUCT", img: "/product_4.png", title: "Mining & Crushing Equipment", desc: "Heavy-duty systems for mining operations", action: "View" },
    { type: "PRODUCT", img: "/brochure.jpg", title: "EOT & Gantry Cranes", desc: "High-capacity lifting and material handling systems", action: "Explore" },
    { type: "PRODUCT", img: "/product_1.png", title: "Industrial Generator Sets", desc: "Reliable power systems for industrial facilities", action: "View" },
    { type: "PRODUCT", img: "/product_2.png", title: "Automated Packaging Machinery", desc: "High-speed industrial packaging systems", action: "Browse" },
    { type: "PRODUCT", img: "/product_3.png", title: "Heavy-Duty Industrial Pumps", desc: "Robust pumps for demanding industrial fluids", action: "View" },
    { type: "PRODUCT", img: "/product_4.png", title: "High-Alumina Refractory Materials", desc: "Heat-resistant materials for furnaces and kilns", action: "Explore" },
    { type: "PRODUCT", img: "/brochure.jpg", title: "Power Transmission Gearboxes", desc: "Precision gear drives for industrial machinery", action: "Browse" },
    { type: "PRODUCT", img: "/product_1.png", title: "Extrusion Dies & Press Containers", desc: "Precision components for aluminium extrusion", action: "View" },
    { type: "PRODUCT", img: "/product_2.png", title: "MDF Resins & Adhesives", desc: "Industrial adhesives for MDF manufacturing", action: "View" }
];

export default function HomeProducts() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const maxScrollLeft = scrollWidth - clientWidth;
            if (maxScrollLeft > 0) {
                setScrollProgress((scrollLeft / maxScrollLeft) * 100);
            }
        }
    };

    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
            // Initialize
            handleScroll();
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    // auto scroll every 5s
    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const maxScrollLeft = scrollWidth - clientWidth;

                // If we are at the end, scroll back to 0. Otherwise, scroll by card width (approx 350+gap)
                if (scrollLeft >= maxScrollLeft - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
                }
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const scrollLeftFn = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRightFn = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.wrapper}>
            {/* Main Brochure Section */}
            <motion.section
                className={styles.brochureSection}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
                }}
            >
                <span className={styles.breadcrumb}>• Our Full Brochure</span>
                <div className={styles.brochureContainer}>
                    <motion.div
                        className={styles.brochureCard}
                        variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
                    >
                        <h2 className={styles.brochureTitle}>Main Brochure</h2>
                        <p className={styles.brochureText}>
                            We deliver complete turnkey plant machineries, industrial spares, specialized capital equipment, and comprehensive engineering solutions.
                        </p>
                        <Link href="/brochure.pdf" className={styles.downloadBtn}>
                            Download Brochure
                        </Link>
                    </motion.div>
                    <motion.div
                        className={styles.industryVisuals}
                        variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
                    >
                        <div className={styles.visualMainImage}>
                            <img src="/brochure.jpg" alt="Brochure" />
                        </div>
                        <div className={styles.industryPills}>
                            <div className={styles.pill}>Metal Processing</div>
                            <div className={styles.pill}>Plastics</div>
                            <div className={styles.pill}>Heavy Machinery</div>
                            <div className={styles.pill}>Consumables</div>
                            <div className={styles.pill}>Spares</div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            <HomeIndustries />

            <HomeAdvantage />

            <HomeServices />


            {/* Our Products Section Instead of News */}
            <motion.section
                className={styles.newsSection}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <div className={styles.newsHeader}>
                    <div className={styles.productLeftHeader}>
                        <h2 className={styles.newsTitle}>Our Products</h2>
                    </div>
                    <div className={styles.productRightHeader}>
                        {/* Empty for now, or you could place something else here */}
                    </div>
                </div>

                <div className={styles.productScrollWrapper} ref={scrollRef}>
                    {products.map((p, idx) => (
                        <div key={idx} className={styles.productCard}>
                            <div className={styles.productImageContainer}>
                                <img src={p.img} alt={p.title} className={styles.productImage} />
                                <div className={styles.productOverlay}></div>
                            </div>
                            <div className={styles.cardForeground}>
                                <div className={styles.cardType}>{p.type}</div>
                                <div className={styles.productCardContent}>
                                    <h3 className={styles.productCardTitle}>{p.title}</h3>
                                    <div className={styles.productCardDescWrapper}>
                                        <p className={styles.productCardDesc}>{p.desc}</p>
                                        <span className={styles.productCardArrow}>→</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.scrollControls}>
                    <div className={styles.progressBarWrapper}>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${scrollProgress}%` }}></div>
                        </div>
                    </div>
                    <div className={styles.bottomArrows}>
                        <button className={styles.arrowBtn} onClick={scrollLeftFn}>←</button>
                        <button className={styles.arrowBtn} onClick={scrollRightFn}>→</button>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
