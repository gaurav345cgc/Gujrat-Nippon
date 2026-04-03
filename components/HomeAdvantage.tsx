"use client";

import React, { useState, useEffect } from 'react';
import styles from './HomeAdvantage.module.css';

const capabilities = [
    {
        title: "Turnkey Industrial Plant Engineering",
        text: "We execute comprehensive end-to-end design, manufacturing, and supply of robust plant setups and heavy machinery. Our turnkey capabilities specifically cater to metal processing facilities, encompassing hot and cold rolling mills, tube mills, strip galvanizing lines, and deep drawing presses. We also design and supply complete Pre-Engineered Building (PEB) infrastructure.",
        cta: "Explore Turnkey Solutions"
    },
    {
        title: "Advanced Machinery Refurbishment",
        text: "We drastically reduce plant downtime by restoring high-wear heavy machinery to exact OEM specifications. Our advanced repair capabilities include Automated Weld Overlay (WOL) for rebuilding vertical roller mills up to 80mm thick, Submerged Arc Welding (SAW) for kiln shells, Non-Destructive Testing (NDT), and precision CNC machining.",
        cta: "View Refurbishment Expertise"
    },
    {
        title: "Plant Modernization & Retrofitting",
        text: "We specialize in upgrading legacy mechanical and electrical infrastructure to align with modern productivity standards. Our engineering teams expertly revamp existing industrial setups—including heat treatment furnaces, slitting lines, and color coating machinery—to maximize operational efficiency, improve output quality, and minimize overall running costs.",
        cta: "Upgrade Your Facility"
    },
    {
        title: "Strategic Capital Equipment Sourcing",
        text: "Leveraging authorized partnerships with world-class international manufacturers, we procure and supply mission-critical capital equipment. Our robust catalog spans surface and underground mining drill rigs, automated packaging and strapping systems, and heavy material handling infrastructure like stacker-reclaimers and EOT cranes.",
        cta: "Discover Strategic Sourcing"
    },
    {
        title: "Comprehensive Industrial Spares Supply",
        text: "We serve as a single-point global sourcing hub for highly specialized plant components, preventing costly operational halts. Our procurement network supplies reliable mechanical, electrical, hydraulic, and pneumatic spares—ranging from heavy-duty gearboxes and industrial pumps to precision valves and coupling elements.",
        cta: "Browse Spare Parts"
    },
    {
        title: "Specialized Industrial Consumables",
        text: "We sustain continuous manufacturing lines through the reliable supply of high-grade, sector-specific consumables. Our portfolio includes high-alumina refractory materials for furnaces, specialized resins and adhesives (like Urea Formaldehyde and Melamine) for MDF production, industrial lubricants, and precision CNC-sharpened cutting tools.",
        cta: "View Consumables Catalog"
    },
    {
        title: "Power Engineering & Electrical Systems",
        text: "To guarantee uninterrupted facility operations, we engineer and supply complete industrial power and control solutions. Our capabilities include the deployment of robust diesel and gas generator sets, high-capacity transformers, compact substations, solar power panels, and customized low-voltage electrical control panels.",
        cta: "Explore Electrical Solutions"
    },
    {
        title: "Global Procurement & Logistics",
        text: "Operating as an ISO 9001:2015 certified Star Export House, we seamlessly navigate complex international supply chains. We successfully execute engineering projects and deliver critical industrial supplies to active operations across more than 16 countries, spanning key markets in Africa, the Middle East, Asia, and North America.",
        cta: "See Global Reach"
    }
];

export default function HomeAdvantage() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % capabilities.length);
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    const currentCap = capabilities[currentIndex];

    return (
        <section className={styles.advantageSection}>
            <div className={styles.container}>
                <h2 className={styles.heading}>Engineering Capabilities</h2>

                <div className={styles.advantageContainer}>
                    <div className={styles.contentWrapper} key={currentIndex}>
                        <p className={styles.advantageText}>
                            <strong className={styles.advantageTitle}>
                                {currentCap.title}:&nbsp;
                            </strong>
                            {currentCap.text}
                        </p>

                        <div className={styles.ctaContainer}>
                            <span className={styles.ctaWord}>{currentCap.cta}</span>
                            <span className={styles.ctaArrow}>→</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
