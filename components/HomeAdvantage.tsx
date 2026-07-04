"use client";

import React, { useState, useEffect } from 'react';
import styles from './HomeAdvantage.module.css';

const capabilities = [
    {
        title: "Plant and Machinery for Metal Processing",
        text: "We undertake design, manufacture and supply of plant and machineries for metal processing industries, including hot and cold rolling mill lines, tube mill lines, slitting and cut-to-length lines, strip galvanising and colour coating lines, deep drawing presses, heat treatment furnaces and related equipment, executed in accordance with customer requirements and agreed quality standards. Complete project supply can be arranged where the contract scope requires it.",
        cta: "Enquire for plant and machinery"
    },
    {
        title: "Machinery Refurbishment and Repair",
        text: "We carry out revamping of existing projects and refurbishment of heavy-wear components to agreed drawings and specifications, including weld rebuild, machining and non-destructive testing where applicable, with the objective of restoring dependable operation and reducing unplanned downtime.",
        cta: "Contact us for refurbishment"
    },
    {
        title: "Plant Modernization and Retrofitting",
        text: "We provide retrofitting and modernization of mechanical and electrical systems in existing plants, including upgrades to slitting lines, colour coating lines and furnace installations, so that equipment continues to meet production and safety expectations under current operating conditions.",
        cta: "Discuss modernization scope"
    },
    {
        title: "Capital Equipment Supply",
        text: "We supply capital equipment and packaged machinery through established manufacturer associations, with emphasis on technical clarification, documentation and dispatch planning. We cater to project-specific and repeat-order requirements in domestic and international markets.",
        cta: "Request equipment quotation"
    },
    {
        title: "Industrial Spares and Components",
        text: "We maintain supply arrangements for mechanical, electrical, hydraulic and pneumatic spares and components for steel plants and process industries, with focus on correct specification, reliable quality and timely delivery to support maintenance schedules.",
        cta: "Send spares enquiry"
    },
    {
        title: "Industrial Chemicals, Greases and Lubricants",
        text: "We offer greases, lubricants and industrial chemicals for plant maintenance and production processes, supplied as per customer specifications and batch requirements, with commitment to consistent grades and transparent documentation.",
        cta: "Request product details"
    },
    {
        title: "Power and Electrical Equipment",
        text: "We supply diesel and gas generator sets, transformers, substations and low-voltage electrical panels for industrial applications, selected to match load, site and regulatory requirements, with support for installation-related coordination where agreed.",
        cta: "Enquire for electrical supply"
    },
    {
        title: "Export and Project Logistics",
        text: "We execute export orders and project shipments with attention to packing, documentation and compliance with import regulations in destination countries. Our customers include operations in Africa, the Middle East, Asia and other regions where reliable supply and integrity in dealings are valued.",
        cta: "Contact for export requirements"
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
                <div className={styles.splitLayout}>
                    <div className={styles.leftCol}>
                        <div className={styles.imageContainer}>
                            <img
                                src="/turnkey-plant-engineering-gujarat-nippon.jpg"
                                alt="Turnkey plant engineering — Gujarat Nippon International, Mumbai"
                                className={styles.mainImage}
                            />
                        </div>
                    </div>
                    
                    <div className={styles.rightCol}>
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
                </div>
            </div>
        </section>
    );
}
