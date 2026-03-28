"use client";

import React, { useRef, useEffect } from 'react';
import styles from './HomeServices.module.css';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

function ServiceCard({ svc, containerRef, scrollRight }: { svc: any, containerRef: React.RefObject<HTMLDivElement | null>, scrollRight: () => void }) {
    const cardRef = useRef<HTMLDivElement>(null);

    const { scrollXProgress } = useScroll({
        target: cardRef,
        container: containerRef,
        axis: "x",
        offset: ["start end", "center center"]
    });

    // Add a smooth spring physics layer on top of the plain scroll progress so it doesn't just snap blindly via fast touchpad scrolling
    const smoothProgress = useSpring(scrollXProgress, { stiffness: 100, damping: 20, restDelta: 0.001 });

    // Stronger animation: Starts noticeably zoomed and stretched
    const scale = useTransform(smoothProgress, [0, 1], [1.12, 1]);
    const scaleX = useTransform(smoothProgress, [0, 1], [1.2, 1]);

    return (
        <div ref={cardRef} className={styles.serviceCard}>
            <motion.div
                className={styles.cardLeft}
                style={{
                    backgroundColor: svc.bgColor,
                    color: svc.textColor,
                    scale,
                    scaleX,
                    transformOrigin: "left center",
                    willChange: "transform"
                }}>
                <h3 className={styles.cardTitle}>{svc.title}</h3>
                <p className={styles.cardDesc}>{svc.description}</p>

                <div className={styles.nextArrow} onClick={scrollRight}>
                    ▶
                </div>

                <div className={styles.buttons}>
                    <div
                        className={styles.iconBtn}
                        style={{ backgroundColor: svc.btnBg, color: svc.btnColor }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <div
                        className={styles.dlBtn}
                        style={{ backgroundColor: svc.btnBg, color: svc.btnColor }}>
                        Download Brochure
                    </div>
                </div>
            </motion.div>
            <div className={styles.cardRight}>
                <motion.img
                    src={svc.image}
                    alt={svc.title}
                    style={{
                        scale,
                        scaleX,
                        transformOrigin: "right center",
                        willChange: "transform"
                    }}
                    className={styles.animatedImage}
                />
            </div>
        </div>
    );
}

export default function HomeServices() {
    const sectionRef = useRef<HTMLElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Track vertical scroll progress of the entire section
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["0 1", "1 0"] // start tracking when section enters viewport from bottom, end when it leaves from top
    });

    // Remove the global vertical scale since the horizontal scale per card is added.

    const services = [
        {
            title: "Turnkey Plant Engineering",
            description: "We design, manufacture, and supply complete plant machinery setups on a turnkey basis for industrial processing facilities.",
            bgColor: "#003153",
            textColor: "#FFFFFF",
            image: "/services1.jpg",
            btnBg: "#FFFFFF",
            btnColor: "#003153"
        },
        {
            title: "Equipment Refurbishment Services",
            description: "We restore and rebuild high-wear heavy machinery components to exact original specifications using advanced automated welding processes.",
            bgColor: "#003153",
            textColor: "#FFFFFF",
            image: "/service2.jpg",
            btnBg: "#FFFFFF",
            btnColor: "#003153"
        },
        {
            title: "Modernization and Retrofitting",
            description: "We upgrade and revamp legacy mechanical infrastructure and electrical systems to enhance overall plant productivity and efficiency.",
            bgColor: "#003153",
            textColor: "#FFFFFF",
            image: "/service3.jpg",
            btnBg: "#FFFFFF",
            btnColor: "#003153"
        },
        {
            title: "Strategic Industrial Sourcing",
            description: "We globally procure and supply specialized industrial spares, chemicals, consumables, and capital equipment from trusted international manufacturers.",
            bgColor: "#003153",
            textColor: "#FFFFFF",
            image: "/services2.jpg",
            btnBg: "#FFFFFF",
            btnColor: "#003153"
        },
        {
            title: "Precision Tool Resharpening",
            description: "We utilize advanced CNC machinery to precisely regrind industrial cutting blades and saws to produce an ultra-sharp edge.",
            bgColor: "#003153",
            textColor: "#FFFFFF",
            image: "/services1.jpg",
            btnBg: "#FFFFFF",
            btnColor: "#003153"
        },
        {
            title: "Electrical System Commissioning",
            description: "We expertly install, revamp, and commission comprehensive industrial electrical networks, including control panels and automation drives.",
            bgColor: "#003153",
            textColor: "#FFFFFF",
            image: "/service2.jpg",
            btnBg: "#FFFFFF",
            btnColor: "#003153"
        },
        {
            title: "Container Relining Services",
            description: "We provide specialized repair and re-lining services to restore heavy aluminium extrusion containers to peak operational standards.",
            bgColor: "#003153",
            textColor: "#FFFFFF",
            image: "/service3.jpg",
            btnBg: "#FFFFFF",
            btnColor: "#003153"
        }
    ];

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: typeof window !== 'undefined' ? window.innerWidth * 0.86 : 600, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const maxScrollLeft = scrollWidth - clientWidth;

                // Cycle back to beginning if we hit the end, otherwise scroll forward by one card
                if (scrollLeft >= maxScrollLeft - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRight();
                }
            }
        }, 7000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className={styles.servicesSection} ref={sectionRef}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.breadcrumb}>
                        <span>• Our Services</span>
                    </div>
                    <div className={styles.titleContainer}>
                        <h2 className={styles.title}>Our Services</h2>
                        <p className={styles.description}>
                            Innovative solutions in turnkey plant engineering, retrofitting, and capital equipment supply to enhance efficiency and productivity across industries.
                        </p>
                    </div>
                    <div className={styles.actionContainer}>
                        <div className={styles.learnMoreBtn}>
                            Our services <span className={styles.arrow}>→</span>
                        </div>
                    </div>
                </div>

                <div className={styles.scrollWrapper} ref={scrollRef}>
                    {services.map((svc, index) => (
                        <ServiceCard key={index} svc={svc} containerRef={scrollRef} scrollRight={scrollRight} />
                    ))}
                </div>
            </div>
        </section>
    );
}
