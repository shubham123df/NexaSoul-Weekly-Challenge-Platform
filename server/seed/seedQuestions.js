import dotenv from 'dotenv';
import { bootstrapDatabase } from '../db/bootstrap.js';
import { seedDatabase } from './seedData.js';

dotenv.config();

async function seed() {
  try {
    const { testConnection } = await import('../db/index.js');
    const connected = await testConnection();
    if (!connected) throw new Error('Cannot connect to PostgreSQL');

    await seedDatabase({ force: true });
    console.log('✅ Force-seeded database with 20 frontend questions');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
