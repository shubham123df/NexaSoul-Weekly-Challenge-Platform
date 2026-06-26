import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { leaderboardApi } from '../api/client';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function Leaderboard() {
  const [data, setData] = useState({ quizTitle: '', leaderboard: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardApi.getTop(10)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-nexa-blue text-sm font-semibold mb-4"
        >
          🏆 Top Performers
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="bg-nexa-gradient-h bg-clip-text text-transparent">Leaderboard</span>
        </h1>
        <p className="text-nexa-muted">
          {data.quizTitle || 'Top 10 participants'}
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-pulse text-nexa-blue text-lg flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-nexa-blue rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-nexa-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <span className="w-2 h-2 bg-nexa-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            Loading leaderboard...
          </div>
        </div>
      ) : data.leaderboard.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center text-nexa-muted hover-lift"
        >
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-lg font-semibold mb-2">No submissions yet</p>
          <p>Be the first to complete the challenge!</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {data.leaderboard.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 4, scale: 1.01 }}
              className={`glass-card p-4 sm:p-5 flex items-center gap-4 hover-lift card-shine ${
                i < 3 ? 'border-nexa-blue/20' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 transition-all duration-300 hover:scale-110 ${
                i === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-glow-blue' :
                i === 1 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/30' :
                i === 2 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                'bg-nexa-navy-soft border border-nexa-border text-nexa-muted'
              }`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate text-nexa-white hover:text-nexa-blue transition-colors">{entry.name}</div>
                <div className="text-sm text-nexa-muted truncate">{entry.department}</div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-bold text-lg text-nexa-green hover-glow">{entry.totalScore}</div>
                <div className="text-xs text-nexa-muted">{formatTime(entry.timeTakenSeconds)}</div>
                <div className="text-xs text-nexa-muted">{entry.accuracy}% accuracy</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
