import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function upsertUser(params: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  const email = params.email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(params.password, 12);

  return prisma.user.upsert({
    where: { email },
    update: {
      name: params.name,
      passwordHash,
      role: params.role,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: params.name,
      email,
      passwordHash,
      role: params.role,
      status: UserStatus.ACTIVE,
    },
  });
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.');
  }

  const admin = await upsertUser({
    name: process.env.ADMIN_NAME ?? 'Admin',
    email: adminEmail,
    password: adminPassword,
    role: UserRole.ADMIN,
  });

  console.log('Admin user:', admin.email);

  if (process.env.EDITOR_EMAIL && process.env.EDITOR_PASSWORD) {
    const editor = await upsertUser({
      name: process.env.EDITOR_NAME ?? 'Editor',
      email: process.env.EDITOR_EMAIL,
      password: process.env.EDITOR_PASSWORD,
      role: UserRole.EDITOR,
    });
    console.log('Editor user:', editor.email);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
