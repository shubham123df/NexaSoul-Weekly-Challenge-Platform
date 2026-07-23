import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nexasoul_quiz',
  },
});
