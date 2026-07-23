import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar, X as CloseIcon } from 'lucide-react';
import LogoBar from './LogoBar';
import { useQuiz } from '../context/QuizContext';
import useScrollDirection from '../hooks/useScrollDirection';
import { useIsMobile } from '../hooks/useMediaQuery';
import { quizApi } from '../api/client';

const links = [
  { to: '/', label: 'Home' },
  { to: '/highlights', label: 'Highlights' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [posterOpen, setPosterOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const { quizInProgress } = useQuiz();
  const scrollVisible = useScrollDirection(72);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadActiveQuiz = async () => {
      try {
        const res = await quizApi.getActive();
        setActiveQuiz(res.data);
      } catch {
        setActiveQuiz(null);
      }
    };
    loadActiveQuiz();
  }, []);

  // Refresh quiz data when poster modal opens
  useEffect(() => {
    if (posterOpen) {
      const loadActiveQuiz = async () => {
        try {
          const res = await quizApi.getActive();
          setActiveQuiz(res.data);
        } catch {
          setActiveQuiz(null);
        }
      };
      loadActiveQuiz();
    }
  }, [posterOpen]);

  // Disable body scroll when poster modal is open
  useEffect(() => {
    if (posterOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [posterOpen]);

  if (quizInProgress) return null;

  // Keeping the compact header present on touch devices avoids hide/show flicker
  // during momentum scrolling and keeps the menu reliably reachable.
  const isVisible = isMobile || scrollVisible || mobileOpen;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : -120,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))] pb-3 sm:px-4 sm:py-4 pointer-events-none"
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <nav className="max-w-7xl mx-auto min-w-0 bg-glass backdrop-blur-glass-lg border border-border rounded-2xl shadow-glass px-2.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between pointer-events-auto">
        <LogoBar className="shrink min-w-0" />

        <div className="hidden sm:flex items-center gap-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive ? 'text-primary' : 'text-text-100 hover:text-primary'
                }`}
                style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-lg"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
                {!isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent-yellow rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{ transformOrigin: 'left' }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={() => setPosterOpen(true)}
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-text-100 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-background-50"
          >
            <Calendar className="w-4 h-4" />
            Weekly Poster
          </button>

          <Link to="/register" className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex">
            Join Challenge
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden p-2 rounded-lg text-text hover:bg-background-50 transition-colors"
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
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="sm:hidden max-w-7xl mx-auto mt-2 pointer-events-auto"
          >
            <div className="bg-glass backdrop-blur-glass-lg border border-border rounded-2xl shadow-glass p-4 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-text-100 hover:bg-background-50 hover:text-primary'
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
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setPosterOpen(true);
                }}
                className="flex items-center justify-center gap-2 text-sm font-medium text-text-100 hover:text-primary transition-colors px-4 py-3 rounded-lg hover:bg-background-50 mt-2"
              >
                <Calendar className="w-4 h-4" />
                Weekly Poster
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weekly Poster Modal */}
      <AnimatePresence>
        {posterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPosterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-[max(1rem,env(safe-area-inset-left))]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface backdrop-blur-glass-lg border border-border rounded-2xl shadow-premium-lg p-4 sm:p-6 w-full max-w-4xl max-h-[90dvh] overflow-y-auto overscroll-contain relative"
            >
              <button
                onClick={() => setPosterOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-text-100 hover:text-text hover:bg-background-50 transition-colors"
              >
                <CloseIcon className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold mb-4 text-text">Weekly Challenge Poster</h2>

              <div className="relative">
                {(() => {
                  // Convert Google Drive sharing link to direct image link
                  const getDirectImageUrl = (url) => {
                    if (!url) return url;
                    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
                    if (driveMatch) {
                      const fileId = driveMatch[1];
                      // Use lh3.googleusercontent.com for more reliable image access
                      return `https://lh3.googleusercontent.com/d/${fileId}`;
                    }
                    return url;
                  };
                  const directPosterUrl = getDirectImageUrl(activeQuiz?.posterUrl);
                  return directPosterUrl ? (
                    <>
                      <img
                        src={directPosterUrl}
                        alt="Weekly Challenge Poster"
                        className="w-full rounded-xl border border-border object-contain"
                        onError={(e) => {
                          console.error('Image failed to load:', directPosterUrl);
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', directPosterUrl);
                        }}
                      />
                    <div className="hidden flex-col items-center justify-center py-20 text-center">
                      <Calendar className="w-16 h-16 text-text-100 mb-4" />
                      <p className="text-text-100 text-lg">No poster available for this week</p>
                      <p className="text-text-100 text-sm mt-2">Check back later for the weekly challenge poster</p>
                    </div>
                  </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Calendar className="w-16 h-16 text-text-100 mb-4" />
                      <p className="text-text-100 text-lg">No poster available for this week</p>
                      <p className="text-text-100 text-sm mt-2">Check back later for the weekly challenge poster</p>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
