import axios from 'axios';

async function tracePoster() {
  console.log('=== Tracing Poster Flow ===\n');

  // 1. Check Database
  console.log('1. Checking Database...');
  const { Client } = await import('pg');
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/nexasoul_quiz',
  });
  
  await client.connect();
  const dbResult = await client.query(`
    SELECT id, title, poster_url 
    FROM quizzes 
    WHERE is_active = true
  `);
  
  if (dbResult.rows.length > 0) {
    console.log('✓ Database has poster_url:', dbResult.rows[0].poster_url);
  } else {
    console.log('✗ No active quiz in database');
  }
  await client.end();

  // 2. Check API Response
  console.log('\n2. Checking API Response...');
  try {
    const apiResponse = await axios.get('http://localhost:5000/api/quiz/active');
    console.log('✓ API Response includes posterUrl:', !!apiResponse.data.posterUrl);
    console.log('  posterUrl value:', apiResponse.data.posterUrl);
  } catch (error) {
    console.log('✗ API Error:', error.message);
  }

  console.log('\n=== Trace Complete ===');
}

tracePoster();
