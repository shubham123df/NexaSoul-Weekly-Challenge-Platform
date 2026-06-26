import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  selectedOption: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  timeTakenSeconds: { type: Number, required: true },
  bonusPoints: { type: Number, default: 0 },
  pointsEarned: { type: Number, default: 0 },
});

const submissionSchema = new mongoose.Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    name: { type: String, required: true },
    uid: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    answers: [answerSchema],
    totalScore: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    wrongCount: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    timeTakenSeconds: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

submissionSchema.index({ quizId: 1, totalScore: -1, timeTakenSeconds: 1 });

export default mongoose.model('Submission', submissionSchema);
