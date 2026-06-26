import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isAdvancing, setIsAdvancing] = useState(false);
  const startTimeRef = useRef(Date.now());
  const questionStartRef = useRef(Date.now());
  const autoAdvanceRef = useRef(null);
  const registration = JSON.parse(sessionStorage.getItem('nexasoul_registration') || 'null');

  useEffect(() => {
    if (!registration) {
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
        setError(err.response?.data?.message || 'Failed to load quiz');
        setLoading(false);
      });

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, [navigate, registration, enterQuizZone]);

  const submitQuiz = useCallback(async (finalAnswers) => {
    if (submitting || !quiz) return;
    setSubmitting(true);
    exitQuiz();

    const timeTakenSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      const res = await quizApi.submit(quiz._id, {
        ...registration,
        answers: finalAnswers,
        timeTakenSeconds,
      });

      sessionStorage.setItem('nexasoul_results', JSON.stringify({
        ...res.data,
        quizId: quiz._id,
      }));

      navigate('/results');
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
      setSubmitting(false);
    }
  }, [quiz, registration, navigate, submitting, exitQuiz]);

  const handleExpire = useCallback(() => {
    if (answers.length >= (quiz?.questions?.length || 0)) return;
    submitQuiz(answers);
  }, [answers, quiz, submitQuiz]);

  const handleNext = useCallback(() => {
    if (selectedOption === null) return;

    const newAnswer = {
      questionIndex: currentIndex,
      selectedOption,
      timeTakenSeconds: questionTime,
    };

    const updatedAnswers = [...answers.filter((a) => a.questionIndex !== currentIndex), newAnswer];

    if (currentIndex + 1 >= quiz.questions.length) {
      submitQuiz(updatedAnswers);
      return;
    }

    setAnswers(updatedAnswers);
    setCurrentIndex(currentIndex + 1);
    setSelectedOption(null);
    setQuestionTime(0);
    questionStartRef.current = Date.now();
  }, [selectedOption, currentIndex, questionTime, answers, quiz, submitQuiz]);

  const handleSelect = (index) => {
    if (selectedOption !== null || submitting || isAdvancing) return;
    
    console.log('✓ Answer selected:', index, 'for question:', currentIndex + 1);
    
    // Save the answer
    const newAnswer = {
      questionIndex: currentIndex,
      selectedOption: index,
      timeTakenSeconds: questionTime,
    };

    const updatedAnswers = [...answers.filter((a) => a.questionIndex !== currentIndex), newAnswer];
    setAnswers(updatedAnswers);
    
    // Mark as advancing
    setSelectedOption(index);
    setIsAdvancing(true);
  };

  // Handle auto-advance when answer is selected
  useEffect(() => {
    if (!isAdvancing || !quiz) return;

    console.log('⏳ Setting up auto-advance for question:', currentIndex + 1);

    autoAdvanceRef.current = setTimeout(() => {
      console.log('⏰ Timeout fired! Current question:', currentIndex + 1);
      
      const totalQuestions = quiz.questions.length;
      
      if (currentIndex + 1 >= totalQuestions) {
        console.log('✓ Last question - submitting quiz');
        submitQuiz(answers);
      } else {
        console.log('✓ Moving to question:', currentIndex + 2);
        setCurrentIndex((prev) => {
          console.log('✓ setCurrentIndex called:', prev, '->', prev + 1);
          return prev + 1;
        });
        setSelectedOption(null);
        setIsAdvancing(false);
        setQuestionTime(0);
        questionStartRef.current = Date.now();
      }
    }, 800);

    return () => {
      if (autoAdvanceRef.current) {
        console.log('🧹 Cleaning up timeout');
        clearTimeout(autoAdvanceRef.current);
      }
    };
  }, [isAdvancing, currentIndex, quiz, answers, submitQuiz]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="animate-pulse text-nexa-blue text-lg flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-nexa-blue rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-nexa-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <span className="w-2 h-2 bg-nexa-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          Loading quiz...
        </div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="max-w-3xl mx-auto glass-card p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={() => navigate('/')} className="btn-secondary">Go Home</button>
      </div>
    );
  }

  const question = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;

  // Show start screen before quiz begins
  if (!quizStarted) {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 sm:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-nexa-gradient flex items-center justify-center text-4xl"
          >
            🎯
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Begin?</h1>
          <p className="text-nexa-muted text-lg mb-2">{quiz.title}</p>
          <p className="text-nexa-muted mb-8">{quiz.description}</p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-nexa-navy-light/50 rounded-xl p-4 border border-nexa-border">
              <div className="text-2xl font-bold text-nexa-blue">{totalQuestions}</div>
              <div className="text-sm text-nexa-muted">Questions</div>
            </div>
            <div className="bg-nexa-navy-light/50 rounded-xl p-4 border border-nexa-border">
              <div className="text-2xl font-bold text-nexa-green">{quiz.durationMinutes}:00</div>
              <div className="text-sm text-nexa-muted">Minutes</div>
            </div>
            <div className="bg-nexa-navy-light/50 rounded-xl p-4 border border-nexa-border">
              <div className="text-2xl font-bold text-purple-400">300</div>
              <div className="text-sm text-nexa-muted">Max Points</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setQuizStarted(true);
              startTimeRef.current = Date.now();
            }}
            className="btn-primary text-lg px-12 py-4"
          >
            Start Quiz 🚀
          </motion.button>

          <p className="text-xs text-nexa-muted mt-6">
            The {quiz.durationMinutes}-minute timer will start once you click the button above.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <ProgressBar current={currentIndex + 1} total={totalQuestions} />
        <Timer
          totalSeconds={quiz.durationMinutes * 60}
          onExpire={handleExpire}
          isRunning={quizStarted && !submitting}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6 sm:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-nexa-blue bg-nexa-blue/10 px-3 py-1 rounded-full">
              Q{currentIndex + 1}
            </span>
            <QuestionTimer key={currentIndex} onTick={setQuestionTime} />
          </div>

          <h2 className="text-lg sm:text-xl font-semibold mb-8 leading-relaxed">
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
                disabled={submitting || selectedOption !== null}
              />
            ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-nexa-muted">
              {currentIndex + 1} / {totalQuestions} questions
            </span>
            <span className={`text-xs font-semibold ${isAdvancing ? 'text-nexa-green animate-pulse' : 'text-nexa-muted'}`}>
              {isAdvancing ? '⏳ Moving to next question...' : selectedOption === null ? '👆 Select an answer to continue' : ''}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
