import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Home, Trophy, Shield, Rocket } from 'lucide-react';
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
  { to: '/admin', label: 'Admin', icon: Shield },
  { to: '/register', label: 'Join Challenge', icon: Rocket },
];

export default function Footer() {
  const { quizInProgress } = useQuiz();

  // Hide footer during active quiz
  if (quizInProgress) return null;

  return (
    <footer className="relative mt-24 pt-16 pb-8 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexa-blue/50 to-transparent" />

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-nexa-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Logo row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center mb-10"
        >
          <LogoBar size="lg" />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <p className="text-nexa-muted text-sm sm:text-base mb-2">
            Transforming learners into professional developers.
          </p>
          <p className="text-nexa-white font-bold tracking-[0.2em] text-sm sm:text-base">
            CODE. CONNECT. CONQUER.
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-8"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-nexa-muted hover:text-nexa-white hover:bg-nexa-navy-light/60 transition-all duration-300"
            >
              <link.icon className="w-4 h-4" />
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
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10"
        >
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nexa-navy-light/40 border border-nexa-border hover:border-nexa-blue/40 hover:bg-nexa-blue/10 transition-all duration-300"
            >
              <social.icon className="w-4 h-4 text-nexa-muted group-hover:text-nexa-blue transition-colors" />
              <span className="text-sm text-nexa-muted group-hover:text-nexa-white transition-colors">
                {social.name}
              </span>
            </a>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-nexa-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-nexa-muted">
            <p>© {new Date().getFullYear()} NexaSoul. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Made with <span className="text-nexa-green">♥</span> for Chandigarh University students
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
