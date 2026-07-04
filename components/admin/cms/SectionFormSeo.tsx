import { ROBOTS_VALUES } from '@/lib/cms/constants';
import type { SeoPayload } from '@/lib/cms/types';

type Props = {
  value: SeoPayload;
  onChange: (value: SeoPayload) => void;
};

export default function SectionFormSeo({ value, onChange }: Props) {
  return (
    <div className="admin-form">
      <label>
        SEO title
        <input
          type="text"
          value={value.seoTitle}
          onChange={(e) => onChange({ ...value, seoTitle: e.target.value })}
        />
      </label>
      <p className="admin-form-hint" style={{ marginTop: '-0.65rem', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
        {value.seoTitle.length} characters
      </p>

      <label>
        Meta description
        <textarea
          rows={3}
          value={value.metaDescription}
          onChange={(e) => onChange({ ...value, metaDescription: e.target.value })}
        />
      </label>
      <p className="admin-form-hint" style={{ marginTop: '-0.65rem', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
        {value.metaDescription.length} characters
      </p>

      <label>
        Canonical URL (optional)
        <input
          type="text"
          value={value.canonicalUrl ?? ''}
          onChange={(e) => onChange({ ...value, canonicalUrl: e.target.value })}
        />
      </label>
      <label>
        Robots
        <select
          value={value.robots ?? 'index,follow'}
          onChange={(e) => onChange({ ...value, robots: e.target.value })}
        >
          {ROBOTS_VALUES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label>
        OG title (optional)
        <input
          type="text"
          value={value.ogTitle ?? ''}
          onChange={(e) => onChange({ ...value, ogTitle: e.target.value })}
        />
      </label>
      <label>
        OG description (optional)
        <textarea
          rows={2}
          value={value.ogDescription ?? ''}
          onChange={(e) => onChange({ ...value, ogDescription: e.target.value })}
        />
      </label>
    </div>
  );
}
