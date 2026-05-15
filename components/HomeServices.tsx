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
            title: "Plant and Machinery Engineering",
            description: "We undertake design, manufacture and supply of plant and machineries for metal processing and allied industries, including rolling mill lines, tube mills, slitting and cut-to-length lines, and related project support as per customer specifications and agreed delivery terms.",
            bgColor: "#0077C0",
            textColor: "#FFFFFF",
            image: "/services1.jpg",
            btnBg: "#FFFFFF",
            btnColor: "#0077C0"
        },
        {
            title: "Equipment Refurbishment",
            description: "We carry out revamping and repair of heavy-wear machinery and components to agreed technical standards, including weld rebuild, machining and inspection, with the objective of reducing downtime and restoring reliable operation.",
            bgColor: "#0077C0",
            textColor: "#FFFFFF",
            image: "/service2.jpg",
            btnBg: "#FFFFFF",
            btnColor: "#0077C0"
        },
        {
            title: "Modernization and Retrofitting",
            description: "We provide modernization and retrofitting of existing mechanical and electrical plant, including furnaces, slitting lines, strip galvanising and colour coating lines, to improve productivity and align equipment with current operating requirements.",
            bgColor: "#0077C0",
            textColor: "#FFFFFF",
            image: "/service3.jpg",
            btnBg: "#FFFFFF",
            btnColor: "#0077C0"
        },
        {
            title: "Industrial Sourcing and Supply",
            description: "We procure and supply industrial spares, chemicals, greases, lubricants and capital equipment through strategic alliances with manufacturers, with competitive pricing and dependable documentation for domestic and export shipments.",
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
                            We provide plant engineering, equipment refurbishment, modernization, industrial spares and consumables supply, and capital equipment sourcing in a well-defined and planned manner, with emphasis on quality, execution and after sales support for customer requirements.
                        </p>
                    </div>
                    <div className={styles.actionContainer}>
                        <div className={styles.learnMoreBtn}>
                            View our services <span className={styles.arrow}>→</span>
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
