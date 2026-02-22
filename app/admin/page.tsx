import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    robots: { index: false, follow: false }
};

export default function AdminDashboardPage() {
    return (
        <article>
            <header>
                <h1>Welcome to the Admin Dashboard</h1>
                <p>Manage content, view leads, and track analytics.</p>
            </header>

            <section>
                <h2>Login / Role Gateway Placeholder</h2>
                <form action="/api/admin/login" method="POST">
                    <label htmlFor="admin-id">Admin ID</label>
                    <input type="text" id="admin-id" name="adminId" required />

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required />

                    <button type="submit">Secure Login</button>
                </form>
            </section>

            <section>
                <h2>Quick Analytics</h2>
                <dl>
                    <dt>Total Leads</dt>
                    <dd>1,024</dd>

                    <dt>Brochure Downloads</dt>
                    <dd>5,210</dd>

                    <dt>Active Users</dt>
                    <dd>89</dd>
                </dl>
            </section>
        </article>
    );
}
