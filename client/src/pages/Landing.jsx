import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Clock, Trophy, Target, Calendar, BarChart3, Medal, Rocket, Code2, Users, Sparkles } from 'lucide-react';
import { quizApi, leaderboardApi } from '../api/client';
import EventCard from '../components/EventCard';
import Timeline from '../components/Timeline';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const features = [
  {
    icon: Code2,
    title: 'Weekly Quiz',
    description: 'Test your frontend knowledge with 20 timed MCQs every week.',
    details: 'Speed bonuses, instant feedback, and a live leaderboard make every second count.',
  },
  {
    icon: Trophy,
    title: 'Leaderboard',
    description: 'Compete with peers and track your rank in real-time.',
    details: 'Top performers get highlighted recognition and exclusive community badges.',
  },
  {
    icon: Target,
    title: 'Review Mode',
    description: 'Understand every answer with detailed explanations.',
    details: 'Learn from mistakes and strengthen concepts before the next challenge.',
  },
];

export default function Landing() {
  const [quiz, setQuiz] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [quizRes, lbRes] = await Promise.all([
          quizApi.getActive(),
          leaderboardApi.getTop(5),
        ]);
        setQuiz(quizRes.data);
        setLeaderboard(lbRes.data.leaderboard || []);
      } catch {
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center section-padding relative overflow-hidden">
        {/* Floating blobs with new color theme */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl animate-blob-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-blob-delayed-2" />
        <div className="absolute top-40 right-20 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-blob" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-nexa-blue text-sm font-semibold mb-6 border-nexa-blue/20 overflow-hidden group"
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-nexa-blue/15 via-nexa-green/15 to-nexa-blue/15 opacity-70"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            />
            <span className="relative w-2.5 h-2.5 rounded-full bg-nexa-green animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
            <span className="relative">NexaSoul Trivia Challenge</span>
          </motion.div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Stop Watching Tutorials.
            <br />
            <span className="text-gradient drop-shadow-[0_0_30px_rgba(0,224,255,0.3)]">Start Proving Skills.</span>
          </h1>

          <p className="text-nexa-gray text-lg max-w-2xl mx-auto mb-10">
            NexaSoul Weekly Challenge Platform — Week 1 Frontend Trivia. 20 MCQs, 20 minutes,
            speed bonuses, and a live leaderboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link to="/register" className="btn-primary shine-hover text-lg inline-flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Start Challenge
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link to="/leaderboard" className="btn-secondary shine-hover text-lg inline-flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                View Leaderboard
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Quiz Info Cards */}
      {!loading && quiz && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="py-12"
        >
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">This Week&apos;s Challenge</h2>
            <p className="text-nexa-muted">Everything you need to know before you begin</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: 'Questions', value: quiz.questions?.length || 20, icon: Target },
              { label: 'Duration', value: `${quiz.durationMinutes} min`, icon: Clock },
              { label: 'Max Score', value: '300 pts', icon: Trophy },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card p-6 text-center group hover-lift card-shine"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-nexa-blue/20 to-nexa-green/20 flex items-center justify-center mb-3 group-hover:shadow-glow-blue transition-shadow duration-300 group-hover:from-nexa-blue/30 group-hover:to-nexa-green/30">
                  <stat.icon className="w-6 h-6 text-nexa-blue group-hover:text-nexa-green transition-colors duration-300" />
                </div>
                <div className="text-2xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-nexa-muted text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Feature / Event Cards - REMOVED */}

      {/* Journey / Timeline */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="py-12 sm:py-16"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-nexa-green text-xs font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Your Journey
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">From Learner to Builder</h2>
          <p className="text-nexa-muted">A clear path to growth, one challenge at a time</p>
        </motion.div>

        <Timeline />
      </motion.section>

      {/* Scoring Rules */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className="py-12"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Scoring Rules</h2>
          <p className="text-nexa-muted">Know the rules, maximize your score</p>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 sm:p-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { rule: 'Correct Answer', points: '+10 pts', color: 'text-nexa-green', icon: Zap },
              { rule: 'Answer ≤ 5 sec', points: '+5 bonus', color: 'text-nexa-blue', icon: Clock },
              { rule: 'Answer ≤ 10 sec', points: '+3 bonus', color: 'text-nexa-cyan', icon: Calendar },
              { rule: 'Wrong Answer', points: '0 pts', color: 'text-nexa-muted', icon: Medal },
            ].map((item) => (
              <motion.div
                key={item.rule}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-nexa-navy-light/50 rounded-xl p-4 border border-nexa-border hover:border-nexa-blue/30 transition-all duration-300 group hover-lift"
              >
                <div className="w-10 h-10 rounded-lg bg-nexa-navy-soft/50 flex items-center justify-center mb-3 group-hover:bg-nexa-blue/10 transition-colors group-hover:shadow-glow-blue">
                  <item.icon className="w-5 h-5 text-nexa-muted group-hover:text-nexa-blue transition-colors" />
                </div>
                <div className="text-nexa-muted text-sm mb-1">{item.rule}</div>
                <div className={`font-bold text-lg ${item.color}`}>{item.points}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Top Performers - REMOVED (moved to admin) */}

      {/* Final CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-16 sm:py-24"
      >
        <div className="glass-card p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-nexa-gradient" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-nexa-blue/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-nexa-green/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nexa-blue/10 border border-nexa-blue/20 text-nexa-blue text-xs font-semibold mb-4">
              <Users className="w-4 h-4" />
              Join 2500+ learners
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to prove your skills?</h2>
            <p className="text-nexa-muted max-w-xl mx-auto mb-8">
              Register now for this week&apos;s frontend trivia challenge and start your journey with NexaSoul.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Link to="/register" className="btn-primary text-lg inline-flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                Join the Challenge
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
