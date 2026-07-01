import { db } from '../db/index.js';
import { quizzes, questions } from '../db/schema.js';
import { eq, desc, ne } from 'drizzle-orm';

/** Normalize question for frontend (MongoDB-compat shape) */
export function formatQuestion(q) {
  return {
    ...q,
    _id: q.id,
    options: [q.optionA, q.optionB, q.optionC, q.optionD],
  };
}

/** Normalize quiz for frontend */
export function formatQuiz(quiz, quizQuestions = []) {
  return {
    ...quiz,
    _id: quiz.id,
    questions: quizQuestions.map(formatQuestion),
  };
}

export async function getQuestionsByQuizId(quizId) {
  return db.select()
    .from(questions)
    .where(eq(questions.quizId, quizId))
    .orderBy(questions.questionNumber);
}

// Get active quiz (without correct answers)
export const getActiveQuiz = async () => {
  const activeQuiz = await db.select().from(quizzes).where(eq(quizzes.isActive, true)).limit(1);

  if (!activeQuiz.length) return null;

  const quiz = activeQuiz[0];
  const quizQuestions = await db.select({
    id: questions.id,
    quizId: questions.quizId,
    questionNumber: questions.questionNumber,
    questionText: questions.questionText,
    optionA: questions.optionA,
    optionB: questions.optionB,
    optionC: questions.optionC,
    optionD: questions.optionD,
    createdAt: questions.createdAt,
  }).from(questions).where(eq(questions.quizId, quiz.id));

  return formatQuiz(quiz, quizQuestions);
};

export const getQuizById = async (quizId) => {
  const quizResult = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  if (!quizResult.length) return null;

  const quiz = quizResult[0];
  const quizQuestions = await db.select({
    id: questions.id,
    quizId: questions.quizId,
    questionNumber: questions.questionNumber,
    questionText: questions.questionText,
    optionA: questions.optionA,
    optionB: questions.optionB,
    optionC: questions.optionC,
    optionD: questions.optionD,
    createdAt: questions.createdAt,
  }).from(questions).where(eq(questions.quizId, quiz.id));

  return formatQuiz(quiz, quizQuestions);
};

export const getFullQuizById = async (quizId) => {
  const quizResult = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  if (!quizResult.length) return null;

  const quiz = quizResult[0];
  const quizQuestions = await getQuestionsByQuizId(quiz.id);
  return formatQuiz(quiz, quizQuestions);
};

export const getAllQuizzes = async () => {
  const allQuizzes = await db.select().from(quizzes).orderBy(desc(quizzes.createdAt));

  return Promise.all(
    allQuizzes.map(async (quiz) => {
      const quizQuestions = await getQuestionsByQuizId(quiz.id);
      return formatQuiz(quiz, quizQuestions);
    })
  );
};

export const createQuiz = async (quizData) => {
  const [newQuiz] = await db.insert(quizzes).values({
    title: quizData.title,
    description: quizData.description || '',
    durationMinutes: quizData.durationMinutes || 20,
    isActive: quizData.isActive || false,
    submissionDeadline: quizData.submissionDeadline || null,
    leaderboardEnabled: quizData.leaderboardEnabled !== undefined ? quizData.leaderboardEnabled : true,
  }).returning();

  return formatQuiz(newQuiz, []);
};

export const addQuestions = async (quizId, questionsData) => {
  const existing = await getQuestionsByQuizId(quizId);
  const startNumber = existing.length + 1;

  const questionsToInsert = questionsData.map((q, index) => ({
    quizId,
    questionNumber: startNumber + index,
    questionText: q.questionText,
    optionA: q.options[0],
    optionB: q.options[1],
    optionC: q.options[2],
    optionD: q.options[3],
    correctAnswer: q.correctAnswer,
    explanation: q.explanation || '',
  }));

  await db.insert(questions).values(questionsToInsert);
};

export const addSingleQuestion = async (quizId, questionData) => {
  const existing = await getQuestionsByQuizId(quizId);
  const questionNumber = existing.length + 1;

  await db.insert(questions).values({
    quizId,
    questionNumber,
    questionText: questionData.questionText,
    optionA: questionData.options[0],
    optionB: questionData.options[1],
    optionC: questionData.options[2],
    optionD: questionData.options[3],
    correctAnswer: questionData.correctAnswer,
    explanation: questionData.explanation || '',
  });

  return getFullQuizById(quizId);
};

export const updateQuiz = async (quizId, updateData) => {
  const payload = { updatedAt: new Date() };

  if (updateData.title !== undefined) payload.title = updateData.title;
  if (updateData.description !== undefined) payload.description = updateData.description;
  if (updateData.durationMinutes !== undefined) payload.durationMinutes = updateData.durationMinutes;
  if (updateData.submissionDeadline !== undefined) {
    payload.submissionDeadline = updateData.submissionDeadline ? new Date(updateData.submissionDeadline) : null;
  }
  if (updateData.leaderboardEnabled !== undefined) payload.leaderboardEnabled = updateData.leaderboardEnabled;
  if (updateData.isActive !== undefined) payload.isActive = updateData.isActive;

  const [updatedQuiz] = await db.update(quizzes)
    .set(payload)
    .where(eq(quizzes.id, quizId))
    .returning();

  const quizQuestions = await getQuestionsByQuizId(quizId);
  return formatQuiz(updatedQuiz, quizQuestions);
};

export const toggleQuizStatus = async (quizId) => {
  const quizResult = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  if (!quizResult.length) return null;

  const activating = !quizResult[0].isActive;

  if (activating) {
    await db.update(quizzes)
      .set({ isActive: false, updatedAt: new Date() })
      .where(ne(quizzes.id, quizId));
  }

  const [updatedQuiz] = await db.update(quizzes)
    .set({ isActive: activating, updatedAt: new Date() })
    .where(eq(quizzes.id, quizId))
    .returning();

  const quizQuestions = await getQuestionsByQuizId(quizId);
  return formatQuiz(updatedQuiz, quizQuestions);
};

export const deleteQuiz = async (quizId) => {
  await db.delete(quizzes).where(eq(quizzes.id, quizId));
};

export const updateQuestion = async (quizId, questionIndex, updateData) => {
  const questionResult = await db.select()
    .from(questions)
    .where(eq(questions.quizId, quizId))
    .orderBy(questions.questionNumber);

  if (questionIndex < 0 || questionIndex >= questionResult.length) return null;

  const target = questionResult[questionIndex];
  const payload = {};

  if (updateData.questionText !== undefined) payload.questionText = updateData.questionText;
  if (updateData.correctAnswer !== undefined) payload.correctAnswer = updateData.correctAnswer;
  if (updateData.explanation !== undefined) payload.explanation = updateData.explanation;
  if (updateData.options) {
    payload.optionA = updateData.options[0];
    payload.optionB = updateData.options[1];
    payload.optionC = updateData.options[2];
    payload.optionD = updateData.options[3];
  }

  const [updatedQuestion] = await db.update(questions)
    .set(payload)
    .where(eq(questions.id, target.id))
    .returning();

  return updatedQuestion;
};

export const deleteQuestion = async (quizId, questionIndex) => {
  const questionResult = await db.select()
    .from(questions)
    .where(eq(questions.quizId, quizId))
    .orderBy(questions.questionNumber);

  if (questionIndex < 0 || questionIndex >= questionResult.length) return;

  await db.delete(questions).where(eq(questions.id, questionResult[questionIndex].id));

  const remaining = questionResult.filter((_, i) => i !== questionIndex);
  for (let i = 0; i < remaining.length; i++) {
    await db.update(questions)
      .set({ questionNumber: i + 1 })
      .where(eq(questions.id, remaining[i].id));
  }
};

export const reseedQuiz = async (quizData, questionsData) => {
  await db.delete(quizzes);
  const quiz = await createQuiz(quizData);
  await addQuestions(quiz.id, questionsData);
  return getFullQuizById(quiz.id);
};
