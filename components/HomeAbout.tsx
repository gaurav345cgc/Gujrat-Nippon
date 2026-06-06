"use client";

import type { CtaPayload, TextPayload } from '@/lib/cms/types';
import styles from './HomeAbout.module.css';
import Link from 'next/link';

const DEFAULT_HEADING = 'About Us';
const DEFAULT_BODY =
    'Gujarat Nippon International Pvt Ltd provides engineering solutions and a diversified range of industrial products and services: design, manufacture and supply of plant and machineries for metal processing industries, revamping, retrofitting and modernization of existing lines, industrial spares and components, greases, lubricants and industrial chemicals, and capital equipment sourcing for domestic and export customers.\n\nWe are committed to reliable products and services, timely execution, transparent dealings and long-term business relationships. Our focus remains on technical expertise, quality standards and total customer satisfaction.';

const DEFAULT_CTA: CtaPayload = {
    heading: 'About Us link',
    buttonLabel: 'READ MORE ABOUT THE COMPANY',
    buttonHref: '/about',
};

type Props = {
    heading?: string;
    body?: string;
    cta?: CtaPayload;
};

export default function HomeAbout({
    heading = DEFAULT_HEADING,
    body = DEFAULT_BODY,
    cta = DEFAULT_CTA,
}: Props) {
    const paragraphs = body.split(/\n\n+/).filter(Boolean);

    return (
        <section className={styles.container}>
            <div className={styles.contentSplit}>
                <div className={styles.leftCol}>
                    <div className={styles.headingArea}>
                        <h2 className={styles.mainHeading}>{heading}</h2>
                        <div className={styles.headingLine}></div>
                    </div>
                    
                    <div className={styles.textContent}>
                        {paragraphs.map((paragraph, index) => (
                            <p key={index} className={styles.paragraphText}>
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <Link href={cta.buttonHref} className={styles.aboutBtn}>
                        {cta.buttonLabel}
                    </Link>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.imageContainer}>
                        <img src="/aboutus.avif" alt="About Gujarat Nippon" className={styles.mainImage} />
                    </div>
                </div>
            </div>
        </section>
    );
}
