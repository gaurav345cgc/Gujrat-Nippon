"use client";

import React from 'react';
import styles from './HomeServices.module.css';

function ServiceCard({ svc }: { svc: any }) {
    return (
        <div
            className={styles.serviceCard}
            style={{
                backgroundColor: svc.bgColor,
                color: svc.textColor,
            }}>
            <h3 className={styles.cardTitle}>{svc.title}</h3>
            <p className={styles.cardDesc}>{svc.description}</p>

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
        </div>
    );
}

export default function HomeServices() {
    const services = [
        {
            title: "Turnkey Plant Engineering",
            description: "We design, manufacture, and supply complete plant machinery setups on a turnkey basis for industrial processing facilities.",
            bgColor: "#0077C0",
            textColor: "#FFFFFF",
            image: "/services1.jpg",
            btnBg: "#FFFFFF",
            btnColor: "#0077C0"
        },
        {
            title: "Equipment Refurbishment Services",
            description: "We restore and rebuild high-wear heavy machinery components to exact original specifications using advanced automated welding processes.",
            bgColor: "#0077C0",
            textColor: "#FFFFFF",
            image: "/service2.jpg",
            btnBg: "#FFFFFF",
            btnColor: "#0077C0"
        },
        {
            title: "Modernization and Retrofitting",
            description: "We upgrade and revamp legacy mechanical infrastructure and electrical systems to enhance overall plant productivity and efficiency.",
            bgColor: "#0077C0",
            textColor: "#FFFFFF",
            image: "/service3.jpg",
            btnBg: "#FFFFFF",
            btnColor: "#0077C0"
        },
        {
            title: "Strategic Industrial Sourcing",
            description: "We globally procure and supply specialized industrial spares, chemicals, consumables, and capital equipment from trusted international manufacturers.",
            bgColor: "#0077C0",
            textColor: "#FFFFFF",
            image: "/services2.jpg",
            btnBg: "#FFFFFF",
            btnColor: "#0077C0"
        }
    ];

    return (
        <section className={styles.servicesSection}>
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

                <div className={styles.cardsGrid}>
                    {services.map((svc, index) => (
                        <ServiceCard key={index} svc={svc} />
                    ))}
                </div>
            </div>
        </section>
    );
}
