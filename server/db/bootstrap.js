import path from 'path';
import { fileURLToPath } from 'url';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool, testConnection } from './index.js';
import * as quizQueries from '../models/quizQueries.js';
import { seedDatabase } from '../seed/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function tablesExist() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT to_regclass('public.quizzes') AS quiz_table"
    );
    return result.rows[0]?.quiz_table !== null;
  } finally {
    client.release();
  }
}

export async function bootstrapDatabase() {
  const connected = await testConnection();
  if (!connected) {
    throw new Error('Failed to connect to PostgreSQL');
  }

  const exists = await tablesExist();
  if (!exists) {
    console.log('Running database migrations...');
    await migrate(db, { migrationsFolder: path.join(__dirname, '../drizzle') });
    console.log('✅ Migrations complete');
  } else {
    console.log('✅ Database tables already exist');
  }

  const activeQuiz = await quizQueries.getActiveQuiz();
  if (!activeQuiz) {
    console.log('No active quiz found — seeding sample data...');
    await seedDatabase();
    console.log('✅ Database seeded with Week 1 quiz');
  } else {
    console.log(`✅ Active quiz found: ${activeQuiz.title}`);
  }
}
