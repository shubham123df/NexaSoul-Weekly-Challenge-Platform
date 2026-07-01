import pkg from 'pg';
const { Client } = pkg;

async function setupDatabase() {
  // First, connect to the default 'postgres' database to create our database
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres',
  });

  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if database exists
    const checkDb = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'nexasoul_quiz'"
    );

    if (checkDb.rows.length === 0) {
      console.log('Creating database nexasoul_quiz...');
      await client.query('CREATE DATABASE nexasoul_quiz');
      console.log('✅ Database created successfully');
    } else {
      console.log('✅ Database nexasoul_quiz already exists');
    }

    await client.end();
    console.log('\n✅ Database setup complete!');
    console.log('You can now run: npm start');
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.log('\nIf the password is incorrect, please update the connection string in this file.');
    await client.end().catch(() => {});
    process.exit(1);
  }
}

setupDatabase();
