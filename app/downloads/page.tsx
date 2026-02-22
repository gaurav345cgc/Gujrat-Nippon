import React from 'react';
import { Metadata } from 'next';
import styles from './Downloads.module.css';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Brochures & Downloads',
    description: 'Download corporate brochures, technical specifications, and compliance certificates for Gujarat Nippon Group.',
};

const DOCUMENTS = [
    {
        id: 'corp-profile',
        title: 'Corporate Profile 2026',
        type: 'PDF',
        size: '4.2 MB',
        date: 'January 2026',
        url: '#'
    },
    {
        id: 'tech-specs',
        title: 'Industrial Equipment Specifications',
        type: 'PDF',
        size: '8.5 MB',
        date: 'December 2025',
        url: '#'
    },
    {
        id: 'iso-cert',
        title: 'ISO 9001:2015 Certificate',
        type: 'PDF',
        size: '1.1 MB',
        date: 'Valid till 2027',
        url: '#'
    },
    {
        id: 'moulding-catalog',
        title: 'Plastic Moulding Catalog',
        type: 'PDF',
        size: '5.6 MB',
        date: 'November 2025',
        url: '#'
    },
    {
        id: 'safety-guidelines',
        title: 'Environmental & Safety Guidelines',
        type: 'PDF',
        size: '2.3 MB',
        date: 'October 2025',
        url: '#'
    },
    {
        id: 'vendor-form',
        title: 'Vendor Registration Form',
        type: 'PDF/DOCX',
        size: '0.8 MB',
        date: 'Always Current',
        url: '#'
    }
];

export default function DownloadsPage() {
    return (
        <main className={styles.container}>
            <p className={styles.description}>
                Access our comprehensive library of corporate documentation, technical brochures, and official quality certifications.
                Click on any document below to view or securely download the file.
            </p>

            <div className={styles.grid}>
                {DOCUMENTS.map((doc) => (
                    <article key={doc.id} className={styles.documentCard}>
                        <div className={styles.iconWrapper}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="12" y1="18" x2="12" y2="12"></line>
                                <polyline points="9 15 12 18 15 15"></polyline>
                            </svg>
                        </div>
                        <h2 className={styles.docTitle}>{doc.title}</h2>
                        <div className={styles.docMeta}>
                            {doc.type} &bull; {doc.size} &bull; {doc.date}
                        </div>
                        <Link href={doc.url} className={styles.downloadBtn}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download
                        </Link>
                    </article>
                ))}
            </div>
        </main>
    );
}
