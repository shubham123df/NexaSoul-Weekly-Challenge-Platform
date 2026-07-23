import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const codeSnippets = [
  '<div>', '<button>', '<section>', '<header>', '<nav>', '<main>', '<article>',
  '</>', '{}', '()', '[]', '=>', 'const', 'let', 'function', 'return',
  'className', 'useState()', 'useEffect()', 'display:flex', 'grid', 'flex',
  'margin', 'padding', 'color', 'React', 'HTML', 'CSS', 'JavaScript', 'Tailwind'
];

const uiComponents = ['check', 'radio', 'progress', 'editor', 'terminal', 'trophy', 'lightning', 'timer', 'question'];

const codeCards = [
  { code: 'const answer = "React";', lang: 'jsx' },
  { code: 'display: flex;', lang: 'css' },
  { code: 'useState(0)', lang: 'jsx' },
  { code: 'export default', lang: 'jsx' },
];

export default function HeroBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
        
        // Add cursor trail point
        setCursorTrail(prev => [
          ...prev.slice(-8),
          { x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() }
        ]);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Layer 2: Floating code snippets
  const floatingSnippets = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    snippet: codeSnippets[i % codeSnippets.length],
    x: Math.random() * 90 + 5,
    y: Math.random() * 90 + 5,
    delay: Math.random() * 10,
    duration: Math.random() * 15 + 20,
    depth: Math.random() * 0.5 + 0.5,
  }));

  // Layer 3: Tiny glass UI components
  const glassComponents = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    type: uiComponents[i % uiComponents.length],
    x: Math.random() * 85 + 7.5,
    y: Math.random() * 85 + 7.5,
    delay: Math.random() * 12,
    duration: Math.random() * 12 + 18,
  }));

  // Floating code cards
  const floatingCards = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    ...codeCards[i % codeCards.length],
    x: Math.random() * 70 + 15,
    y: Math.random() * 70 + 15,
    delay: Math.random() * 8,
    duration: Math.random() * 20 + 25,
  }));

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Layer 1: Soft animated gradient mesh and moving light blobs */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        animate={{
          x: mousePosition.x * 20,
          y: mousePosition.y * 20,
        }}
        transition={{ type: 'spring', stiffness: 80, damping: 25 }}
      >
        {/* Animated gradient mesh */}
        <motion.div
          className="absolute inset-0 opacity-[0.04]"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(6,182,212,0.1) 50%, rgba(139,92,246,0.1) 100%)',
            backgroundSize: '400% 400%',
          }}
        />

        {/* Moving light blobs - Premium aurora effect */}
        <motion.div
          className="absolute top-[5%] left-[10%] w-[600px] h-[600px] rounded-full blur-[180px] bg-primary/8"
          animate={{
            x: [0, 120, -60, 0],
            y: [0, -100, 80, 0],
            scale: [1, 1.4, 0.85, 1.2],
            opacity: [0.6, 0.8, 0.5, 0.7],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-[25%] right-[5%] w-[550px] h-[550px] rounded-full blur-[160px] bg-accent-cyan/7"
          animate={{
            x: [0, -100, 120, 0],
            y: [0, 80, -100, 0],
            scale: [1, 1.3, 0.9, 1.25],
            opacity: [0.5, 0.7, 0.6, 0.8],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3,
          }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[15%] w-[500px] h-[500px] rounded-full blur-[140px] bg-accent-purple/6"
          animate={{
            x: [0, 80, -110, 0],
            y: [0, -90, 70, 0],
            scale: [1, 1.25, 0.8, 1.15],
            opacity: [0.4, 0.6, 0.5, 0.7],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 5,
          }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[20%] w-[450px] h-[450px] rounded-full blur-[120px] bg-accent-green/5"
          animate={{
            x: [0, -90, 100, 0],
            y: [0, 70, -80, 0],
            scale: [1, 1.35, 0.85, 1.2],
            opacity: [0.5, 0.75, 0.55, 0.65],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full blur-[100px] bg-accent-orange/4"
          animate={{
            x: [0, 60, -70, 0],
            y: [0, -50, 60, 0],
            scale: [1, 1.2, 0.9, 1.1],
            opacity: [0.3, 0.5, 0.4, 0.6],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />
      </motion.div>

      {/* Subtle CSS grid for depth */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `
          linear-gradient(rgba(37, 99, 235, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(37, 99, 235, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Layer 2: Floating HTML/CSS/JS/React snippets */}
      {floatingSnippets.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-[9px] sm:text-[11px] font-mono text-primary/12 font-medium"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            filter: `blur(${0.5 + (1 - item.depth) * 1}px)`,
            opacity: item.depth * 0.15,
          }}
          animate={{
            y: [0, -25 * item.depth, 0],
            x: [0, 15 * item.depth, 0],
            rotate: [0, 3 * item.depth, -3 * item.depth, 0],
            opacity: [item.depth * 0.1, item.depth * 0.2, item.depth * 0.1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay,
          }}
        >
          {item.snippet}
        </motion.div>
      ))}

      {/* Layer 3: Tiny glass UI components */}
      {glassComponents.map((item) => (
        <motion.div
          key={item.id}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 8, -8, 0],
            opacity: [0.08, 0.15, 0.08],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay,
          }}
        >
          {item.type === 'check' && (
            <div className="w-4 h-4 rounded border border-primary/20 bg-primary/5 flex items-center justify-center">
              <div className="w-2 h-2 rounded-sm bg-accent-green/30" />
            </div>
          )}
          {item.type === 'radio' && (
            <div className="w-4 h-4 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
            </div>
          )}
          {item.type === 'progress' && (
            <div className="w-8 h-1.5 rounded-full bg-border/50 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary/30 to-accent-cyan/30"
                animate={{ width: ['30%', '70%', '30%'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          )}
          {item.type === 'editor' && (
            <div className="w-6 h-4 rounded bg-surface/80 border border-border/30 p-0.5">
              <div className="flex gap-0.5 mb-0.5">
                <div className="w-1 h-1 rounded-full bg-red-400/40" />
                <div className="w-1 h-1 rounded-full bg-yellow-400/40" />
                <div className="w-1 h-1 rounded-full bg-green-400/40" />
              </div>
              <div className="space-y-0.5">
                <div className="w-full h-0.5 bg-primary/20 rounded" />
                <div className="w-2/3 h-0.5 bg-accent-cyan/20 rounded" />
              </div>
            </div>
          )}
          {item.type === 'terminal' && (
            <div className="w-6 h-4 rounded bg-surface/80 border border-border/30 p-0.5">
              <div className="flex items-center gap-1">
                <span className="text-[6px] text-accent-green/40">$</span>
                <div className="w-2 h-0.5 bg-primary/20 rounded" />
              </div>
            </div>
          )}
          {item.type === 'trophy' && (
            <div className="w-5 h-5 text-accent-orange/20">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4V5H16C16.55 5 17 5.45 17 6V8C17 9.1 16.1 10 15 10H14V12C15.1 12 16 12.9 16 14V16.5C16 17.88 14.88 19 13.5 19H12V22H10V19H8.5C7.12 19 6 17.88 6 16.5V16C6 14.9 6.9 14 8 14V12H10V10H9C7.9 10 7 9.1 7 8V6C7 5.45 7.45 5 8 5H10V4C10 2.9 10.9 2 12 2Z" />
              </svg>
            </div>
          )}
          {item.type === 'lightning' && (
            <div className="w-4 h-6 text-accent-cyan/20">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2V11H13L11 22L17 11H11L13 2H7Z" />
              </svg>
            </div>
          )}
          {item.type === 'timer' && (
            <div className="w-5 h-5 rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center">
              <div className="w-1 h-2 bg-primary/30 rounded-full" />
            </div>
          )}
          {item.type === 'question' && (
            <div className="w-5 h-5 rounded-full border-2 border-accent-purple/20 bg-accent-purple/5 flex items-center justify-center text-[8px] text-accent-purple/30 font-bold">
              ?
            </div>
          )}
        </motion.div>
      ))}

      {/* Floating code snippet cards */}
      {floatingCards.map((item) => (
        <motion.div
          key={item.id}
          className="absolute glass-card p-2 rounded-lg"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            backdropFilter: 'blur(4px)',
            background: 'rgba(255, 255, 255, 0.4)',
            opacity: 0.06,
          }}
          animate={{
            y: [0, -35, 0],
            x: [0, 25, 0],
            rotate: [0, 5, -5, 0],
            opacity: [0.04, 0.08, 0.04],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay,
          }}
        >
          <div className="text-[8px] font-mono text-text-100/80 leading-relaxed">
            {item.code}
          </div>
        </motion.div>
      ))}

      {/* Cursor trail - Premium glow effect */}
      {cursorTrail.map((point, i) => (
        <motion.div
          key={point.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: point.x,
            top: point.y,
            width: 12 - i * 1,
            height: 12 - i * 1,
            background: `radial-gradient(circle, rgba(37, 99, 235, ${0.2 - i * 0.02}) 0%, rgba(6, 182, 212, ${0.15 - i * 0.015}) 50%, transparent 70%)`,
            filter: 'blur(3px)',
          }}
          initial={{ opacity: 0.25 - i * 0.02, scale: 1 }}
          animate={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      ))}

      {/* Hero spotlight that slowly drifts */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[120px] bg-primary/5"
        animate={{
          x: [0, 80, -60, 0],
          y: [0, -40, 50, 0],
          scale: [1, 1.15, 0.9, 1.1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
