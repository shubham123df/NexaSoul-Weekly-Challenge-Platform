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
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const results = JSON.parse(sessionStorage.getItem('nexasoul_results') || 'null');
  const quizState = JSON.parse(sessionStorage.getItem('nexasoul_quiz_state') || 'null');

  useEffect(() => {
    if (!results?.quizId) {
      navigate('/results');
      return;
    }

    // Handle demo mode
    if (results.demoMode && quizState?.quiz) {
      const demoReview = quizState.quiz.questions.map((q, idx) => ({
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        selectedOption: quizState.answers[idx]?.selectedOption,
        correctAnswer: 0, // Assuming option A is correct for demo
        isCorrect: quizState.answers[idx]?.selectedOption === 0,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        explanation: 'This is a demo quiz. In production, detailed explanations would be provided here.',
      }));
      setReview(demoReview);
      setLoading(false);
      return;
    }

    // Normal mode - fetch from API
    if (!results?.submissionId) {
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
  }, [results, quizState, navigate]);

  // Hide navbar when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsScrollingDown(true);
      } else if (currentScrollY < lastScrollY) {
        setIsScrollingDown(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Apply hidden class to header when scrolling down
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      if (isScrollingDown) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }
    }
  }, [isScrollingDown]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="animate-pulse text-primary">Loading review...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto hide-navbar-scroll pt-24">
        {/* Centered review section */}
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-black">Answer Review</h1>
            <p className="text-black font-medium">
              Learn from each question — tap to see why the correct answer is right.
            </p>
          </motion.div>

          <div className="space-y-4">
            {review.map((item) => (
              <motion.div
                key={item.questionNumber}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border-2 border-primary/20 shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === item.questionNumber ? null : item.questionNumber)}
                  className="w-full p-5 text-left flex items-start gap-4 hover:bg-primary/5 transition-colors"
                >
                  <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0 border-2 ${
                    item.isCorrect ? 'bg-accent-green/20 border-accent-green text-accent-green' : 'bg-red-500/20 border-red-500 text-red-500'
                  }`}>
                    {item.isCorrect ? '✓' : '✗'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-primary mb-1">Question {item.questionNumber}</div>
                    <div className="font-semibold text-sm sm:text-base text-black">{item.questionText}</div>
                    <div className="mt-2 text-xs font-medium text-black">
                      Your answer: {item.selectedOption !== null ? labels[item.selectedOption] : '—'} ·
                      Correct: {labels[item.correctAnswer]}
                    </div>
                  </div>
                  <span className="text-primary text-sm shrink-0 mt-1 font-bold">
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
                      <div className="px-5 pb-5 pt-0 border-t-2 border-primary/20">
                        <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-accent-green/10 to-accent-cyan/10 border-2 border-accent-green/30">
                          <div className="text-accent-green font-bold text-sm mb-2">
                            Why is this answer correct?
                          </div>
                          <p className="text-black font-medium text-sm leading-relaxed">
                            {item.explanation || 'No explanation provided for this question.'}
                          </p>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {item.options.map((opt, i) => (
                            <div
                              key={i}
                              className={`min-w-0 break-words p-3 rounded-lg text-xs sm:text-sm border-2 ${
                                i === item.correctAnswer
                                  ? 'border-green-500 bg-green-500 text-white font-bold shadow-lg shadow-green-500/30'
                                  : i === item.selectedOption && !item.isCorrect
                                  ? 'border-red-500/50 bg-red-500/10 text-red-500 font-semibold'
                                  : 'border-primary/20 bg-white text-black'
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
    </div>
  );
}
