import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Timer({ totalSeconds, onExpire, isRunning = true, fixed = false }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

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
    ? 'border-red-400/60 bg-red-50/90'
    : isWarning
    ? 'border-amber-400/60 bg-amber-50/90'
    : 'border-indigo-200 bg-white/95';

  const textClass = isCritical
    ? 'text-red-600'
    : isWarning
    ? 'text-amber-600'
    : 'text-indigo-700';

  const iconClass = isCritical
    ? 'text-red-500'
    : isWarning
    ? 'text-amber-500'
    : 'text-indigo-500';

  const timerContent = (
    <motion.div
      animate={isCritical ? { scale: [1, 1.04, 1] } : {}}
      transition={{ repeat: isCritical ? Infinity : 0, duration: 1 }}
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shadow-md backdrop-blur-sm ${borderClass} ${
        fixed ? 'shadow-lg' : ''
      }`}
      role="timer"
      aria-live="polite"
      aria-label={`Time remaining: ${formatTime(remaining)}`}
    >
      <Clock className={`w-5 h-5 shrink-0 ${iconClass}`} />
      <div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium leading-none mb-0.5">
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
      <div className="fixed top-4 right-4 z-50">
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
      setSeconds((prev) => {
        const next = prev + 1;
        onTick?.(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTick, paused]);

  const bonusText =
    seconds <= 5 ? '+5 speed bonus' : seconds <= 10 ? '+3 speed bonus' : 'No speed bonus';

  const bonusColor =
    seconds <= 5 ? 'text-emerald-600' : seconds <= 10 ? 'text-teal-600' : 'text-slate-400';

  return (
    <div className="text-sm flex items-center gap-2 flex-wrap justify-end">
      <span className="text-slate-500">Question time:</span>
      <span className="font-mono font-semibold text-indigo-700">{seconds}s</span>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 ${bonusColor}`}>
        {bonusText}
      </span>
    </div>
  );
}
