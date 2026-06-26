import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fireConfetti } from '../components/Confetti';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function Results() {
  const navigate = useNavigate();
  const results = JSON.parse(sessionStorage.getItem('nexasoul_results') || 'null');

  useEffect(() => {
    if (!results) {
      navigate('/');
      return;
    }
    fireConfetti();
  }, [results, navigate]);

  if (!results) return null;

  const stats = [
    { label: 'Total Score', value: results.totalScore, unit: 'pts', highlight: true },
    { label: 'Accuracy', value: results.accuracy, unit: '%' },
    { label: 'Time Taken', value: formatTime(results.timeTakenSeconds), unit: '' },
    { label: 'Correct', value: results.correctCount, unit: 'answers', color: 'text-nexa-green' },
    { label: 'Wrong', value: results.wrongCount, unit: 'answers', color: 'text-red-400' },
  ];

  if (results.leaderboardEnabled && results.rank) {
    stats.push({ label: 'Rank', value: `#${results.rank}`, unit: '', highlight: true });
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-nexa-gradient flex items-center justify-center text-3xl hover:scale-110 transition-transform duration-300 hover-glow"
        >
          🎉
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-nexa-green text-sm font-semibold mb-4"
        >
          ✨ Congratulations!
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Challenge Complete!</h1>
        <p className="text-nexa-muted">Great effort on the NexaSoul Frontend Trivia</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 sm:p-8 mb-8 hover-lift"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className={`bg-nexa-navy-light/50 rounded-xl p-4 border border-nexa-border text-center hover:border-nexa-blue/30 transition-all duration-300 card-shine ${
                stat.highlight ? 'sm:col-span-1 border-nexa-blue/30' : ''
              }`}
            >
              <div className="text-nexa-muted text-xs sm:text-sm mb-1">{stat.label}</div>
              <div className={`text-xl sm:text-2xl font-bold ${stat.color || (stat.highlight ? 'text-gradient' : 'text-nexa-white')}`}>
                {stat.value}
                {stat.unit && <span className="text-sm text-nexa-muted ml-1">{stat.unit}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

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
  );
}
