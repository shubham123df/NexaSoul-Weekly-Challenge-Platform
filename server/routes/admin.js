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

// Seed database with sample quiz
router.post('/seed', async (req, res) => {
  try {
    const frontendQuestions = [
      {
        questionText: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
        correctAnswer: 0,
        explanation: 'HTML stands for Hyper Text Markup Language. It is the standard markup language used to create and structure content on the web.',
      },
      {
        questionText: 'Which CSS property is used to change the text color of an element?',
        options: ['font-color', 'text-color', 'color', 'foreground-color'],
        correctAnswer: 2,
        explanation: 'The `color` property in CSS sets the foreground color of text and other elements.',
      },
      {
        questionText: 'Which HTML tag is used to define an internal stylesheet?',
        options: ['<css>', '<script>', '<style>', '<link>'],
        correctAnswer: 2,
        explanation: 'The `<style>` tag is used inside HTML documents to define internal CSS rules.',
      },
      {
        questionText: 'What is the correct syntax for referring to an external CSS file in HTML?',
        options: ['<style src="style.css">', '<link rel="stylesheet" href="style.css">', '<stylesheet>style.css</stylesheet>', '<css href="style.css">'],
        correctAnswer: 1,
        explanation: 'External CSS files are linked using `<link rel="stylesheet" href="style.css">` inside the `<head>` section.',
      },
      {
        questionText: 'Which JavaScript method is used to select an element by its ID?',
        options: ['document.querySelector()', 'document.getElementById()', 'document.getElementsByClassName()', 'document.findElement()'],
        correctAnswer: 1,
        explanation: '`document.getElementById()` returns the element whose id property matches the specified string.',
      },
      {
        questionText: 'In React, what hook is used to manage state in a functional component?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 1,
        explanation: '`useState` is the primary React hook for adding local state to functional components.',
      },
      {
        questionText: 'Which of the following is NOT a valid JavaScript variable declaration keyword?',
        options: ['let', 'var', 'const', 'define'],
        correctAnswer: 3,
        explanation: 'JavaScript uses `let`, `var`, and `const` to declare variables. `define` is not a valid keyword.',
      },
      {
        questionText: 'What does the CSS property `display: flex` do?',
        options: ['Hides the element', 'Creates a flexible box layout', 'Makes text bold', 'Adds a border'],
        correctAnswer: 1,
        explanation: '`display: flex` enables Flexbox layout, allowing flexible alignment and distribution of space among items.',
      },
      {
        questionText: 'Which HTTP method is typically used to retrieve data from a server?',
        options: ['POST', 'PUT', 'GET', 'DELETE'],
        correctAnswer: 2,
        explanation: 'GET requests are used to retrieve/read data from a server without modifying it.',
      },
      {
        questionText: 'What is the purpose of the `alt` attribute in an `<img>` tag?',
        options: ['Sets image alignment', 'Provides alternative text for accessibility', 'Changes image size', 'Links the image to a URL'],
        correctAnswer: 1,
        explanation: 'The `alt` attribute provides descriptive text for screen readers and when images fail to load.',
      },
      {
        questionText: 'Which Tailwind CSS class applies a flex container with centered items?',
        options: ['flex center', 'flex items-center', 'display-flex align-center', 'flexbox-center'],
        correctAnswer: 1,
        explanation: 'In Tailwind, `flex` creates a flex container and `items-center` vertically centers flex items.',
      },
      {
        questionText: 'What does DOM stand for in web development?',
        options: ['Document Object Model', 'Data Object Management', 'Digital Output Method', 'Document Orientation Map'],
        correctAnswer: 0,
        explanation: 'The DOM (Document Object Model) is a programming interface that represents HTML/XML documents as a tree of objects.',
      },
      {
        questionText: 'Which React hook runs side effects after render?',
        options: ['useState', 'useMemo', 'useEffect', 'useCallback'],
        correctAnswer: 2,
        explanation: '`useEffect` lets you perform side effects like data fetching, subscriptions, or DOM manipulation after render.',
      },
      {
        questionText: 'What is the default display value of a `<div>` element?',
        options: ['inline', 'block', 'flex', 'inline-block'],
        correctAnswer: 1,
        explanation: 'Block-level elements like `<div>` take up the full width available and start on a new line.',
      },
      {
        questionText: 'Which CSS unit is relative to the font size of the root element?',
        options: ['em', 'rem', 'px', 'vh'],
        correctAnswer: 1,
        explanation: '`rem` (root em) units are relative to the font-size of the root `<html>` element, making scaling consistent.',
      },
      {
        questionText: 'What does API stand for?',
        options: ['Application Programming Interface', 'Advanced Program Integration', 'Automated Process Interface', 'Application Process Integration'],
        correctAnswer: 0,
        explanation: 'An API (Application Programming Interface) defines how software components communicate with each other.',
      },
      {
        questionText: 'Which property makes a CSS box model include padding and border in the element\'s total width?',
        options: ['box-sizing: border-box', 'box-model: include', 'width: total', 'display: box'],
        correctAnswer: 0,
        explanation: '`box-sizing: border-box` includes padding and border within the specified width and height.',
      },
      {
        questionText: 'In JavaScript, which method adds one or more elements to the end of an array?',
        options: ['pop()', 'shift()', 'push()', 'unshift()'],
        correctAnswer: 2,
        explanation: 'The `push()` method adds elements to the end of an array and returns the new length.',
      },
      {
        questionText: 'What is JSX in React?',
        options: ['A JavaScript database', 'A syntax extension for JavaScript', 'A CSS preprocessor', 'A Node.js framework'],
        correctAnswer: 1,
        explanation: 'JSX is a syntax extension that lets you write HTML-like markup inside JavaScript, which React transforms into elements.',
      },
      {
        questionText: 'Which media query breakpoint is commonly used for mobile-first responsive design in Tailwind?',
        options: ['sm: (640px)', 'mobile: (320px)', 'xs: (480px)', 'phone: (375px)'],
        correctAnswer: 0,
        explanation: 'Tailwind\'s `sm:` breakpoint starts at 640px. Tailwind is mobile-first, so unprefixed styles apply to all screens by default.',
      },
    ];

    await Quiz.deleteMany({});
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);

    const quiz = await Quiz.create({
      title: 'NexaSoul Frontend Trivia Challenge – Week 1',
      description: 'Test your frontend development knowledge with 20 MCQs. Answer fast for bonus points!',
      durationMinutes: 20,
      questions: frontendQuestions,
      isActive: true,
      submissionDeadline: deadline,
      leaderboardEnabled: true,
    });

    res.json({ message: 'Database seeded successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
