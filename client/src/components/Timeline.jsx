import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BookOpen, Hammer, Users, Trophy, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: BookOpen,
    title: 'Learning',
    description: 'Master modern frontend concepts through curated weekly content and hands-on examples.',
  },
  {
    icon: Hammer,
    title: 'Building',
    description: 'Apply what you learn by building real projects and solving practical MCQ challenges.',
  },
  {
    icon: Users,
    title: 'Collaborating',
    description: 'Connect with peers, share solutions, and grow together in a community-driven environment.',
  },
  {
    icon: Trophy,
    title: 'Showcasing',
    description: 'Climb the live leaderboard and showcase your skills to the NexaSoul ecosystem.',
  },
  {
    icon: TrendingUp,
    title: 'Growth',
    description: 'Unlock opportunities, internships, and recognition as you progress through the cohort.',
  },
];

export default function Timeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className="relative">
      {/* Connecting line */}
      <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-nexa-border sm:-translate-x-1/2 hidden sm:block" />

      <div className="space-y-12 sm:space-y-16">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isLeft = i % 2 === 0;

          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative flex items-center gap-6 sm:gap-0 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
            >
              {/* Node */}
              <div className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.15, type: 'spring' }}
                  className="w-12 h-12 rounded-full bg-nexa-navy-light border-2 border-nexa-blue/50 flex items-center justify-center shadow-glow-blue"
                >
                  <Icon className="w-5 h-5 text-nexa-blue" />
                </motion.div>
              </div>

              {/* Content */}
              <div className={`w-full sm:w-[calc(50%-3rem)] pl-20 sm:pl-0 ${isLeft ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 sm:text-left'}`}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="glass-card p-5 inline-block text-left"
                >
                  <h3 className="text-lg font-bold text-nexa-white mb-1">{step.title}</h3>
                  <p className="text-nexa-muted text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress fill line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-nexa-blue via-nexa-cyan to-nexa-green origin-top sm:-translate-x-1/2 hidden sm:block"
      />
    </div>
  );
}
