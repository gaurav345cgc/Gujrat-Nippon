import CmsFieldHint from '@/components/admin/cms/CmsFieldHint';
import { MAX_BODY_LEN, MAX_HEADLINE_LEN } from '@/lib/cms/constants';
import type { CtaPayload } from '@/lib/cms/types';

type Props = {
  value: CtaPayload;
  onChange: (value: CtaPayload) => void;
};

export default function SectionFormCta({ value, onChange }: Props) {
  return (
    <div className="admin-form">
      <label>
        Heading
        <input
          type="text"
          value={value.heading}
          maxLength={MAX_HEADLINE_LEN}
          onChange={(e) => onChange({ ...value, heading: e.target.value })}
        />
      </label>
      <CmsFieldHint current={value.heading.length} max={MAX_HEADLINE_LEN} min={1} />

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
        Button label
        <input
          type="text"
          value={value.buttonLabel}
          onChange={(e) => onChange({ ...value, buttonLabel: e.target.value })}
        />
      </label>
      <label>
        Button link
        <input
          type="text"
          value={value.buttonHref}
          onChange={(e) => onChange({ ...value, buttonHref: e.target.value })}
        />
      </label>
    </div>
  );
}
