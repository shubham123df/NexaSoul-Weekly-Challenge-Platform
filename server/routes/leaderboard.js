import express from 'express';
import Submission from '../models/Submission.js';
import Quiz from '../models/Quiz.js';

const router = express.Router();

router.get('/:quizId', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const leaderboard = await Submission.find({ quizId: req.params.quizId })
      .sort({ totalScore: -1, timeTakenSeconds: 1, completedAt: 1 })
      .limit(limit)
      .select('name department totalScore timeTakenSeconds accuracy completedAt');

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/active/top', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ isActive: true });
    if (!quiz) return res.json([]);
    const limit = parseInt(req.query.limit, 10) || 10;
    const leaderboard = await Submission.find({ quizId: quiz._id })
      .sort({ totalScore: -1, timeTakenSeconds: 1, completedAt: 1 })
      .limit(limit)
      .select('name department totalScore timeTakenSeconds accuracy completedAt');
    res.json({ quizTitle: quiz.title, leaderboard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
