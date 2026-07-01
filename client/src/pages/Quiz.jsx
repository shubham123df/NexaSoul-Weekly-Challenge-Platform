import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Send } from 'lucide-react';
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

  useEffect(() => {
    if (!registrationRef.current) {
      navigate('/register');
      return;
    }

    enterQuizZone();

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
          totalScore: correctCount * 10,
          accuracy: Math.round((correctCount / totalQuestions) * 100),
          timeTakenSeconds,
          correctCount,
          wrongCount: totalQuestions - correctCount,
          rank: null,
          leaderboardEnabled: false,
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

  const handleSelect = (index) => {
    if (submitting) return;
    setSelectedOption(index);
  };

  const handleSubmitQuestion = () => {
    if (selectedOption === null || submitting || !quiz) return;

    const newAnswer = {
      questionIndex: currentIndex,
      selectedOption,
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
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="edu-card inline-flex items-center gap-3 px-6 py-4">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="text-slate-600 font-medium">Loading your quiz...</span>
        </div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="max-w-3xl mx-auto edu-card p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate('/')} className="btn-secondary">Go Home</button>
      </div>
    );
  }

  const question = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const isLastQuestion = currentIndex + 1 >= totalQuestions;

  if (!quizStarted) {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="edu-card p-8 sm:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center shadow-lg shadow-indigo-200"
          >
            <BookOpen className="w-10 h-10 text-white" />
          </motion.div>

          <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wider mb-2">
            Week 1 · Frontend Trivia
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3 tracking-tight">
            Ready to Begin?
          </h1>
          <p className="text-slate-600 text-lg mb-1">{quiz.title}</p>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">{quiz.description}</p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { value: totalQuestions, label: 'Questions', color: 'text-indigo-600' },
              { value: `${quiz.durationMinutes}:00`, label: 'Minutes', color: 'text-teal-600' },
              { value: '300', label: 'Max Points', color: 'text-emerald-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
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

          <p className="text-xs text-slate-400 mt-6">
            The {quiz.durationMinutes}-minute timer starts when you click Start Quiz.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto quiz-focus-mode pt-16 sm:pt-4">
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
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
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
          className="edu-card p-6 sm:p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
              <BookOpen className="w-4 h-4" />
              Question {currentIndex + 1}
            </span>
            <QuestionTimer
              key={currentIndex}
              onTick={setQuestionTime}
              paused={submitting}
            />
          </div>

          <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-8 leading-relaxed">
            {question.questionText}
          </h2>

          <div className="space-y-3 mb-8">
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400 self-center sm:self-auto">
              {currentIndex + 1} of {totalQuestions}
            </span>

            <motion.button
              type="button"
              whileHover={selectedOption !== null && !submitting ? { scale: 1.02 } : {}}
              whileTap={selectedOption !== null && !submitting ? { scale: 0.98 } : {}}
              onClick={handleSubmitQuestion}
              disabled={selectedOption === null || submitting}
              className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                selectedOption !== null && !submitting
                  ? 'bg-gradient-to-r from-indigo-600 to-teal-600 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              {submitting ? (
                <>Submitting quiz...</>
              ) : isLastQuestion ? (
                <>
                  <Send className="w-4 h-4" />
                  Submit Quiz
                </>
              ) : (
                <>
                  Submit &amp; Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>

          {selectedOption === null && (
            <p className="text-xs text-slate-400 text-center sm:text-right mt-3">
              Select an answer, then click Submit to continue
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
