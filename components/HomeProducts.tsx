"use client";

import React, { useRef, useState, useEffect } from 'react';
import styles from './HomeProducts.module.css';
import Link from 'next/link';
import HomeAdvantage from './HomeAdvantage';
import HomeServices from './HomeServices';

const products = [
    { type: "PRODUCT", img: "/product_1.png", title: "Plant & Machineries", desc: "Design, manufacture and supply of plant and equipment for metal processing as per project scope", action: "View" },
    { type: "PRODUCT", img: "/product_2.png", title: "Capital Equipment", desc: "Supply of industrial machinery and packaged equipment as per project requirements", action: "View" },
    { type: "PRODUCT", img: "/product_3.png", title: "Plastic Moulding Systems", desc: "Supply and support for plastic moulding lines and related plant requirements", action: "View" },
    { type: "PRODUCT", img: "/product_4.png", title: "Mining & Crushing Equipment", desc: "Sourcing and supply of mining and crushing equipment for extractive industry customers", action: "View" },
    { type: "PRODUCT", img: "/brochure.jpg", title: "EOT & Gantry Cranes", desc: "Material handling cranes supplied to agreed technical and safety standards", action: "View" },
    { type: "PRODUCT", img: "/product_1.png", title: "Industrial Generator Sets", desc: "Diesel and gas generator sets for industrial power backup and prime power", action: "View" },
    { type: "PRODUCT", img: "/product_2.png", title: "Packaging Machinery", desc: "Industrial packaging and strapping systems for production and dispatch lines", action: "View" },
    { type: "PRODUCT", img: "/product_3.png", title: "Industrial Pumps", desc: "Pumps and fluid handling equipment for process and utility applications", action: "View" },
    { type: "PRODUCT", img: "/product_4.png", title: "Refractory Materials", desc: "High-alumina refractory products for furnaces and high-temperature plant", action: "View" },
    { type: "PRODUCT", img: "/brochure.jpg", title: "Gearboxes & Drives", desc: "Power transmission gearboxes and drives for industrial machinery", action: "View" },
    { type: "PRODUCT", img: "/product_1.png", title: "Extrusion Dies & Press Containers", desc: "Components for aluminium extrusion supplied to drawing and specification", action: "View" },
    { type: "PRODUCT", img: "/product_2.png", title: "MDF Resins & Adhesives", desc: "Industrial resins and adhesives for MDF and panel manufacturing customers", action: "View" }
];

function getHomepageProductAlt(img: string, title: string) {
    if (img === '/product_1.png' && title.toLowerCase().includes('plant')) {
        return 'Cold rolling mill — turnkey plant machinery supplied by Gujarat Nippon International';
    }
    if (img === '/product_2.png' && title.toLowerCase().includes('capital')) {
        return 'Capital equipment — EOT crane supplied by Gujarat Nippon International, Mumbai';
    }
    if (img === '/product_3.png' && title.toLowerCase().includes('moulding')) {
        return 'Plastic moulding system — injection moulding machinery supplied by Gujarat Nippon';
    }
    return `${title} supplied by Gujarat Nippon International`;
}

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
            <HomeAdvantage />
            <HomeServices />

            <section className={styles.newsSection}>
                <div className={styles.newsHeader}>
                    <div className={styles.productLeftHeader}>
                        <h2 className={styles.newsTitle}>Products & Supply</h2>
                    </div>
                </div>

                <div className={styles.productScrollWrapper} ref={scrollRef}>
                    {products.map((p, idx) => (
                        <div key={idx} className={styles.productCard}>
                            <div className={styles.productImageContainer}>
                                <img
                                    src={p.img}
                                    alt={getHomepageProductAlt(p.img, p.title)}
                                    className={styles.productImage}
                                />
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
            </section>
        </div>
    );
}
