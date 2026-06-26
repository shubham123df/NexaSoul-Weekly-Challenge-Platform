import { Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
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

export default function App() {
  return (
    <QuizProvider>
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <Navbar />
        <main className="pt-24 pb-12 px-4 relative z-10">
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
        <Footer />
      </div>
    </QuizProvider>
  );
}
