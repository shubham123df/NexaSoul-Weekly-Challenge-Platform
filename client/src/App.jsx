import { useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { QuizProvider, useQuiz } from './context/QuizContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Instructions from './pages/Instructions';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Review from './pages/Review';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import Highlights from './pages/Highlights';

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppLayout() {
  const { quizInProgress } = useQuiz();

  return (
    <div className="min-h-[100dvh] relative overflow-x-clip">
      <ScrollToTop />
      {!quizInProgress && <AnimatedBackground />}
      <Navbar />
      <main className={`relative z-10 px-[max(1rem,env(safe-area-inset-left))] sm:px-6 max-w-full ${quizInProgress ? 'pt-6 pb-[max(2rem,env(safe-area-inset-bottom))]' : 'pt-24 sm:pt-28 md:pt-32 pb-[max(3rem,env(safe-area-inset-bottom))]'}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/review" element={<Review />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/highlights" element={<Highlights />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!quizInProgress && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <QuizProvider>
      <AppLayout />
    </QuizProvider>
  );
}
