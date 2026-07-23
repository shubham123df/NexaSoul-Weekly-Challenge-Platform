import express from 'express';
import * as quizQueries from '../models/quizQueries.js';
import * as submissionQueries from '../models/submissionQueries.js';

const router = express.Router();

function calculateBonus(timeTakenSeconds) {
  if (timeTakenSeconds <= 5) return 5;
  if (timeTakenSeconds <= 10) return 3;
  return 0;
}

// Check if UID has already submitted this week
router.get('/check-weekly-uid', async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) {
      return res.status(400).json({ message: 'UID is required' });
    }

    const hasSubmitted = await submissionQueries.checkWeeklySubmissionByUID(uid);
    
    if (hasSubmitted) {
      return res.status(409).json({ message: 'You have already attempted this week\'s challenge' });
    }

    res.json({ available: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/active', async (req, res) => {
  try {
    const quiz = await quizQueries.getActiveQuiz();
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

    const result = await submissionQueries.checkEmailForActiveQuiz(email.toLowerCase());
    
    if (result.noActiveQuiz) {
      return res.status(404).json({ message: 'No active quiz available' });
    }
    
    if (result.exists) {
      return res.status(409).json({ message: 'This email has already submitted this week\'s quiz' });
    }

    res.json({ available: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const quiz = await quizQueries.getQuizById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/submit', async (req, res) => {
  try {
    const quiz = await quizQueries.getFullQuizById(req.params.id);
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

    const isDuplicate = await submissionQueries.checkDuplicateSubmission(quiz.id, uid, email);
    if (isDuplicate) {
      return res.status(409).json({ message: 'You have already submitted this quiz' });
    }

    const processedAnswers = answers.map((answer) => {
      const question = quiz.questions.find(q => q.questionNumber === answer.questionIndex + 1);
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

    const submission = await submissionQueries.createSubmission(
      {
        quizId: quiz.id,
        name,
        uid,
        email,
        mobile,
        department,
        year,
        totalScore,
        correctCount,
        wrongCount,
        accuracy,
        timeTakenSeconds: timeTakenSeconds || 0,
      },
      processedAnswers
    );

    let rank = null;
    if (quiz.leaderboardEnabled) {
      rank = await submissionQueries.getSubmissionRank(quiz.id, totalScore, timeTakenSeconds || 0);
    }

    res.status(201).json({
      submissionId: submission.id,
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
    const { id: quizId, submissionId } = req.params;

    if (!quizId || !submissionId) {
      return res.status(400).json({ message: 'Quiz ID and submission ID are required' });
    }

    const quiz = await quizQueries.getFullQuizById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const submission = await submissionQueries.getSubmissionById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.quizId !== quiz.id) {
      return res.status(400).json({ message: 'Submission does not belong to this quiz' });
    }

    const submissionAnswers = await submissionQueries.getSubmissionAnswers(submission.id);

    const review = quiz.questions.map((q) => {
      const userAnswer = submissionAnswers.find((a) => a.questionIndex === q.questionNumber - 1);
      return {
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correctAnswer: q.correctAnswer,
        selectedOption: userAnswer?.selectedOption ?? null,
        isCorrect: userAnswer?.isCorrect ?? false,
        explanation: q.explanation,
      };
    });

    res.json({ 
      review, 
      submission: { 
        name: submission.name, 
        totalScore: submission.totalScore 
      } 
    });
  } catch (error) {
    console.error('Review route error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve review data',
      error: error.message 
    });
  }
});

export default router;
