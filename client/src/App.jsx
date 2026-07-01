import { Routes, Route } from 'react-router-dom';
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

function AppLayout() {
  const { quizInProgress } = useQuiz();

  return (
    <div className="min-h-screen relative">
      {!quizInProgress && <AnimatedBackground />}
      <Navbar />
      <main className={`relative z-10 px-4 ${quizInProgress ? 'pt-6 pb-8' : 'pt-24 pb-12'}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/review" element={<Review />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
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
