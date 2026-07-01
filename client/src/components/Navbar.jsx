import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import LogoBar from './LogoBar';
import { useQuiz } from '../context/QuizContext';
import useScrollDirection from '../hooks/useScrollDirection';

const links = [
  { to: '/', label: 'Home' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { quizInProgress } = useQuiz();
  const scrollVisible = useScrollDirection(72);

  if (quizInProgress) return null;

  const isVisible = scrollVisible || mobileOpen;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : -120,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none"
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <nav className="max-w-6xl mx-auto glass-card px-4 sm:px-6 py-3 flex items-center justify-between pointer-events-auto">
        <LogoBar />

        <div className="hidden sm:flex items-center gap-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive ? 'text-nexa-white' : 'text-nexa-muted hover:text-nexa-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-indigo-500/15 border border-indigo-400/25 rounded-lg"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/register" className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex">
            Join Challenge
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden p-2 rounded-lg text-nexa-white hover:bg-nexa-navy-light transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden max-w-6xl mx-auto mt-2 pointer-events-auto"
          >
            <div className="glass-card p-4 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-indigo-500/15 text-nexa-white border border-indigo-400/25'
                      : 'text-nexa-muted hover:bg-nexa-navy-light hover:text-nexa-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="btn-primary text-center block mt-2"
              >
                Join Challenge
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
