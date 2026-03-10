export default function CookieConsentBanner() {
    return (
        <aside>
            <section aria-labelledby="cookie-heading">
                <h2 id="cookie-heading">We use cookies</h2>
                <p>We use cookies to improve your experience and for analytics. Please accept our use of cookies.</p>
                <form action="/api/cookies/accept" method="POST">
                    <button type="submit">Accept All</button>
                    <button type="button">Reject Optional</button>
                    <a href="/cookies">Cookie Policy</a>
                </form>
            </section>
        </aside>
    );
}
