import pkg from 'pg';
const { Client } = pkg;

async function checkPosterUrl() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nexasoul_quiz',
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✅ Connected');

    const result = await client.query(`
      SELECT id, title, poster_url 
      FROM quizzes 
      WHERE is_active = true
    `);

    console.log('\nActive Quiz:');
    if (result.rows.length === 0) {
      console.log('No active quiz found');
    } else {
      result.rows.forEach(quiz => {
        console.log(`ID: ${quiz.id}`);
        console.log(`Title: ${quiz.title}`);
        console.log(`Poster URL: ${quiz.poster_url || '(empty)'}`);
      });
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await client.end().catch(() => {});
    process.exit(1);
  }
}

checkPosterUrl();
