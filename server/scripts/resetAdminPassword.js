const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
  const email = 'novalcapital@example.com';
  const password = 'Valcap123';
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('User not found');
    return;
  }
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword, role: 'admin' }
  });
  console.log('Admin password and role updated.');
}

resetAdminPassword().finally(() => prisma.$disconnect());
