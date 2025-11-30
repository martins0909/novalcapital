const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function recreateAdminUser() {
  const email = 'novalcapital@example.com';
  const password = 'Valcap123';
  const fullName = 'Noval Capital';
  const role = 'admin';

  // Delete existing user
  await prisma.user.deleteMany({ where: { email } });

  // Create new admin user
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
      role
    }
  });
  console.log('Admin user recreated.');
}

recreateAdminUser().finally(() => prisma.$disconnect());
