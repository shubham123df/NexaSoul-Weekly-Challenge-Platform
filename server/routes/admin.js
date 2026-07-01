import express from 'express';
import * as quizQueries from '../models/quizQueries.js';
import * as submissionQueries from '../models/submissionQueries.js';
import { seedDatabase } from '../seed/seedData.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.use(adminAuth);

router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await quizQueries.getAllQuizzes();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/quizzes', async (req, res) => {
  try {
    const quiz = await quizQueries.createQuiz(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await quizQueries.updateQuiz(req.params.id, req.body);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/quizzes/:id/toggle', async (req, res) => {
  try {
    const quiz = await quizQueries.toggleQuizStatus(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/quizzes/:id', async (req, res) => {
  try {
    await quizQueries.deleteQuiz(req.params.id);
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/quizzes/:id/questions', async (req, res) => {
  try {
    const quiz = await quizQueries.addSingleQuestion(req.params.id, req.body);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/quizzes/:id/questions/:qIndex', async (req, res) => {
  try {
    const question = await quizQueries.updateQuestion(req.params.id, parseInt(req.params.qIndex, 10), req.body);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    const quiz = await quizQueries.getFullQuizById(req.params.id);
    res.json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/quizzes/:id/questions/:qIndex', async (req, res) => {
  try {
    await quizQueries.deleteQuestion(req.params.id, parseInt(req.params.qIndex, 10));
    const quiz = await quizQueries.getFullQuizById(req.params.id);
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/quizzes/:id/submissions', async (req, res) => {
  try {
    const submissions = await submissionQueries.getSubmissionsByQuizId(req.params.id);
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/submissions/:id', async (req, res) => {
  try {
    const submission = await submissionQueries.getSubmissionWithAnswers(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/submissions/:id', async (req, res) => {
  try {
    await submissionQueries.deleteSubmission(req.params.id);
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/submissions/delete-multiple', async (req, res) => {
  try {
    const { submissionIds } = req.body;
    if (!submissionIds || !Array.isArray(submissionIds)) {
      return res.status(400).json({ message: 'Invalid submission IDs' });
    }
    await submissionQueries.deleteMultipleSubmissions(submissionIds);
    res.json({ message: `${submissionIds.length} submissions deleted` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/seed', async (req, res) => {
  try {
    const quiz = await seedDatabase({ force: true });
    res.json({ message: 'Database seeded successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
