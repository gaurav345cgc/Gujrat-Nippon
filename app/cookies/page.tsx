import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cookie Policy',
};

export default function CookiesPage() {
    return (
        <article>
            <header>
                <h1>Cookie Policy</h1>
                <p>How we use cookies and similar technologies.</p>
            </header>

            <section>
                <h2>What Are Cookies?</h2>
                <p>Cookies are small text files that are placed on your machine to help the site provide a better user experience.</p>
            </section>

            <section>
                <h2>Managing Cookies</h2>
                <p>You may prefer to disable cookies on this site and on others.</p>
            </section>
        </article>
    );
}
