const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  const email = 'novalcapital@example.com';
  const password = 'Valcap123';
  const fullName = 'Noval Capital';
  const role = 'admin';

  // Hash password for security
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
      role
    }
  });
  console.log('New admin user created successfully.');
}

createAdminUser().finally(() => prisma.$disconnect());
