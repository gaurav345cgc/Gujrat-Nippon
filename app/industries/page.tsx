import React from 'react';
import styles from './Industries.module.css';
import { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '../../components/PageHero';

export const metadata: Metadata = {
    title: { absolute: 'Industries Served — Metal, Plastics, Energy | Gujarat Nippon' },
    description:
        'We cater to steel and metal processing, automotive, plastics, chemicals, energy and global logistics industries with reliable engineering solutions and sourced capital equipment.',
};

const industries = [
    {
        id: 1,
        slug: 'steel-metal-processing',
        title: 'Steel & Metal Processing',
        description:
            'Rolling and coil lines, tube mills, galvanising and spares supply for steel and metal processing plants.',
        image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 2,
        slug: 'automotive',
        title: 'Automotive',
        description:
            'Spares, greases and lubricants, and sourced equipment support for automotive manufacturing and utilities.',
        image: 'https://images.unsplash.com/photo-1518985289906-8dceaa1b8ef0?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 3,
        slug: 'plastics-moulding',
        title: 'Plastics & Moulding',
        description:
            'Injection moulding systems, spares and maintenance supplies for plastics processing and high-volume lines.',
        image: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 4,
        slug: 'chemical-manufacturing',
        title: 'Chemical Manufacturing',
        description:
            'Industrial chemicals, greases and lubricants for process plants and maintenance programmes.',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 5,
        slug: 'global-logistics',
        title: 'Global Logistics',
        description:
            'Export-import coordination, packing and documentation for machinery, spares and capital equipment.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 6,
        slug: 'energy-power',
        title: 'Energy & Power',
        description:
            'Generators, electrical equipment and plant spares for power and industrial utility applications.',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 7,
        slug: 'construction-materials',
        title: 'Construction Materials',
        description:
            'Equipment, spares and pneumatics or hydraulics consumables for construction materials manufacturing.',
        image: 'https://images.unsplash.com/photo-1541888081198-d1a2dd6b59d9?auto=format&fit=crop&q=80&w=800',
    },
    {
        id: 8,
        slug: 'consumer-goods',
        title: 'Consumer Goods',
        description:
            'Spares, consumables and moulding-related support for high-volume consumer goods production.',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    },
];

export default function IndustriesPage() {
    return (
        <main className={styles.pageWrapper}>
            <PageHero
                label="Industries & services"
                titleMain="Industries"
                titleAccent="We Serve"
                description="Industries served metal processing India and allied sectors: turnkey plant and machineries, spares, greases, lubricants, chemicals and capital equipment from our Mumbai office."
                bgImage="/industries-hero-bg.jpg"
            />

            <div className={styles.container}>
                <p className={styles.pageSubtitle}>
                    Gujarat Nippon International Pvt Ltd supplies engineering solutions and industrial products to the
                    sectors below. For{' '}
                    <Link href="/products/turnkey-plant-engineering" className={styles.inlineLink}>
                        turnkey plant engineering solutions
                    </Link>{' '}
                    or to{' '}
                    <Link href="/contact" className={styles.inlineLink}>
                        send us your project requirement
                    </Link>
                    , contact our Mumbai office.
                </p>

                <div className={styles.grid}>
                    {industries.map((industry) => (
                        <article key={industry.id} className={styles.industryCard}>
                            <span className={styles.cardTag}>Industry</span>

                            <div className={styles.cardImageWrapper}>
                                <img
                                    src={industry.image}
                                    alt={
                                        industry.slug === 'steel-metal-processing'
                                            ? 'Steel and metal processing — rolling mills, coil lines and plant supply, Gujarat Nippon International'
                                            : `${industry.title} sector — industrial supply and engineering solutions, Gujarat Nippon International`
                                    }
                                    className={styles.cardImage}
                                />
                            </div>

                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>{industry.title}</h3>
                                <p className={styles.cardDesc}>{industry.description}</p>
                                <Link href={`/industries/${industry.slug}`} className={styles.learnMore}>
                                    {`View ${industry.title} solutions`}
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}
