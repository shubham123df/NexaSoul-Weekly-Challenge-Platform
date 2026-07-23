import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { quizApi } from '../api/client';
import ProgressBar from '../components/ProgressBar';
import Timer, { QuestionTimer } from '../components/Timer';
import OptionButton from '../components/OptionButton';
import { useQuiz } from '../context/QuizContext';

export default function Quiz() {
  const navigate = useNavigate();
  const { enterQuizZone, exitQuiz } = useQuiz();
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionTime, setQuestionTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showFinalWarning, setShowFinalWarning] = useState(false);
  const startTimeRef = useRef(Date.now());
  const answersRef = useRef([]);
  const questionTimeRef = useRef(0);
  const registrationRef = useRef(
    JSON.parse(sessionStorage.getItem('nexasoul_registration') || 'null')
  );

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    questionTimeRef.current = questionTime;
  }, [questionTime]);

  // Save quiz state to sessionStorage when quiz starts or progresses
  useEffect(() => {
    if (quizStarted && quiz) {
      const quizState = {
        quiz,
        currentIndex,
        answers,
        startTime: startTimeRef.current,
      };
      sessionStorage.setItem('nexasoul_quiz_state', JSON.stringify(quizState));
    }
  }, [quizStarted, currentIndex, answers, quiz]);

  // Prevent back button navigation during quiz
  useEffect(() => {
    if (quizStarted) {
      window.history.pushState(null, '', window.location.href);
      window.history.pushState(null, '', window.location.href);
      const handlePopState = (event) => {
        event.preventDefault();
        window.history.pushState(null, '', window.location.href);
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [quizStarted]);

  useEffect(() => {
    if (!registrationRef.current) {
      navigate('/register');
      return;
    }

    enterQuizZone();

    // Check if quiz state exists in sessionStorage (prevents restart on back button)
    const savedQuizState = sessionStorage.getItem('nexasoul_quiz_state');
    if (savedQuizState) {
      try {
        const state = JSON.parse(savedQuizState);
        setQuiz(state.quiz);
        setCurrentIndex(state.currentIndex);
        setAnswers(state.answers);
        setQuizStarted(true);
        startTimeRef.current = state.startTime;
        setLoading(false);
        return;
      } catch (e) {
        console.error('Failed to restore quiz state:', e);
        sessionStorage.removeItem('nexasoul_quiz_state');
      }
    }

    quizApi.getActive()
      .then((res) => {
        setQuiz(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!err.response) {
          // Backend not available - show sample quiz for testing
          console.warn('Backend not available, showing sample quiz');
          setQuiz({
            _id: 'demo-quiz',
            title: 'Demo Quiz (Backend Offline)',
            description: 'This is a demo quiz for testing the UI',
            durationMinutes: 20,
            questions: [
              {
                questionNumber: 1,
                questionText: 'What is 2 + 2?',
                optionA: '3',
                optionB: '4',
                optionC: '5',
                optionD: '6',
              },
              {
                questionNumber: 2,
                questionText: 'What color is the sky?',
                optionA: 'Blue',
                optionB: 'Green',
                optionC: 'Red',
                optionD: 'Yellow',
              },
            ],
          });
          setLoading(false);
        } else {
          setError(err.response?.data?.message || 'Failed to load quiz');
          setLoading(false);
        }
      });

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate, enterQuizZone]);

  const submitQuiz = useCallback(async (finalAnswers) => {
    if (submitting || !quiz) return;
    setSubmitting(true);
    exitQuiz();

    // Clear quiz state from sessionStorage to prevent re-entry
    sessionStorage.removeItem('nexasoul_quiz_state');

    const timeTakenSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      const res = await quizApi.submit(quiz._id, {
        ...registrationRef.current,
        answers: finalAnswers,
        timeTakenSeconds,
      });

      sessionStorage.setItem('nexasoul_results', JSON.stringify({
        ...res.data,
        quizId: quiz._id,
      }));

      navigate('/results');
    } catch (err) {
      if (!err.response) {
        // Backend not available - show demo results
        console.warn('Backend not available, showing demo results');
        const correctCount = finalAnswers.filter(a => a.selectedOption === 0).length;
        const totalQuestions = finalAnswers.length;
        
        sessionStorage.setItem('nexasoul_results', JSON.stringify({
          quizId: quiz._id,
          submissionId: 'demo-submission-' + Date.now(),
          totalScore: correctCount * 10,
          accuracy: Math.round((correctCount / totalQuestions) * 100),
          timeTakenSeconds,
          correctCount,
          wrongCount: totalQuestions - correctCount,
          rank: null,
          leaderboardEnabled: false,
          demoMode: true,
        }));
        
        navigate('/results');
      } else {
        setError(err.response?.data?.message || 'Submission failed');
        setSubmitting(false);
        enterQuizZone();
      }
    }
  }, [quiz, navigate, submitting, exitQuiz, enterQuizZone]);

  const handleExpire = useCallback(() => {
    submitQuiz(answersRef.current);
  }, [submitQuiz]);

  // Detect window/tab switch with warning system
  useEffect(() => {
    if (quizStarted && !submitting) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setTabSwitchCount(prev => {
            const newCount = prev + 1;
            if (newCount === 1) {
              // First switch - show warning
              setShowWarning(true);
            } else if (newCount === 2) {
              // Second switch - show final warning
              setShowFinalWarning(true);
            } else {
              // Third or more switches - submit immediately
              submitQuiz(answersRef.current);
            }
            return newCount;
          });
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [quizStarted, submitting, submitQuiz]);

  const handleSelect = (index) => {
    if (submitting) return;
    setSelectedOption(index);
    
    // Auto-advance to next question after short delay
    setTimeout(() => {
      const newAnswer = {
        questionIndex: currentIndex,
        selectedOption: index,
        timeTakenSeconds: questionTimeRef.current,
      };

      const updatedAnswers = [
        ...answersRef.current.filter((a) => a.questionIndex !== currentIndex),
        newAnswer,
      ];

      setAnswers(updatedAnswers);
      answersRef.current = updatedAnswers;

      const isLastQuestion = currentIndex + 1 >= quiz.questions.length;

      if (isLastQuestion) {
        submitQuiz(updatedAnswers);
        return;
      }

      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setQuestionTime(0);
      questionTimeRef.current = 0;
    }, 300); // 300ms delay for visual feedback
  };


  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="edu-card inline-flex items-center gap-3 px-6 py-4">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <span className="w-2 h-2 bg-accent-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="text-text-100 font-medium">Loading your quiz...</span>
        </div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="max-w-3xl mx-auto edu-card p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => navigate('/')} className="btn-secondary">Go Home</button>
      </div>
    );
  }

  const question = quiz.questions?.[currentIndex];
  const totalQuestions = quiz.questions?.length || 0;
  const isLastQuestion = currentIndex + 1 >= totalQuestions;

  // Guard against invalid question index
  if (!question && quizStarted) {
    return (
      <div className="max-w-3xl mx-auto edu-card p-8 text-center">
        <p className="text-red-500 mb-4">Error loading question. Please try again.</p>
        <button onClick={() => navigate('/')} className="btn-secondary">Go Home</button>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-white to-gray-50 p-8 sm:p-12 rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <BookOpen className="w-10 h-10 text-white" />
          </motion.div>

          <p className="text-black text-sm font-bold uppercase tracking-wider mb-2">
            Week 2 · Frontend Trivia
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3 tracking-tight">
            Ready to Begin?
          </h1>
          <p className="text-black text-lg mb-1 font-semibold">{quiz.title}</p>
          <p className="text-black mb-8 max-w-md mx-auto">{quiz.description}</p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { value: totalQuestions, label: 'Questions', color: 'text-primary' },
              { value: `${quiz.durationMinutes}:00`, label: 'Minutes', color: 'text-accent-cyan' },
              { value: '300', label: 'Max Points', color: 'text-accent-green' },
            ].map((stat) => (
              <div key={stat.label} className="bg-gradient-to-br from-primary/10 to-accent-cyan/10 rounded-xl p-4 border-2 border-primary/30">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm font-semibold text-black">{stat.label}</div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setQuizStarted(true);
              startTimeRef.current = Date.now();
            }}
            className="btn-primary text-lg px-12 py-4"
          >
            Start Quiz
          </motion.button>

          <p className="text-xs font-semibold text-black mt-6">
            The {quiz.durationMinutes}-minute timer starts when you click Start Quiz.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto quiz-focus-mode pt-16 sm:pt-4">
      <div className="grid lg:grid-cols-5 gap-8 items-start">
        
        {/* Left decorative section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block lg:col-span-2 space-y-6"
        >
          <div className="bg-gradient-to-br from-primary/10 to-accent-cyan/10 p-6 rounded-2xl relative overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
            <motion.div 
              className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-pulse-slow"
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-black mb-4">Quiz Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black font-medium">Question</span>
                  <span className="font-bold text-primary">{currentIndex + 1} / {totalQuestions}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black font-medium">Answered</span>
                  <span className="font-bold text-accent-green">{answers.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black font-medium">Remaining</span>
                  <span className="font-bold text-accent-cyan">{totalQuestions - currentIndex}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-primary/20">
                <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary via-accent-cyan to-accent-lime"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent-lime/10 to-accent-yellow/10 p-6 rounded-2xl relative overflow-hidden border-2 border-accent-lime/30 shadow-lg shadow-accent-lime/20">
            <motion.div 
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-lime/30 rounded-full blur-3xl animate-pulse-slow"
              style={{ animationDelay: '1s' }}
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-black mb-4">Quiz Rules</h3>
              <ul className="space-y-3">
                {[
                  'Select answer to auto-advance',
                  'Tab switch will submit quiz',
                  'No going back to previous questions',
                  'Timer runs continuously'
                ].map((rule, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 text-black font-medium text-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-accent-lime flex items-center justify-center text-black text-xs flex-shrink-0 font-bold">!</span>
                    {rule}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Right quiz section */}
        <div className="lg:col-span-3">
          <Timer
            totalSeconds={quiz.durationMinutes * 60}
            onExpire={handleExpire}
            isRunning={quizStarted && !submitting}
            fixed
          />

          <div className="mb-6 pt-2">
            <ProgressBar current={currentIndex + 1} total={totalQuestions} variant="edu" />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="bg-gradient-to-br from-white to-gray-50 p-6 sm:p-8 rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20"
            >
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-black bg-gradient-to-r from-primary/20 to-accent-cyan/20 px-4 py-2 rounded-full border-2 border-primary/40 shadow-md">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Question {currentIndex + 1}
                </span>
                <QuestionTimer
                  key={currentIndex}
                  onTick={setQuestionTime}
                  paused={submitting}
                />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-black mb-8 leading-relaxed">
                {question.questionText}
              </h2>

              <div className="space-y-4 mb-6">
                {question.options.map((option, index) => (
                  <OptionButton
                    key={index}
                    index={index}
                    text={option}
                    selected={selectedOption === index}
                    onSelect={handleSelect}
                    disabled={submitting}
                    variant="edu"
                  />
                ))}
              </div>

              <div className="text-center pt-6 border-t-2 border-primary/20">
                <span className="text-sm font-semibold text-black">
                  {currentIndex + 1} of {totalQuestions} · Select an answer to continue
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* First Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border-2 border-primary/30 shadow-xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Warning: Tab Switch Detected</h3>
                <p className="text-black mb-6">
                  Switching tabs or windows during the quiz is considered cheating. If you switch again, your quiz will be automatically submitted.
                </p>
                <button
                  onClick={() => setShowWarning(false)}
                  className="btn-primary w-full"
                >
                  I Understand, Continue Quiz
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Warning Modal */}
      <AnimatePresence>
        {showFinalWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border-2 border-red-500/30 shadow-xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Final Warning</h3>
                <p className="text-black mb-6">
                  You have switched tabs again. Your quiz will be submitted immediately with your current answers. This is your last chance to continue.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowFinalWarning(false);
                      submitQuiz(answersRef.current);
                    }}
                    className="btn-primary w-full"
                  >
                    Submit Quiz & View Results
                  </button>
                  <button
                    onClick={() => setShowFinalWarning(false)}
                    className="btn-secondary w-full"
                  >
                    Continue Quiz (Last Warning)
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
