"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import styles from './PageHeader.module.css';

const PAGE_HEADERS: Record<string, { title: string; image: string }> = {
    '/about': { title: 'About Us', image: '/distribution_image.png' }, // Overview group uses same images
    '/certifications': { title: 'Certifications / Quality', image: '/distribution_image.png' }, // Overview group uses same images
    '/products': { title: 'Products & Services', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000' },
    '/industries': { title: 'Industries Served', image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=2000' },
    '/careers': { title: 'Careers', image: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&q=80&w=2000' },
    '/contact': { title: 'Contact Us', image: '/export_image.png' },
};

export default function PageHeader() {
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    // The home page has its own full-screen custom Hero component, skip this global header
    if (isHomePage) return null;

    // Determine base path to map to header images
    let basePath = '';
    if (pathname.length > 1) {
        basePath = '/' + pathname.split('/')[1];
    }

    // Default to the first overview image if page not found
    const headerInfo = PAGE_HEADERS[basePath] || { title: 'Gujarat Nippon International Pvt Ltd', image: '/distribution_image.png' };

    return (
        <div className={styles.headerContainer}>
            <div className={styles.imageWrapper} style={{ backgroundImage: `url('${headerInfo.image}')` }}>
                <div className={styles.overlay}>
                    <h1 className={styles.title}>{headerInfo.title}</h1>
                </div>
            </div>
        </div>
    );
}
