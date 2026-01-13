import { prisma } from './src/lib/prisma'

async function testConnection() {
  try {
    // Test the connection by trying to query the database
    const plans = await prisma.nutritionalPlan.findMany()
    console.log('✅ Database connection successful')
    console.log(`Found ${plans.length} nutritional plans`)
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()