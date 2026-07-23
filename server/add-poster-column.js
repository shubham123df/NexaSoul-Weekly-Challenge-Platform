import pkg from 'pg';
const { Client } = pkg;

async function addPosterColumn() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nexasoul_quiz',
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✅ Connected');

    // Check if column exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'quizzes' 
      AND column_name = 'poster_url'
    `);

    if (checkColumn.rows.length === 0) {
      console.log('Adding poster_url column to quizzes table...');
      await client.query(`
        ALTER TABLE quizzes 
        ADD COLUMN poster_url TEXT DEFAULT ''
      `);
      console.log('✅ Column added successfully');
    } else {
      console.log('✅ Column poster_url already exists');
    }

    await client.end();
    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await client.end().catch(() => {});
    process.exit(1);
  }
}

addPosterColumn();
