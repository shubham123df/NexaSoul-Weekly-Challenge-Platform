import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Timer({ totalSeconds, onExpire, isRunning = true }) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    console.log('⏱️ Timer initialized/reset to:', totalSeconds, 'seconds');
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    console.log('⏱️ Timer useEffect - isRunning:', isRunning, 'remaining:', remaining);
    
    if (!isRunning || remaining <= 0) {
      console.log('⏱️ Timer NOT running');
      return;
    }

    console.log('⏱️ Starting countdown interval...');
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          console.log('⏱️ Timer reached 0');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      console.log('⏱️ Clearing interval');
      clearInterval(interval);
    };
  }, [isRunning, remaining, onExpire]);

  // Call onExpire when timer reaches 0
  useEffect(() => {
    if (remaining === 0 && isRunning) {
      console.log('⏱️ Calling onExpire!');
      onExpire?.();
    }
  }, [remaining, isRunning, onExpire]);

  const isLow = remaining <= 60;
  const isCritical = remaining <= 30;

  return (
    <motion.div
      animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: isCritical ? Infinity : 0, duration: 1 }}
      className={`glass-card px-4 py-2 flex items-center gap-2 ${
        isCritical ? 'border-red-500/50' : isLow ? 'border-yellow-500/50' : 'border-nexa-blue/30'
      }`}
    >
      <svg className="w-5 h-5 text-nexa-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className={`font-mono font-bold text-lg ${isCritical ? 'text-red-400' : isLow ? 'text-yellow-400' : 'text-nexa-white'}`}>
        {formatTime(remaining)}
      </span>
    </motion.div>
  );
}

export function QuestionTimer({ onTick }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        onTick?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onTick]);

  const bonusText =
    seconds <= 5 ? '+5 bonus available!' : seconds <= 10 ? '+3 bonus available!' : 'No speed bonus';

  const bonusColor =
    seconds <= 5 ? 'text-nexa-green' : seconds <= 10 ? 'text-yellow-400' : 'text-nexa-muted';

  return (
    <div className="text-sm">
      <span className="text-nexa-muted">Time on question: </span>
      <span className="font-mono font-semibold">{seconds}s</span>
      <span className={`ml-3 ${bonusColor}`}>{bonusText}</span>
    </div>
  );
}
