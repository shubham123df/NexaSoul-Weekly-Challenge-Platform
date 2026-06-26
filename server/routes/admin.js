import express from 'express';
import Quiz from '../models/Quiz.js';
import Submission from '../models/Submission.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.use(adminAuth);

router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/quizzes', async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/quizzes/:id/toggle', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    if (!quiz.isActive) {
      await Quiz.updateMany({ _id: { $ne: quiz._id } }, { isActive: false });
      quiz.isActive = true;
    } else {
      quiz.isActive = false;
    }
    await quiz.save();
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    await Submission.deleteMany({ quizId: req.params.id });
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/quizzes/:id/questions', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    quiz.questions.push(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/quizzes/:id/questions/:qIndex', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    const idx = parseInt(req.params.qIndex, 10);
    if (idx < 0 || idx >= quiz.questions.length) {
      return res.status(404).json({ message: 'Question not found' });
    }
    quiz.questions[idx] = { ...quiz.questions[idx].toObject(), ...req.body };
    await quiz.save();
    res.json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/quizzes/:id/questions/:qIndex', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    const idx = parseInt(req.params.qIndex, 10);
    quiz.questions.splice(idx, 1);
    await quiz.save();
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all submissions for a quiz
router.get('/quizzes/:id/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find({ quizId: req.params.id })
      .sort({ totalScore: -1, timeTakenSeconds: 1 })
      .select('-answers');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get submission details with answers
router.get('/submissions/:id', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a submission
router.delete('/submissions/:id', async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete multiple submissions
router.post('/submissions/delete-multiple', async (req, res) => {
  try {
    const { submissionIds } = req.body;
    if (!submissionIds || !Array.isArray(submissionIds)) {
      return res.status(400).json({ message: 'Invalid submission IDs' });
    }
    await Submission.deleteMany({ _id: { $in: submissionIds } });
    res.json({ message: `${submissionIds.length} submissions deleted` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
