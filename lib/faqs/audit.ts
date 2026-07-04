export function summarizeFaqChanges(fields: Record<string, unknown>): Record<string, unknown> {
  const keys = Object.keys(fields).filter((k) => fields[k] !== undefined);
  return { changedFields: keys, ...fields };
}
