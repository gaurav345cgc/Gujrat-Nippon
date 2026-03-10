export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-wrapper" style={{ display: 'flex' }}>
            <aside style={{ width: '250px', borderRight: '1px solid #ccc', padding: '1rem' }}>
                <nav>
                    <h2>Admin Panel</h2>
                    <ul>
                        <li><a href="/admin">Dashboard</a></li>
                        <li><a href="/admin/cms">CMS Editor</a></li>
                        <li><a href="/admin/brochures">Brochures & FAQ</a></li>
                        <li><a href="/admin/leads">View Leads</a></li>
                    </ul>
                </nav>
            </aside>

            <main style={{ flex: 1, padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
}
