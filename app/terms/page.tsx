import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service',
};

export default function TermsPage() {
    return (
        <article>
            <header>
                <h1>Terms of Service</h1>
                <p>Last Updated: February 22, 2026</p>
            </header>

            <section>
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing our website, you agree to be bound by these terms.</p>
            </section>

            <section>
                <h2>2. Use License</h2>
                <p>Permission is granted to temporarily download one copy of the materials.</p>
            </section>
        </article>
    );
}
