import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { bootstrapDatabase } from './db/bootstrap.js';
import quizRoutes from './routes/quiz.js';
import adminRoutes from './routes/admin.js';
import leaderboardRoutes from './routes/leaderboard.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now to allow inline styles
  crossOriginEmbedderPolicy: false,
}));

// CORS middleware - MUST be registered before rate limiter
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://nexasoul-quiz-frontend.onrender.com',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-secret', 'Authorization'],
}));

// Rate limiting - disabled for development
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000, // Increased limit for development
//   message: 'Too many requests from this IP, please try again later.',
// });
// app.use('/api/', limiter);

// Stricter rate limiting for admin routes - disabled for development
// const adminLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 200, // Increased limit for development
//   message: 'Too many admin requests, please try again later.',
// });
app.use(express.json());

app.get('/', (req, res) => res.json({
  status: 'ok',
  message: 'NexaSoul Quiz API',
  version: '1.0.0',
  endpoints: ['/api/health', '/api/quiz/active', '/api/admin/quizzes'],
}));
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'NexaSoul Quiz API - PostgreSQL' }));

app.use('/api/quiz', quizRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/analytics', analyticsRoutes);

async function startServer() {
  try {
    await bootstrapDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Database: PostgreSQL`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
