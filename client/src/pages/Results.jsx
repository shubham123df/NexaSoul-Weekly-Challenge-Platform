import { useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';

import { fireConfetti } from '../components/Confetti';

import { Award, Sparkles } from 'lucide-react';

import { useQuiz } from '../context/QuizContext';

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

function formatTime(seconds) {

  const m = Math.floor(seconds / 60);

  const s = seconds % 60;

  return `${m}m ${s}s`;

}



export default function Results() {

  const navigate = useNavigate();
  const { exitQuiz } = useQuiz();

  const results = JSON.parse(sessionStorage.getItem('nexasoul_results') || 'null');



  useEffect(() => {

    if (!results) {

      navigate('/');

      return;

    }

    // Ensure navbar is visible on results page
    exitQuiz();

    fireConfetti();

  }, [results, navigate, exitQuiz]);



  if (!results) return null;



  const stats = [

    { label: 'Total Score', value: results.totalScore, unit: 'pts', highlight: true },

    { label: 'Accuracy', value: results.accuracy, unit: '%' },

    { label: 'Time Taken', value: formatTime(results.timeTakenSeconds), unit: '' },

    { label: 'Correct', value: results.correctCount, unit: 'answers', color: 'text-accent-lime' },
    { label: 'Wrong', value: results.wrongCount, unit: 'answers', color: 'text-red-500' },

  ];



  if (results.leaderboardEnabled && results.rank) {

    stats.push({ label: 'Rank', value: `#${results.rank}`, unit: '', highlight: true });

  }



  return (

    <div className="max-w-5xl mx-auto pt-24">
      <div className="grid lg:grid-cols-5 gap-8 items-start">
        
        {/* Left decorative section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block lg:col-span-2 space-y-6"
        >
          <div className="bg-gradient-to-br from-accent-lime/10 to-accent-yellow/10 p-6 rounded-2xl relative overflow-hidden border-2 border-accent-lime/30 shadow-lg shadow-accent-lime/20">
            <motion.div 
              className="absolute -top-10 -right-10 w-40 h-40 bg-accent-lime/30 rounded-full blur-3xl animate-pulse-slow"
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-black mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black font-medium">Accuracy</span>
                  <span className="font-bold text-primary">{results.accuracy}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black font-medium">Time</span>
                  <span className="font-bold text-accent-cyan">{formatTime(results.timeTakenSeconds)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black font-medium">Correct</span>
                  <span className="font-bold text-accent-green">{results.correctCount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black font-medium">Wrong</span>
                  <span className="font-bold text-red-500">{results.wrongCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-accent-cyan/10 p-6 rounded-2xl relative overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
            <motion.div 
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-pulse-slow"
              style={{ animationDelay: '1s' }}
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-black mb-4">Next Steps</h3>
              <ul className="space-y-3">
                {[
                  'Review your answers',
                  'Check the leaderboard',
                  'Share your results',
                  'Join next week\'s challenge'
                ].map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 text-black font-medium text-sm"
                  >
                    <Sparkles className="w-4 h-4 text-accent-lime flex-shrink-0" />
                    {step}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Right results section */}
        <div className="lg:col-span-3">
          <div className="hidden sm:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-8"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-lime/20 to-accent-yellow/20 border-2 border-accent-lime/40 text-black text-sm font-bold mb-4 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Congratulations!
              </motion.div>
              {results.rank && results.rank <= 3 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent-cyan/20 border-2 border-primary/40 text-primary text-sm font-bold mb-4 shadow-md"
                >
                  <Award className="w-4 h-4" />
                  Certificate Awarded!
                </motion.div>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-black">Challenge Complete!</h1>
              <p className="text-black font-medium">Great effort on the NexaSoul Frontend Trivia</p>
            </motion.div>
          </div>

          {/* Mobile static version */}
          <div className="sm:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-lime/20 to-accent-yellow/20 border-2 border-accent-lime/40 text-black text-sm font-bold mb-4 shadow-md">
              <Sparkles className="w-4 h-4" />
              Congratulations!
            </div>
            {results.rank && results.rank <= 3 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent-cyan/20 border-2 border-primary/40 text-primary text-sm font-bold mb-4 shadow-md">
                <Award className="w-4 h-4" />
                Certificate Awarded!
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-black">Challenge Complete!</h1>
            <p className="text-black font-medium">Great effort on the NexaSoul Frontend Trivia</p>
          </div>

          <div className="hidden sm:block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 mb-6 rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20 hover-lift"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className={`bg-white rounded-xl p-4 border-2 border-primary/20 text-center hover:border-primary/50 transition-all duration-300 card-shine shadow-md ${
                      stat.highlight ? 'sm:col-span-1 border-primary/40' : ''
                    }`}
                  >
                    <div className="text-black font-semibold text-xs sm:text-sm mb-1">{stat.label}</div>
                    <div className={`text-xl sm:text-2xl font-bold ${stat.color || (stat.highlight ? 'text-gradient' : 'text-black')}`}>
                      {stat.value}
                      {stat.unit && <span className="text-sm text-black ml-1">{stat.unit}</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Mobile static stats */}
          <div className="sm:hidden bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 mb-6 rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20 hover-lift">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <div key={stat.label} className="bg-white rounded-lg p-4 border-2 border-primary/20 shadow-md">
                  <div className="text-black font-semibold text-xs sm:text-sm mb-1">{stat.label}</div>
                  <div className={`text-xl sm:text-2xl font-bold ${stat.color || (stat.highlight ? 'text-gradient' : 'text-black')}`}>
                    {stat.value}
                    {stat.unit && <span className="text-sm text-black ml-1">{stat.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden sm:block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/review" className="btn-primary text-center hover-lift">
                Why is this answer correct?
              </Link>
              <Link to="/leaderboard" className="btn-secondary text-center hover-lift">
                View Leaderboard
              </Link>
              <Link to="/" className="btn-secondary text-center hover-lift">
                Back to Home
              </Link>
            </motion.div>
          </div>

          {/* Mobile static buttons */}
          <div className="sm:hidden flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/review" className="btn-primary text-center hover-lift">
              Why is this answer correct?
            </Link>
            <Link to="/leaderboard" className="btn-secondary text-center hover-lift">
              View Leaderboard
            </Link>
            <Link to="/" className="btn-secondary text-center hover-lift">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>

  );

}

