const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');

const db = new Database('./dev.db');
const adapter = new PrismaBetterSqlite3(db);
const prisma = new PrismaClient({ adapter });

async function testConnection() {
  try {
    // Test the connection by trying to query the database
    const plans = await prisma.nutritionalPlan.findMany();
    console.log('✅ Database connection successful');
    console.log(`Found ${plans.length} nutritional plans`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();