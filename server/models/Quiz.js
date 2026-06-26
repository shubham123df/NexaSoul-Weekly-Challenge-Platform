import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: {
    type: [String],
    validate: [(v) => v.length === 4, 'Exactly 4 options required'],
    required: true,
  },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
  explanation: { type: String, default: '' },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    durationMinutes: { type: Number, default: 20 },
    questions: [questionSchema],
    isActive: { type: Boolean, default: false },
    submissionDeadline: { type: Date, default: null },
    leaderboardEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Quiz', quizSchema);
