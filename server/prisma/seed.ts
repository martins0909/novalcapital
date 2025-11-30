const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check if admin already exists
  const existingAdmin = await prisma.user.findFirst({ where: { email: 'admin@example.com' } });
  if (existingAdmin) {
    console.log('Admin user already exists.');
    return;
  }
  // Create admin user
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'admin123', // Plain text for now, update if using hashing
      fullName: 'Admin User',
      role: 'admin',
      balance: 0,
    }
  });
  console.log('Admin user created.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });