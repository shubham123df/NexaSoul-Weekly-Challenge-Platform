import { db } from '../db/index.js';
import { submissions, answers, quizzes } from '../db/schema.js';
import { eq, and, or, desc, inArray } from 'drizzle-orm';

// Check if email already submitted for active quiz
export const checkEmailForActiveQuiz = async (email) => {
  const activeQuiz = await db.select().from(quizzes).where(eq(quizzes.isActive, true)).limit(1);
  
  if (!activeQuiz.length) return { exists: false, noActiveQuiz: true };
  
  const existing = await db.select()
    .from(submissions)
    .where(and(
      eq(submissions.quizId, activeQuiz[0].id),
      eq(submissions.email, email.toLowerCase())
    ))
    .limit(1);
  
  return { exists: existing.length > 0, noActiveQuiz: false };
};

// Check if UID or email already submitted
export const checkDuplicateSubmission = async (quizId, uid, email) => {
  const existing = await db.select()
    .from(submissions)
    .where(and(
      eq(submissions.quizId, quizId),
      or(
        eq(submissions.uid, uid),
        eq(submissions.email, email.toLowerCase())
      )
    ))
    .limit(1);
  
  return existing.length > 0;
};

// Create submission with answers
export const createSubmission = async (submissionData, answersData) => {
  // Create submission
  const [newSubmission] = await db.insert(submissions).values({
    quizId: submissionData.quizId,
    name: submissionData.name,
    uid: submissionData.uid,
    email: submissionData.email.toLowerCase(),
    mobile: submissionData.mobile,
    department: submissionData.department,
    year: submissionData.year,
    totalScore: submissionData.totalScore,
    correctCount: submissionData.correctCount,
    wrongCount: submissionData.wrongCount,
    accuracy: submissionData.accuracy,
    timeTakenSeconds: submissionData.timeTakenSeconds,
  }).returning();
  
  // Create answers
  const answersToInsert = answersData.map(a => ({
    submissionId: newSubmission.id,
    questionIndex: a.questionIndex,
    selectedOption: a.selectedOption,
    isCorrect: a.isCorrect,
    timeTakenSeconds: a.timeTakenSeconds,
    bonusPoints: a.bonusPoints,
    pointsEarned: a.pointsEarned,
  }));
  
  await db.insert(answers).values(answersToInsert);
  
  return newSubmission;
};

// Get rank for a submission
export const getSubmissionRank = async (quizId, totalScore, timeTakenSeconds) => {
  const allSubmissions = await db.select()
    .from(submissions)
    .where(eq(submissions.quizId, quizId));

  const betterCount = allSubmissions.filter(
    (s) =>
      s.totalScore > totalScore ||
      (s.totalScore === totalScore && s.timeTakenSeconds < timeTakenSeconds)
  ).length;

  return betterCount + 1;
};

// Get submission by ID
export const getSubmissionById = async (submissionId) => {
  const result = await db.select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .limit(1);

  return result.length ? result[0] : null;
};

// Get submission answers
export const getSubmissionAnswers = async (submissionId) => {
  return await db.select()
    .from(answers)
    .where(eq(answers.submissionId, submissionId))
    .orderBy(answers.questionIndex);
};

// Get submission with answers (admin detail view)
export const getSubmissionWithAnswers = async (submissionId) => {
  const submission = await getSubmissionById(submissionId);
  if (!submission) return null;

  const submissionAnswers = await getSubmissionAnswers(submissionId);

  return {
    ...submission,
    _id: submission.id,
    answers: submissionAnswers,
  };
};

// Get all submissions for a quiz
export const getSubmissionsByQuizId = async (quizId) => {
  const rows = await db.select({
    id: submissions.id,
    name: submissions.name,
    uid: submissions.uid,
    email: submissions.email,
    mobile: submissions.mobile,
    department: submissions.department,
    year: submissions.year,
    totalScore: submissions.totalScore,
    correctCount: submissions.correctCount,
    wrongCount: submissions.wrongCount,
    accuracy: submissions.accuracy,
    timeTakenSeconds: submissions.timeTakenSeconds,
    completedAt: submissions.completedAt,
    createdAt: submissions.createdAt,
  })
  .from(submissions)
  .where(eq(submissions.quizId, quizId))
  .orderBy(desc(submissions.totalScore), submissions.timeTakenSeconds);

  return rows.map((row) => ({ ...row, _id: row.id }));
};

// Get leaderboard for active quiz
export const getActiveQuizLeaderboard = async (limit = 10) => {
  const activeQuiz = await db.select().from(quizzes).where(eq(quizzes.isActive, true)).limit(1);
  
  if (!activeQuiz.length) return [];
  
  return await db.select({
    name: submissions.name,
    department: submissions.department,
    totalScore: submissions.totalScore,
    timeTakenSeconds: submissions.timeTakenSeconds,
    accuracy: submissions.accuracy,
    completedAt: submissions.completedAt,
  })
  .from(submissions)
  .where(eq(submissions.quizId, activeQuiz[0].id))
  .orderBy(submissions.totalScore, submissions.timeTakenSeconds, submissions.completedAt)
  .limit(limit);
};

// Get leaderboard for specific quiz
export const getQuizLeaderboard = async (quizId, limit = 10) => {
  return await db.select({
    name: submissions.name,
    department: submissions.department,
    totalScore: submissions.totalScore,
    timeTakenSeconds: submissions.timeTakenSeconds,
    accuracy: submissions.accuracy,
    completedAt: submissions.completedAt,
  })
  .from(submissions)
  .where(eq(submissions.quizId, quizId))
  .orderBy(submissions.totalScore, submissions.timeTakenSeconds, submissions.completedAt)
  .limit(limit);
};

// Delete submission
export const deleteSubmission = async (submissionId) => {
  await db.delete(submissions).where(eq(submissions.id, submissionId));
};

// Delete multiple submissions
export const deleteMultipleSubmissions = async (submissionIds) => {
  if (!submissionIds?.length) return;
  await db.delete(submissions).where(inArray(submissions.id, submissionIds));
};

// Get top performers with detailed analytics
export const getTopPerformers = async (quizId, limit = 10) => {
  const submissionsList = await db.select()
    .from(submissions)
    .where(eq(submissions.quizId, quizId))
    .orderBy(submissions.totalScore, submissions.timeTakenSeconds)
    .limit(limit);
  
  const performersWithAnswers = await Promise.all(
    submissionsList.map(async (submission) => {
      const submissionAnswers = await db.select()
        .from(answers)
        .where(eq(answers.submissionId, submission.id))
        .orderBy(answers.questionIndex);
      
      const avgTimePerQuestion = submissionAnswers.length > 0
        ? submissionAnswers.reduce((sum, a) => sum + a.timeTakenSeconds, 0) / submissionAnswers.length
        : 0;
      
      const totalBonusPoints = submissionAnswers.reduce((sum, a) => sum + a.bonusPoints, 0);
      
      // Check for suspicious patterns (all answers in < 2 seconds)
      const suspiciousFast = submissionAnswers.every(a => a.timeTakenSeconds < 2) && submissionAnswers.length > 5;
      
      // Check for perfect timing pattern (all answers take same time)
      const times = submissionAnswers.map(a => a.timeTakenSeconds);
      const uniqueTimes = new Set(times);
      const perfectTiming = uniqueTimes.size === 1 && times.length > 5;
      
      return {
        ...submission,
        answerCount: submissionAnswers.length,
        avgTimePerQuestion: Math.round(avgTimePerQuestion * 100) / 100,
        totalBonusPoints,
        answers: submissionAnswers,
        flags: {
          suspiciousFast,
          perfectTiming,
        },
      };
    })
  );
  
  return performersWithAnswers;
};

// Get analytics for a quiz
export const getQuizAnalytics = async (quizId) => {
  const submissionsList = await db.select()
    .from(submissions)
    .where(eq(submissions.quizId, quizId));
  
  if (!submissionsList.length) {
    return {
      totalSubmissions: 0,
      avgScore: 0,
      avgAccuracy: 0,
      avgTime: 0,
      scoreDistribution: [],
      departmentBreakdown: {},
    };
  }
  
  const totalSubmissions = submissionsList.length;
  const avgScore = submissionsList.reduce((sum, s) => sum + s.totalScore, 0) / totalSubmissions;
  const avgAccuracy = submissionsList.reduce((sum, s) => sum + s.accuracy, 0) / totalSubmissions;
  const avgTime = submissionsList.reduce((sum, s) => sum + s.timeTakenSeconds, 0) / totalSubmissions;
  
  // Score distribution
  const scoreRanges = [
    { range: '0-25', min: 0, max: 25 },
    { range: '26-50', min: 26, max: 50 },
    { range: '51-75', min: 51, max: 75 },
    { range: '76-100', min: 76, max: 100 },
    { range: '101+', min: 101, max: Infinity },
  ];
  
  const scoreDistribution = scoreRanges.map(range => ({
    range: range.range,
    count: submissionsList.filter(s => s.totalScore >= range.min && s.totalScore <= range.max).length,
  }));
  
  // Department breakdown
  const departmentBreakdown = {};
  submissionsList.forEach(s => {
    departmentBreakdown[s.department] = (departmentBreakdown[s.department] || 0) + 1;
  });
  
  return {
    totalSubmissions,
    avgScore: Math.round(avgScore * 100) / 100,
    avgAccuracy: Math.round(avgAccuracy * 100) / 100,
    avgTime: Math.round(avgTime * 100) / 100,
    scoreDistribution,
    departmentBreakdown,
  };
};
