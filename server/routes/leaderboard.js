import express from 'express';
import * as submissionQueries from '../models/submissionQueries.js';
import * as quizQueries from '../models/quizQueries.js';

const router = express.Router();

router.get('/:quizId', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const leaderboard = await submissionQueries.getQuizLeaderboard(req.params.quizId, limit);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/active/top', async (req, res) => {
  try {
    const quiz = await quizQueries.getActiveQuiz();
    if (!quiz) return res.json([]);
    const limit = parseInt(req.query.limit, 10) || 10;
    const leaderboard = await submissionQueries.getActiveQuizLeaderboard(limit);
    res.json({ quizTitle: quiz.title, leaderboard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
