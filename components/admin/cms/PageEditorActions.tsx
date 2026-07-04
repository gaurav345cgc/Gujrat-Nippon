type Props = {
  saving: boolean;
  publishing: boolean;
  restoringDefaults: boolean;
  canPublish: boolean;
  validationError: string | null;
  onSaveDraft: () => void;
  onPublish: () => void;
  onPreview: () => void;
  onRestoreDefaults: () => void;
};

export default function PageEditorActions({
  saving,
  publishing,
  restoringDefaults,
  canPublish,
  validationError,
  onSaveDraft,
  onPublish,
  onPreview,
  onRestoreDefaults,
}: Props) {
  const busy = saving || publishing || restoringDefaults;

  return (
    <div className="admin-toolbar" style={{ marginTop: '1.5rem' }}>
      <div className="admin-toolbar-actions">
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={onPreview}
        >
          Preview in new tab
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={onRestoreDefaults}
          disabled={busy}
        >
          {restoringDefaults ? 'Resetting…' : 'Reset to defaults'}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={onSaveDraft}
          disabled={busy}
        >
          {saving ? 'Saving…' : 'Save draft'}
        </button>
        <button
          type="button"
          className="admin-btn"
          onClick={onPublish}
          disabled={!canPublish || busy}
          title={!canPublish ? validationError ?? 'Fix validation errors before publishing' : undefined}
        >
          {publishing ? 'Publishing…' : 'Publish'}
        </button>
      </div>
      {validationError ? (
        <p style={{ marginTop: '0.75rem', color: 'var(--admin-danger)', fontSize: '0.85rem' }}>
          {validationError}
        </p>
      ) : null}
    </div>
  );
}
