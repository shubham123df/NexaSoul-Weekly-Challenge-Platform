import axios from 'axios';

async function testActiveQuiz() {
  try {
    const response = await axios.get('http://localhost:5000/api/quiz/active');
    console.log('Active Quiz Response:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.log('Response data:', error.response.data);
    }
  }
}

testActiveQuiz();
