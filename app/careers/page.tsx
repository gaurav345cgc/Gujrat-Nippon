import React from 'react';
import styles from './Careers.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Careers | Gujarat Nippon Group',
    description: 'Join our talent network and shape the future of industrial engineering and manufacturing.',
};

const features = [
    {
        id: 1,
        title: 'GROWTH',
        description: 'Experience exponential growth opportunities.',
        icon: (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                <path d="M18.7 8H14" stroke="#C00000" />
                <path d="M18.7 8v4.6" stroke="#C00000" />
            </svg>
        )
    },
    {
        id: 2,
        title: 'INNOVATION',
        description: 'Drive innovation at the forefront of our industry.',
        icon: (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2v1" />
                <path d="M12 7v1" stroke="#C00000" />
                <path d="M12 12v1" stroke="#C00000" />
                <path d="M9 22c-1.1 0-2-.9-2-2v-2" />
                <path d="M17 22c1.1 0 2-.9 2-2v-2" />
                <path d="M15 18c1.1 0 2-.9 2-2v-4a5 5 0 0 0-10 0v4c0 1.1.9 2 2 2" />
            </svg>
        )
    },
    {
        id: 3,
        title: 'COLLABORATION',
        description: 'Work with top talents to achieve remarkable results.',
        icon: (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                <path d="M12 11l3 3 2-2-3-3" stroke="#C00000" />
            </svg>
        )
    },
    {
        id: 4,
        title: 'LEADERSHIP',
        description: 'Develop leadership skills in a supportive environment.',
        icon: (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="#C00000" />
                <line x1="4" y1="22" x2="4" y2="15" />
                <path d="M11 21c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
        )
    }
];

export default function CareersPage() {
    return (
        <main className={styles.container}>
            <h1 className={styles.pageTitle}>Join Our Talent Network</h1>
            <p className={styles.pageSubtitle}>
                At Gujarat Nippon Group, we prioritize talent development and career growth, fostering an empowering work culture that drives performance and innovation. Our commitment to linking learning with career advancement energizes our workforce, attracting top talent across all our key markets. Join us to be part of a dynamic team dedicated to shaping the future of global engineering and pushing boundaries in our industry.
            </p>

            <div className={styles.featuresGrid}>
                {features.map((feature) => (
                    <div key={feature.id} className={styles.featureCard}>
                        <div className={styles.iconContainer}>
                            {feature.icon}
                        </div>
                        <h3 className={styles.featureTitle}>{feature.title}</h3>
                        <p className={styles.featureDesc}>{feature.description}</p>
                    </div>
                ))}
            </div>

            {/* Job Openings Section */}
            <section className={styles.jobOpeningsSection}>
                <h2 className={styles.jobOpeningsTitle}>Current Job Openings</h2>
                <div className={styles.noOpeningsBox}>
                    <p>There are currently no openings available.</p>
                    <p className={styles.noOpeningsSubtext}>Please check back later for exciting career opportunities.</p>
                </div>
            </section>
        </main>
    );
}
