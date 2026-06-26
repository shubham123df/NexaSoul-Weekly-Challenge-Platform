import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { quizApi } from '../api/client';

const labels = ['A', 'B', 'C', 'D'];

export default function Review() {
  const navigate = useNavigate();
  const [review, setReview] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const results = JSON.parse(sessionStorage.getItem('nexasoul_results') || 'null');

  useEffect(() => {
    if (!results?.quizId || !results?.submissionId) {
      navigate('/results');
      return;
    }

    quizApi.getReview(results.quizId, results.submissionId)
      .then((res) => {
        setReview(res.data.review);
        setLoading(false);
      })
      .catch(() => {
        navigate('/results');
      });
  }, [results, navigate]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="animate-pulse text-nexa-blue">Loading review...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Answer Review</h1>
        <p className="text-nexa-muted">
          Learn from each question — tap to see why the correct answer is right.
        </p>
      </motion.div>

      <div className="space-y-4">
        {review.map((item) => (
          <motion.div
            key={item.questionNumber}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === item.questionNumber ? null : item.questionNumber)}
              className="w-full p-5 text-left flex items-start gap-4"
            >
              <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                item.isCorrect ? 'bg-nexa-green/20 text-nexa-green' : 'bg-red-500/20 text-red-400'
              }`}>
                {item.isCorrect ? '✓' : '✗'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-nexa-blue mb-1">Question {item.questionNumber}</div>
                <div className="font-medium text-sm sm:text-base">{item.questionText}</div>
                <div className="mt-2 text-xs text-nexa-muted">
                  Your answer: {item.selectedOption !== null ? labels[item.selectedOption] : '—'} ·
                  Correct: {labels[item.correctAnswer]}
                </div>
              </div>
              <span className="text-nexa-green text-sm shrink-0 mt-1">
                {expanded === item.questionNumber ? '▲' : '▼'}
              </span>
            </button>

            <AnimatePresence>
              {expanded === item.questionNumber && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-0 border-t border-nexa-border">
                    <div className="mt-4 p-4 rounded-xl bg-nexa-green/5 border border-nexa-green/20">
                      <div className="text-nexa-green font-semibold text-sm mb-2">
                        Why is this answer correct?
                      </div>
                      <p className="text-nexa-gray text-sm leading-relaxed">
                        {item.explanation || 'No explanation provided for this question.'}
                      </p>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {item.options.map((opt, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-lg text-xs sm:text-sm border ${
                            i === item.correctAnswer
                              ? 'border-nexa-green/50 bg-nexa-green/10 text-nexa-green'
                              : i === item.selectedOption && !item.isCorrect
                              ? 'border-red-500/50 bg-red-500/10 text-red-400'
                              : 'border-nexa-border text-nexa-muted'
                          }`}
                        >
                          <span className="font-bold">{labels[i]}.</span> {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button onClick={() => navigate('/results')} className="btn-secondary">
          ← Back to Results
        </button>
      </div>
    </div>
  );
}
