require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('Testing database connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL || 'Not defined');

  // Define database URL directly if environment variable is not working
  const databaseUrl =
    process.env.DATABASE_URL ||
    'postgresql://postgres.gyywxyobcbnhbzzbdeop:htHf4izqkGbLj3wW@aws-0-eu-north-1.pooler.supabase.com:5432/postgres';

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  try {
    // Simple test query
    console.log('Attempting simple query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Connection successful, result:', result);

    // Check if users table exists
    console.log('Checking for users table...');
    try {
      const users = await prisma.user.findMany({ take: 1 });
      console.log('User table found, first user:', users[0] || 'No users found');
    } catch (e) {
      console.log('Error querying users:', e.message);
    }
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
