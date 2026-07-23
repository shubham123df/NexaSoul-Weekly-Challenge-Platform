import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useMediaQuery';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Timer({ totalSeconds, onExpire, isRunning = true, fixed = false }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setRemaining(totalSeconds);
    expiredRef.current = false;
  }, [totalSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpireRef.current?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const isWarning = remaining <= 300 && remaining > 60;
  const isCritical = remaining <= 60;

  const borderClass = isCritical
    ? 'border-red-500/60 bg-red-50/90'
    : isWarning
    ? 'border-amber-500/60 bg-amber-50/90'
    : 'border-primary/30 bg-surface';

  const textClass = isCritical
    ? 'text-red-600'
    : isWarning
    ? 'text-amber-600'
    : 'text-primary';

  const iconClass = isCritical
    ? 'text-red-500'
    : isWarning
    ? 'text-amber-500'
    : 'text-primary';

  const timerContent = (
    <motion.div
      animate={isCritical && !isMobile && !reducedMotion ? { scale: [1, 1.04, 1] } : {}}
      transition={{ repeat: isCritical && !isMobile && !reducedMotion ? Infinity : 0, duration: 1 }}
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shadow-md backdrop-blur-sm ${borderClass} ${
        fixed ? 'shadow-lg' : ''
      }`}
      role="timer"
      aria-live="polite"
      aria-label={`Time remaining: ${formatTime(remaining)}`}
    >
      <Clock className={`w-5 h-5 shrink-0 ${iconClass}`} />
      <div>
        <div className="text-[10px] uppercase tracking-wider text-text-100 font-medium leading-none mb-0.5">
          Time Left
        </div>
        <span className={`font-mono font-bold text-xl leading-none ${textClass}`}>
          {formatTime(remaining)}
        </span>
      </div>
      {isWarning && (
        <span className={`text-xs font-semibold hidden sm:inline ${isCritical ? 'text-red-500' : 'text-amber-600'}`}>
          {isCritical ? 'Hurry!' : '< 5 min'}
        </span>
      )}
    </motion.div>
  );

  if (fixed) {
    return (
      <div className="fixed z-50 top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))]">
        {timerContent}
      </div>
    );
  }

  return timerContent;
}

export function QuestionTimer({ onTick, paused = false }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setSeconds(0);
  }, []);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [paused]);

  // Call onTick when seconds changes
  useEffect(() => {
    onTick?.(seconds);
  }, [seconds, onTick]);

  const bonusText =
    seconds <= 5 ? '+5 speed bonus' : seconds <= 10 ? '+3 speed bonus' : 'No speed bonus';

  const bonusColor =
    seconds <= 5 ? 'text-accent-green' : seconds <= 10 ? 'text-accent-cyan' : 'text-text-200';

  return (
    <div className="text-sm flex items-center gap-2 flex-wrap justify-end">
      <span className="text-text-100">Question time:</span>
      <span className="font-mono font-semibold text-primary">{seconds}s</span>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-surface ${bonusColor}`}>
        {bonusText}
      </span>
    </div>
  );
}
