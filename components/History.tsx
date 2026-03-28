"use client";

import React, { useRef } from 'react';
import styles from './History.module.css';

const historyData = [
    { year: '2010', title: 'First Major Projects', desc: 'Successfully delivered automation and control solutions for manufacturing and energy industries.' },
    { year: '2013', title: 'Expanding Operations', desc: 'Started working with large scale infrastructure, providing automation systems and control equipment.' },
    { year: '2016', title: 'Digital Transformation', desc: 'Introduced IoT and digital monitoring solutions.' },
    { year: '2019', title: 'Global Reach', desc: 'Expanded our operations globally.' },
];

export default function History() {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.heading}>Our History</h2>

                <div className={styles.timelineWrapper}>
                    <div className={styles.cardsScroll} ref={scrollRef}>
                        {historyData.map((item, idx) => (
                            <div className={styles.card} key={idx}>
                                <div className={styles.yearPill}>{item.year}</div>
                                <h3 className={styles.cardTitle}>{item.title}</h3>
                                <p className={styles.cardDesc}>{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className={styles.timelineLineWrapper}>
                        <div className={styles.timelineLine}></div>
                        <div className={styles.timelineYears}>
                            <span>2013</span>
                            <span>2016</span>
                            <span>2019</span>
                            <span>2024</span>
                            <span>2025</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
