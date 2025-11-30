const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setAdminUser() {
  const email = 'admin@admin.com';
  const password = 'Admin123!';
  const fullName = 'Admin';
  const role = 'admin';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role, fullName },
    create: { email, password: hashedPassword, role, fullName },
  });

  console.log('Admin user upserted:', user);
}

setAdminUser()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
