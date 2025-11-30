const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setPlainPasswordAndRole() {
  const email = 'novalcapital@example.com';
  const password = 'Valcap123';
  const role = 'admin';
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('User not found');
    return;
  }
  await prisma.user.update({
    where: { email },
    data: { password, role }
  });
  console.log('Password set to plain text and role set to admin.');
}

setPlainPasswordAndRole().finally(() => prisma.$disconnect());
