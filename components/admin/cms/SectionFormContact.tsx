import CmsFieldHint from '@/components/admin/cms/CmsFieldHint';
import { MAX_HEADLINE_LEN } from '@/lib/cms/constants';
import type { ContactInfoPayload } from '@/lib/cms/types';

type Props = {
  value: ContactInfoPayload;
  onChange: (value: ContactInfoPayload) => void;
};

export default function SectionFormContact({ value, onChange }: Props) {
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
        Address
        <textarea
          rows={3}
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
        />
      </label>
      <label>
        Phone
        <input
          type="text"
          value={value.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
        />
      </label>
      <label>
        Email
        <input
          type="email"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
        />
      </label>
      <label>
        Working hours (optional)
        <input
          type="text"
          value={value.workingHours ?? ''}
          onChange={(e) => onChange({ ...value, workingHours: e.target.value })}
        />
      </label>
      <label>
        Map URL (optional)
        <input
          type="text"
          value={value.mapUrl ?? ''}
          onChange={(e) => onChange({ ...value, mapUrl: e.target.value })}
        />
      </label>
    </div>
  );
}
