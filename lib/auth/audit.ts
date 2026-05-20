import { createAdminClient } from '@/lib/supabase/admin';

/** Server-only audit writes (service role) — works for unauthenticated events like failed login. */
export async function writeAuditLog(params: {
  actorId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string | null;
}): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from('audit_logs').insert({
      actor_id: params.actorId ?? null,
      action: params.action,
      entity_type: params.entityType ?? null,
      entity_id: params.entityId ?? null,
      metadata: params.metadata ?? null,
      ip: params.ip ?? null,
    });
  } catch (error) {
    console.error('[audit] failed to write log', params.action, error);
  }
}
