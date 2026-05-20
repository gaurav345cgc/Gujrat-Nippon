/**
 * Creates bootstrap admin/editor users in Supabase Auth + profiles table.
 *
 * Loads `.env.local` then `.env` (same order as Next.js).
 *
 * Run: npm run db:seed
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import ws from 'ws';
import { createClient } from '@supabase/supabase-js';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function upsertUser(params: {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'EDITOR';
}) {
  const email = params.email.toLowerCase().trim();

  const { data: list } = await admin.auth.admin.listUsers();
  const existing = list.users.find((u) => u.email?.toLowerCase() === email);

  let userId: string;

  if (existing) {
    userId = existing.id;
    await admin.auth.admin.updateUserById(userId, {
      password: params.password,
      user_metadata: { name: params.name },
    });
    console.log('Updated auth user:', email);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: params.password,
      email_confirm: true,
      user_metadata: { name: params.name },
    });
    if (error || !data.user) {
      throw error ?? new Error(`Failed to create ${email}`);
    }
    userId = data.user.id;
    console.log('Created auth user:', email);
  }

  const { error: profileError } = await admin.from('profiles').upsert({
    id: userId,
    name: params.name,
    role: params.role,
    status: 'ACTIVE',
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    throw profileError;
  }

  console.log('Profile ready:', email, params.role);
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD');
  }

  await upsertUser({
    email: adminEmail,
    password: adminPassword,
    name: process.env.ADMIN_NAME ?? 'Admin',
    role: 'ADMIN',
  });

  if (process.env.EDITOR_EMAIL && process.env.EDITOR_PASSWORD) {
    await upsertUser({
      email: process.env.EDITOR_EMAIL,
      password: process.env.EDITOR_PASSWORD,
      name: process.env.EDITOR_NAME ?? 'Editor',
      role: 'EDITOR',
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
