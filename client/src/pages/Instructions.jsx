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

    color: 'text-primary',

  },

  {

    icon: Target,

    title: '20 MCQs',

    description: 'Each question has one correct answer. Choose wisely — there is no negative marking.',

    color: 'text-accent-green',

  },

  {

    icon: Zap,

    title: 'Speed Bonuses',

    description: 'Answer within 5 seconds for +5 bonus or within 10 seconds for +3 bonus.',

    color: 'text-accent-orange',

  },

  {

    icon: Shield,

    title: 'One Attempt Per Email',

    description: 'Your email is tied to this week\'s quiz. Once submitted, you cannot retake it.',

    color: 'text-accent-purple',

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

    sessionStorage.removeItem('nexasoul_quiz_state');
    startQuiz();

    navigate('/quiz');

  };



  return (

    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-5 gap-8 items-start">
        
        {/* Left decorative section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block lg:col-span-2 space-y-6"
        >
          <div className="bg-gradient-to-br from-primary/10 to-accent-cyan/10 p-6 rounded-2xl relative overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
            <motion.div 
              className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-pulse-slow"
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-black mb-4">Player Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black font-medium">Name</span>
                  <span className="font-bold text-primary">{registration?.name || 'Challenger'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black font-medium">UID</span>
                  <span className="font-bold text-accent-cyan">{registration?.uid || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black font-medium">Department</span>
                  <span className="font-bold text-accent-green">{registration?.department || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent-lime/10 to-accent-yellow/10 p-6 rounded-2xl relative overflow-hidden border-2 border-accent-lime/30 shadow-lg shadow-accent-lime/20">
            <motion.div 
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-lime/30 rounded-full blur-3xl animate-pulse-slow"
              style={{ animationDelay: '1s' }}
            />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-black mb-4">Quick Tips</h3>
              <ul className="space-y-3">
                {[
                  'Read each question carefully',
                  'Manage your time wisely',
                  'Don\'t refresh the page',
                  'Stay focused and calm'
                ].map((tip, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 text-black font-medium text-sm"
                  >
                    <Shield className="w-4 h-4 text-accent-green flex-shrink-0" />
                    {tip}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Right instructions section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 sm:p-8 rounded-3xl border-2 border-primary/30 shadow-xl shadow-primary/20 relative overflow-hidden">
            {/* Animated background accents */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-green/20 rounded-full blur-3xl animate-pulse-slow" />

            <div className="relative z-10">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-green/20 to-accent-cyan/20 border-2 border-accent-green/40 text-black text-sm font-bold mb-4 shadow-md"
                >
                  <Shield className="w-4 h-4" />
                  Ready to Begin
                </motion.div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-black">
                  Quiz <span className="text-gradient">Instructions</span>
                </h1>
                <p className="text-black font-medium">
                  Hi <span className="text-primary font-bold">{registration?.name || 'Challenger'}</span>, read the rules before you start.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {instructions.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 6, scale: 1.01 }}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 group shadow-md"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center shrink-0 group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300 border-2 border-primary/30">
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-black mb-1">{item.title}</h3>
                      <p className="text-black font-medium text-sm leading-relaxed">{item.description}</p>
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
          </div>
        </motion.div>
      </div>
    </div>

  );

}

