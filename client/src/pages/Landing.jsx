import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';

import { Zap, Clock, Trophy, Target, Calendar, BarChart3, Medal, Code2, Users, Sparkles, Award } from 'lucide-react';

import { quizApi, leaderboardApi } from '../api/client';

import EventCard from '../components/EventCard';


import WeeklyPoster from '../components/WeeklyPoster';

import RotatingText from '../components/RotatingText';

import Hero3DAnimation from '../components/Hero3DAnimation';



const containerVariants = {

  hidden: { opacity: 0 },

  visible: {

    opacity: 1,

    transition: { 

      staggerChildren: 0.12,

      delayChildren: 0.1,

    },

  },

};



const itemVariants = {

  hidden: { opacity: 0, y: 30, scale: 0.95 },

  visible: { 

    opacity: 1, 

    y: 0, 

    scale: 1,

    transition: { 

      duration: 0.6,

      ease: [0.22, 1, 0.36, 1],

    },

  },

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

  {

    icon: Award,

    title: 'Certificates',

    description: 'Winners receive official NexaSoul certificates for top performance.',

    details: 'Earn recognition for your skills with certificates you can share on LinkedIn and your portfolio.',

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

    <div className="w-full">

      {/* Hero Section - Premium split-screen layout */}

      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 via-purple-50/20 to-cyan-50/30 w-full min-h-screen flex items-center" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}>

        {/* Animated decorative circles */}
        <motion.div 
          className="absolute top-8 right-8 sm:top-12 sm:right-16 lg:top-20 lg:right-32 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-accent-yellow opacity-80 blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 0.6, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div 
          className="absolute bottom-12 right-4 sm:bottom-20 sm:right-12 w-32 h-32 sm:w-40 sm:h-40 lg:w-52 lg:h-52 rounded-full bg-primary opacity-60 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.4, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />

        {/* Additional animated elements */}
        <motion.div 
          className="absolute top-1/4 left-8 w-16 h-16 rounded-full bg-accent-lime opacity-40 blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div 
          className="absolute bottom-1/4 left-16 w-12 h-12 rounded-full bg-accent-blue opacity-50 blur-lg"
          animate={{
            y: [0, 15, 0],
            x: [0, -8, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* Subtle decorative marks (doodles) */}
        <motion.div 
          className="absolute top-16 left-6 text-accent-yellow text-2xl opacity-40"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >⊕</motion.div>
        <motion.div 
          className="absolute bottom-32 left-10 text-primary text-xl opacity-30"
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >✕</motion.div>
        
        {/* Additional blue 'x' marks */}
        <motion.div 
          className="absolute top-20 right-20 text-accent-blue text-3xl opacity-50"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >✕</motion.div>
        <motion.div 
          className="absolute bottom-20 right-32 text-accent-blue text-2xl opacity-40"
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >✕</motion.div>
        
        {/* Pink 'x' mark */}
        <motion.div 
          className="absolute bottom-16 left-32 text-primary text-2xl opacity-35"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >✕</motion.div>

        {/* Main content - Split-screen layout */}

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column - Content */}
            <div className="text-left space-y-8">
              
              {/* Top badge - "IT'S GIVING MAIN CHARACTER ENERGY" */}

              <motion.div

                initial={{ scale: 0.85, opacity: 0 }}

                animate={{ scale: 1, opacity: 1 }}

                transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}

                className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-yellow border-2 border-accent-yellow text-secondary text-sm font-black overflow-hidden group shadow-badge"

              >

                <span className="relative">⚡</span>

                <span className="relative font-display">IT'S GIVING MAIN CHARACTER ENERGY</span>

              </motion.div>

              {/* Main heading */}

              <motion.div

                initial={{ opacity: 0, y: 30 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}

              >

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-2 leading-tight tracking-tight text-secondary font-display">

                  Welcome to

                </h1>

                <motion.h1 
                  className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight text-accent-blue font-display"
                >
                  {"Srujana".split("").map((letter, index) => (
                    <motion.span
                      key={index}
                      className="inline-block"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: [20, 0, 0, 20]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: [0.22, 1, 0.36, 1],
                        delay: index * 0.2,
                        times: [0, 0.15, 0.85, 1]
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.h1>

              </motion.div>

              {/* Subheading */}

              <motion.p

                initial={{ opacity: 0, y: 20 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}

                className="text-text text-lg sm:text-xl max-w-xl leading-relaxed"

              >

                NexaSoul's weekly online campaign for Frontend × Full Stack devs who actually touch grass... online.

              </motion.p>

              {/* Description */}

              <motion.p

                initial={{ opacity: 0, y: 20 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}

                className="text-text font-semibold text-base sm:text-lg"

              >

                Week 2 drops a <span className="font-black text-secondary">20-question</span> trivia blitz — <span className="font-black text-secondary">20 minutes</span>, speed

                bonuses, and absolutely zero timer peeking. Lock in. No cap.

              </motion.p>

              {/* CTA Buttons */}

              <motion.div

                initial={{ opacity: 0, y: 20 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}

                className="flex flex-col sm:flex-row gap-4"

              >

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>

                  <Link to="/register" className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-full bg-gradient-to-r from-primary to-accent-blue text-white shadow-lg hover:shadow-xl transition-all duration-300">

                    Join This Week's Challenge →

                  </Link>

                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>

                  <Link to="/leaderboard" className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-full bg-white text-secondary border-2 border-secondary shadow-lg hover:shadow-xl transition-all duration-300">

                    View Leaderboard →

                  </Link>

                </motion.div>

              </motion.div>

            </div>

            {/* Right Column - Hero Orb Visual */}

            <div className="flex justify-center lg:justify-end relative">

              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                animate={{ x: [0, 15, 0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative group"
              >

                {/* Dark rounded card */}
                <div className="relative w-64 sm:w-80 lg:w-96 aspect-square p-4 sm:p-8 rounded-3xl bg-gradient-to-br from-accent-darkPanels via-gray-800 to-accent-darkPanels overflow-hidden">

                  {/* Radial glow behind outermost ring - matching website theme */}
                  <div 
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)'
                    }}
                  />

                  {/* Concentric rings container */}
                  <div className="relative w-full h-full flex items-center justify-center">

                    {/* Ring 1 (largest) - blue border with glow */}
                    <div 
                      className="absolute rounded-full border-2 border-primary"
                      style={{
                        width: '85%',
                        height: '85%',
                        boxShadow: '0 0 25px rgba(59, 130, 246, 0.4), inset 0 0 15px rgba(59, 130, 246, 0.15)'
                      }}
                    />

                    {/* Ring 2 (mid) - hairline with inner shadow */}
                    <div 
                      className="absolute rounded-full border border-accent-blue"
                      style={{
                        width: '60%',
                        height: '60%',
                        boxShadow: 'inset 0 0 12px rgba(0, 0, 0, 0.4)'
                      }}
                    />

                    {/* Ring 3 (inner) - circular ring (not square) */}
                    <div 
                      className="absolute rounded-full border-2 border-accent-lime flex items-center justify-center"
                      style={{
                        width: '40%',
                        height: '40%',
                        boxShadow: '0 0 15px rgba(132, 204, 22, 0.3), inset 0 0 10px rgba(132, 204, 22, 0.1)'
                      }}
                    >
                      {/* White circular disc behind logo */}
                      <div 
                        className="absolute rounded-full bg-white"
                        style={{
                          width: '85%',
                          height: '85%',
                          opacity: '0.95'
                        }}
                      />

                      {/* NexaSoul logo */}
                      <div className="relative z-10 flex items-center justify-center">
                        <img 
                          src="/nexasoul-logo.png" 
                          alt="NexaSoul Logo" 
                          className="w-14 h-14 object-contain"
                        />
                      </div>
                    </div>

                    {/* Confetti elements - matching website theme colors */}
                    {/* Lime X - top-left on outer ring */}
                    <motion.div 
                      className="absolute text-accent-lime text-2xl font-bold"
                      style={{ top: '12%', left: '10%' }}
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >✕</motion.div>

                    {/* Yellow triangle - upper-right on mid ring */}
                    <motion.div 
                      className="absolute text-accent-yellow text-xl"
                      style={{ top: '15%', right: '15%' }}
                      animate={{ rotate: [0, -360] }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    >△</motion.div>

                    {/* Blue dot - mid-left */}
                    <motion.div 
                      className="absolute rounded-full bg-primary"
                      style={{ top: '42%', left: '6%', width: '10px', height: '10px' }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                    {/* Small lime dot - mid-right on outer ring */}
                    <motion.div 
                      className="absolute rounded-full bg-accent-lime"
                      style={{ top: '40%', right: '8%', width: '8px', height: '8px' }}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                />

                    {/* Purple dot - bottom-right on mid ring */}
                    <motion.div 
                      className="absolute rounded-full bg-purple-500"
                      style={{ bottom: '22%', right: '18%', width: '9px', height: '9px' }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />

                    {/* Blue X - near inner ring */}
                    <motion.div 
                      className="absolute text-primary text-lg font-bold"
                      style={{ bottom: '30%', right: '28%' }}
                      animate={{ rotate: [360, 0] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >✕</motion.div>

                  </div>

                  {/* Sticker labels - matching website theme */}
                  {/* Top-right: BUILT DIFFERENT */}
                  <motion.div 
                    className="absolute -top-2 -right-2 px-4 py-1.5 rounded-full bg-accent-yellow text-secondary font-black text-xs"
                    style={{ transform: 'rotate(-4deg)' }}
                    animate={{ rotate: [-4, 0, -4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    BUILT DIFFERENT
                  </motion.div>

                  {/* Bottom-left: WEEK 02 · LIVE */}
                  <motion.div 
                    className="absolute -bottom-2 -left-2 px-4 py-1.5 rounded-full bg-primary text-white font-black text-xs"
                    style={{ transform: 'rotate(3deg)' }}
                    animate={{ rotate: [3, 0, 3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  >
                    WEEK 02 · LIVE
                  </motion.div>

                </div>

              </motion.div>

            </div>

          </div>

        </div>

      </section>



      {/* Quiz Info Cards - with purple theme, full width */}

      {!loading && quiz && (

        <motion.section

          initial="hidden"

          whileInView="visible"

          viewport={{ once: true, margin: '-50px' }}

          variants={containerVariants}

          className="py-8 bg-gradient-to-br from-purple-50 via-white to-pink-50 w-full"

        >

          <div className="w-full px-4 sm:px-6 lg:px-8">

          <motion.div variants={itemVariants} className="text-center mb-4">

            <h2 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">This Week&apos;s Challenge</h2>

            <p className="text-purple-700 text-base">Everything you need to know before you begin</p>

          </motion.div>




          <div className="grid md:grid-cols-4 gap-5">

            {[

              { label: 'Questions', value: quiz.questions?.length || 20, icon: Target, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-100' },

              { label: 'Duration', value: `${quiz.durationMinutes} min`, icon: Clock, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-100' },

              { label: 'Max Score', value: '300 pts', icon: Trophy, color: 'from-fuchsia-500 to-fuchsia-600', bg: 'bg-fuchsia-100' },

              { label: 'Certificate', value: 'For Winners', icon: Award, color: 'from-violet-500 to-violet-600', bg: 'bg-violet-100' },

            ].map((stat, i) => (

              <motion.div

                key={stat.label}

                variants={itemVariants}

                whileHover={{ y: -6, scale: 1.02 }}

                className="bg-white p-5 text-center group hover-lift card-shine rounded-2xl shadow-lg border-2 border-purple-200 hover:border-purple-400 transition-all duration-300"

              >

                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow duration-300`}>

                  <stat.icon className="w-6 h-6 text-white" />

                </div>

                <div className="text-2xl font-bold text-purple-900 mb-1">{stat.value}</div>

                <div className="text-purple-600 text-sm font-medium">{stat.label}</div>

              </motion.div>

            ))}

            </div>

          </div>

        </motion.section>

      )}



      {/* Weekly Challenge Poster Section - with teal theme, full width */}

      <motion.section

        initial="hidden"

        whileInView="visible"

        viewport={{ once: true, margin: '-50px' }}

        variants={containerVariants}

        className="py-8 bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 w-full"

      >

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div variants={itemVariants} className="text-center mb-4">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 border border-teal-300 text-teal-700 text-xs font-semibold mb-4">

            <Sparkles className="w-4 h-4" />

            Featured Challenge

          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Week 2: Frontend Trivia</h2>

          <p className="text-teal-700 text-base">Test your frontend development knowledge</p>

        </motion.div>



        <motion.div variants={itemVariants}>

          <WeeklyPoster posterUrl={quiz?.posterUrl} />

        </motion.div>

        </div>

      </motion.section>



      {/* Feature / Event Cards - REMOVED */}






      {/* Scoring Rules - with orange theme, full width */}

      <motion.section

        initial="hidden"

        whileInView="visible"

        viewport={{ once: true, margin: '-50px' }}

        variants={containerVariants}

        className="py-8 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 w-full"

      >

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div variants={itemVariants} className="text-center mb-4">

            <h2 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Scoring Rules</h2>

            <p className="text-orange-700 text-base">Know the rules, maximize your score</p>

          </motion.div>




          <motion.div variants={itemVariants} className="bg-white p-5 sm:p-6 rounded-2xl shadow-xl border-2 border-orange-200">

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {[

              { rule: 'Correct Answer', points: '+10 pts', color: 'from-green-500 to-green-600', bg: 'bg-green-100', text: 'text-green-700', icon: Zap },

              { rule: 'Answer ≤ 5 sec', points: '+5 bonus', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-100', text: 'text-orange-700', icon: Clock },

              { rule: 'Answer ≤ 10 sec', points: '+3 bonus', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-100', text: 'text-amber-700', icon: Calendar },

              { rule: 'Wrong Answer', points: '0 pts', color: 'from-gray-400 to-gray-500', bg: 'bg-gray-100', text: 'text-gray-600', icon: Medal },

            ].map((item) => (

              <motion.div

                key={item.rule}

                whileHover={{ y: -4, scale: 1.02 }}

                className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 group hover-lift"

              >

                <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mb-3 group-hover:shadow-lg transition-all duration-300`}>

                  <item.icon className={`w-5 h-5 ${item.text}`} />

                </div>

                <div className={`text-sm mb-1 ${item.text} font-medium`}>{item.rule}</div>

                <div className={`font-bold text-lg bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>{item.points}</div>

              </motion.div>

            ))}

            </div>

          </motion.div>

        </div>

      </motion.section>



      {/* Top Performers - REMOVED (moved to admin) */}



      {/* Final CTA - with indigo theme, full width */}

      <motion.section

        initial={{ opacity: 0, y: 30 }}

        whileInView={{ opacity: 1, y: 0 }}

        viewport={{ once: true }}

        className="py-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 w-full"

      >

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 text-center relative overflow-hidden rounded-3xl border border-white/20">

          <motion.div 
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400"
            animate={{
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ backgroundSize: '200% auto' }}
          />

          <motion.div 
            className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <motion.div 
            className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />



          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold mb-4">

              <Users className="w-4 h-4" />

              Join 2500+ learners

            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight text-white">Ready to prove your skills?</h2>

            <p className="text-white/90 max-w-xl mx-auto mb-6">

              Register now for this week&apos;s frontend trivia challenge and start your journey with NexaSoul.

            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="inline-block">

              <Link to="/register" className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2 hover:bg-yellow-400 transition-colors duration-300 shadow-2xl">

                Join the Challenge

              </Link>

            </motion.div>

            </div>

          </div>

        </div>

      </motion.section>

    </div>

  );

}

