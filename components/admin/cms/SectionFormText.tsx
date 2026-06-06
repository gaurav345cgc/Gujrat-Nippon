import CmsFieldHint from '@/components/admin/cms/CmsFieldHint';
import { MAX_BODY_LEN, MAX_HEADLINE_LEN, MAX_LEGAL_BODY_LEN } from '@/lib/cms/constants';
import type { TextPayload } from '@/lib/cms/types';

type Props = {
  value: TextPayload;
  onChange: (value: TextPayload) => void;
  legal?: boolean;
};

export default function SectionFormText({ value, onChange, legal }: Props) {
  const maxBody = legal ? MAX_LEGAL_BODY_LEN : MAX_BODY_LEN;

  return (
    <div className="admin-form">
      <label>
        Heading (optional)
        <input
          type="text"
          value={value.heading ?? ''}
          maxLength={MAX_HEADLINE_LEN}
          onChange={(e) => onChange({ ...value, heading: e.target.value })}
        />
      </label>
      <CmsFieldHint current={(value.heading ?? '').length} max={MAX_HEADLINE_LEN} />

      <label>
        Body
        <textarea
          rows={legal ? 12 : 6}
          value={value.body}
          maxLength={maxBody}
          onChange={(e) => onChange({ ...value, body: e.target.value })}
        />
      </label>
      <CmsFieldHint current={value.body.length} max={maxBody} min={1} />
    </div>
  );
}
