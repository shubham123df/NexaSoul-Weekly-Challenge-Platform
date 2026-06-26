import express from 'express';
import Submission from '../models/Submission.js';
import Quiz from '../models/Quiz.js';
import XLSX from 'xlsx';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/:quizId', adminAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const submissions = await Submission.find({ quizId: req.params.quizId });
    const totalParticipants = submissions.length;
    const averageScore = totalParticipants
      ? Math.round(submissions.reduce((s, sub) => s + sub.totalScore, 0) / totalParticipants)
      : 0;
    const highestScore = totalParticipants
      ? Math.max(...submissions.map((s) => s.totalScore))
      : 0;

    const questionStats = quiz.questions.map((q, index) => {
      let correct = 0;
      let attempted = 0;
      submissions.forEach((sub) => {
        const ans = sub.answers.find((a) => a.questionIndex === index);
        if (ans) {
          attempted++;
          if (ans.isCorrect) correct++;
        }
      });
      return {
        questionNumber: index + 1,
        questionText: q.questionText,
        attempted,
        correct,
        accuracy: attempted ? Math.round((correct / attempted) * 100) : 0,
      };
    });

    res.json({
      quizTitle: quiz.title,
      totalParticipants,
      averageScore,
      highestScore,
      questionStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:quizId/export/csv', adminAuth, async (req, res) => {
  try {
    const submissions = await Submission.find({ quizId: req.params.quizId }).sort({ totalScore: -1 });
    const headers = ['Name', 'UID', 'Email', 'Department', 'Year', 'Score', 'Time Taken (seconds)', 'Accuracy'];
    const rows = submissions.map((s) => [
      s.name,
      s.uid,
      s.email,
      s.department,
      s.year,
      s.totalScore,
      s.timeTakenSeconds,
      `${s.accuracy}%`,
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=nexasoul-submissions.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:quizId/export/excel', adminAuth, async (req, res) => {
  try {
    const submissions = await Submission.find({ quizId: req.params.quizId }).sort({ totalScore: -1 });
    const data = submissions.map((s) => ({
      Name: s.name,
      UID: s.uid,
      Email: s.email,
      Department: s.department,
      Year: s.year,
      Score: s.totalScore,
      'Time Taken (seconds)': s.timeTakenSeconds,
      Accuracy: `${s.accuracy}%`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=nexasoul-submissions.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
