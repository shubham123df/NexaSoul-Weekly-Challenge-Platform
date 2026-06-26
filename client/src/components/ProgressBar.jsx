import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const percent = total ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-nexa-muted mb-2">
        <span>Question {current} of {total}</span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div className="h-2 bg-nexa-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-nexa-gradient-h rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
