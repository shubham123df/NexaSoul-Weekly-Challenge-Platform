import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

import { leaderboardApi } from '../api/client';

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

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

    <div className="w-full px-4 sm:px-6 lg:px-8">

      <div className="hidden sm:block">
        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          className="text-center mb-8"

        >

        <motion.div

          initial={{ scale: 0.9, opacity: 0 }}

          animate={{ scale: 1, opacity: 1 }}

          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4"

        >

          <Trophy className="w-4 h-4" />
          Top Performers

        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">

          <span className="text-gradient">Leaderboard</span>

        </h1>

        <p className="text-text-100">

          {data.quizTitle || 'Top 10 participants'}

        </p>

      </motion.div>
      </div>

      {/* Mobile static version */}
      <div className="sm:hidden text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
          <Trophy className="w-4 h-4" />
          Top Performers
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="text-gradient">Leaderboard</span>
        </h1>
        <p className="text-text-100">
          {data.quizTitle || 'Top 10 participants'}
        </p>
      </div>



      {loading ? (

        <div className="text-center py-20">

          <div className="animate-pulse text-primary text-lg flex items-center justify-center gap-2">

            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />

            <span className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />

            <span className="w-2 h-2 bg-accent-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />

            Loading leaderboard...

          </div>

        </div>

      ) : data.leaderboard.length === 0 ? (

        <motion.div

          initial={{ opacity: 0, scale: 0.9 }}

          animate={{ opacity: 1, scale: 1 }}

          className="glass-card px-6 py-10 sm:py-12 text-center text-text-100"

        >

          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary" />
          </div>

          <p className="text-lg font-semibold text-text mb-1">Leaderboard is waiting</p>

          <p className="text-sm">Complete this week’s challenge to set the first score.</p>

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
                i < 3 ? 'border-primary/20' : ''
              }`}

            >

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 transition-all duration-300 hover:scale-110 ${
                i === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 shadow-glow' :
                i === 1 ? 'bg-gray-400/20 text-gray-400 border border-gray-400/30' :
                i === 2 ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' :
                'bg-surface border border-border text-text-100'
              }`}>

                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}

              </div>



              <div className="flex-1 min-w-0">

                <div className="font-semibold truncate text-text hover:text-primary transition-colors">{entry.name}</div>
                <div className="text-sm text-text-100 truncate">{entry.department}</div>

              </div>



              <div className="text-right shrink-0">

                <div className="font-bold text-lg text-accent-green hover-glow">{entry.totalScore}</div>

                <div className="text-xs text-text-100">{formatTime(entry.timeTakenSeconds)}</div>

                <div className="text-xs text-text-100">{entry.accuracy}% accuracy</div>

              </div>

            </motion.div>

          ))}

        </div>

      )}

    </div>

  );

}

