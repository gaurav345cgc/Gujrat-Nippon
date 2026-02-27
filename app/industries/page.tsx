import React from 'react';
import styles from './Industries.module.css';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Industries Served | Gujarat Nippon Group',
    description: 'Discover the diverse range of global industries powered by Gujarat Nippon Group.',
};

const industries = [
    {
        id: 1,
        title: 'Steel & Metal Processing',
        description: 'Complete turnkey solutions for cold rolling mills, slitting lines, and heavy-duty metal forging.',
        image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 2,
        title: 'Automotive Spares',
        description: 'High-precision components, greases, and industrial consumables for automotive manufacturing.',
        image: 'https://images.unsplash.com/photo-1518985289906-8dceaa1b8ef0?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 3,
        title: 'Plastics & Moulding',
        description: 'Advanced injection moulding systems delivering high-volume consumer plastics globally.',
        image: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 4,
        title: 'Chemical Manufacturing',
        description: 'Providing industrial-grade chemicals and advanced lubricants for heavy machinery.',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 5,
        title: 'Global Logistics',
        description: 'Exporting raw materials and capital equipment to thriving markets across Africa and the GCC.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 6,
        title: 'Energy & Power',
        description: 'Supporting power infrastructure with cutting-edge electrical and hydraulic systems.',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 7,
        title: 'Construction Materials',
        description: 'Sourcing and supplying structural steel elements and heavy-duty construction pneumatics.',
        image: 'https://images.unsplash.com/photo-1541888081198-d1a2dd6b59d9?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 8,
        title: 'Consumer Goods',
        description: 'End-to-end manufacturing of FMCG products like toothbrushes for multinational brands.',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    }
];

export default function IndustriesPage() {
    return (
        <main className={styles.pageWrapper}>


            <div className={styles.container}>
                <p className={styles.pageSubtitle}>
                    Gujarat Nippon Group powers innovation across multiple sectors. From heavy-duty metal processing to precision plastics engineering, our comprehensive &quot;One Point Engineering Solutions&quot; equip industries worldwide to meet the demands of tomorrow.
                </p>

                <div className={styles.grid}>
                    {industries.map((industry) => (
                        <article key={industry.id} className={styles.industryCard}>
                            <span className={styles.cardTag}>Industry</span>

                            <div className={styles.cardImageWrapper}>
                                <img
                                    src={industry.image}
                                    alt={industry.title}
                                    className={styles.cardImage}
                                />
                            </div>

                            <h3 className={styles.cardTitle}>{industry.title}</h3>

                            <div className={styles.cardFooter}>
                                <p className={styles.cardDesc}>{industry.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}
