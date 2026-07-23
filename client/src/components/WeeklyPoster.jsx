import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Trophy, Zap, Sparkles } from 'lucide-react';

const posterData = {
  week: 2,
  title: 'Frontend Trivia Challenge',
  description: 'Put your HTML, CSS, and JavaScript knowledge to the test with our second weekly challenge. Speed matters, accuracy counts, and the leaderboard awaits.',
  startDate: 'July 21, 2026',
  endDate: 'July 26, 2026',
  duration: '20 minutes',
  questions: '20 MCQs',
  maxScore: '300 pts',
  participants: '2500+',
  theme: 'Frontend Development',
  difficulty: 'Intermediate',
};

export default function WeeklyPoster({ posterUrl, compact = false }) {
  // Convert Google Drive sharing link to direct image link
  const getDirectImageUrl = (url) => {
    if (!url) return url;
    // Check if it's a Google Drive sharing link
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      const fileId = driveMatch[1];
      // Try multiple Google Drive direct link formats
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
    return url;
  };

  const directPosterUrl = getDirectImageUrl(posterUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="glass-card p-1 rounded-3xl overflow-hidden hover-lift">
        <div className="relative bg-gradient-to-br from-surface/90 to-background-50/95 rounded-2xl p-4 sm:p-8 overflow-hidden">
          {/* Decorative animated background */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-accent-purple/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }} />

          <div className="relative z-10">
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-accent-purple/20 border border-primary/30"
              >
                <Sparkles className="w-4 h-4 text-accent-cyan" />
                <span className="text-xs font-semibold text-accent-cyan">Week {posterData.week} Challenge</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-green/20 border border-accent-green/30"
              >
                <Zap className="w-4 h-4 text-accent-green" />
                <span className="text-xs font-semibold text-black">{posterData.difficulty}</span>
              </motion.div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Poster Visual */}
              <div className="w-full lg:w-2/5">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/25 via-accent-purple/20 to-accent-cyan/25 border border-border/50 overflow-hidden group"
                >
                  {directPosterUrl ? (
                    <img
                      src={directPosterUrl}
                      alt="Weekly Challenge Poster"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        console.error('Poster image failed to load:', directPosterUrl);
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent-purple/30 animate-gradient-x" style={{ backgroundSize: '200% 200%' }} />
                  )}

                  {/* Fallback content when no image */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center ${directPosterUrl ? 'hidden' : ''}`}>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center mb-4 shadow-glow"
                    >
                      <Calendar className="w-10 h-10 text-white" />
                    </motion.div>
                    <div className="text-4xl font-bold text-gradient mb-2">W{posterData.week}</div>
                    <div className="text-sm text-text-100">{posterData.theme}</div>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
                  <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-accent-purple/50 rounded-tr-lg" />
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-accent-cyan/50 rounded-bl-lg" />
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />
                </motion.div>
              </div>

              {/* Poster Details */}
              <div className="w-full lg:w-3/5 space-y-5">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-black mb-3">{posterData.title}</h3>
                  <p className="text-black text-sm sm:text-base leading-relaxed">{posterData.description}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: Clock, label: 'Duration', value: posterData.duration, color: 'text-primary' },
                    { icon: Trophy, label: 'Questions', value: posterData.questions, color: 'text-primary' },
                    { icon: Zap, label: 'Max Score', value: posterData.maxScore, color: 'text-primary' },
                    { icon: Users, label: 'Players', value: posterData.participants, color: 'text-primary' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="bg-surface/60 rounded-xl p-3 border border-border/50 hover:border-primary/30 transition-all duration-300"
                    >
                      <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                      <div className="text-xs text-black mb-1">{stat.label}</div>
                      <div className="font-semibold text-black text-sm">{stat.value}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-primary/10 to-accent-purple/10 rounded-xl p-4 border border-border/50">
                  <div className="flex-1">
                    <div className="text-xs text-black mb-1">Challenge Period</div>
                    <div className="font-semibold text-black text-sm">
                      {posterData.startDate} → {posterData.endDate}
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center shadow-glow"
                  >
                    <Calendar className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
