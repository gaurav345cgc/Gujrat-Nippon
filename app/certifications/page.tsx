import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Certifications',
    description: 'View our ISO and industry-specific compliance certifications.',
};

export default function CertificationsPage() {
    return (
        <article>
            <header>
                <h1>Our Certifications</h1>
                <p>Committed to the highest global standards.</p>
            </header>

            <section>
                <h2>ISO 27001</h2>
                <p>Information Security Management</p>
            </section>

            <section>
                <h2>ISO 9001</h2>
                <p>Quality Management Systems</p>
            </section>
        </article>
    );
}
