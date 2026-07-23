import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, Users, ArrowRight, Sparkles, Award } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  mobile: {
    opacity: 1,
    y: 0,
  },
};

// Mock data for previous weekly highlights
const highlights = [
  {
    week: 1,
    title: 'Frontend Trivia Challenge',
    date: 'July 14 - July 19, 2026',
    winner: 'Coming Soon',
    topScore: '---',
    description: 'Test your HTML, CSS, and JavaScript knowledge with our first weekly challenge.',
    status: 'active',
  },
  {
    week: 2,
    title: 'React Fundamentals',
    date: 'July 8 - July 14, 2026',
    winner: 'TBD',
    topScore: '---',
    description: 'Dive deep into React concepts including hooks, state management, and component lifecycle.',
    status: 'upcoming',
  },
  {
    week: 3,
    title: 'CSS Mastery',
    date: 'July 15 - July 21, 2026',
    winner: 'TBD',
    topScore: '---',
    description: 'Advanced CSS techniques including Flexbox, Grid, animations, and responsive design.',
    status: 'upcoming',
  },
  {
    week: 4,
    title: 'JavaScript ES6+',
    date: 'July 22 - July 28, 2026',
    winner: 'TBD',
    topScore: '---',
    description: 'Modern JavaScript features including async/await, destructuring, and more.',
    status: 'upcoming',
  },
];

export default function Highlights() {
  const [activeFilter, setActiveFilter] = useState('All');
  const visibleHighlights = highlights.filter((highlight) =>
    activeFilter === 'All' ? true : highlight.status === activeFilter.toLowerCase(),
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-semibold mb-4">
          <Sparkles className="w-4 h-4" />
          Archive
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="text-gradient">Previous</span> <span className="text-gradient">Weekly Highlights</span>
        </h1>
        <p className="text-text-100 max-w-2xl mx-auto">
          Explore past challenges, see top performers, and track your progress through the NexaSoul journey.
        </p>
      </motion.section>

      {/* Filter Tabs */}
      <div className="hidden sm:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-2"
        >
          {['All', 'Completed', 'Upcoming'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-accent-cyan text-white shadow-lg shadow-accent-cyan/30'
                  : 'bg-accent-cyan/20 border border-accent-cyan/40 text-accent-cyan hover:bg-accent-cyan hover:text-white hover:border-accent-cyan/60'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>
      </div>
      <div className="sm:hidden flex gap-2 mb-8 overflow-x-auto pb-2">
        {['All', 'Completed', 'Upcoming'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            aria-pressed={activeFilter === filter}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all ${
              activeFilter === filter
                ? 'bg-accent-cyan text-white shadow-lg shadow-accent-cyan/30'
                : 'bg-accent-cyan/20 border border-accent-cyan/40 text-accent-cyan hover:bg-accent-cyan hover:text-white hover:border-accent-cyan/60'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Highlights Grid */}
      <div className="hidden sm:block">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="pb-12"
        >
        <div className="grid md:grid-cols-2 gap-6">
          {visibleHighlights.map((highlight) => (
            <motion.div
              key={highlight.week}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              className="glass-card p-6 hover-lift card-shine"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-accent-cyan" />
                  </div>
                  <div>
                    <div className="text-xs text-text-100 mb-1">Week {highlight.week}</div>
                    <h3 className="font-semibold text-text">{highlight.title}</h3>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    highlight.status === 'active'
                      ? 'bg-accent-green/20 text-accent-green'
                      : highlight.status === 'upcoming'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-text-100/20 text-text-100'
                  }`}
                >
                  {highlight.status}
                </span>
              </div>

              {highlight.status === 'upcoming' ? (
                <p className="text-text-100 text-sm">Challenge details will be announced soon.</p>
              ) : (
                <>
                  <p className="text-text-100 text-sm mb-4 line-clamp-2">{highlight.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-surface rounded-lg p-3 border border-border">
                      <div className="flex items-center gap-2 text-text-100 text-xs mb-1">
                        <Calendar className="w-3 h-3" />
                        Date
                      </div>
                      <div className="text-xs font-medium text-text">{highlight.date}</div>
                    </div>
                    <div className="bg-surface rounded-lg p-3 border border-border">
                      <div className="flex items-center gap-2 text-text-100 text-xs mb-1">
                        <Trophy className="w-3 h-3" />
                        Top Score
                      </div>
                      <div className="text-xs font-medium text-text">{highlight.topScore}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-text-100 text-sm">
                      <Users className="w-4 h-4" />
                      <span>Winner: {highlight.winner}</span>
                    </div>
                    {highlight.status === 'completed' && (
                      <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-accent-green/20 text-accent-green">
                        <Award className="w-3 h-3" />
                        <span>Certificate</span>
                      </div>
                    )}
                    {highlight.status === 'active' && (
                      <Link
                        to="/register"
                        className="text-xs px-4 py-2 rounded-lg bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan hover:text-white transition-all inline-flex items-center gap-1"
                      >
                        Join
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          ))}
          {visibleHighlights.length === 0 && (
            <div className="glass-card p-8 text-center text-text-100 md:col-span-2">
              No completed challenges yet.
            </div>
          )}
        </div>
      </motion.section>
      </div>

      {/* Mobile static version */}
      <div className="sm:hidden pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          {visibleHighlights.map((highlight) => (
            <div
              key={highlight.week}
              className="glass-card p-6 hover-lift card-shine"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center text-white font-bold">
                    {highlight.week}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{highlight.title}</h3>
                    <p className="text-xs text-text-100">{highlight.status === 'upcoming' ? 'Upcoming' : highlight.date}</p>
                  </div>
                </div>
              </div>

              {highlight.status === 'upcoming' ? (
                <p className="text-sm text-text-100">Challenge details will be announced soon.</p>
              ) : (
                <>
                  <p className="text-sm text-text-100 mb-4">{highlight.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-surface rounded-lg p-3 border border-border">
                      <div className="flex items-center gap-2 text-text-100 text-xs mb-1">
                        <Calendar className="w-3 h-3" />
                        Date
                      </div>
                      <div className="text-xs font-medium text-text">{highlight.date}</div>
                    </div>
                    <div className="bg-surface rounded-lg p-3 border border-border">
                      <div className="flex items-center gap-2 text-text-100 text-xs mb-1">
                        <Trophy className="w-3 h-3" />
                        Top Score
                      </div>
                      <div className="text-xs font-medium text-text">{highlight.topScore}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-text-100 text-sm">
                      <Users className="w-4 h-4" />
                      <span>Winner: {highlight.winner}</span>
                    </div>
                    {highlight.status === 'active' && (
                      <Link
                        to="/register"
                        className="text-xs px-4 py-2 rounded-lg bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan hover:text-white transition-all inline-flex items-center gap-1"
                      >
                        Join
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
          {visibleHighlights.length === 0 && (
            <div className="glass-card p-8 text-center text-text-100">
              No completed challenges yet.
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-8"
      >
        <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-green/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-text">Ready for the next challenge?</h2>
            <p className="text-text-100 max-w-xl mx-auto mb-8">
              Join the active weekly challenge and compete with other learners to climb the leaderboard.
            </p>
            <Link to="/register" className="btn-primary text-lg inline-flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Start Challenge
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
