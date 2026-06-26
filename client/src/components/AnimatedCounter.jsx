import { useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate, useInView, motion } from 'framer-motion';

export default function AnimatedCounter({ value, suffix = '', prefix = '', duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (value >= 1000) return Math.round(latest).toLocaleString();
    return Math.round(latest);
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration,
        ease: 'easeOut',
      });
      return controls.stop;
    }
  }, [isInView, value, count, duration]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      {prefix && <span>{prefix}</span>}
      <motion.span>{rounded}</motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
