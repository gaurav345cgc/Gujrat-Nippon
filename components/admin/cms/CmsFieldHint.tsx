type Props = {
  current: number;
  max: number;
  min?: number;
  label?: string;
};

export default function CmsFieldHint({ current, max, min, label }: Props) {
  const over = current > max;
  const under = min !== undefined && current < min;

  return (
    <p
      className="admin-form-hint"
      style={{
        marginTop: '-0.65rem',
        marginBottom: '1rem',
        fontSize: '0.75rem',
        color: over || under ? 'var(--admin-danger)' : 'var(--admin-text-muted)',
      }}
    >
      {label ? `${label}: ` : ''}
      {current}/{max}
      {min !== undefined ? ` (min ${min})` : ''}
    </p>
  );
}
