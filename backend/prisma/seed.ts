import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.account.findFirst({
    where: { isSuperadmin: true },
  });
  if (existing) {
    console.log('Super admin already exists.');
    return;
  }

  const password = process.env.SUPERADMIN_PASSWORD;
  const name = process.env.SUPERADMIN_NAME;
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.account.create({
    data: {
      name: name,
      password: hashedPassword,
      isSuperadmin: true,
    },
  });
  console.log('✅ Super admin created!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
