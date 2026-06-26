import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import Quiz from './models/Quiz.js';
import quizRoutes from './routes/quiz.js';
import adminRoutes from './routes/admin.js';
import leaderboardRoutes from './routes/leaderboard.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

// Force reload env
console.log('🔄 Server starting...');
console.log('=== SERVER CONFIGURATION ===');
console.log('PORT:', process.env.PORT);
console.log('ADMIN_SECRET:', process.env.ADMIN_SECRET);
console.log('ADMIN_SECRET length:', process.env.ADMIN_SECRET?.length);
console.log('ADMIN_SECRET type:', typeof process.env.ADMIN_SECRET);
console.log('===========================');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'NexaSoul Quiz API' }));

app.use('/api/quiz', quizRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/analytics', analyticsRoutes);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexasoul-quiz';

mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err.message));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
