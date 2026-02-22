import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy',
};

export default function PrivacyPage() {
    return (
        <article>
            <header>
                <h1>Privacy Policy</h1>
                <p>Last Updated: February 22, 2026</p>
            </header>

            <section>
                <h2>1. Information We Collect</h2>
                <p>We collect information to provide better services to our global clients.</p>
            </section>

            <section>
                <h2>2. How We Use Information</h2>
                <p>Your information is stored securely and used in accordance with GDPR principles.</p>
            </section>
        </article>
    );
}
