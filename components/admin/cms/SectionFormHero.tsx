import CmsFieldHint from '@/components/admin/cms/CmsFieldHint';
import { MAX_BODY_LEN, MAX_HEADLINE_LEN } from '@/lib/cms/constants';
import type { HeroPayload } from '@/lib/cms/types';

type Props = {
  value: HeroPayload;
  onChange: (value: HeroPayload) => void;
  homeTemplate?: boolean;
};

export default function SectionFormHero({ value, onChange, homeTemplate }: Props) {
  return (
    <div className="admin-form">
      <label>
        {homeTemplate ? 'Headline' : 'Subheadline'}
        <input
          type="text"
          value={homeTemplate ? value.headline : (value.subheadline ?? '')}
          maxLength={MAX_HEADLINE_LEN}
          onChange={(e) =>
            onChange(
              homeTemplate
                ? { ...value, headline: e.target.value }
                : { ...value, subheadline: e.target.value }
            )
          }
        />
      </label>
      <CmsFieldHint
        current={(homeTemplate ? value.headline : (value.subheadline ?? '')).length}
        max={MAX_HEADLINE_LEN}
        min={1}
      />

      <label>
        {homeTemplate ? 'Subheadline (optional)' : 'Headline'}
        <input
          type="text"
          value={homeTemplate ? (value.subheadline ?? '') : value.headline}
          maxLength={MAX_HEADLINE_LEN}
          onChange={(e) =>
            onChange(
              homeTemplate
                ? { ...value, subheadline: e.target.value }
                : { ...value, headline: e.target.value }
            )
          }
        />
      </label>
      <CmsFieldHint
        current={(homeTemplate ? (value.subheadline ?? '') : value.headline).length}
        max={MAX_HEADLINE_LEN}
        min={homeTemplate ? undefined : 1}
      />

      <label>
        Body (optional)
        <textarea
          rows={4}
          value={value.body ?? ''}
          maxLength={MAX_BODY_LEN}
          onChange={(e) => onChange({ ...value, body: e.target.value })}
        />
      </label>
      <CmsFieldHint current={(value.body ?? '').length} max={MAX_BODY_LEN} />

      <label>
        Primary CTA label (optional)
        <input
          type="text"
          value={value.primaryCtaLabel ?? ''}
          onChange={(e) => onChange({ ...value, primaryCtaLabel: e.target.value })}
        />
      </label>
      <label>
        Primary CTA link (optional)
        <input
          type="text"
          value={value.primaryCtaHref ?? ''}
          onChange={(e) => onChange({ ...value, primaryCtaHref: e.target.value })}
        />
      </label>
      <label>
        Secondary CTA label (optional)
        <input
          type="text"
          value={value.secondaryCtaLabel ?? ''}
          onChange={(e) => onChange({ ...value, secondaryCtaLabel: e.target.value })}
        />
      </label>
      <label>
        Secondary CTA link (optional)
        <input
          type="text"
          value={value.secondaryCtaHref ?? ''}
          onChange={(e) => onChange({ ...value, secondaryCtaHref: e.target.value })}
        />
      </label>
    </div>
  );
}
