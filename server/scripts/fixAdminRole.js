const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixAdminRole() {
  const email = 'novalcapital@example.com';
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('User not found');
    return;
  }
  await prisma.user.update({
    where: { email },
    data: { role: 'admin' }
  });
  console.log('User role set to admin.');
}

fixAdminRole().finally(() => prisma.$disconnect());
