import React from 'react';
import { Metadata } from 'next';
import styles from './Downloads.module.css';
import Link from 'next/link';
import { documents } from '../../lib/data/downloads';

export const metadata: Metadata = {
    title: 'Brochures & Downloads',
    description: 'Download corporate brochures, technical specifications, and compliance certificates for Gujarat Nippon International Pvt Ltd.',
};

export default function DownloadsPage() {
    return (
        <main className={styles.container}>
            <p className={styles.description}>
                Access our comprehensive library of corporate documentation, technical brochures, and official quality certifications.
                Click on any document below to view or securely download the file.
            </p>

            <div className={styles.grid}>
                {documents.map((doc) => (
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
