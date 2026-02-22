import { Metadata } from 'next';
import BrochureCard from '../../components/BrochureCard';
import { Brochure } from '../../lib/types';

export const metadata: Metadata = {
    title: 'Downloads',
    description: 'Download corporate brochures and spec sheets.',
};

const mockBrochures: Brochure[] = [
    {
        id: '1',
        title: 'Q1 Corporate Overview',
        description: 'A high-level overview of our corporate strategy for Q1.',
        fileSize: 2500000,
        lastUpdated: new Date('2026-01-15'),
        downloadUrl: '/files/q1-overview.pdf',
        downloadCount: 1205,
    },
    {
        id: '2',
        title: 'Enterprise Management System Specs',
        description: 'Detailed specifications for our EMS suite.',
        fileSize: 5800000,
        lastUpdated: new Date('2025-11-20'),
        downloadUrl: '/files/ems-specs.pdf',
        downloadCount: 450,
    }
];

export default function DownloadsPage() {
    return (
        <article>
            <header>
                <h1>Downloads</h1>
                <p>Access our library of corporate documents and technical specifications.</p>
            </header>

            <section>
                <h2>Available Brochures</h2>
                {mockBrochures.map(brochure => (
                    <BrochureCard key={brochure.id} brochure={brochure} />
                ))}
            </section>
        </article>
    );
}
