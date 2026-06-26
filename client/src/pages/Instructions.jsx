import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Target, Zap, Shield, AlertCircle, Play } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

const instructions = [
  {
    icon: Clock,
    title: '20 Minutes Only',
    description: 'The quiz auto-submits once the timer hits zero, so keep an eye on the clock.',
    color: 'text-nexa-blue',
  },
  {
    icon: Target,
    title: '20 MCQs',
    description: 'Each question has one correct answer. Choose wisely — there is no negative marking.',
    color: 'text-nexa-green',
  },
  {
    icon: Zap,
    title: 'Speed Bonuses',
    description: 'Answer within 5 seconds for +5 bonus or within 10 seconds for +3 bonus.',
    color: 'text-yellow-400',
  },
  {
    icon: Shield,
    title: 'One Attempt Per Email',
    description: 'Your email is tied to this week\'s quiz. Once submitted, you cannot retake it.',
    color: 'text-purple-400',
  },
  {
    icon: AlertCircle,
    title: 'Stay Focused',
    description: 'Do not refresh or leave the page during the quiz — your progress may be lost.',
    color: 'text-red-400',
  },
];

export default function Instructions() {
  const navigate = useNavigate();
  const { startQuiz } = useQuiz();
  const registration = JSON.parse(sessionStorage.getItem('nexasoul_registration') || 'null');

  useEffect(() => {
    if (!registration) {
      navigate('/register');
    }
  }, [navigate, registration]);

  const handleStart = () => {
    startQuiz();
    navigate('/quiz');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 sm:p-10 relative overflow-hidden"
      >
        {/* Animated background accents */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-nexa-blue/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-nexa-green/10 rounded-full blur-3xl animate-pulse-slow" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-nexa-green text-sm font-semibold mb-4"
            >
              <Shield className="w-4 h-4" />
              Ready to Begin
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Quiz <span className="text-gradient">Instructions</span>
            </h1>
            <p className="text-nexa-muted">
              Hi <span className="text-nexa-white font-semibold">{registration?.name || 'Challenger'}</span>, read the rules before you start.
            </p>
          </div>

          <div className="space-y-4 mb-10">
            {instructions.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 6, scale: 1.01 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-nexa-navy-light/40 border border-nexa-border hover:border-nexa-blue/30 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-nexa-blue/15 to-nexa-green/15 flex items-center justify-center shrink-0 group-hover:shadow-glow-blue transition-shadow duration-300">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-nexa-white mb-1">{item.title}</h3>
                  <p className="text-nexa-muted text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              className="btn-primary text-lg inline-flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              I Agree — Start Quiz
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/register')}
              className="btn-secondary text-lg inline-flex items-center justify-center gap-2"
            >
              Go Back
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
