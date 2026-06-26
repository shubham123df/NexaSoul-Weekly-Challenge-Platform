import express from 'express';
import Quiz from '../models/Quiz.js';
import Submission from '../models/Submission.js';

const router = express.Router();

function calculateBonus(timeTakenSeconds) {
  if (timeTakenSeconds <= 5) return 5;
  if (timeTakenSeconds <= 10) return 3;
  return 0;
}

router.get('/active', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ isActive: true }).select('-questions.correctAnswer -questions.explanation');
    if (!quiz) {
      return res.status(404).json({ message: 'No active quiz available' });
    }
    if (quiz.submissionDeadline && new Date() > quiz.submissionDeadline) {
      return res.status(403).json({ message: 'Quiz submission deadline has passed' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/active/check-email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    const quiz = await Quiz.findOne({ isActive: true });
    if (!quiz) {
      return res.status(404).json({ message: 'No active quiz available' });
    }

    const existing = await Submission.findOne({ quizId: quiz._id, email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'This email has already submitted this week\'s quiz' });
    }

    res.json({ available: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer -questions.explanation');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/submit', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (!quiz.isActive) return res.status(403).json({ message: 'Quiz is not active' });
    if (quiz.submissionDeadline && new Date() > quiz.submissionDeadline) {
      return res.status(403).json({ message: 'Submission deadline has passed' });
    }

    const { name, uid, email, mobile, department, year, answers, timeTakenSeconds } = req.body;

    if (!name || !uid || !email || !mobile || !department || !year || !answers) {
      return res.status(400).json({ message: 'All registration fields and answers are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    if (!/^\d{10}$/.test(mobile.replace(/\s/g, ''))) {
      return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number' });
    }

    const existing = await Submission.findOne({ quizId: quiz._id, $or: [{ uid }, { email: email.toLowerCase() }] });
    if (existing) {
      return res.status(409).json({ message: 'You have already submitted this quiz' });
    }

    const processedAnswers = answers.map((answer) => {
      const question = quiz.questions[answer.questionIndex];
      const isCorrect = question && answer.selectedOption === question.correctAnswer;
      const bonusPoints = isCorrect ? calculateBonus(answer.timeTakenSeconds || 0) : 0;
      const pointsEarned = isCorrect ? 10 + bonusPoints : 0;

      return {
        questionIndex: answer.questionIndex,
        selectedOption: answer.selectedOption,
        isCorrect,
        timeTakenSeconds: answer.timeTakenSeconds || 0,
        bonusPoints,
        pointsEarned,
      };
    });

    const correctCount = processedAnswers.filter((a) => a.isCorrect).length;
    const wrongCount = processedAnswers.length - correctCount;
    const totalScore = processedAnswers.reduce((sum, a) => sum + a.pointsEarned, 0);
    const accuracy = processedAnswers.length
      ? Math.round((correctCount / processedAnswers.length) * 100)
      : 0;

    const submission = await Submission.create({
      quizId: quiz._id,
      name,
      uid,
      email,
      mobile,
      department,
      year,
      answers: processedAnswers,
      totalScore,
      correctCount,
      wrongCount,
      accuracy,
      timeTakenSeconds: timeTakenSeconds || 0,
    });

    let rank = null;
    if (quiz.leaderboardEnabled) {
      const betterCount = await Submission.countDocuments({
        quizId: quiz._id,
        $or: [
          { totalScore: { $gt: submission.totalScore } },
          { totalScore: submission.totalScore, timeTakenSeconds: { $lt: submission.timeTakenSeconds } },
        ],
      });
      rank = betterCount + 1;
    }

    res.status(201).json({
      submissionId: submission._id,
      totalScore,
      accuracy,
      timeTakenSeconds: submission.timeTakenSeconds,
      correctCount,
      wrongCount,
      rank,
      leaderboardEnabled: quiz.leaderboardEnabled,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/review/:submissionId', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    const submission = await Submission.findById(req.params.submissionId);
    if (!quiz || !submission) return res.status(404).json({ message: 'Not found' });

    const review = quiz.questions.map((q, index) => {
      const userAnswer = submission.answers.find((a) => a.questionIndex === index);
      return {
        questionNumber: index + 1,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        selectedOption: userAnswer?.selectedOption ?? null,
        isCorrect: userAnswer?.isCorrect ?? false,
        explanation: q.explanation,
      };
    });

    res.json({ review, submission: { name: submission.name, totalScore: submission.totalScore } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
