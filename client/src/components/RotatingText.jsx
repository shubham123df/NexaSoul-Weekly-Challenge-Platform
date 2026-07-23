import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useMediaQuery';

const words = ['Code.', 'Compete.', 'Build.', 'Learn.', 'Win.', 'Grow.', 'Innovate.', 'Create.', 'Conquer.'];

export default function RotatingText() {
  const [index, setIndex] = useState(0);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return undefined;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, isMobile ? 3500 : 2500);

    return () => clearInterval(interval);
  }, [isMobile, reducedMotion]);

  return (
    <div className="relative h-12 sm:h-16 mb-4">
      {reducedMotion ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-blue-cyan">
            Win.
          </span>
        </div>
      ) : isMobile ? (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-blue-cyan">
            {words[index]}
          </span>
        </motion.div>
      ) : (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-blue-cyan">
            {words[index]}
          </span>
        </motion.div>
      )}
    </div>
  );
}
