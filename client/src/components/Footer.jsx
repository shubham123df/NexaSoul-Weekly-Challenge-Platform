import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Home, Trophy } from 'lucide-react';
import LogoBar from './LogoBar';
import { useQuiz } from '../context/QuizContext';

function InstagramIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function WhatsAppIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0-1 0v.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 0-1H9z" />
      <path d="M14.5 10a.5.5 0 0 0-1 0v.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 0-1h-.5z" />
      <path d="M9.5 15a.5.5 0 0 0-1 0v.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 0-1h-.5z" />
      <path d="M14.5 15a.5.5 0 0 0-1 0v.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 0-1h-.5z" />
    </svg>
  );
}

const socialLinks = [
  {
    name: 'Website',
    href: 'https://nexasoul.vercel.app/',
    icon: Globe,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/nexasoul_25/',
    icon: InstagramIcon,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/nexasoul/',
    icon: LinkedInIcon,
  },
  {
    name: 'WhatsApp',
    href: 'https://chat.whatsapp.com/LsqljE6IVEjIBGSB04wpHq',
    icon: WhatsAppIcon,
  },
];

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/register', label: 'Join Challenge' },
];

export default function Footer() {
  const { quizInProgress } = useQuiz();

  // Hide footer during active quiz
  if (quizInProgress) return null;

  return (
    <footer className="relative mt-12 pt-8 pb-4 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 w-full">
      {/* Animated top gradient line */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400"
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

      {/* Animated background glows */}
      <motion.div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-3xl pointer-events-none"
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
        className="absolute bottom-0 left-0 w-[400px] h-[200px] bg-accent-lime/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      <motion.div 
        className="absolute bottom-0 right-0 w-[400px] h-[200px] bg-accent-blue/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.25, 0.1]
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Logo row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center mb-4"
        >
          <LogoBar size="lg" />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center mb-4"
        >
          <p className="text-white/90 text-xs sm:text-sm mb-1">
            Transforming learners into professional developers.
          </p>
          <p className="text-white font-bold tracking-[0.2em] text-sm sm:text-base bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            CODE. CONNECT. CONQUER.
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 border border-white/20 hover:border-white/40"
            >
              {link.icon && <link.icon className="w-3.5 h-3.5" />}
              {link.label}
            </Link>
          ))}
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 w-full"
        >
          {socialLinks.map((social) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:border-yellow-400/50 hover:bg-yellow-400/20 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <social.icon className="w-4 h-4 text-white/80 group-hover:text-yellow-400 transition-colors" />
              <span className="text-xs text-white/80 group-hover:text-white transition-colors">
                {social.name}
              </span>
            </motion.a>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <div className="pt-4 border-t border-white/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-white/70">
            <p className="text-center sm:text-left">© 2026 NexaSoul. All rights reserved.</p>
            <p className="text-center">Developed By: Shubham Kumar Gupta</p>
            <p className="flex items-center gap-1 text-center sm:text-right">
              Made with <motion.span 
                className="text-pink-400 text-xs"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >♥</motion.span> Chandigarh University
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
