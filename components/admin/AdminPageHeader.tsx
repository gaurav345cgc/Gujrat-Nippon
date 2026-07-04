type AdminPageHeaderProps = {
  title: string;
  subtitle?: string;
  count?: number;
  countLabel?: string;
  actions?: React.ReactNode;
};

export default function AdminPageHeader({
  title,
  subtitle,
  count,
  countLabel,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="admin-page-header">
      <div className="admin-page-header-text">
        <h1 className="admin-page-title">
          {title}
          {count !== undefined && (
            <span className="admin-page-count">
              {count.toLocaleString()} {countLabel ?? 'items'}
            </span>
          )}
        </h1>
        {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="admin-page-header-actions">{actions}</div>}
    </header>
  );
}
