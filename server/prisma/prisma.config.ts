// Prisma v7+ configuration for MongoDB
export default {
  adapter: {
    provider: 'mongodb',
    url: process.env.DATABASE_URL,
  },
};
