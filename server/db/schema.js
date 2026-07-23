import { pgTable, uuid, varchar, text, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Quizzes table
export const quizzes = pgTable('quizzes', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').default(''),
  durationMinutes: integer('duration_minutes').default(20),
  isActive: boolean('is_active').default(false),
  submissionDeadline: timestamp('submission_deadline'),
  leaderboardEnabled: boolean('leaderboard_enabled').default(true),
  posterUrl: text('poster_url').default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Questions table (normalized from embedded array in MongoDB)
export const questions = pgTable('questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  quizId: uuid('quiz_id').references(() => quizzes.id, { onDelete: 'cascade' }).notNull(),
  questionNumber: integer('question_number').notNull(),
  questionText: text('question_text').notNull(),
  optionA: varchar('option_a', { length: 500 }).notNull(),
  optionB: varchar('option_b', { length: 500 }).notNull(),
  optionC: varchar('option_c', { length: 500 }).notNull(),
  optionD: varchar('option_d', { length: 500 }).notNull(),
  correctAnswer: integer('correct_answer').notNull(), // 0-3 representing A-D
  explanation: text('explanation').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Submissions table
export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  quizId: uuid('quiz_id').references(() => quizzes.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  uid: varchar('uid', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  mobile: varchar('mobile', { length: 20 }).notNull(),
  department: varchar('department', { length: 100 }).notNull(),
  year: varchar('year', { length: 50 }).notNull(),
  totalScore: integer('total_score').default(0),
  correctCount: integer('correct_count').default(0),
  wrongCount: integer('wrong_count').default(0),
  accuracy: integer('accuracy').default(0),
  timeTakenSeconds: integer('time_taken_seconds').default(0),
  completedAt: timestamp('completed_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    quizEmailIdx: index('submissions_quiz_email_idx').on(table.quizId, table.email),
    quizUidIdx: index('submissions_quiz_uid_idx').on(table.quizId, table.uid),
    leaderboardIdx: index('submissions_leaderboard_idx').on(table.quizId, table.totalScore, table.timeTakenSeconds),
  };
});

// Answers table (normalized from embedded array in MongoDB)
export const answers = pgTable('answers', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id').references(() => submissions.id, { onDelete: 'cascade' }).notNull(),
  questionIndex: integer('question_index').notNull(),
  selectedOption: integer('selected_option').notNull(), // 0-3
  isCorrect: boolean('is_correct').notNull(),
  timeTakenSeconds: integer('time_taken_seconds').notNull(),
  bonusPoints: integer('bonus_points').default(0),
  pointsEarned: integer('points_earned').default(0),
});

// Define relations
export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(questions),
  submissions: many(submissions),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
  }),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [submissions.quizId],
    references: [quizzes.id],
  }),
  answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  submission: one(submissions, {
    fields: [answers.submissionId],
    references: [submissions.id],
  }),
}));
