import { createContext, useContext, useState, useCallback } from 'react';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [quizInProgress, setQuizInProgress] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const startQuiz = useCallback(() => {
    setQuizInProgress(true);
    setQuizStarted(true);
  }, []);

  const enterQuizZone = useCallback(() => {
    setQuizInProgress(true);
    setQuizStarted(false);
  }, []);

  const exitQuiz = useCallback(() => {
    setQuizInProgress(false);
    setQuizStarted(false);
  }, []);

  return (
    <QuizContext.Provider value={{ quizInProgress, quizStarted, startQuiz, enterQuizZone, exitQuiz }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
