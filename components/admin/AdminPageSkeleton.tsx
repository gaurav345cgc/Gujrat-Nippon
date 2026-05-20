/** Instant shell while admin route segments load. */
export default function AdminPageSkeleton() {
  return (
    <div className="admin-page admin-page-skeleton" aria-busy="true" aria-label="Loading">
      <div className="admin-skeleton-header">
        <div className="admin-skeleton-line admin-skeleton-line--title" />
        <div className="admin-skeleton-line admin-skeleton-line--subtitle" />
      </div>
      <div className="admin-kpi-grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="admin-kpi-card admin-skeleton-card" />
        ))}
      </div>
      <div className="admin-card admin-skeleton-card admin-skeleton-card--tall" />
    </div>
  );
}
